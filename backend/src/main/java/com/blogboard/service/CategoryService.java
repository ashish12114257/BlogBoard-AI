package com.blogboard.service;

import com.blogboard.dto.CategoryRequest;
import com.blogboard.dto.CategoryResponse;
import com.blogboard.entity.Category;
import com.blogboard.exception.DuplicateResourceException;
import com.blogboard.exception.ResourceNotFoundException;
import com.blogboard.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll(Sort.by("name"))
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        return CategoryResponse.from(getEntity(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String name = request.name().trim();
        String slug = request.slug().trim();

        if (categoryRepository.existsByName(name)) {
            throw new DuplicateResourceException("A category named '" + name + "' already exists");
        }
        if (categoryRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("A category with slug '" + slug + "' already exists");
        }

        Category category = new Category(name, slug, request.description());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getEntity(id);
        String name = request.name().trim();
        String slug = request.slug().trim();

        if (categoryRepository.existsByNameAndIdNot(name, id)) {
            throw new DuplicateResourceException("A category named '" + name + "' already exists");
        }
        if (categoryRepository.existsBySlugAndIdNot(slug, id)) {
            throw new DuplicateResourceException("A category with slug '" + slug + "' already exists");
        }

        category.setName(name);
        category.setSlug(slug);
        category.setDescription(request.description());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = getEntity(id);
        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public Category getEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}