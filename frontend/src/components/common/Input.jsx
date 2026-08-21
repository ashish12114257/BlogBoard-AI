export default function Input({ label, error, className = '', id, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}