// Centralized API service.
//
// Talks to the Spring Boot backend through the REST endpoints below.
// All mapping/normalization between the backend DTO shape and the shape the
// React components expect happens here so components never need to know about
// backend field names.

const API_BASE_URL = 'https://blogboard-ai.onrender.com';

// ---------------------------------------------------------------------------
// Category presentation metadata (colors + short labels).
// The backend only stores name/slug/description; color is purely cosmetic.
// ---------------------------------------------------------------------------

const CATEGORY_COLORS = {
  ml: '#4f46e5',
  dl: '#0d9488',
  statistics: '#ea580c',
  nlp: '#e11d48',
  cv: '#d97706',
  genai: '#9333ea',
  ainews: '#059669',
};

const FALLBACK_COLORS = [
  '#4f46e5', '#0d9488', '#ea580c', '#e11d48', '#d97706', '#9333ea',
  '#059669', '#0284c7', '#db2777', '#65a30d',
];

const SHORT_LABELS = {
  ml: 'ML',
  dl: 'DL',
  statistics: 'Stats',
  nlp: 'NLP',
  cv: 'CV',
  genai: 'Gen AI',
  ainews: 'AI News',
  'machine learning': 'ML',
  'deep learning': 'DL',
  'statistics for ai': 'Stats',
  'natural language processing': 'NLP',
  'computer vision': 'CV',
  'generative ai': 'Gen AI',
  'ai news': 'AI News',
};

export function getCategoryColor(slug) {
  if (CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug];
  let hash = 0;
  for (const ch of String(slug)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

export function getCategoryShortLabel(nameOrSlug) {
  const key = String(nameOrSlug || '').trim().toLowerCase();
  if (SHORT_LABELS[key]) return SHORT_LABELS[key];
  const words = String(nameOrSlug || '').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return nameOrSlug || '';
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function formatError(data, status) {
  if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
    const [field, message] = Object.entries(data.fieldErrors)[0];
    return `${field}: ${message}`;
  }
  if (data?.message) return data.message;
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input and try again.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A resource with those details already exists.';
    case 500:
      return 'An unexpected server error occurred. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

async function request(path, options = {}) {
  const { method = 'GET', body, query } = options;

  const url = new URL(API_BASE_URL + path);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) config.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(url.toString(), config);
  } catch (err) {
    throw new ApiError(
      'Unable to reach the server. Please check your connection and try again.',
      0
    );
  }

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(formatError(data, response.status), response.status, data);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

function computeReadTime(markdown) {
  const words = (markdown || '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

function todayIso() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// Backend BlogDetailResponse / BlogSummaryResponse -> frontend article shape.
function normalizeBlog(blog) {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    content: blog.content,
    category: blog.categorySlug,
    categoryName: blog.categoryName,
    author: blog.author,
    date: blog.publishedDate,
    readTime: String(blog.readTime || '').replace(/\s*read$/i, '').trim(),
    tags: blog.tags || [],
    featured: false,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

// Backend CategoryResponse -> frontend category shape.
function normalizeCategory(category) {
  return {
    id: category.id,
    slug: category.slug,
    label: category.name,
    shortLabel: getCategoryShortLabel(category.name),
    description: category.description,
    color: getCategoryColor(category.slug),
  };
}

// Backend PageResponse -> frontend page shape.
function normalizePage(page) {
  return {
    items: (page.items || []).map(normalizeBlog),
    total: page.total || 0,
    page: page.page || 1,
    pageSize: page.pageSize || (page.items ? page.items.length : 0),
    totalPages: page.totalPages || 1,
    hasNext: Boolean(page.hasNext),
    hasPrevious: Boolean(page.hasPrevious),
  };
}

// Converts form values (category slug) to the BlogRequest payload the backend
// expects (categoryId numeric).
async function toBlogRequest(data) {
  const categories = await api.getCategories();
  const category = categories.find((c) => c.slug === data.category);
  const categoryId = category ? category.id : data.categoryId;

  if (!categoryId) {
    throw new ApiError('Please select a valid category.', 400);
  }

  return {
    title: data.title,
    description: data.description,
    content: data.content,
    categoryId,
    author: data.author,
    publishedDate: data.date || todayIso(),
    readTime: computeReadTime(data.content),
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export const api = {
  // GET /api/blogs
  async getBlogs({ category, search, sort = 'newest', page = 1, size = 10 } = {}) {
    if (search && String(search).trim()) {
      return this.searchBlogs(search, { sort, page, size });
    }
    if (category) {
      return this.getBlogsByCategory(category, { sort, page, size });
    }
    const data = await request('/blogs', { query: { sort, page, size } });
    return normalizePage(data);
  },

  // GET /api/blogs/{id}
  async getBlogById(id) {
    const data = await request(`/blogs/${id}`);
    return normalizeBlog(data);
  },

  // GET /api/blogs/slug/{slug}
  async getBlogBySlug(slug) {
    const data = await request(`/blogs/slug/${encodeURIComponent(slug)}`);
    return normalizeBlog(data);
  },

  // GET /api/blogs/category/{category}
  async getBlogsByCategory(category, { sort = 'newest', page = 1, size = 10 } = {}) {
    const data = await request(`/blogs/category/${encodeURIComponent(category)}`, {
      query: { sort, page, size },
    });
    return normalizePage(data);
  },

  // GET /api/blogs/search?query=
  async searchBlogs(query, { sort = 'newest', page = 1, size = 10 } = {}) {
    const data = await request('/blogs/search', {
      query: { query, sort, page, size },
    });
    return normalizePage(data);
  },

  // POST /api/blogs
  async createBlog(data) {
    const payload = await toBlogRequest(data);
    const created = await request('/blogs', { method: 'POST', body: payload });
    return normalizeBlog(created);
  },

  // POST /api/blogs/generate — triggers the existing multi-agent
  // (TutorialAgent -> ValidatorAgent) LangGraph workflow in draft mode.
  // Returns a draft that is never auto-published.
  async generateBlog({ topic, domain } = {}) {
    const data = await request('/blogs/generate', {
      method: 'POST',
      body: { topic, domain: domain || undefined },
    });
    return {
      topic: data.topic,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      categoryName: data.categoryName,
      tags: data.tags || [],
      slug: data.slug,
      readTime: data.readTime,
      revisionCount: data.revisionCount || 0,
      author: data.author || '',
    };
  },

  // PUT /api/blogs/{id}
  async updateBlog(id, data) {
    const payload = await toBlogRequest(data);
    const updated = await request(`/blogs/${id}`, { method: 'PUT', body: payload });
    return normalizeBlog(updated);
  },

  // DELETE /api/blogs/{id}
  async deleteBlog(id) {
    await request(`/blogs/${id}`, { method: 'DELETE' });
    return { success: true };
  },

  // GET /api/categories
  async getCategories() {
    const data = await request('/categories');
    return data.map(normalizeCategory);
  },

  // POST /api/categories
  async createCategory(data) {
    const created = await request('/categories', { method: 'POST', body: data });
    return normalizeCategory(created);
  },

  // PUT /api/categories/{id}
  async updateCategory(id, data) {
    const updated = await request(`/categories/${id}`, { method: 'PUT', body: data });
    return normalizeCategory(updated);
  },

  // DELETE /api/categories/{id}
  async deleteCategory(id) {
    await request(`/categories/${id}`, { method: 'DELETE' });
    return { success: true };
  },

  // GET /api/tags
  async getTags() {
    return request('/tags');
  },

  // POST /api/tags
  async createTag(name) {
    return request('/tags', { method: 'POST', body: { name } });
  },

  // ---- Derived helpers (computed from real backend data, no extra endpoints)
  // ---------------------------------------------------------------------------

  // GET /api/blogs?sort=newest&page=1&size={limit}
  async getRecentArticles(limit = 6) {
    const { items } = await this.getBlogs({ sort: 'newest', page: 1, size: limit });
    return items;
  },

  // The backend has no "featured" concept, so the newest articles are used as
  // a reasonable fallback.
  async getFeaturedArticles(limit = 3) {
    const { items } = await this.getBlogs({ sort: 'newest', page: 1, size: limit });
    return items;
  },

  // Related = newest articles in the same category, excluding the current one.
  async getRelatedArticles(slug, limit = 3) {
    try {
      const current = await this.getBlogBySlug(slug);
      const { items } = await this.getBlogsByCategory(current.category, {
        sort: 'newest',
        size: limit + 1,
      });
      return items.filter((a) => a.slug !== slug).slice(0, limit);
    } catch (err) {
      return [];
    }
  },

  // Dashboard statistics computed from available blog/category/tag data.
  async getStats() {
    const [blogsPage, categories, tags] = await Promise.all([
      this.getBlogs({ size: 100 }),
      this.getCategories(),
      this.getTags(),
    ]);
    return {
      totalArticles: blogsPage.total,
      totalCategories: categories.length,
      totalTags: tags.length,
      featuredArticles: blogsPage.items.filter((b) =>
        (b.tags || []).some((t) => t.toLowerCase() === 'featured')
      ).length,
    };
  },

  // ---- Backward-compatible aliases used by the existing hooks ----

  async getArticles(params = {}) {
    const { pageSize, ...rest } = params || {};
    return this.getBlogs({ size: pageSize, ...rest });
  },

  async getArticleBySlug(slug) {
    return this.getBlogBySlug(slug);
  },
};