import BlogCard from './BlogCard';

/**
 * Responsive article grid with a subtle staggered entrance.
 * `columns` controls the desktop column count (2 or 3).
 */
export default function BlogGrid({ articles = [], columns = 3, className = '' }) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 ${
        columns === 3 ? 'lg:grid-cols-3' : ''
      } ${className}`}
    >
      {articles.map((article, index) => (
        <div
          key={article.id}
          className="h-full animate-fade-up"
          style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
        >
          <BlogCard article={article} />
        </div>
      ))}
    </div>
  );
}
