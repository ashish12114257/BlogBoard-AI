import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { ArrowRightIcon, SparklesIcon } from '../common/icons';

export default function HeroSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200">
      <div className="container-page pb-14 pt-16 sm:pb-20 sm:pt-24">
        <p className="eyebrow animate-fade-up">An AI-powered publishing platform</p>

        <h1
          className="display-hero mt-5 max-w-3xl animate-fade-up"
          style={{ animationDelay: '60ms' }}
        >
          Write, generate &amp; share ideas that{' '}
          <em className="italic text-brand-600 dark:text-brand-400">matter</em>.
        </h1>

        <p
          className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          BlogBoard blends human creativity with multi-agent AI drafting — a curated
          space to read deeply and publish confidently.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-xl animate-fade-up"
          style={{ animationDelay: '180ms' }}
          role="search"
        >
          <SearchBar value={search} onChange={setSearch} placeholder="Search articles…" />
        </form>

        <div
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 animate-fade-up"
          style={{ animationDelay: '240ms' }}
        >
          <button type="button" onClick={() => navigate('/blogs')} className="btn-primary">
            Start reading
            <ArrowRightIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/create')}
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <SparklesIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            Publish with AI
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
