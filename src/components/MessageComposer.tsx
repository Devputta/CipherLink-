import React, { useState, useRef } from 'react';
import {
  ArrowUp,
  Paperclip,
  X,
  FileText,
  Film,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { MediaAttachment } from '../types/chat';

interface MessageComposerProps {
  onSendMessage: (
    text: string,
    ephemeralSeconds?: number,
    media?: MediaAttachment
  ) => Promise<void>;
  onTyping: (isTyping: boolean) => void;
  disabled: boolean;
  peerPresent: boolean;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  onTyping,
  disabled,
}) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [autoDeleteSeconds, setAutoDeleteSeconds] = useState<number | undefined>(undefined);
  const [attachment, setAttachment] = useState<MediaAttachment | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1500);
  };

  const handleFileSelected = (file: File) => {
    setFileError(null);
    // 25MB file limit for in-memory WebCrypto encryption
    if (file.size > 25 * 1024 * 1024) {
      setFileError('Attachment exceeds 25 MB limit for browser encryption.');
      setTimeout(() => setFileError(null), 5000);
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachment({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl: reader.result,
        });
      }
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      console.error('File read error');
      setFileError('Failed to read file from disk.');
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
    // reset input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Clipboard paste support for images
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleFileSelected(file);
          break;
        }
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = text.trim();
    if ((!cleanText && !attachment) || isSending || disabled) return;

    setIsSending(true);
    onTyping(false);
    try {
      await onSendMessage(cleanText, autoDeleteSeconds, attachment || undefined);
      setText('');
      setAttachment(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setIsSending(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = !disabled && !isSending && (text.trim().length > 0 || attachment !== null);

  return (
    <div className="border-t border-slate-200/90 dark:border-[#2b323c] bg-white dark:bg-[#161b22] p-2.5 sm:p-3 transition-colors shrink-0">
      {fileError && (
        <div className="mb-2 p-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between animate-in fade-in">
          <span>{fileError}</span>
          <button
            type="button"
            onClick={() => setFileError(null)}
            className="p-0.5 hover:text-rose-900 dark:hover:text-rose-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="border border-slate-200/90 dark:border-[#2b323c] rounded-xl bg-white dark:bg-[#0d1117] focus-within:border-emerald-700 dark:focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-700/20 transition-colors shadow-2xs overflow-hidden">
          {/* Attachment Preview Chip */}
          {attachment && (
            <div className="mx-2.5 mt-2 p-2 bg-slate-50 dark:bg-[#1a212c] rounded-lg border border-slate-200/80 dark:border-[#2b323c] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.dataUrl}
                    alt={attachment.name}
                    className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                ) : attachment.type.startsWith('video/') ? (
                  <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-[#f0f6fc] truncate font-mono text-[11px]">
                    {attachment.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-[#8b949e]">
                    {formatBytes(attachment.size)} · End-to-end encrypted
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition-colors"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Reading file indicator */}
          {isReadingFile && (
            <div className="mx-2.5 mt-2 p-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Preparing encrypted attachment…</span>
            </div>
          )}

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder={
              disabled
                ? 'Join a channel above to write a message.'
                : attachment
                ? 'Add an encrypted caption or press Enter to send...'
                : 'Write a message... (Press Enter to send)'
            }
            className="w-full px-3.5 pt-2.5 pb-1.5 text-xs sm:text-sm text-slate-900 dark:text-[#f0f6fc] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none bg-transparent"
          />

          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between px-2.5 sm:px-3 pb-2 pt-1.5 border-t border-slate-100 dark:border-[#2b323c] gap-2">
            {/* Left: Attachment button and auto-delete settings */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Media File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,application/pdf,.pdf,.doc,.docx,.txt,.zip"
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f242c] rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Attach photo, video, PDF or document"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-[11px] font-medium">Attach media</span>
              </button>

              <div className="w-px h-3 bg-slate-200 dark:bg-[#2b323c] hidden xs:block" />

              {/* Auto-delete setting */}
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#8b949e]">
                <span className="text-[10px] sm:text-[11px] font-medium">Timer:</span>
                <div className="inline-flex items-center gap-0.5 sm:gap-1">
                  {[
                    { label: 'Off', val: undefined },
                    { label: '30s', val: 30 },
                    { label: '5m', val: 300 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setAutoDeleteSeconds(opt.val)}
                      className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] rounded transition-colors cursor-pointer ${
                        autoDeleteSeconds === opt.val
                          ? 'bg-slate-200 dark:bg-[#2b323c] text-slate-900 dark:text-[#f0f6fc] font-semibold'
                          : 'text-slate-500 dark:text-[#8b949e] hover:text-slate-800 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#1f242c]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Send button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Encrypting…</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
