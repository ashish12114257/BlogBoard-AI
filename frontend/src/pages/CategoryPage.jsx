import { Link, useParams, useSearchParams } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import Select from '../components/common/Select';
import CategoryNav from '../components/layout/CategoryNav';
import BlogGrid from '../components/blog/BlogGrid';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { ArrowRightIcon } from '../components/common/icons';
import { useArticles, useCategories } from '../hooks/useAsync';

const PAGE_SIZE = 6;

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const category = categories?.find((c) => c.slug === slug);

  const { data, loading, error, refetch } = useArticles({
    category: slug,
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

  if (categoriesLoading) {
    return (
      <div className="page">
        <LoadingSpinner label="Loading category…" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="page">
        <ErrorMessage message={categoriesError.message} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="page text-center">
        <h1 className="page-title">Category not found</h1>
        <p className="mt-3 text-sm text-slate-500">
          The category you are looking for does not exist.
        </p>
        <Link to="/blogs" className="btn-primary mt-8 inline-flex">
          Browse all articles
          <ArrowRightIcon />
        </Link>
      </div>
    );
  }

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="page">
      <div className="border-b border-slate-200 pb-4">
        <CategoryNav categories={categories} activeSlug={slug} allHref="/blogs" />
      </div>

      <header className="mt-10 animate-fade-up">
        <p className="eyebrow">Category</p>
        <h1 className="display-title mt-3 text-4xl sm:text-5xl">{category.label}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
          {category.description}
        </p>
        <p className="mt-4 text-sm font-medium text-slate-400">
          {total} article{total === 1 ? '' : 's'}
        </p>
      </header>

      <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-[minmax(0,1fr)_15rem]">
        <SearchBar
          value={search}
          onChange={(value) => updateParams({ search: value, page: 1 })}
          placeholder={`Search in ${category.label}…`}
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

      {loading ? (
        <LoadingSpinner label="Loading articles…" />
      ) : error ? (
        <ErrorMessage message={error.message} onRetry={refetch} />
      ) : items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No articles found"
            message="Articles in this category will appear here."
          />
        </div>
      ) : (
        <BlogGrid articles={items} columns={3} className="mt-8" />
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
