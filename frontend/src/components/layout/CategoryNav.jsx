import { Link } from 'react-router-dom';

const pillBase =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150';

const pillActive = 'border-slate-900 bg-slate-900 text-white';
const pillIdle =
  'border-slate-200 bg-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200';

/**
 * Horizontal editorial category rail.
 *
 * - `categories` comes from the real GET /api/categories data.
 * - `hrefFor(slug)` decides where a category points (a /category/:slug page or
 *   a filtered /blogs?category= listing), so existing filtering keeps working.
 */
export default function CategoryNav({
  categories = [],
  loading = false,
  activeSlug = '',
  allHref = '/blogs',
  allLabel = 'All',
  hrefFor,
}) {
  const href = (slug) => (hrefFor ? hrefFor(slug) : `/category/${slug}`);
  const allActive = !activeSlug;

  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <nav aria-label="Browse by category" className="flex items-center gap-2">
        <Link
          to={allHref}
          aria-current={allActive ? 'page' : undefined}
          className={`${pillBase} ${allActive ? pillActive : pillIdle}`}
        >
          {allLabel}
        </Link>

        {categories.map((category) => {
          const active = activeSlug === category.slug;
          return (
            <Link
              key={category.slug}
              to={href(category.slug)}
              aria-current={active ? 'page' : undefined}
              className={`${pillBase} ${active ? pillActive : pillIdle}`}
            >
              {category.label}
            </Link>
          );
        })}

        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <span
              key={`skeleton-${i}`}
              className="h-[2.15rem] w-20 shrink-0 animate-pulse rounded-full border border-slate-200 bg-slate-100/60"
              aria-hidden="true"
            />
          ))}
      </nav>
    </div>
  );
}
