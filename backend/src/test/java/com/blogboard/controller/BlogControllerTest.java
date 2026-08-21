package com.blogboard.controller;

import com.blogboard.repository.CategoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
class BlogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void cleanBlogData() {
        jdbcTemplate.execute("DELETE FROM blog_tags");
        jdbcTemplate.execute("DELETE FROM blogs");
        jdbcTemplate.execute("DELETE FROM tags");
    }

    private Long mlCategoryId() {
        return categoryRepository.findBySlug("ml").orElseThrow().getId();
    }

    private String blogJson(String slug) throws Exception {
        return objectMapper.writeValueAsString(blogBody(slug));
    }

    private Map<String, Object> blogBody(String slug) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("title", "Test Blog " + slug);
        body.put("slug", slug);
        body.put("description", "A test blog description.");
        body.put("content", "## Introduction\n\nSome **body** content.\n\n```java\nSystem.out.println(\"hi\");\n```");
        body.put("categoryId", mlCategoryId());
        body.put("author", "Tester");
        body.put("publishedDate", "2026-03-01");
        body.put("readTime", "5 min");
        body.put("tags", List.of("java", "spring"));
        return body;
    }

    private long createBlog(String slug) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(blogJson(slug)))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    @Test
    void getAll_returnsPagedResults() throws Exception {
        createBlog("blog-one");
        createBlog("blog-two");

        mockMvc.perform(get("/api/blogs")
                        .param("page", "1")
                        .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(2))
                .andExpect(jsonPath("$.total").value(2))
                .andExpect(jsonPath("$.items[0].title").value("Test Blog blog-one"));
    }

    private long createBlogWithDate(String slug, String publishedDate) throws Exception {
        Map<String, Object> body = blogBody(slug);
        body.put("publishedDate", publishedDate);
        MvcResult result = mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    @Test
    void getAll_newestSortOrdersByPublishedDateDesc() throws Exception {
        createBlogWithDate("blog-a", "2026-03-01");
        createBlogWithDate("blog-b", "2026-03-05");

        mockMvc.perform(get("/api/blogs")
                        .param("sort", "newest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].slug").value("blog-b"))
                .andExpect(jsonPath("$.items[1].slug").value("blog-a"));
    }

    @Test
    void getAll_oldestSortOrdersByPublishedDateAsc() throws Exception {
        createBlogWithDate("blog-a", "2026-03-01");
        createBlogWithDate("blog-b", "2026-03-05");

        mockMvc.perform(get("/api/blogs")
                        .param("sort", "oldest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].slug").value("blog-a"))
                .andExpect(jsonPath("$.items[1].slug").value("blog-b"));
    }

    @Test
    void getById_returnsBlogDetail() throws Exception {
        long id = createBlog("blog-detail");

        mockMvc.perform(get("/api/blogs/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Blog blog-detail"))
                .andExpect(jsonPath("$.categorySlug").value("ml"))
                .andExpect(jsonPath("$.content").exists())
                .andExpect(jsonPath("$.tags[0]").value("java"))
                .andExpect(jsonPath("$.author").value("Tester"));
    }

    @Test
    void getById_unknownId_returnsNotFound() throws Exception {
        mockMvc.perform(get("/api/blogs/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void getBySlug_returnsBlog() throws Exception {
        createBlog("blog-by-slug");

        mockMvc.perform(get("/api/blogs/slug/blog-by-slug"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("blog-by-slug"));
    }

    @Test
    void getByCategory_filtersBlogs() throws Exception {
        createBlog("ml-blog");

        Map<String, Object> dlBody = blogBody("dl-blog");
        dlBody.put("categoryId", categoryRepository.findBySlug("dl").orElseThrow().getId());
        mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dlBody)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/blogs/category/ml"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].slug").value("ml-blog"));
    }

    @Test
    void search_matchesTitleContentAndTag() throws Exception {
        createBlog("attention-mechanisms");

        mockMvc.perform(get("/api/blogs/search").param("query", "attention"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.items[0].slug").value("attention-mechanisms"));

        mockMvc.perform(get("/api/blogs/search").param("query", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1));

        mockMvc.perform(get("/api/blogs/search").param("query", "body"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1));
    }

    @Test
    void create_slugGeneratedFromTitleWhenOmitted() throws Exception {
        Map<String, Object> body = blogBody("generated");
        body.put("slug", null);

        mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("test-blog-generated"));
    }

    @Test
    void create_duplicateSlug_returnsConflict() throws Exception {
        createBlog("dup-slug");
        mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(blogJson("dup-slug")))
                .andExpect(status().isConflict());
    }

    @Test
    void create_invalidRequest_returnsBadRequestWithFieldErrors() throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("title", "");
        body.put("description", "x");
        body.put("categoryId", mlCategoryId());
        body.put("author", "Tester");

        mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.title").exists())
                .andExpect(jsonPath("$.fieldErrors.content").exists());
    }

    @Test
    void create_unknownCategory_returnsNotFound() throws Exception {
        Map<String, Object> body = blogBody("bad-category");
        body.put("categoryId", 9999L);

        mockMvc.perform(post("/api/blogs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_returnsUpdatedBlog() throws Exception {
        long id = createBlog("blog-update");

        Map<String, Object> body = blogBody("blog-updated");
        body.put("title", "Updated Title");
        body.put("slug", "blog-updated");

        mockMvc.perform(put("/api/blogs/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.slug").value("blog-updated"));
    }

    @Test
    void delete_returnsNoContentAndRemovesBlog() throws Exception {
        long id = createBlog("blog-delete");

        mockMvc.perform(delete("/api/blogs/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/blogs/{id}", id))
                .andExpect(status().isNotFound());
    }
}