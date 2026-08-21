package com.blogboard.controller;

import com.blogboard.dto.CategoryRequest;
import com.blogboard.entity.Category;
import com.blogboard.repository.CategoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
@Transactional
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void getAll_returnsSeededCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(7));
    }

    @Test
    void getById_returnsCategory() throws Exception {
        Category category = categoryRepository.findBySlug("ml").orElseThrow();
        mockMvc.perform(get("/api/categories/{id}", category.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("ml"))
                .andExpect(jsonPath("$.name").value("Machine Learning"));
    }

    @Test
    void getById_unknownId_returnsNotFound() throws Exception {
        mockMvc.perform(get("/api/categories/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returnsCreated() throws Exception {
        CategoryRequest request = new CategoryRequest(
                "Data Engineering", "data-engineering", "Data pipelines and tooling.");

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Data Engineering"))
                .andExpect(jsonPath("$.slug").value("data-engineering"));
    }

    @Test
    void create_duplicateSlug_returnsConflict() throws Exception {
        CategoryRequest request = new CategoryRequest("Another ML", "ml", "duplicate");

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void create_invalidRequest_returnsBadRequestWithFieldErrors() throws Exception {
        CategoryRequest request = new CategoryRequest("", "", null);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.slug").exists());
    }

    @Test
    void update_returnsUpdatedCategory() throws Exception {
        Category category = categoryRepository.findBySlug("dl").orElseThrow();
        CategoryRequest request = new CategoryRequest(
                "Deep Learning Updated", "dl", "Updated description.");

        mockMvc.perform(put("/api/categories/{id}", category.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Deep Learning Updated"))
                .andExpect(jsonPath("$.description").value("Updated description."));
    }

    @Test
    void delete_returnsNoContentAndRemovesCategory() throws Exception {
        CategoryRequest request = new CategoryRequest("Temp Category", "temp-cat", "temporary");

        MvcResult result = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        long id = json.get("id").asLong();

        mockMvc.perform(delete("/api/categories/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/categories/{id}", id))
                .andExpect(status().isNotFound());
    }
}