import React, { useState } from 'react';
import { Menu, X, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { Container } from '../ui/Container';
import type { ClientConfig } from '../../types/config';

interface NavbarProps {
  config: ClientConfig;
  showPortalLink?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ config, showPortalLink = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { brand, hero, offerings, about, socialProof, contact } = config;

  const navLinks = [
    offerings && offerings.length > 0 ? { name: 'Offerings', href: '#offerings' } : null,
    about ? { name: 'About', href: '#about' } : null,
    socialProof && socialProof.length > 0 ? { name: 'Testimonials', href: '#social-proof' } : null,
    contact ? { name: 'Contact', href: '#contact' } : null,
  ].filter(Boolean) as Array<{ name: string; href: string }>;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-themeBg/85 backdrop-blur-md transition-colors">
      <Container>
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                className="h-9 w-auto object-contain rounded"
                onError={(e) => {
                  // Hide image if broken and fallback to icon
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-themePrimary/20 border border-themePrimary/40 text-themeAccent shadow-sm transition-transform group-hover:scale-105">
                <Shield className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-outfit text-lg sm:text-xl font-bold tracking-tight text-themeText group-hover:text-themeAccent transition-colors">
                {brand.name}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium tracking-wide">
                {brand.tagline.slice(0, 48)}
                {brand.tagline.length > 48 ? '...' : ''}
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-themeAccent"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {showPortalLink && (
              <a
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-500 transition-colors shadow-sm"
                title="Return to the Builder Welcome Portal"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-indigo-400" />
                <span>Portal</span>
              </a>
            )}

            {hero?.ctaText && (
              <a
                href={hero.ctaUrl || '#contact'}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-themePrimary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-themePrimary/25 transition-all hover:bg-themePrimary/90 hover:shadow-themePrimary/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{hero.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-themeBg/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-themeAccent transition-colors"
            >
              {link.name}
            </a>
          ))}
          {hero?.ctaText && (
            <div className="pt-2">
              <a
                href={hero.ctaUrl || '#contact'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-themePrimary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-themePrimary/20 hover:bg-themePrimary/90"
              >
                <span>{hero.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
          {showPortalLink && (
            <div className="pt-1">
              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-center text-xs font-semibold text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-indigo-400" />
                <span>Return to Landing Portal</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
