package com.blogboard.service;

import com.blogboard.dto.TagRequest;
import com.blogboard.dto.TagResponse;
import com.blogboard.entity.Tag;
import com.blogboard.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<TagResponse> getAll() {
        return tagRepository.findAll(Sort.by("name"))
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    /**
     * Creates a tag or returns the existing one (tags are unique by name,
     * case-insensitively) - find-or-create semantics keep the API idempotent.
     */
    @Transactional
    public TagResponse create(TagRequest request) {
        String name = request.name().trim();
        Optional<Tag> existing = tagRepository.findByNameIgnoreCase(name);
        if (existing.isPresent()) {
            return TagResponse.from(existing.get());
        }
        return TagResponse.from(tagRepository.save(new Tag(name)));
    }
}