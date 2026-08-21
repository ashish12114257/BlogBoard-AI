package com.blogboard.config;

import com.blogboard.entity.Blog;
import com.blogboard.entity.Category;
import com.blogboard.entity.Tag;
import com.blogboard.repository.BlogRepository;
import com.blogboard.repository.CategoryRepository;
import com.blogboard.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Seeds the standard BlogBoard categories and a set of realistic sample blogs
 * on a fresh database so the API and the React frontend have data to display.
 * Each block is a no-op when its data already exists.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final BlogRepository blogRepository;

    @Override
    public void run(String... args) {
        seedCategories();
        seedBlogs();
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            return;
        }

        List<Category> categories = List.of(
                new Category("Machine Learning", "ml",
                        "Algorithms, theory, and applied ML from fundamentals to production."),
                new Category("Deep Learning", "dl",
                        "Neural networks, architectures, training tricks, and modern DL research."),
                new Category("Statistics for AI", "statistics",
                        "Probability, statistical tests, distributions, and the math behind ML."),
                new Category("Natural Language Processing", "nlp",
                        "Text processing, transformers, LLMs, and language understanding."),
                new Category("Computer Vision", "cv",
                        "Image processing, object detection, segmentation, and visual AI."),
                new Category("Generative AI", "genai",
                        "Diffusion models, LLMs, RAG, agents, and the frontier of AI generation."),
                new Category("AI News", "ainews",
                        "Breaking developments, model releases, and industry analysis.")
        );

        categoryRepository.saveAll(categories);
        log.info("Seeded {} categories.", categories.size());
    }

    private void seedBlogs() {
        if (blogRepository.count() > 0) {
            return;
        }

        List<Blog> blogs = List.of(
                blog("Understanding Gradient Descent and Its Variants",
                        "understanding-gradient-descent-and-its-variants",
                        "An intuitive walk through the optimization algorithm that trains most of modern machine learning, from vanilla SGD to Adam and beyond.",
                        """
                                Gradient descent is the workhorse behind virtually every deep learning model in production today. At its core it is a simple idea: repeatedly move the model's parameters in the direction that most reduces the loss. What looks like a single algorithm is actually a large family of optimizers, each with a different strategy for choosing step sizes and directions.

                                The vanilla version updates parameters by subtracting the gradient scaled by a fixed learning rate. Stochastic gradient descent makes this practical on huge datasets by estimating the gradient from a small random batch of examples. Mini-batching adds parallelism and a little noise, which often helps the optimizer escape shallow local minima.

                                Modern variants build on this foundation. Momentum accumulates a running average of past gradients to smooth the trajectory, while RMSProp and Adam adapt a per-parameter learning rate based on the magnitude of recent gradients. Adam has become the default for most practitioners because it converges quickly with minimal tuning.

                                The practical takeaway is that choosing an optimizer is a bias-variance trade-off. Large batch sizes and low learning rates make training stable but slow; smaller batches and adaptive methods converge faster at the cost of more hyperparameter sensitivity. Understanding these trade-offs is essential to debugging slow or unstable training runs.
                                """,
                        "ml", "Dr. Ananya Iyer", LocalDate.of(2026, 2, 10), "12 min read",
                        List.of("gradient-descent", "optimization", "deep-learning")),
                blog("A Gentle Introduction to Transformers",
                        "a-gentle-introduction-to-transformers",
                        "How attention replaced recurrence: the architecture that powers BERT, GPT, and every modern language model.",
                        """
                                The Transformer, introduced in 2017, fundamentally changed how we build sequence models. Instead of processing words one at a time with recurrence, it reads the whole sequence in parallel and lets each token attend to every other token. The result was a massive speed-up in training and a flexible architecture that scales to billions of parameters.

                                The key innovation is the self-attention mechanism. Each token is projected into a query, a key, and a value vector. Attention scores are computed as the dot product of a token's query with the keys of all other tokens, then normalized with a softmax and used to weight the values. This lets the model directly learn which parts of the input are relevant to each position.

                                Transformers are built as stacks of blocks, each containing a multi-head attention layer followed by a feed-forward network, with residual connections and layer normalization around both. Positional encodings inject order information, since the architecture has no built-in sense of sequence.

                                Scaling laws have shown that these models improve predictably with more parameters and data, which is why the field has raced toward ever-larger pretrained models. Understanding the attention mechanism, even at an intuitive level, goes a long way toward understanding how models like GPT produce their outputs.
                                """,
                        "nlp", "Marcus Chen", LocalDate.of(2026, 2, 18), "10 min read",
                        List.of("transformers", "attention", "llm")),
                blog("Convolutional Neural Networks Explained",
                        "convolutional-neural-networks-explained",
                        "From edge detection to ImageNet: how CNNs use spatial locality to master images.",
                        """
                                Convolutional neural networks brought machine vision out of the lab. The core idea is that images have a strong spatial structure: nearby pixels are correlated, and meaningful features like edges, textures, and shapes repeat across the image. CNNs exploit this with a convolution operation that applies a small learned filter across the entire input.

                                A convolution layer slides a kernel over the image, computing a weighted sum at each position. Because the same kernel is reused everywhere, the number of parameters is drastically smaller than a fully connected layer processing the same pixels. Early layers learn low-level detectors such as edges and color blobs, while deeper layers combine them into parts, objects, and scenes.

                                Pooling layers downsample the feature maps, adding translation invariance and reducing compute. Modern architectures such as ResNet add skip connections that let gradients flow through very deep stacks, enabling networks with hundreds of layers to train reliably.

                                CNNs remain the backbone of many vision systems, though vision transformers have recently challenged them at the top end. For practitioners, the practical lesson is that inductive biases — building the right structure into the model — are often more valuable than raw capacity.
                                """,
                        "cv", "Priya Raghavan", LocalDate.of(2026, 1, 28), "9 min read",
                        List.of("cnn", "computer-vision", "deep-learning")),
                blog("What Are Diffusion Models and How Do They Work?",
                        "what-are-diffusion-models-and-how-do-they-work",
                        "The elegant idea behind modern image generators: learn to reverse a process of gradual noise.",
                        """
                                Diffusion models power the current wave of generative image tools. The intuition is surprisingly simple. Imagine taking a clear image and slowly adding random noise until it becomes pure static. If you can learn to reverse that process — step by step denoising a noisy image back into a coherent one — you can generate new images by starting from random noise and applying the reverse process.

                                Training works by corrupting clean images with a controlled amount of Gaussian noise and asking the model to predict the noise that was added. The model is conditioned on a time step that encodes how noisy the image is, so it can adapt its denoising strategy at each stage of the reverse process.

                                What makes this powerful is that the denoising network can be conditioned on anything: a text prompt, a class label, or an entire source image. This is how text-to-image systems work. Samplers such as DDIM and Euler improve the efficiency of the reverse process, turning what used to take hundreds of steps into a few dozen.

                                The result is a flexible family of generative models that produces high-fidelity, diverse outputs. Latent diffusion models push this further by performing the diffusion process in a compressed latent space, dramatically reducing compute while keeping quality.
                                """,
                        "genai", "Lena Fischer", LocalDate.of(2026, 3, 2), "11 min read",
                        List.of("diffusion-models", "generative-models", "text-to-image")),
                blog("Random Forests vs Gradient Boosting: A Practical Comparison",
                        "random-forests-vs-gradient-boosting-a-practical-comparison",
                        "Two powerhouse tree ensembles, one table. When each shines, how they differ, and how to choose.",
                        """
                                Tree-based ensembles are the default choice for tabular machine learning. Random forests and gradient boosting both combine many decision trees, but they do so in fundamentally different ways, and those differences drive where each performs best.

                                Random forests build each tree on a bootstrap sample of the data and grow them independently, averaging their predictions. This parallel, high-variance construction makes forests extremely robust to noise and resistant to overfitting. They train quickly and need almost no tuning, which makes them an excellent baseline.

                                Gradient boosting, by contrast, builds trees sequentially, with each new tree trained to correct the residual errors of the ensemble built so far. This lets boosting capture complex interactions precisely, often achieving the best raw accuracy — but it also makes boosting more sensitive to noisy data and to hyperparameters like learning rate and tree depth.

                                In practice, a good rule of thumb is to reach for random forests first on noisy or high-dimensional data, and to use gradient boosting when you need maximum accuracy and are willing to tune carefully. Both remain competitive, which is why they dominate the leaderboards of tabular competitions.
                                """,
                        "ml", "Omar Haddad", LocalDate.of(2026, 1, 15), "8 min read",
                        List.of("random-forest", "gradient-boosting", "ensemble")),
                blog("Mastering Statistical Hypothesis Testing for ML Practitioners",
                        "mastering-statistical-hypothesis-testing-for-ml-practitioners",
                        "p-values, confidence intervals, and A/B tests — the stats every data scientist actually needs.",
                        """
                                Machine learning models are built on noisy data, and statistical hypothesis testing is how we decide whether observed differences are real. Whether you are comparing two model variants in an A/B test or deciding whether a feature actually helps, hypothesis testing gives the process a rigorous foundation.

                                The core idea is to define a null hypothesis — usually that there is no effect — and then ask how unlikely the observed data would be under that assumption. The p-value measures that unlikelihood. A common trap is treating p-values as the probability that the null is true; they are not. The framing matters for how you draw conclusions.

                                Confidence intervals are often more informative than p-values. An interval around a metric estimate communicates both the size of an effect and the uncertainty around it, which is exactly what a product decision needs. Reporting intervals alongside point estimates is a habit worth building.

                                Practical testing also requires care with sample sizes and multiple comparisons. Running many tests inflates the chance of false positives, so corrections like the Bonferroni adjustment or false discovery rate control become necessary. These tools are the difference between conclusions you can trust and conclusions that merely look significant.
                                """,
                        "statistics", "Dr. Sofia Marques", LocalDate.of(2026, 3, 5), "13 min read",
                        List.of("statistics", "hypothesis-testing", "p-values"))
        );

        blogRepository.saveAll(blogs);
        log.info("Seeded {} sample blogs.", blogs.size());
    }

    private Blog blog(String title, String slug, String description, String content,
                      String categorySlug, String author, LocalDate publishedDate,
                      String readTime, List<String> tagNames) {
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setSlug(slug);
        blog.setDescription(description);
        blog.setContent(content);
        blog.setCategory(findCategory(categorySlug));
        blog.setAuthor(author);
        blog.setPublishedDate(publishedDate);
        blog.setReadTime(readTime);
        blog.setTags(resolveTags(tagNames));
        return blog;
    }

    private Category findCategory(String slug) {
        return categoryRepository.findBySlug(slug).orElseThrow(
                () -> new IllegalStateException("Missing seeded category: " + slug));
    }

    /**
     * Finds existing tags by name (case-insensitive) and creates any missing
     * ones, mirroring the behaviour of BlogService.resolveTags.
     */
    private Set<Tag> resolveTags(List<String> tagNames) {
        List<String> normalized = tagNames.stream()
                .map(String::trim)
                .map(name -> name.startsWith("#") ? name.substring(1) : name)
                .distinct()
                .toList();

        List<String> lowerNames = normalized.stream().map(String::toLowerCase).toList();
        Map<String, Tag> byName = tagRepository.findByNameInIgnoreCase(lowerNames)
                .stream()
                .collect(Collectors.toMap(tag -> tag.getName().toLowerCase(), Function.identity(), (a, b) -> a));

        Set<Tag> tags = new HashSet<>(byName.values());
        for (String name : normalized) {
            if (!byName.containsKey(name.toLowerCase())) {
                Tag tag = tagRepository.save(new Tag(name));
                byName.put(name.toLowerCase(), tag);
                tags.add(tag);
            }
        }
        return tags;
    }
}