import { getCategoryColor, getCategoryShortLabel } from '../../services/api';

export default function CategoryBadge({ category, categoryName, showLabel = false }) {
  const color = getCategoryColor(category);
  const label = showLabel
    ? categoryName || category
    : getCategoryShortLabel(categoryName || category);
  return (
    <span className="badge border border-slate-200 bg-slate-50 text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}