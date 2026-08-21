import { InboxIcon } from './icons';

export default function EmptyState({ icon, title = 'Nothing here yet', message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
      {icon || <InboxIcon className="h-10 w-10 text-slate-300 dark:text-slate-500" />}
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>}
    </div>
  );
}