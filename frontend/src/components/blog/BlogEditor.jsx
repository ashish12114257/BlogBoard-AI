import { useState } from 'react';
import Textarea from '../common/Textarea';
import { renderMarkdown } from '../../utils/markdown';

export default function BlogEditor({
  value,
  onChange,
  placeholder = 'Write your blog content in Markdown…',
}) {
  const [mode, setMode] = useState('write');

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/25">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setMode('write')}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'write'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'preview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Preview
        </button>
      </div>
      {mode === 'write' ? (
        <Textarea
          bare
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={16}
          className="resize-y bg-white p-4 font-mono text-slate-800"
        />
      ) : (
        <div className="min-h-[16rem] bg-white p-4 sm:p-6">
          {value?.trim() ? (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          ) : (
            <p className="text-sm text-slate-400">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}