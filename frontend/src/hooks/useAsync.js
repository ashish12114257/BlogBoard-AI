import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';

// Shared hook pattern: returns { data, loading, error, refetch }.
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cleanup = refetch();
    return cleanup;
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useCategories() {
  return useAsync(() => api.getCategories(), []);
}

export function useArticle(slug) {
  return useAsync(() => api.getArticleBySlug(slug), [slug]);
}

export function useArticles(params = {}) {
  return useAsync(() => api.getArticles(params), [JSON.stringify(params)]);
}

export function useRecentArticles(limit = 6) {
  return useAsync(() => api.getRecentArticles(limit), [limit]);
}

export function useFeaturedArticles(limit = 3) {
  return useAsync(() => api.getFeaturedArticles(limit), [limit]);
}

export function useRelatedArticles(slug, limit = 3) {
  return useAsync(() => api.getRelatedArticles(slug, limit), [slug, limit]);
}

export function useStats() {
  return useAsync(() => api.getStats(), []);
}

// Count of articles per category slug.
export function useCategoryCounts() {
  return useAsync(async () => {
    const categories = await api.getCategories();
    const counts = {};
    await Promise.all(
      categories.map(async (category) => {
        const page = await api.getBlogsByCategory(category.slug, { size: 1 });
        counts[category.slug] = page.total;
      })
    );
    return counts;
  }, []);
}