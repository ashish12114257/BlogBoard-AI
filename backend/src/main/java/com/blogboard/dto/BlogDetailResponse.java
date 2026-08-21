package com.blogboard.dto;

import com.blogboard.entity.Blog;
import com.blogboard.entity.Category;
import com.blogboard.entity.Tag;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BlogDetailResponse(
        Long id,
        String title,
        String slug,
        String description,
        String content,
        String categorySlug,
        String categoryName,
        String author,
        LocalDate publishedDate,
        String readTime,
        List<String> tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BlogDetailResponse from(Blog blog) {
        Category category = blog.getCategory();
        return new BlogDetailResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getSlug(),
                blog.getDescription(),
                blog.getContent(),
                category != null ? category.getSlug() : null,
                category != null ? category.getName() : null,
                blog.getAuthor(),
                blog.getPublishedDate(),
                blog.getReadTime(),
                blog.getTags().stream().map(Tag::getName).sorted().toList(),
                blog.getCreatedAt(),
                blog.getUpdatedAt()
        );
    }
}