import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Clock,
  ArrowUp,
  Laptop,
  Smartphone,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Zap,
  Radio,
  ExternalLink,
  Paperclip,
  Trash2,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HomePageProps {
  onOpenChat: (initialCode?: string) => void;
  onOpenAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenChat, onOpenAbout }) => {
  const [quickCode, setQuickCode] = useState('234');

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickCode.replace(/\D/g, '').slice(0, 6);
    if (clean.length >= 3) {
      onOpenChat(clean);
    } else {
      onOpenChat('234');
    }
  };

  return (
    <div className="w-full text-slate-800 dark:text-[#f0f6fc]">
      {/* =========================================================================
          1. HERO SECTION (Human-built, high-clarity Light Mode)
      ========================================================================= */}
      <section className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-8 pb-14 sm:pt-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Product Narrative & Quick Join Launcher */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-200/90 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Zero-knowledge client encryption</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Private conversations, <br className="hidden sm:inline" />
                <span className="text-emerald-800 dark:text-emerald-400">without the fuss.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-[#8b949e] leading-relaxed max-w-xl font-normal pt-2">
                CipherLink lets two people meet in a temporary channel and exchange messages, photos, videos, and PDFs directly. No signups, no phone numbers, and no persistent server storage.
              </p>
            </div>

            {/* Quick Channel Launcher Bar */}
            <div className="p-3.5 sm:p-4 bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl shadow-xs space-y-3 max-w-lg">
              <form onSubmit={handleQuickJoin} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="font-mono text-xs font-semibold">#</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter code (e.g. 234)"
                    className="w-full pl-7 pr-3 py-2 text-sm font-mono font-semibold bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#2b323c] rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-emerald-700 focus:bg-white dark:focus:bg-[#0d1117] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Join Channel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8b949e] pt-1 border-t border-slate-100 dark:border-[#2b323c]">
                <span className="text-[11px]">Pick any 3–6 digit number to start.</span>
                <button
                  type="button"
                  onClick={() => onOpenChat('234')}
                  className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Try demo channel #234</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-slate-600 dark:text-[#8b949e]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>No registration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>AES-256 in browser</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Photos &amp; PDFs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Alice & Bob Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl shadow-xs overflow-hidden">
              {/* Fake Window Header (WhatsApp style conversation bar) */}
              <div className="px-3.5 py-2 border-b border-slate-200/90 dark:border-[#2b323c] bg-slate-50/70 dark:bg-[#1f242c]/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-semibold text-xs text-white">
                      A
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161b22]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-[#f0f6fc]">
                        Alice
                      </span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/60">
                        #234
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      online
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-[#8b949e] font-mono">
                  Example conversation
                </span>
              </div>

              {/* Chat timeline simulation */}
              <div className="p-4 space-y-3 bg-[#fafbfc] dark:bg-[#0d1117]/40 text-xs">
                {/* Alice message */}
                <div className="flex flex-col items-start space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-[#8b949e] px-1">
                    Alice · 7:42 PM
                  </span>
                  <div className="px-3 py-2 rounded-xl bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] text-slate-800 dark:text-[#f0f6fc] shadow-2xs max-w-[85%]">
                    Are you on channel 234?
                  </div>
                </div>

                {/* Bob message (Self) */}
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-[#8b949e] px-1">
                    You (Bob) · 7:43 PM
                  </span>
                  <div className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-[#1e2a38] text-white shadow-2xs max-w-[85%]">
                    Yes, just joined. Local AES-GCM encryption is active.
                  </div>
                </div>

                {/* Alice media attachment message */}
                <div className="flex flex-col items-start space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-[#8b949e] px-1">
                    Alice · 7:44 PM
                  </span>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] text-slate-800 dark:text-[#f0f6fc] shadow-2xs max-w-[85%] space-y-1.5">
                    <div className="flex items-center gap-2 p-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/50 rounded-lg text-rose-700 dark:text-rose-300 text-[11px] font-mono">
                      <FileText className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span className="truncate">project-spec.pdf (1.2 MB)</span>
                    </div>
                    <p className="text-[11px]">Sending the encrypted document now.</p>
                  </div>
                </div>

                {/* Ephemeral Timer indicator */}
                <div className="text-center pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-900/60 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Auto-delete: 5 minutes</span>
                  </span>
                </div>
              </div>

              {/* Fake message input */}
              <div className="p-2.5 border-t border-slate-200/90 dark:border-[#2b323c] bg-white dark:bg-[#161b22] flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 dark:text-slate-500 pl-1">
                  Write encrypted message…
                </span>
                <div className="w-6 h-6 rounded bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center">
                  <ArrowUp className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STEP-BY-STEP HOW IT WORKS (Realistic 4-Step Narrative)
      ========================================================================= */}
      <section id="how-it-works" className="border-t border-slate-200/90 dark:border-[#2b323c] bg-[#f8fafc] dark:bg-[#0d1117] py-14 sm:py-20 scroll-mt-14">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              How CipherLink works
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Connect in four straightforward steps.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#8b949e]">
              No account creation or address books. Just pick a channel code and meet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl p-5 shadow-xs space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Choose a code
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Pick any 3–6 digit number (such as 234 or 89104) or generate a random PIN.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl p-5 shadow-xs space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Share the code
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Send the channel code or invite link to the person you want to message privately.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl p-5 shadow-xs space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Join channel
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Both devices connect to the relay. When both are present, key derivation locks the session.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl p-5 shadow-xs space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Message &amp; share files
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Exchange text, photos, videos, and PDFs. Delete messages or let auto-delete clear them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ZERO-KNOWLEDGE DIAGRAM
      ========================================================================= */}
      <section className="border-t border-slate-200/90 dark:border-[#2b323c] bg-white dark:bg-[#161b22] py-14 sm:py-20">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Zero-Knowledge Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              The relay server never reads your messages.
            </h3>
            <p className="text-sm text-slate-600 dark:text-[#8b949e]">
              Plaintext is encrypted on Alice's device with AES-GCM-256 before leaving. Only Bob possesses the key to decrypt.
            </p>
          </div>

          {/* Diagram Container */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#fafbfc] dark:bg-[#0d1117] border border-slate-200/90 dark:border-[#2b323c]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 max-w-2xl mx-auto">
              {/* Alice Device */}
              <div className="flex flex-col items-center space-y-2 w-36">
                <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-[#1f242c] border border-slate-200 dark:border-[#2b323c] flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Laptop className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-white">Alice</div>
                <div className="text-[11px] text-slate-500 dark:text-[#8b949e]">Alice's browser</div>
              </div>

              {/* Connecting Line Left */}
              <div className="flex-1 flex flex-col items-center justify-center w-full sm:w-auto">
                <div className="w-full hidden sm:flex items-center">
                  <div className="h-px bg-slate-300 dark:bg-[#2b323c] flex-1" />
                  <span className="text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 mx-1">
                    #234
                  </span>
                  <div className="h-px bg-slate-300 dark:bg-[#2b323c] flex-1" />
                </div>
                <div className="sm:hidden text-[10px] font-mono text-slate-400 py-1">
                  ↓ joins #234
                </div>
              </div>

              {/* Shared Channel Relay */}
              <div className="flex flex-col items-center space-y-2 px-5 py-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 min-w-[170px]">
                <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="font-mono font-bold text-xs text-emerald-900 dark:text-emerald-300">
                  Channel 234
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                  Zero-Knowledge Relay
                </div>
              </div>

              {/* Connecting Line Right */}
              <div className="flex-1 flex flex-col items-center justify-center w-full sm:w-auto">
                <div className="w-full hidden sm:flex items-center">
                  <div className="h-px bg-slate-300 dark:bg-[#2b323c] flex-1" />
                  <span className="text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 mx-1">
                    #234
                  </span>
                  <div className="h-px bg-slate-300 dark:bg-[#2b323c] flex-1" />
                </div>
                <div className="sm:hidden text-[10px] font-mono text-slate-400 py-1">
                  ↓ joins #234
                </div>
              </div>

              {/* Bob Device */}
              <div className="flex flex-col items-center space-y-2 w-36">
                <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-[#1f242c] border border-slate-200 dark:border-[#2b323c] flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Smartphone className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-white">Bob</div>
                <div className="text-[11px] text-slate-500 dark:text-[#8b949e]">Bob's browser</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHAT MAKES CIPHERLINK DIFFERENT (4 Core Features)
      ========================================================================= */}
      <section className="border-t border-slate-200/90 dark:border-[#2b323c] bg-[#f8fafc] dark:bg-[#0d1117] py-14 sm:py-18">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for purpose, not for data collection.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#8b949e]">
              A lightweight architecture that respects your privacy from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
            <div className="space-y-2">
              <div className="text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                01 · Zero Persistence
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Temporary channels
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Meet in a shared channel without needing a contact list. Once participants leave, the room disappears from server memory.
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-200 dark:md:border-[#2b323c] md:pl-6">
              <div className="text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                02 · Local Cryptography
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Web Crypto AES-256
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Keys are derived inside your browser with PBKDF2 (120,000 rounds of SHA-256). The relay server transports only opaque ciphertext.
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-200 dark:md:border-[#2b323c] md:pl-6">
              <div className="text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                03 · Media Attachments
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Encrypted photos &amp; files
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Securely send photos, videos, PDFs, and documents. Attachments are encrypted end-to-end on your device before transfer.
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-200 dark:md:border-[#2b323c] md:pl-6">
              <div className="text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                04 · Message Control
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Auto-delete &amp; delete
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8b949e] leading-relaxed">
                Delete your messages anytime or configure ephemeral auto-delete timers (30s / 5m) to clear your active conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. READY TO CHAT ACTION
      ========================================================================= */}
      <section className="border-t border-slate-200/90 dark:border-[#2b323c] bg-white dark:bg-[#161b22] py-14 sm:py-18">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ready to start a conversation?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#8b949e] max-w-md mx-auto leading-relaxed">
            Choose a channel code, share it with someone, and meet them there.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChat()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <span>Open CipherLink Messages</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenAbout}
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-slate-700 dark:text-[#c9d1d9] hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-[#1f242c] hover:bg-slate-100 dark:hover:bg-[#28303b] border border-slate-200 dark:border-[#2b323c] rounded-md transition-colors cursor-pointer w-full sm:w-auto"
            >
              Read About &amp; FAQ
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CLEAN PRODUCT FOOTER (With BrandLogo & All Rights Reserved)
      ========================================================================= */}
      <footer className="border-t border-slate-200/90 dark:border-[#2b323c] bg-white dark:bg-[#161b22] py-8 text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-medium text-slate-700 dark:text-slate-300">
            <BrandLogo size="xs" />
            <span>CipherLink</span>
            <span>·</span>
            <span className="font-normal text-slate-500 dark:text-[#8b949e]">
              © 2026 CipherLink. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={onOpenAbout}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              About &amp; FAQ
            </button>
            <a
              href="https://github.com/Devputta/CipherLink-.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <button
              type="button"
              onClick={() => onOpenChat()}
              className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Open Messenger →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
