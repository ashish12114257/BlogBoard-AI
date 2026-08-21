package com.blogboard.service;

import com.blogboard.dto.BlogDetailResponse;
import com.blogboard.dto.BlogRequest;
import com.blogboard.dto.BlogSummaryResponse;
import com.blogboard.dto.PageResponse;
import com.blogboard.entity.Blog;
import com.blogboard.entity.Category;
import com.blogboard.entity.Tag;
import com.blogboard.exception.DuplicateResourceException;
import com.blogboard.exception.ResourceNotFoundException;
import com.blogboard.repository.BlogRepository;
import com.blogboard.repository.CategoryRepository;
import com.blogboard.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private static final int MAX_PAGE_SIZE = 100;

    private final BlogRepository blogRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public PageResponse<BlogSummaryResponse> getAll(String category, String search, String sort,
                                                    int page, int size) {
        Pageable pageable = PageRequest.of(safePage(page), safeSize(size), buildSort(sort));

        Page<Blog> result;
        if (isNotBlank(search)) {
            result = blogRepository.search(search.trim(), pageable);
        } else if (isNotBlank(category)) {
            result = blogRepository.findByCategorySlug(category.trim(), pageable);
        } else {
            result = blogRepository.findAll(pageable);
        }

        List<BlogSummaryResponse> items = result.getContent()
                .stream()
                .map(BlogSummaryResponse::from)
                .toList();

        return PageResponse.of(
                items,
                result.getNumber() + 1,
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.hasNext(),
                result.hasPrevious()
        );
    }

    @Transactional(readOnly = true)
    public BlogDetailResponse getById(Long id) {
        return BlogDetailResponse.from(getEntity(id));
    }

    @Transactional(readOnly = true)
    public BlogDetailResponse getBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with slug: " + slug));
        return BlogDetailResponse.from(blog);
    }

    @Transactional
    public BlogDetailResponse create(BlogRequest request) {
        String slug = normalizeSlug(request.slug(), request.title());
        if (blogRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("A blog with slug '" + slug + "' already exists");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.categoryId()));

        Blog blog = new Blog();
        applyRequest(blog, request, slug, category);

        return BlogDetailResponse.from(blogRepository.save(blog));
    }

    @Transactional
    public BlogDetailResponse update(Long id, BlogRequest request) {
        Blog blog = getEntity(id);
        String slug = normalizeSlug(request.slug(), request.title());
        if (blogRepository.existsBySlugAndIdNot(slug, id)) {
            throw new DuplicateResourceException("A blog with slug '" + slug + "' already exists");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.categoryId()));

        applyRequest(blog, request, slug, category);
        return BlogDetailResponse.from(blogRepository.save(blog));
    }

    @Transactional
    public void delete(Long id) {
        blogRepository.delete(getEntity(id));
    }

    private void applyRequest(Blog blog, BlogRequest request, String slug, Category category) {
        blog.setTitle(request.title().trim());
        blog.setSlug(slug);
        blog.setDescription(request.description().trim());
        blog.setContent(request.content());
        blog.setCategory(category);
        blog.setAuthor(request.author().trim());
        blog.setPublishedDate(request.publishedDate() != null ? request.publishedDate() : LocalDate.now());
        blog.setReadTime(request.readTime());
        blog.setTags(resolveTags(request.tags()));
    }

    private Blog getEntity(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
    }

    /**
     * Resolves the requested tag names to existing tags, creating any missing
     * ones. Comparison is case-insensitive and the resulting set is unique.
     */
    private Set<Tag> resolveTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }

        List<String> normalized = tagNames.stream()
                .map(String::trim)
                .filter(name -> !name.isEmpty())
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

    private String normalizeSlug(String slug, String title) {
        String base = (slug == null || slug.isBlank()) ? title : slug;
        String result = base.trim()
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s_]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return result.isEmpty() ? "untitled" : result;
    }

    private Sort buildSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "publishedDate");
        }
        return switch (sort.trim().toLowerCase()) {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "publishedDate");
            case "title" -> Sort.by(Sort.Direction.ASC, "title");
            case "title_desc" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.DESC, "publishedDate");
        };
    }

    private int safePage(int page) {
        return Math.max(page, 1) - 1;
    }

    private int safeSize(int size) {
        return Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
    }

    private boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
    }
}