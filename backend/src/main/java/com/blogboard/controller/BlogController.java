package com.blogboard.controller;

import com.blogboard.dto.BlogDetailResponse;
import com.blogboard.dto.BlogGenerateRequest;
import com.blogboard.dto.BlogGenerateResponse;
import com.blogboard.dto.BlogRequest;
import com.blogboard.dto.BlogSummaryResponse;
import com.blogboard.dto.PageResponse;
import com.blogboard.service.BlogGenerationService;
import com.blogboard.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    private final BlogGenerationService blogGenerationService;

    @GetMapping
    public PageResponse<BlogSummaryResponse> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return blogService.getAll(category, search, sort, page, size);
    }

    @GetMapping("/{id}")
    public BlogDetailResponse getById(@PathVariable Long id) {
        return blogService.getById(id);
    }

    @GetMapping("/slug/{slug}")
    public BlogDetailResponse getBySlug(@PathVariable String slug) {
        return blogService.getBySlug(slug);
    }

    @GetMapping("/category/{category}")
    public PageResponse<BlogSummaryResponse> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return blogService.getAll(category, null, sort, page, size);
    }

    @GetMapping("/search")
    public PageResponse<BlogSummaryResponse> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return blogService.getAll(null, query, sort, page, size);
    }

    @PostMapping("/generate")
    public BlogGenerateResponse generate(@Valid @RequestBody BlogGenerateRequest request) {
        return blogGenerationService.generate(request);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogDetailResponse create(@Valid @RequestBody BlogRequest request) {
        return blogService.create(request);
    }

    @PutMapping("/{id}")
    public BlogDetailResponse update(@PathVariable Long id, @Valid @RequestBody BlogRequest request) {
        return blogService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        blogService.delete(id);
    }
}