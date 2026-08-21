import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo, MenuIcon, XIcon, PlusIcon, SunIcon, MoonIcon } from '../common/icons';
import { useTheme } from '../../context/ThemeContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/blogs', label: 'All Blogs' },
  { to: '/admin', label: 'Admin' },
];

const desktopLinkClass = ({ isActive }) =>
  `relative px-1 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:transition-transform after:duration-200 ${
    isActive
      ? 'text-slate-900 after:scale-x-100 after:bg-brand-600 dark:text-slate-100'
      : 'text-slate-500 after:scale-x-0 after:bg-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-slate-100 text-slate-900 dark:bg-slate-100/10 dark:text-slate-100'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-100/5 dark:hover:text-slate-200'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <NavLink to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="text-brand-600 transition-transform duration-200 group-hover:-rotate-6">
              <Logo className="h-[26px] w-[26px]" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-slate-900">
              Blog<span className="italic text-brand-600 dark:text-brand-400">Board</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-100/10 dark:hover:text-slate-200"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          <Link to="/admin/create" className="btn-primary hidden !px-4 !py-2 md:inline-flex">
            <PlusIcon />
            Create Blog
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-100/10 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-slate-200 bg-slate-50 px-4 pb-4 pt-2 animate-fade-in md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={mobileLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/admin/create"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            <PlusIcon />
            Create Blog
          </Link>
        </nav>
      )}
    </header>
  );
}
