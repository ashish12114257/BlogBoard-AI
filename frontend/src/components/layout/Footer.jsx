import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useAsync';
import {
  Logo,
  MailIcon,
  LinkedInIcon,
  GitHubIcon,
  ArrowUpRightIcon,
} from '../common/icons';

const EMAIL = 'ashishkumar.codes@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/ashishkumarlpu01/';
const GITHUB_URL = 'https://github.com/ashish12114257';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/blogs', label: 'All Blogs' },
  { to: '/admin', label: 'Admin Dashboard' },
];

const socials = [
  { href: `mailto:${EMAIL}`, label: 'Email', Icon: MailIcon, external: false },
  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: LinkedInIcon, external: true },
  { href: GITHUB_URL, label: 'GitHub', Icon: GitHubIcon, external: true },
];

const connections = [
  { href: `mailto:${EMAIL}`, label: EMAIL, external: false },
  { href: LINKEDIN_URL, label: 'LinkedIn Profile', external: true },
  { href: GITHUB_URL, label: 'GitHub Profile', external: true },
];

export default function Footer() {
  const { data: categories } = useCategories();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-10">
        {/* Brand */}
        <div className="max-w-sm">
          <Link to="/" className="group inline-flex items-center gap-2.5">
            <span className="text-brand-600 transition-transform duration-200 group-hover:-rotate-6">
              <Logo className="h-[26px] w-[26px]" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-slate-900">
              Blog<span className="italic text-brand-600 dark:text-brand-400">Board</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            An AI-powered platform for creating, discovering and sharing insightful
            blogs.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            {socials.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/admin/create"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Create a Blog
              </Link>
            </li>
          </ul>
        </nav>

        {/* Categories (real data) */}
        <div>
          <h3 className="eyebrow">Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {(categories || []).slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/category/${category.slug}`}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="eyebrow">Connect with me</h3>
          <ul className="mt-4 space-y-3">
            {connections.map(({ href, label, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group inline-flex items-center gap-1.5 break-all text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {label}
                  {external && (
                    <ArrowUpRightIcon className="h-3 w-3 shrink-0 text-slate-300 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} BlogBoard. All rights reserved.</p>
          <p>Published from idea to article in minutes.</p>
        </div>
      </div>
    </footer>
  );
}
