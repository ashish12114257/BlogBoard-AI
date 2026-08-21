import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { SparklesIcon } from '../common/icons';
import BlogEditor from './BlogEditor';
import { useCategories } from '../../hooks/useAsync';
import { api } from '../../services/api';

function PanelHeading({ number, icon, children }) {
  return (
    <header className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
      {number && (
        <span aria-hidden="true" className="text-xs font-semibold tracking-widest text-brand-600 dark:text-brand-400">
          {number}
        </span>
      )}
      {icon && <span className="text-brand-600 dark:text-brand-400">{icon}</span>}
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
        {children}
      </h2>
    </header>
  );
}

function MiniSpinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function BlogForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Publish',
  submitting = false,
  showAiGenerate = false,
  cancelHref = '/admin',
  cancelLabel = 'Cancel',
}) {
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    category: initialValues.category || '',
    tags: (initialValues.tags || []).join(', '),
    content: initialValues.content || '',
    author: initialValues.author || '',
  });
  const [errors, setErrors] = useState({});
  const [aiTopic, setAiTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [generated, setGenerated] = useState(false);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleGenerate() {
    const topic = aiTopic.trim();
    if (!topic || generating) return;
    setGenerating(true);
    setGenerateError(null);
    setGenerated(false);
    try {
      const result = await api.generateBlog({
        topic,
        domain: form.category || undefined,
      });
      setForm((prev) => ({
        ...prev,
        title: result.title || prev.title,
        description: result.description || prev.description,
        category: result.category || prev.category,
        tags: (result.tags || []).join(', '),
        content: result.content || prev.content,
      }));
      setGenerated(true);
    } catch (err) {
      setGenerateError(err.message || 'Failed to generate content with AI.');
    } finally {
      setGenerating(false);
    }
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.description.trim()) next.description = 'Description is required.';
    if (!form.category) next.category = 'Please select a category.';
    if (!form.author.trim()) next.author = 'Author is required.';
    if (!form.content.trim()) next.content = 'Content is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {categoriesLoading && <LoadingSpinner label="Loading categories…" />}
      {categoriesError && <p className="text-sm text-red-600 dark:text-red-400">{categoriesError.message}</p>}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          {/* Blog information */}
          <section className="card overflow-hidden animate-fade-up">
            <PanelHeading number="01">Blog information</PanelHeading>
            <div className="space-y-5 p-6">
              <Input
                label="Title"
                id="title"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="A clear, descriptive title"
                error={errors.title}
                className="text-base"
              />

              <Textarea
                label="Description"
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="A short summary shown in article cards and search results"
                error={errors.description}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Category"
                  id="category"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  options={categories?.map((c) => ({ value: c.slug, label: c.label })) || []}
                  placeholder="Select a category"
                  error={errors.category}
                />
                <Input
                  label="Author"
                  id="author"
                  value={form.author}
                  onChange={(e) => setField('author', e.target.value)}
                  placeholder="Article author"
                  error={errors.author}
                />
              </div>

              <Input
                label="Tags"
                id="tags"
                value={form.tags}
                onChange={(e) => setField('tags', e.target.value)}
                placeholder="comma, separated, tags"
              />
              <p className="-mt-3 text-xs text-slate-400">
                Separate tags with commas — they power search and discovery.
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="card overflow-hidden animate-fade-up" style={{ animationDelay: '60ms' }}>
            <PanelHeading number="02">Content</PanelHeading>
            <div className="p-6">
              <label htmlFor="content" className="label">
                Content
              </label>
              <BlogEditor value={form.content} onChange={(value) => setField('content', value)} />
              {errors.content && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                Markdown supported — # headings, **bold**, *italic*, `code`, and [links](url).
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24">
          {/* AI generation */}
          {showAiGenerate && (
            <section
              className="overflow-hidden rounded-xl border border-dashed border-brand-300 bg-brand-50/50 animate-fade-up dark:border-brand-500/40 dark:bg-brand-500/5"
              style={{ animationDelay: '120ms' }}
            >
              <header className="flex items-center gap-2.5 border-b border-dashed border-brand-200 px-5 py-4 dark:border-brand-500/30">
                <SparklesIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
                  Generate with AI
                </h2>
              </header>
              <div className="space-y-4 p-5">
                <p className="text-xs leading-relaxed text-slate-500">
                  Enter a topic and the multi-agent workflow will draft the title, description,
                  content, category, and tags. Generated content is never published automatically —
                  review it before publishing.
                </p>
                <Input
                  label="Topic"
                  id="ai-topic"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Java Multithreading"
                  disabled={generating}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGenerate}
                  disabled={generating || !aiTopic.trim()}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <MiniSpinner className="h-4 w-4" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>

                {generating && (
                  <p className="text-xs text-slate-500">
                    This usually takes a minute or two.
                  </p>
                )}
                {generateError && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {generateError}
                  </p>
                )}
                {generated && (
                  <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    Draft generated. Review the fields above and edit before publishing.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Publishing */}
          <section className="card overflow-hidden animate-fade-up" style={{ animationDelay: '180ms' }}>
            <PanelHeading number={showAiGenerate ? '03' : null}>Publishing</PanelHeading>
            <div className="space-y-3 p-5">
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <MiniSpinner className="h-4 w-4" />
                    Saving…
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
              <Button to={cancelHref} variant="secondary" className="w-full">
                {cancelLabel}
              </Button>
              <p className="pt-1 text-xs leading-relaxed text-slate-400">
                Your article will be published immediately after saving.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
