import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles, FileCheck2, LogIn } from 'lucide-react';
import { ActivePage, UserProfile } from '../types';
import { SystemStatus } from './SystemStatus';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: UserProfile | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', target: 'landing', sectionId: 'hero' },
    { label: 'How It Works', target: 'landing', sectionId: 'how-it-works' },
    { label: 'Features', target: 'landing', sectionId: 'features' },
    { label: 'About Us', target: 'landing', sectionId: 'about' },
    { label: 'Supported Docs', target: 'supported-docs' },
  ];

  const handleNavClick = (target: string, sectionId?: string) => {
    setMobileMenuOpen(false);
    if (target === 'landing') {
      setActivePage('landing');
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      setActivePage(target as ActivePage);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 1. Brand Logo on Top-Left */}
        <div 
          onClick={() => setActivePage('landing')}
          className="flex cursor-pointer items-center gap-2.5 transition-transform hover:scale-[1.01]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 via-blue-900 to-cyan-600 text-white shadow-md shadow-cyan-900/10">
            <ShieldCheck className="h-6 w-6 text-cyan-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900">DocShield</span>
              <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-cyan-800 uppercase">AI</span>
            </div>
            <span className="text-[10px] font-medium tracking-tight text-slate-500">Document Verification & Compliance</span>
          </div>
        </div>

        {/* 2. Desktop Navigation: Home, How It Works, Features, About Us */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.target, link.sectionId)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {link.label}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => setActivePage('dashboard')}
              className="ml-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-950 transition hover:bg-blue-100"
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* 3 & 4. Top-Right Buttons: Clearly Visible "Sign In" and "Get Started" on Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          
          <div className="hidden lg:block">
            <SystemStatus />
          </div>

          {currentUser ? (
            /* Logged in state with quick access to Verify, Dashboard & Logout */
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('verify')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:shadow hover:opacity-95"
              >
                <FileCheck2 className="h-4 w-4 text-cyan-300" />
                <span>Verify Doc</span>
              </button>
              
              <div 
                onClick={() => setActivePage('dashboard')}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 hover:bg-slate-100 transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-900 text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            /* Not logged in: Prominent SIGN IN and GET STARTED buttons */
            <div className="flex items-center gap-2.5">
              
              {/* Clearly visible SIGN IN button */}
              <button
                onClick={() => setActivePage('login')}
                className="flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-xs transition hover:border-blue-950 hover:bg-slate-50 hover:text-blue-950 active:scale-95"
              >
                <LogIn className="h-4 w-4 text-slate-600" />
                <span>Sign In</span>
              </button>

              {/* Prominent GET STARTED button beside Sign In */}
              <button
                onClick={() => setActivePage('verify')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-950/20 transition hover:opacity-95 hover:shadow-lg active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 text-cyan-300" />
              </button>

            </div>
          )}

        </div>

        {/* Mobile controls & hamburger button */}
        <div className="flex items-center gap-2 md:hidden">
          {!currentUser && (
            <button
              onClick={() => setActivePage('login')}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setActivePage('verify')}
            className="rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
          >
            Get Started
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.target, link.sectionId)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
            
            <div className="my-2 border-t border-slate-200 pt-3">
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setActivePage('dashboard'); setMobileMenuOpen(false); }}
                    className="w-full rounded-xl bg-blue-50 py-2.5 text-center text-sm font-bold text-blue-900"
                  >
                    Go to Dashboard ({currentUser.name})
                  </button>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full rounded-xl py-2 text-center text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => { setActivePage('login'); setMobileMenuOpen(false); }}
                    className="w-full rounded-xl border-2 border-slate-300 py-2.5 text-center text-sm font-bold text-slate-800 hover:bg-slate-50 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setActivePage('verify'); setMobileMenuOpen(false); }}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-900 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-blue-950/20"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
