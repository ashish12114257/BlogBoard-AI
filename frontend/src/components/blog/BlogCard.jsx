import { Link } from 'react-router-dom';
import { getCategoryColor } from '../../services/api';
import { formatDate, getInitials } from '../../utils/formatters';
import Tag from '../common/Tag';
import { ArrowUpRightIcon } from '../common/icons';

export default function BlogCard({ article }) {
  const href = `/blogs/${article.slug}`;

  return (
    <Link
      to={href}
      aria-label={`Read: ${article.title}`}
      className="group card-hover flex h-full flex-col p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="category-label">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: getCategoryColor(article.category) }}
          />
          {article.categoryName || article.category}
        </span>
        <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-600 dark:group-hover:text-brand-400" />
      </div>

      <h3 className="mt-4 font-serif text-xl font-medium leading-snug tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-brand-800 dark:group-hover:text-brand-300">
        {article.title}
      </h3>

      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {article.description}
      </p>

      {article.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-200/60">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600"
        >
          {getInitials(article.author)}
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{article.author}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>{article.readTime} read</span>
      </div>
    </Link>
  );
}
