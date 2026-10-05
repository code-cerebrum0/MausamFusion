import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react';
import { mainNav } from '../../data/navigation';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { cn } from '../../utils/cn';
import { Logo } from '../ui/Logo';
import { ButtonLink } from '../ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const { progress, y } = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const scrolled = y > 8;

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200 ease-out',
        scrolled ? 'border-line bg-bg/85 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] backdrop-blur-md' : 'border-transparent bg-bg/60 backdrop-blur-sm'
      )}>
      
      <div className="container-page flex h-16 items-center gap-3">
        <Logo />
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-0.5 xl:flex">
          {mainNav.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            cn(
              'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-[background-color,color] duration-150',
              isActive ? 'bg-surface2 text-fg' : 'text-muted hover:bg-surface2/60 hover:text-fg'
            )
            }>
            
              {item.label}
            </NavLink>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex h-9 items-center gap-2 rounded-xl px-2.5 text-sm text-muted transition-[background-color,color] duration-150 hover:bg-surface2 hover:text-fg lg:border lg:border-line lg:bg-surface lg:pr-2"
            aria-label="Search the site">
            
            <SearchIcon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden rounded border border-line bg-surface2 px-1.5 font-mono text-[10px] text-muted lg:inline">⌘K</kbd>
          </button>
          <ThemeToggle />
          <ButtonLink to="/contact" size="sm" className="ml-1 hidden sm:inline-flex">
            Contact
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-fg transition-[background-color] duration-150 hover:bg-surface2 xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}>
            
            {menuOpen ? <XIcon className="h-5 w-5" aria-hidden="true" /> : <MenuIcon className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5" aria-hidden="true">
        <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <MobileMenu open={menuOpen} onClose={closeMenu} onOpenSearch={onOpenSearch} />
    </header>);

}