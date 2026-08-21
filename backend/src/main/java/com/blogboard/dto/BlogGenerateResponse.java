package com.blogboard.dto;

import java.util.List;

public record BlogGenerateResponse(
        String topic,
        String title,
        String description,
        String content,
        String category,
        String categoryName,
        List<String> tags,
        String slug,
        String readTime,
        int revisionCount,
        String author
) {
}