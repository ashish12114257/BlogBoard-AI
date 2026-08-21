import { Link, useParams } from 'react-router-dom';
import Tag from '../components/common/Tag';
import SectionHeader from '../components/common/SectionHeader';
import BlogGrid from '../components/blog/BlogGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ChevronRightIcon } from '../components/common/icons';
import { renderMarkdown } from '../utils/markdown';
import { formatDate, getInitials } from '../utils/formatters';
import { getCategoryColor } from '../services/api';
import { useArticle, useRelatedArticles } from '../hooks/useAsync';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const { data: article, loading, error } = useArticle(slug);
  const { data: related } = useRelatedArticles(slug, 3);

  if (loading) {
    return (
      <div className="page">
        <LoadingSpinner label="Loading article…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-slate-900 dark:hover:text-slate-200">
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <Link
          to={`/category/${article.category}`}
          className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
        >
          {article.categoryName || article.category}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span className="max-w-[16rem] truncate text-slate-700 sm:max-w-[24rem] dark:text-slate-300">
          {article.title}
        </span>
      </nav>

      {/* Centered reading column */}
      <article className="mx-auto mt-10 max-w-[44rem] animate-fade-up">
        <header className="border-b border-slate-200 pb-8">
          <span className="category-label">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: getCategoryColor(article.category) }}
            />
            {article.categoryName || article.category}
          </span>

          <h1 className="display-title mt-5 text-4xl leading-[1.12] sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 font-serif text-lg italic leading-relaxed text-slate-500">
            {article.description}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700"
            >
              {getInitials(article.author)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{article.author}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span aria-hidden="true"> · </span>
                {article.readTime} read
              </p>
            </div>
          </div>
        </header>

        <div
          className="markdown-body mt-10"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />

        {article.tags?.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-slate-200 pt-7">
            {article.tags.map((tag) => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </div>
        )}
      </article>

      {related?.length > 0 && (
        <section className="mt-20 border-t border-slate-200 pt-12">
          <SectionHeader title="Related articles" description={`More from ${article.categoryName || article.category}.`} />
          <BlogGrid articles={related} columns={3} className="mt-8" />
        </section>
      )}
    </div>
  );
}
