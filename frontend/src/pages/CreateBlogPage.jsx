import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../components/blog/BlogForm';
import ErrorMessage from '../components/common/ErrorMessage';
import { api } from '../services/api';

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(values) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await api.createBlog(values);
      navigate(`/blogs/${created.slug}`);
    } catch (err) {
      setError(err.message || 'Failed to create the blog post.');
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Create Blog</h1>
      <p className="page-subtitle">Write a new article and publish it to BlogBoard.</p>

      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mt-8">
        <BlogForm
          onSubmit={handleSubmit}
          submitLabel="Publish"
          submitting={submitting}
          showAiGenerate
          cancelHref="/admin"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
}