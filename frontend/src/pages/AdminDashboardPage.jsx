import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/admin/DashboardCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import CategoryBadge from '../components/common/CategoryBadge';
import {
  PlusIcon,
  ArticleIcon,
  FolderIcon,
  TagIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
} from '../components/common/icons';
import { formatDate } from '../utils/formatters';
import { api } from '../services/api';
import { useArticles, useStats } from '../hooks/useAsync';

export default function AdminDashboardPage() {
  const { data: stats, refetch: refetchStats } = useStats();
  const { data, loading, error, refetch } = useArticles({
    sort: 'newest',
    pageSize: 20,
  });

  const [deleting, setDeleting] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const recent = data?.items || [];

  function requestDelete(article) {
    setDeleting(article);
    setDeleteError(null);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteError(null);
    try {
      await api.deleteBlog(deleting.id);
      setConfirmOpen(false);
      setDeleting(null);
      refetch();
      refetchStats();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete the article.');
    }
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage blogs, categories, and content.</p>
        </div>
        <Button to="/admin/create">
          <PlusIcon />
          Create Blog
        </Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Total Blogs"
          value={stats?.totalArticles ?? '—'}
          icon={<ArticleIcon />}
          color="brand"
        />
        <DashboardCard
          label="Categories"
          value={stats?.totalCategories ?? '—'}
          icon={<FolderIcon />}
          color="green"
        />
        <DashboardCard
          label="Tags"
          value={stats?.totalTags ?? '—'}
          icon={<TagIcon />}
          color="amber"
        />
        <DashboardCard
          label="Featured Articles"
          value={stats?.featuredArticles ?? '—'}
          icon={<StarIcon />}
          color="red"
        />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="section-heading">Recent Blogs</h2>
          <Link to="/blogs" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            View all
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading articles…" />
        ) : error ? (
          <ErrorMessage message={error.message} onRetry={refetch} />
        ) : recent.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No blogs yet"
              message="Create your first blog post to get started."
            />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-card">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((article) => (
                  <tr key={article.id} className="transition-colors hover:bg-slate-50">
                    <td className="max-w-xs truncate px-5 py-3 font-medium text-slate-900">
                      {article.title}
                    </td>
                    <td className="px-5 py-3">
                      <CategoryBadge category={article.category} categoryName={article.categoryName} />
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(article.date)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" to={`/admin/edit/${article.slug}`}>
                          <PencilIcon />
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => requestDelete(article)}>
                          <TrashIcon />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={confirmOpen}
        title="Delete article"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        {deleteError && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{deleteError}</p>}
        <p className="text-sm leading-relaxed text-slate-600">
          Are you sure you want to delete{' '}
          <strong className="font-medium text-slate-900">{deleting?.title}</strong>? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}