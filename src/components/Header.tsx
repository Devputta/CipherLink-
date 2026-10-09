import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Github,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Radio,
  FileText,
  Info,
} from 'lucide-react';
import { ConnectionStatus } from '../types/chat';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  status: ConnectionStatus;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateMessages: () => void;
  onScrollToHowItWorks?: () => void;
  activeRoute: 'home' | 'chat' | 'about';
}

export const Header: React.FC<HeaderProps> = ({
  status,
  soundEnabled,
  onToggleSound,
  isDark,
  onToggleDark,
  onNavigateHome,
  onNavigateAbout,
  onNavigateMessages,
  onScrollToHowItWorks,
  activeRoute,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-200/90 dark:border-[#2b323c] bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xs sticky top-0 z-40 transition-colors">
      <div className="max-w-[1120px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Product Logo & Branding */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
          title="Return to CipherLink Home"
        >
          <BrandLogo size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-tight">
              CipherLink
            </span>
            <span className="text-[10px] text-slate-500 dark:text-[#8b949e] leading-tight font-medium hidden xs:inline">
              Private Encrypted Messaging
            </span>
          </div>
        </button>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Navigation Links */}
          <nav className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-[#8b949e]">
            <button
              type="button"
              onClick={onScrollToHowItWorks || onNavigateHome}
              className={`hover:text-slate-900 dark:hover:text-[#f0f6fc] transition-colors cursor-pointer ${
                activeRoute === 'home' ? 'text-slate-900 dark:text-[#f0f6fc]' : ''
              }`}
            >
              How it works
            </button>
            <button
              type="button"
              onClick={onNavigateAbout}
              className={`hover:text-slate-900 dark:hover:text-[#f0f6fc] transition-colors cursor-pointer ${
                activeRoute === 'about' ? 'text-emerald-800 dark:text-emerald-400 font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>

          <div className="w-px h-3.5 bg-slate-200 dark:bg-[#2b323c]" aria-hidden="true" />

          {/* Status text only if in chat route */}
          {activeRoute === 'chat' && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-[#8b949e] hidden lg:inline" title={status === 'connected' ? 'Relay online' : 'Connecting to relay…'}>
              {status === 'connected' ? 'Relay Online' : 'Connecting…'}
            </span>
          )}

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/Devputta/CipherLink-.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#8b949e] dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded-md transition-colors"
            title="View source on GitHub"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#8b949e] dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded-md transition-colors cursor-pointer"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Sound toggle button */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#8b949e] dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded-md transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-700 dark:text-[#c9d1d9]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 dark:text-[#6e7681]" />
            )}
          </button>

          {/* Primary Action Button: Open Messages / Home */}
          {activeRoute !== 'chat' ? (
            <button
              type="button"
              onClick={onNavigateMessages}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Open Messages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded-md border border-slate-200 dark:border-[#2b323c] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          )}
        </div>

        {/* Mobile Header Right (Compact, uncluttered) */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick Route button */}
          {activeRoute !== 'chat' ? (
            <button
              type="button"
              onClick={onNavigateMessages}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-800 dark:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-2xs whitespace-nowrap"
            >
              <span>Messages</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 dark:text-[#f0f6fc] bg-slate-100 dark:bg-[#1f242c] rounded-md border border-slate-200 dark:border-[#2b323c] whitespace-nowrap"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Home</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-1.5 text-slate-700 dark:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded-md transition-colors cursor-pointer ml-0.5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown (Clean, zero overlap) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/90 dark:border-[#2b323c] bg-white dark:bg-[#161b22] px-4 py-3 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleMobileNav(onNavigateHome)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                activeRoute === 'home'
                  ? 'bg-slate-100 dark:bg-[#1f242c] text-emerald-800 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1f242c]/50'
              }`}
            >
              <span>Home</span>
              {activeRoute === 'home' && <span className="text-xs text-emerald-600">Active</span>}
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav(onNavigateMessages)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                activeRoute === 'chat'
                  ? 'bg-slate-100 dark:bg-[#1f242c] text-emerald-800 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1f242c]/50'
              }`}
            >
              <span>Messages</span>
              {activeRoute === 'chat' && <span className="text-xs text-emerald-600">Active</span>}
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav(onScrollToHowItWorks || onNavigateHome)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1f242c]/50"
            >
              <span>How it works</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav(onNavigateAbout)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                activeRoute === 'about'
                  ? 'bg-slate-100 dark:bg-[#1f242c] text-emerald-800 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1f242c]/50'
              }`}
            >
              <span>About &amp; FAQ</span>
              {activeRoute === 'about' && <span className="text-xs text-emerald-600">Active</span>}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#2b323c] grid grid-cols-2 gap-2 text-xs">
            {/* Toggle Theme */}
            <button
              type="button"
              onClick={onToggleDark}
              className="flex items-center justify-center gap-2 p-2 rounded-md border border-slate-200 dark:border-[#2b323c] bg-slate-50 dark:bg-[#1f242c] text-slate-700 dark:text-slate-200"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Toggle Sound */}
            <button
              type="button"
              onClick={onToggleSound}
              className="flex items-center justify-center gap-2 p-2 rounded-md border border-slate-200 dark:border-[#2b323c] bg-slate-50 dark:bg-[#1f242c] text-slate-700 dark:text-slate-200"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Sound: On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Sound: Muted</span>
                </>
              )}
            </button>
          </div>

          {/* GitHub link in mobile drawer */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 dark:text-[#8b949e]">
            <a
              href="https://github.com/Devputta/CipherLink-.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <span className="text-[11px]">
              {status === 'connected' ? 'Relay connected' : 'Connecting…'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
