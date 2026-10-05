import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';
import { useUtmCapture } from '../../hooks/useUtm';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchDialog } from './SearchDialog';
import { CookieBanner } from './CookieBanner';
import { FloatingActions } from './FloatingActions';

export function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  useUtmCapture(location.search, location.pathname);

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const t = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const skipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg">
      <a
        href="#main"
        onClick={skipToContent}
        className="sr-only z-[80] rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
        
        Skip to content
      </a>
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <CookieBanner />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
      <Toaster theme={theme} position="bottom-center" toastOptions={{ className: 'font-sans' }} />
    </div>);

}