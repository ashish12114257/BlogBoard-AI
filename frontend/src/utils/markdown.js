import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true,
});

// Renders markdown to sanitized HTML safe for injection via dangerouslySetInnerHTML.
export function renderMarkdown(markdown = '') {
  const rawHtml = marked.parse(markdown);
  return DOMPurify.sanitize(rawHtml);
}