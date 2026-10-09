import React, { useState } from 'react';
import {
  Copy,
  Check,
  LogOut,
  AlertTriangle,
  Sparkles,
  Hash,
  User,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { ChannelInfo } from '../types/chat';

interface ChannelSetupProps {
  channelInfo: ChannelInfo | null;
  onJoin: (code: string, passphrase?: string, name?: string) => Promise<void>;
  onLeave: () => void;
  isLoading: boolean;
  defaultName?: string;
  myUserName?: string;
}

export const ChannelSetup: React.FC<ChannelSetupProps> = ({
  channelInfo,
  onJoin,
  onLeave,
  isLoading,
  defaultName = 'You',
  myUserName,
}) => {
  const [code, setCode] = useState('234');
  const [name, setName] = useState(myUserName || defaultName);
  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateRandomCode = () => {
    const random = Math.floor(100 + Math.random() * 900).toString();
    setCode(random);
    setValidationError(null);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.replace(/\D/g, '').slice(0, 6);
    if (clean.length < 3) {
      setValidationError('Channel codes must be 3–6 digits.');
      return;
    }
    setValidationError(null);
    onJoin(clean, undefined, name.trim() || 'You');
  };

  const handleCopy = () => {
    if (!channelInfo) return;
    const url = new URL(window.location.href);
    url.searchParams.set('channel', channelInfo.code);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmLeave = () => {
    setShowLeaveConfirm(false);
    onLeave();
  };

  // State: Connected to an active channel -> WhatsApp-style conversation bar
  if (channelInfo) {
    const isOnline = Boolean(channelInfo.peerPresent);
    const peerDisplayName = channelInfo.peerName || 'Partner';

    return (
      <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl px-3 sm:px-4 py-2 shadow-xs transition-colors shrink-0">
        <div className="flex items-center justify-between gap-2.5">
          {/* WhatsApp-style avatar + name + online/offline status */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* WhatsApp-style compact Avatar with status indicator badge */}
            <div className="relative shrink-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm text-white shadow-2xs ${
                  isOnline
                    ? 'bg-emerald-600 dark:bg-emerald-600'
                    : 'bg-slate-400 dark:bg-slate-600'
                }`}
              >
                {peerDisplayName.charAt(0).toUpperCase()}
              </div>
              {/* Online / Offline status badge */}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#161b22] ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
                title={isOnline ? 'Online' : 'Offline'}
              />
            </div>

            {/* Conversation Name & Online Status */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#f0f6fc] truncate leading-tight">
                  {peerDisplayName}
                </span>
                {/* Clickable channel code symbol badge */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-colors cursor-pointer shrink-0"
                  title="Click to copy channel link"
                >
                  <Hash className="w-2.5 h-2.5" />
                  <span>{channelInfo.code}</span>
                  {copied ? (
                    <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 ml-0.5" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Status line: WhatsApp-like "online" or "offline" */}
              <div className="flex items-center gap-1 text-[11px] leading-tight mt-0.5">
                {isOnline ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    online
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-[#8b949e]">
                    offline · waiting to connect
                  </span>
                )}
                <span className="text-slate-300 dark:text-[#30363d]">·</span>
                <span className="text-[10px] text-slate-400 dark:text-[#8b949e] font-mono hidden xs:inline">
                  You: {myUserName || 'You'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls: Share & Leave */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-50 dark:bg-[#1f242c] hover:bg-slate-100 dark:hover:bg-[#28303b] text-slate-700 dark:text-[#f0f6fc] border border-slate-200 dark:border-[#2b323c] rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Copy channel invite link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500 dark:text-[#8b949e]" />
                  <span className="text-[11px] hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowLeaveConfirm(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-[#2b323c] rounded-md transition-colors cursor-pointer"
              title="Leave channel"
            >
              <LogOut className="w-3 h-3" />
              <span className="text-[11px] hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>

        {/* Leave Channel Confirmation */}
        {showLeaveConfirm && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#2b323c] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/60 dark:bg-[#1f242c]/70 p-2 rounded-lg border border-amber-200/80 dark:border-[#2b323c] text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-[#f0f6fc]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-[11px]">
                Leave channel #{channelInfo.code}? Messages in this session will clear.
              </span>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
                className="px-2 py-0.5 text-[11px] text-slate-600 dark:text-[#8b949e] bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#2b323c] rounded"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="px-2 py-0.5 text-[11px] font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded shadow-2xs"
              >
                Confirm leave
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // State: Pre-join -> Compact bar with small clickable channel code symbol and small name input
  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-xs transition-colors shrink-0">
      <form onSubmit={handleJoinSubmit} className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Small Channel Code & Small Name section (compact row) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            {/* Small Clickable Channel Code Input with # symbol */}
            <div className="relative shrink-0 w-28 sm:w-32">
              <button
                type="button"
                onClick={generateRandomCode}
                title="Click symbol to generate random code"
                className="absolute inset-y-0 left-0 pl-2 pr-1 flex items-center text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-colors"
              >
                <Hash className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <input
                id="channel-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setValidationError(null);
                }}
                placeholder="Code (234)"
                className="w-full pl-6 pr-1.5 py-1 bg-slate-50/80 dark:bg-[#0d1117] border border-slate-200 dark:border-[#2b323c] rounded-md text-slate-900 dark:text-[#f0f6fc] font-mono text-xs tracking-wider font-semibold focus:outline-none focus:bg-white dark:focus:bg-[#0d1117] focus:border-emerald-700 dark:focus:border-emerald-600 transition-colors shadow-2xs"
                title="Enter 3-6 digit channel code"
              />
            </div>

            {/* Clickable Quick Random Symbol button */}
            <button
              type="button"
              onClick={generateRandomCode}
              className="p-1 text-slate-500 hover:text-emerald-700 dark:text-[#8b949e] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded border border-slate-200 dark:border-[#2b323c] transition-colors cursor-pointer shrink-0"
              title="Generate random code"
              aria-label="Random code"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {/* Small Name Section like WhatsApp chat alias */}
            <div className="relative shrink-0 w-24 sm:w-32">
              <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-3 h-3" />
              </div>
              <input
                id="name-input"
                type="text"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-5 pr-1.5 py-1 text-xs bg-slate-50/80 dark:bg-[#0d1117] border border-slate-200 dark:border-[#2b323c] rounded-md text-slate-800 dark:text-[#f0f6fc] focus:outline-none focus:bg-white dark:focus:bg-[#0d1117] focus:border-emerald-700 dark:focus:border-emerald-600 font-medium"
                title="Your display name"
              />
            </div>

            {/* Status indicator: Offline / Not Connected */}
            <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#6e7681] truncate pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span className="truncate">offline</span>
            </div>
          </div>

          {/* Join Channel Button */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="submit"
              disabled={isLoading || code.length < 3}
              className="px-3 py-1 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              {isLoading ? 'Joining…' : 'Join'}
            </button>
          </div>
        </div>

        {validationError && (
          <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium mt-0.5">
            {validationError}
          </p>
        )}
      </form>
    </div>
  );
};

