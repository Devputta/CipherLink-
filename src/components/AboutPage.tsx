import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, ShieldCheck, Lock, Users, Sparkles, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AboutPageProps {
  onStartMessaging: () => void;
  onBackHome?: () => void;
}

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: 'Do I or my friend need to create an account?',
    a: 'No. There are no logins, no email addresses, no phone numbers, and no passwords. You just open CipherLink, pick a code, and enter the channel.',
  },
  {
    q: 'Can I send photos, videos, and PDFs?',
    a: 'Yes. CipherLink supports attaching images, videos, and PDF documents. All files are encrypted with AES-256-GCM directly inside your browser before transmission over the relay.',
  },
  {
    q: 'Can I delete my messages?',
    a: 'Yes. You can delete any message you have sent. When deleted, it is removed instantly from both your screen and your partner’s screen in real time.',
  },
  {
    q: 'How does my partner connect to me?',
    a: 'Send them the channel code (for instance, 234) or copy the shareable link from the chat screen. When they open that code on their device, you will both be in the same private session.',
  },
  {
    q: 'How does the encryption work?',
    a: 'Your messages are encrypted directly inside your browser before they touch the network. Using the Web Cryptography API with AES-256-GCM and PBKDF2 key derivation, only someone with the matching channel code can decrypt the messages. The relay server only passes encrypted envelopes and never sees your plaintext.',
  },
  {
    q: 'What happens when someone leaves the channel?',
    a: 'When you leave or close your tab, your browser memory is cleared. When both participants disconnect, the temporary room on the server ceases to exist. There is no chat history stored on the server.',
  },
  {
    q: 'What does the auto-delete option do?',
    a: 'If you enable auto-delete (30 seconds or 5 minutes), messages automatically count down and disappear from both screens once the timer expires.',
  },
  {
    q: 'Can a third person join our room?',
    a: 'No. Each channel strictly caps participation at two people. If a third person attempts to enter an occupied channel code, they are rejected.',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onStartMessaging, onBackHome }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-[760px] mx-auto px-4 py-6 sm:py-9 space-y-7 text-slate-800 dark:text-[#f0f6fc]">
      {/* Top back button if callback provided */}
      {onBackHome && (
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      )}

      {/* Intro Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Temporary, Accountless Messaging</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          A quiet way for two people to chat privately.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-[#8b949e] leading-relaxed">
          CipherLink was built to solve a simple problem: sometimes you need to send a private message or share a document with someone without signing up for an app, exchanging phone numbers, or creating a permanent profile.
        </p>

        {/* Primary Call to Action */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onStartMessaging}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Messenger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-[#2b323c]" />

      {/* How It Works - 3 Step Practical Walkthrough */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
          How it works in practice
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-lg shadow-2xs space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              01 · Pick a Code
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Choose any 3–6 digits
            </div>
            <p className="text-xs text-slate-600 dark:text-[#8b949e] leading-relaxed">
              Use a quick number like <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">234</span> or pick a random code.
            </p>
          </div>

          <div className="p-3.5 bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-lg shadow-2xs space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              02 · Share with Partner
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Share the channel PIN
            </div>
            <p className="text-xs text-slate-600 dark:text-[#8b949e] leading-relaxed">
              Send the code or link to your partner over Signal, email, or in person.
            </p>
          </div>

          <div className="p-3.5 bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-lg shadow-2xs space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              03 · Talk &amp; Share
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Encrypted channel
            </div>
            <p className="text-xs text-slate-600 dark:text-[#8b949e] leading-relaxed">
              Send encrypted text, photos, and files. Delete whenever you want.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Privacy Philosophy */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
          The Privacy Concept
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-3.5 bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-lg shadow-2xs space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>What CipherLink guarantees</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-[#8b949e]">
              <li>Client-side AES-256-GCM encryption with Web Crypto API.</li>
              <li>Relay server never has access to the cryptographic key.</li>
              <li>No user accounts, profiles, emails, or phone numbers.</li>
              <li>Two-person limit prevents third-party eavesdroppers from entering an active room.</li>
              <li>Auto-delete and instant message deletion for participants.</li>
            </ul>
          </div>

          <div className="p-3.5 bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-lg shadow-2xs space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Things to remember</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-[#8b949e]">
              <li>Short 3-digit PINs can be guessed; only share your code privately.</li>
              <li>If you refresh or leave, previous session history is discarded.</li>
              <li>Auto-delete clears active views, but cannot prevent physical screenshots.</li>
              <li>Use longer codes (5–6 digits) for higher rendezvous privacy.</li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-slate-200 dark:border-[#2b323c]" />

      {/* Frequently Asked Questions */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200 dark:divide-[#2b323c] border-y border-slate-200 dark:border-[#2b323c]">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-slate-900 dark:text-white hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 dark:text-[#8b949e] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-[#8b949e] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 dark:text-[#8b949e] mt-2 leading-relaxed pr-4">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Navigation & Call to Action */}
      <div className="pt-2 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-[#8b949e]">
          Ready to try it out?
        </p>

        <button
          type="button"
          onClick={onStartMessaging}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <span>Open CipherLink Messages</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer with All Rights Reserved */}
      <div className="pt-4 border-t border-slate-200/90 dark:border-[#2b323c] text-center text-xs text-slate-500 dark:text-[#8b949e]">
        © 2026 CipherLink. All rights reserved. · Zero logs. Zero trackers.
      </div>
    </div>
  );
};
