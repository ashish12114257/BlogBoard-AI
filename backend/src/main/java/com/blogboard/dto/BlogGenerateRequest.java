package com.blogboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogGenerateRequest(

        @NotBlank(message = "Topic is required")
        @Size(max = 500, message = "Topic must be at most 500 characters")
        String topic,

        // Optional category slug; defaults to "ml" (Machine Learning) when omitted.
        @Size(max = 100, message = "Domain must be at most 100 characters")
        String domain,

        // Optional publish date (YYYY-MM-DD); defaults to today.
        String date
) {
}