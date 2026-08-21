export default function Textarea({ label, error, bare = false, className = '', id, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={
          bare
            ? `block w-full text-sm text-slate-900 outline-none placeholder:text-slate-400 ${className}`
            : `input min-h-[6rem] ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : ''} ${className}`
        }
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}