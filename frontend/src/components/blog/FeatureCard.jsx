import { Link } from 'react-router-dom';
import { getCategoryColor } from '../../services/api';
import { getInitials } from '../../utils/formatters';
import { ArrowUpRightIcon } from '../common/icons';

/**
 * Large editorial lead card used for the top featured article.
 */
export default function FeatureCard({ article }) {
  const href = `/blogs/${article.slug}`;

  return (
    <Link
      to={href}
      className="group card-hover flex h-full flex-col p-7 sm:p-10"
      aria-label={`Read: ${article.title}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="category-label">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: getCategoryColor(article.category) }}
          />
          {article.categoryName || article.category}
        </span>
        <ArrowUpRightIcon className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-600 dark:group-hover:text-brand-400" />
      </div>

      <h3 className="display-title mt-6 text-3xl leading-[1.15] transition-colors duration-200 group-hover:text-brand-800 dark:group-hover:text-brand-300 sm:text-4xl">
        {article.title}
      </h3>

      <p className="mt-4 line-clamp-2 max-w-2xl text-base leading-relaxed text-slate-600">
        {article.description}
      </p>

      <div className="mt-auto flex items-center gap-3 pt-8 text-sm text-slate-500">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"
        >
          {getInitials(article.author)}
        </span>
        <span className="font-medium text-slate-800">{article.author}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>{article.readTime} read</span>
      </div>
    </Link>
  );
}
