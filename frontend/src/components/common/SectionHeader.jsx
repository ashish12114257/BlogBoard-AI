import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons';

export default function SectionHeader({ title, description, actionTo, actionLabel = 'View all', className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-brand-600" />
          <h2 className="section-heading">{title}</h2>
        </div>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
      </div>
      {actionTo && (
        <Link
          to={actionTo}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {actionLabel}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
