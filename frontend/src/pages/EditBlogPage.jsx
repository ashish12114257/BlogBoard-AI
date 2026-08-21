import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogForm from '../components/blog/BlogForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { api } from '../services/api';
import { useArticle } from '../hooks/useAsync';

export default function EditBlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: article, loading, error: loadError } = useArticle(slug);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(values) {
    setSubmitting(true);
    setError(null);
    try {
      const updated = await api.updateBlog(article.id, { ...article, ...values });
      navigate(`/blogs/${updated.slug}`);
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <LoadingSpinner label="Loading article…" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page">
        <ErrorMessage message={loadError.message} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Edit Blog</h1>
          <p className="page-subtitle">Update the article details below.</p>
        </div>
        <Link
          to={`/blogs/${article.slug}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          View article
        </Link>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mt-8">
        <BlogForm
          key={article.slug}
          initialValues={article}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          submitting={submitting}
          cancelHref={`/blogs/${article.slug}`}
          cancelLabel="Back to article"
        />
      </div>
    </div>
  );
}