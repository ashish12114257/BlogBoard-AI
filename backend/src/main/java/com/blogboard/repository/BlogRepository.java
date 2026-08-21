package com.blogboard.repository;

import com.blogboard.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    Optional<Blog> findBySlug(String slug);

    Page<Blog> findByCategorySlug(String categorySlug, Pageable pageable);

    @Query("""
            SELECT b FROM Blog b
            WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(CAST(b.content AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
               OR EXISTS (
                   SELECT 1 FROM b.tags t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%'))
               )
            """)
    Page<Blog> search(@Param("query") String query, Pageable pageable);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}