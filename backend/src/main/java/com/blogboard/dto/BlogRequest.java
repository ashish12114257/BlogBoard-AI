package com.blogboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record BlogRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        // Optional: if omitted or blank, the slug is generated from the title.
        @Size(max = 255, message = "Slug must be at most 255 characters")
        String slug,

        @NotBlank(message = "Description is required")
        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description,

        @NotBlank(message = "Content is required")
        String content,

        @NotNull(message = "Category id is required")
        Long categoryId,

        @NotBlank(message = "Author is required")
        @Size(max = 200, message = "Author must be at most 200 characters")
        String author,

        LocalDate publishedDate,

        @Size(max = 50, message = "Read time must be at most 50 characters")
        String readTime,

        List<String> tags
) {
}