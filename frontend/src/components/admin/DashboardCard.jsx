const COLOR_CLASSES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',
};

export default function DashboardCard({ label, value, icon, color = 'brand' }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              COLOR_CLASSES[color] || COLOR_CLASSES.brand
            }`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-0.5 truncate text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}