import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '../common/icons';

export default function CategoryCard({ category, count, index = 0 }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group card-hover flex h-full flex-col p-6"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="font-serif text-4xl font-medium leading-none text-slate-200 transition-colors duration-200 group-hover:text-brand-200 dark:text-slate-200/25 dark:group-hover:text-brand-500/40"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-600 dark:group-hover:text-brand-400" />
      </div>

      <h3 className="mt-5 font-serif text-lg font-medium tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-brand-800 dark:group-hover:text-brand-300">
        {category.label}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {category.description}
      </p>

      <p className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {count} {count === 1 ? 'article' : 'articles'}
      </p>
    </Link>
  );
}
