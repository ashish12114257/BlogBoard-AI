import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import Select from '../components/common/Select';
import SectionHeader from '../components/common/SectionHeader';
import CategoryNav from '../components/layout/CategoryNav';
import BlogGrid from '../components/blog/BlogGrid';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { useArticles, useCategories } from '../hooks/useAsync';

const PAGE_SIZE = 6;

export default function AllBlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data, loading, error, refetch } = useArticles({
    category,
    search,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next);
  }

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const activeCategoryLabel =
    categories?.find((c) => c.slug === category)?.label || 'All categories';

  return (
    <div className="page">
      <header className="animate-fade-up">
        <p className="eyebrow">The archive</p>
        <h1 className="page-title mt-3">All Blogs</h1>
        <p className="page-subtitle max-w-xl">
          Browse every article on BlogBoard — filter by category or search for a
          topic, tag, or author.
        </p>
      </header>

      <div className="mt-8 border-y border-slate-200 py-4">
        <CategoryNav
          categories={categories || []}
          loading={categoriesLoading}
          activeSlug={category}
          allHref="/blogs"
          hrefFor={(slug) => `/blogs?category=${encodeURIComponent(slug)}`}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <SearchBar
          value={search}
          onChange={(value) => updateParams({ search: value, page: 1 })}
          placeholder="Search by title, tag, or author…"
        />
        <Select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
          options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
          ]}
          aria-label="Sort articles"
        />
      </div>

      {!loading && !error && items.length > 0 && (
        <SectionHeader
          title={activeCategoryLabel}
          description={`${total} article${total === 1 ? '' : 's'} found`}
          className="mt-10"
        />
      )}

      {loading ? (
        <LoadingSpinner label="Loading articles…" />
      ) : error ? (
        <ErrorMessage message={error.message} onRetry={refetch} />
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No articles found"
            message="Try a different search term or filter."
          />
        </div>
      ) : (
        <BlogGrid articles={items} columns={3} className="mt-6" />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(nextPage) => updateParams({ page: nextPage })}
        className="mt-14"
      />
    </div>
  );
}
