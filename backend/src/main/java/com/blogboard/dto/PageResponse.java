package com.blogboard.dto;

import java.util.List;

public record PageResponse<T>(
        List<T> items,
        int page,
        int pageSize,
        long total,
        int totalPages,
        boolean hasNext,
        boolean hasPrevious
) {
    public static <T> PageResponse<T> of(List<T> items, int page, int pageSize, long total, int totalPages,
                                         boolean hasNext, boolean hasPrevious) {
        return new PageResponse<>(items, page, pageSize, total, totalPages, hasNext, hasPrevious);
    }
}