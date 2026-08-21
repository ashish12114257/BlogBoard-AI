import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <p className="text-5xl font-bold tracking-tight text-brand-600 dark:text-brand-400">404</p>
      <h1 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button to="/">Back to Home</Button>
        <Button variant="secondary" to="/blogs">
          Browse Blogs
        </Button>
      </div>
    </div>
  );
}