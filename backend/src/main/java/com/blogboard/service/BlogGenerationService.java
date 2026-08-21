package com.blogboard.service;

import com.blogboard.dto.BlogGenerateRequest;
import com.blogboard.dto.BlogGenerateResponse;
import com.blogboard.exception.BlogGenerationException;
import com.blogboard.repository.CategoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Triggers the existing multi-agent BlogBoard generation workflow.
 *
 * The LangGraph workflow (TutorialAgent -> ValidatorAgent revision loop) lives
 * in the Python {@code blogboard/} package, so this service shells out to the
 * {@code blogboard/generate.py} CLI script, which invokes the compiled graph in
 * "skip_storage" draft mode and prints a single JSON payload on stdout.
 *
 * The generated draft is returned to the caller — it is never persisted or
 * published here. Persisting happens through the normal create/update API.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BlogGenerationService {

    private final ObjectMapper objectMapper;
    private final CategoryRepository categoryRepository;

    @Value("${blogboard.generate.python-command:uv run python}")
    private String pythonCommand;

    @Value("${blogboard.generate.script-path:../blogboard/generate.py}")
    private String scriptPath;

    @Value("${blogboard.generate.timeout-seconds:300}")
    private long timeoutSeconds;

    public BlogGenerateResponse generate(BlogGenerateRequest request) {
        String topic = request.topic().trim();
        String domain = request.domain() == null || request.domain().isBlank() ? "ml" : request.domain().trim();
        String date = request.date() == null || request.date().isBlank()
                ? LocalDate.now().toString()
                : request.date();

        Path script = Path.of(scriptPath).toAbsolutePath().normalize();
        if (!Files.isRegularFile(script)) {
            throw new BlogGenerationException(
                    "AI generation script not found at " + script
                            + ". Check the 'blogboard.generate.script-path' property.");
        }
        Path projectRoot = script.getParent().getParent();

        List<String> command = new ArrayList<>();
        command.addAll(Arrays.asList(pythonCommand.trim().split("\\s+")));
        command.add(String.valueOf(script));
        command.add("--topic");
        command.add(topic);
        command.add("--domain");
        command.add(domain);
        command.add("--date");
        command.add(date);

        log.info("Triggering AI blog generation: topic='{}' domain='{}'", topic, domain);

        Path outFile;
        Path errFile;
        try {
            outFile = Files.createTempFile("blogboard-gen", ".out");
            errFile = Files.createTempFile("blogboard-gen", ".err");
        } catch (IOException e) {
            throw new BlogGenerationException("Failed to create temp files for AI generation.", e);
        }

        Process process;
        try {
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(projectRoot.toFile());
            pb.redirectErrorStream(false);
            pb.redirectOutput(outFile.toFile());
            pb.redirectError(errFile.toFile());
            process = pb.start();
        } catch (IOException e) {
            deleteQuietly(outFile, errFile);
            throw new BlogGenerationException(
                    "Failed to launch the AI generation process (" + String.join(" ", command)
                            + "): " + e.getMessage(), e);
        }

        try {
            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new BlogGenerationException(
                        "AI generation timed out after " + timeoutSeconds
                                + "s. Increase 'blogboard.generate.timeout-seconds' if needed.");
            }
        } catch (InterruptedException e) {
            process.destroyForcibly();
            Thread.currentThread().interrupt();
            throw new BlogGenerationException("AI generation was interrupted.", e);
        }

        String stdout = "";
        String stderr = "";
        try {
            stdout = Files.readString(outFile);
            stderr = Files.readString(errFile);
        } catch (IOException e) {
            log.warn("Failed to read AI generation output files: {}", e.getMessage());
        } finally {
            deleteQuietly(outFile, errFile);
        }

        int exitCode = process.exitValue();
        log.debug("AI generation exit={} stderr:\n{}", exitCode, stderr);

        JsonNode json = parseOutput(stdout);
        if (exitCode != 0) {
            String message = json != null && json.hasNonNull("error")
                    ? json.get("error").asText()
                    : "AI generation failed with exit code " + exitCode + ". " + tail(stderr);
            throw new BlogGenerationException(message);
        }
        if (json == null) {
            throw new BlogGenerationException(
                    "AI generation produced no JSON output. " + tail(stderr));
        }

        return toResponse(json);
    }

    private JsonNode parseOutput(String stdout) {
        String trimmed = stdout.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readTree(trimmed);
        } catch (Exception e) {
            log.warn("Failed to parse AI generation output: {}", e.getMessage());
            return null;
        }
    }

    private BlogGenerateResponse toResponse(JsonNode json) {
        String category = json.path("category").asText("ml");
        String categoryName = categoryRepository.findBySlug(category)
                .map(c -> c.getName())
                .orElse(category);

        List<String> tags = new ArrayList<>();
        if (json.hasNonNull("tags") && json.get("tags").isArray()) {
            json.get("tags").forEach(node -> {
                String value = node.asText("").trim();
                if (!value.isEmpty()) {
                    tags.add(value);
                }
            });
        }

        return new BlogGenerateResponse(
                json.path("topic").asText(""),
                json.path("title").asText(""),
                json.path("description").asText(""),
                json.path("content").asText(""),
                category,
                categoryName,
                tags,
                json.path("slug").asText(""),
                json.path("readTime").asText(""),
                json.path("revisionCount").asInt(0),
                ""
        );
    }

    private String tail(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        String[] lines = text.trim().split("\\R");
        int from = Math.max(0, lines.length - 15);
        return String.join(" | ", Arrays.copyOfRange(lines, from, lines.length));
    }

    private void deleteQuietly(Path... paths) {
        for (Path path : paths) {
            try {
                Files.deleteIfExists(path);
            } catch (IOException ignored) {
                // best-effort cleanup
            }
        }
    }
}