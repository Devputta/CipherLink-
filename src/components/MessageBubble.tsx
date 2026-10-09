import React, { useState, useEffect } from 'react';
import {
  Clock,
  Copy,
  Check,
  Trash2,
  FileText,
  Download,
  ExternalLink,
  Film,
  Image as ImageIcon,
  X,
  Eye,
} from 'lucide-react';
import { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  onDeleteMessage?: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onDeleteMessage,
}) => {
  const isSelf = message.sender === 'self';
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    if (!message.expiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((message.expiresAt! - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [message.expiresAt]);

  const handleCopy = () => {
    const textToCopy = message.plaintext || message.media?.name || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMedia = () => {
    if (!message.media?.dataUrl) return;
    const a = document.createElement('a');
    a.href = message.media.dataUrl;
    a.download = message.media.name || 'cipherlink-attachment';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenPdf = () => {
    if (!message.media?.dataUrl) return;
    setPdfModalOpen(true);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const media = message.media;
  const isImage = media?.type.startsWith('image/');
  const isVideo = media?.type.startsWith('video/');
  const isPdf =
    media?.type === 'application/pdf' ||
    (media?.name && media.name.toLowerCase().endsWith('.pdf'));

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} group mb-3 w-full`}>
      {/* Sender and timestamp header */}
      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500 dark:text-[#8b949e]">
        <span className="font-semibold text-slate-700 dark:text-[#f0f6fc]">
          {isSelf ? 'You' : message.senderName || 'Peer'}
        </span>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <span className="text-[11px] text-slate-400 dark:text-[#6e7681] tabular-nums font-mono">
          {formattedTime}
        </span>
      </div>

      {/* Bubble Container */}
      <div
        className={`relative rounded-xl text-sm leading-relaxed max-w-[92%] sm:max-w-[78%] break-words shadow-2xs transition-colors ${
          isSelf
            ? 'bg-slate-900 dark:bg-[#1e2a38] text-white dark:border dark:border-[#2c3d52]'
            : 'bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] text-slate-900 dark:text-[#f0f6fc]'
        } ${media ? 'p-2 sm:p-2.5' : 'px-3.5 py-2.5'}`}
      >
        {/* Media: Image Attachment */}
        {media && isImage && (
          <div className="space-y-1.5 mb-1.5">
            <div className="relative group/img rounded-lg overflow-hidden bg-slate-950/20 max-h-72 flex items-center justify-center">
              <img
                src={media.dataUrl}
                alt={media.name}
                onClick={() => setLightboxOpen(true)}
                className="max-h-72 w-auto max-w-full rounded-lg object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs p-1 rounded-md text-white">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="p-1 hover:text-emerald-400"
                  title="Expand image"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMedia}
                  className="p-1 hover:text-emerald-400"
                  title="Download image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 px-1">
              <span className="truncate max-w-[180px] sm:max-w-[240px] font-mono">{media.name}</span>
              <span className="font-mono">{formatBytes(media.size)}</span>
            </div>
          </div>
        )}

        {/* Media: Video Attachment */}
        {media && isVideo && (
          <div className="space-y-1.5 mb-1.5">
            <div className="rounded-lg overflow-hidden bg-black max-h-72">
              <video
                src={media.dataUrl}
                controls
                playsInline
                className="max-h-72 w-full rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 px-1">
              <span className="truncate max-w-[180px] sm:max-w-[240px] font-mono flex items-center gap-1">
                <Film className="w-3 h-3 shrink-0" />
                {media.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{formatBytes(media.size)}</span>
                <button
                  type="button"
                  onClick={handleDownloadMedia}
                  className="hover:text-emerald-400 p-0.5"
                  title="Download video"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media: PDF Attachment */}
        {media && isPdf && (
          <div
            className={`p-2.5 rounded-lg border mb-1.5 flex items-center justify-between gap-3 ${
              isSelf
                ? 'bg-slate-800/80 border-slate-700 text-white'
                : 'bg-slate-50 dark:bg-[#1f242c] border-slate-200 dark:border-[#2b323c] text-slate-900 dark:text-[#f0f6fc]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate font-mono">{media.name}</div>
                <div className="text-[10px] text-slate-400 dark:text-[#8b949e]">
                  PDF Document · {formatBytes(media.size)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleOpenPdf}
                className="p-1.5 rounded hover:bg-slate-700/50 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Preview PDF"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDownloadMedia}
                className="p-1.5 rounded hover:bg-slate-700/50 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Media: Other Document / File */}
        {media && !isImage && !isVideo && !isPdf && (
          <div
            className={`p-2.5 rounded-lg border mb-1.5 flex items-center justify-between gap-3 ${
              isSelf
                ? 'bg-slate-800/80 border-slate-700 text-white'
                : 'bg-slate-50 dark:bg-[#1f242c] border-slate-200 dark:border-[#2b323c] text-slate-900 dark:text-[#f0f6fc]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate font-mono">{media.name}</div>
                <div className="text-[10px] text-slate-400 dark:text-[#8b949e]">
                  File · {formatBytes(media.size)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadMedia}
              className="p-1.5 rounded hover:bg-slate-700/50 dark:hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Text Plaintext (if any) */}
        {message.plaintext && (
          <p className="whitespace-pre-wrap px-0.5">{message.plaintext}</p>
        )}

        {/* Action / countdown / delete row */}
        <div
          className={`flex items-center justify-between gap-2 mt-1.5 pt-1 text-[10px] ${
            isSelf
              ? 'text-slate-300 dark:text-slate-400 border-t border-slate-800 dark:border-[#2c3d52]'
              : 'text-slate-400 dark:text-[#8b949e] border-t border-slate-100 dark:border-[#2b323c]'
          }`}
        >
          {/* Left: Auto-delete countdown */}
          <div>
            {secondsRemaining !== null && (
              <span className="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400 font-mono font-medium">
                <Clock className="w-2.5 h-2.5" />
                <span>{secondsRemaining}s</span>
              </span>
            )}
          </div>

          {/* Right: Copy & Delete controls */}
          <div className="flex items-center gap-1.5">
            {/* Copy button */}
            {message.plaintext && (
              <button
                type="button"
                onClick={handleCopy}
                className={`p-1 rounded cursor-pointer transition-opacity ${
                  isSelf ? 'hover:text-white' : 'hover:text-slate-700 dark:hover:text-[#f0f6fc]'
                }`}
                title="Copy message text"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400 dark:text-emerald-300" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Delete button (available for self messages) */}
            {onDeleteMessage && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className={`p-1 rounded cursor-pointer transition-colors text-slate-400 hover:text-rose-400 dark:hover:text-rose-400 ${
                  isSelf ? 'hover:bg-rose-950/40' : 'hover:bg-rose-50 dark:hover:bg-rose-950/30'
                }`}
                title="Delete message"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            {isSelf && (
              <span className="text-[10px] text-slate-400 dark:text-[#8b949e] font-medium ml-0.5">
                {message.status === 'delivered'
                  ? 'Delivered'
                  : message.status === 'sent'
                  ? 'Sent'
                  : 'Sending…'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200 animate-in fade-in duration-100 shadow-2xs">
          <span>Delete this message for everyone?</span>
          <button
            type="button"
            onClick={() => {
              if (onDeleteMessage) onDeleteMessage(message.id);
              setShowConfirmDelete(false);
            }}
            className="px-2 py-0.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-semibold cursor-pointer"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmDelete(false)}
            className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxOpen && media && isImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white pb-2 px-1 text-xs">
              <span className="font-mono truncate max-w-xs">{media.name}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadMedia}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="p-1 hover:text-rose-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <img
              src={media.dataUrl}
              alt={media.name}
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* PDF Document Preview Modal */}
      {pdfModalOpen && media && isPdf && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-3 sm:p-6 backdrop-blur-xs"
          onClick={() => setPdfModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-mono truncate">{media.name}</span>
                <span className="text-slate-400 text-[11px]">({formatBytes(media.size)})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadMedia}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-slate-950">
              <iframe
                src={media.dataUrl}
                title={media.name}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
