package com.blogboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotBlank(message = "Slug is required")
        @Pattern(regexp = "^[a-z0-9-]+$",
                message = "Slug must contain only lowercase letters, numbers, and hyphens")
        @Size(max = 100, message = "Slug must be at most 100 characters")
        String slug,

        @Size(max = 500, message = "Description must be at most 500 characters")
        String description
) {
}