package com.blogboard.exception;

/**
 * Raised when the AI blog-generation workflow fails to produce a draft
 * (missing API key, missing script, timeout, or non-zero exit code).
 */
public class BlogGenerationException extends RuntimeException {

    public BlogGenerationException(String message) {
        super(message);
    }

    public BlogGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}