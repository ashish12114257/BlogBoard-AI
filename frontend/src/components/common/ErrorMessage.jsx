import Button from './Button';
import { AlertIcon } from './icons';

export default function ErrorMessage({ message = 'Something went wrong while loading.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-100 bg-red-50/50 px-6 py-16 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400">
        <AlertIcon className="h-5 w-5" />
      </div>
      <p className="max-w-md text-sm text-slate-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}