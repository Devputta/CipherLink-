/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ChannelSetup } from './components/ChannelSetup';
import { MessageBubble } from './components/MessageBubble';
import { MessageComposer } from './components/MessageComposer';
import { BrandLogo } from './components/BrandLogo';
import {
  deriveChannelKey,
  encryptMessage,
  decryptMessage,
  EncryptedPayload,
} from './crypto/cipher';
import {
  ChatMessage,
  ChannelInfo,
  ConnectionStatus,
  MediaAttachment,
} from './types/chat';
import { sounds } from './utils/sound';
import { Lock, AlertCircle, Shield } from 'lucide-react';

interface WireEnvelope {
  text: string;
  media?: MediaAttachment;
}

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [myUserName, setMyUserName] = useState<string>('You');

  const channelInfoRef = useRef<ChannelInfo | null>(null);
  channelInfoRef.current = channelInfo;

  const myUserNameRef = useRef<string>('You');
  myUserNameRef.current = myUserName;

  // Client Routing: 'home' | 'chat' | 'about'
  const [currentRoute, setCurrentRoute] = useState<'home' | 'chat' | 'about'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('channel')) {
        return 'chat';
      }
      if (window.location.pathname === '/chat') {
        return 'chat';
      }
      if (window.location.pathname === '/about') {
        return 'about';
      }
    }
    return 'home';
  });

  const navigateTo = (route: 'home' | 'chat' | 'about') => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const newPath = route === 'home' ? '/' : route === 'chat' ? '/chat' : '/about';
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/chat') {
        setCurrentRoute('chat');
      } else if (path === '/about') {
        setCurrentRoute('about');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dark mode state with persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cipherlink_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cipherlink_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cipherlink_theme', 'light');
    }
  }, [isDark]);

  // Active Cryptographic Key
  const activeCryptoKey = useRef<CryptoKey | null>(null);

  // Messages & Presence
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [peerIsTyping, setPeerIsTyping] = useState(false);

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, peerIsTyping]);

  // Ephemeral message cleanup timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setMessages((prev) => {
        const remaining = prev.filter((msg) => !msg.expiresAt || msg.expiresAt > now);
        return remaining.length === prev.length ? prev : remaining;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      sounds.setEnabled(!prev);
      return !prev;
    });
  };

  // Safe WebSocket sender
  const sendWs = useCallback((payload: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  // WebSocket setup
  useEffect(() => {
    let active = true;

    const connectSocket = () => {
      if (!active) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        setConnectionStatus('connected');
        setErrorMessage(null);

        // Keep-alive heartbeat
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 20000);

        // Auto-rejoin if reconnected while in an active channel
        if (channelInfoRef.current?.code) {
          ws.send(
            JSON.stringify({
              type: 'join',
              code: channelInfoRef.current.code,
              name: myUserNameRef.current,
            })
          );
        }
      };

      ws.onclose = () => {
        if (!active) return;
        setConnectionStatus('disconnected');
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        setTimeout(connectSocket, 2500);
      };

      ws.onerror = () => {
        if (!active) return;
        setConnectionStatus('error');
      };

      ws.onmessage = async (event) => {
        if (!active) return;
        let data: any;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (data.type === 'error') {
          setErrorMessage(data.message);
          setIsJoining(false);
          sounds.playError();
          return;
        }

        if (data.type === 'joined') {
          setIsJoining(false);
          setErrorMessage(null);
          return;
        }

        if (data.type === 'peer-joined') {
          setChannelInfo((prev) =>
            prev
              ? {
                  ...prev,
                  participants: 2,
                  peerPresent: true,
                  peerName: data.peerName || 'Peer',
                }
              : null
          );
          sounds.playPeerConnected();
          return;
        }

        if (data.type === 'peer-present') {
          setChannelInfo((prev) =>
            prev
              ? {
                  ...prev,
                  participants: 2,
                  peerPresent: true,
                  peerName: data.peerName || 'Peer',
                }
              : null
          );
          return;
        }

        if (data.type === 'peer-left') {
          setChannelInfo((prev) =>
            prev
              ? {
                  ...prev,
                  participants: 1,
                  peerPresent: false,
                }
              : null
          );
          setPeerIsTyping(false);
          return;
        }

        if (data.type === 'peer-typing') {
          setPeerIsTyping(Boolean(data.isTyping));
          return;
        }

        // Real-time peer message deletion
        if (data.type === 'message-deleted') {
          setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
          return;
        }

        // Inbound ciphertext
        if (data.type === 'ciphertext') {
          const payload: EncryptedPayload = data.payload;
          if (!activeCryptoKey.current) return;

          try {
            const rawDecrypted = await decryptMessage(payload, activeCryptoKey.current);
            let plaintext = rawDecrypted;
            let media: MediaAttachment | undefined = undefined;

            // Try parsing JSON payload if media was attached
            try {
              const parsed = JSON.parse(rawDecrypted);
              if (parsed && typeof parsed === 'object' && ('text' in parsed || 'media' in parsed)) {
                plaintext = parsed.text || '';
                media = parsed.media;
              }
            } catch {
              // Backward compatibility with standard text strings
              plaintext = rawDecrypted;
            }

            const newMsg: ChatMessage = {
              id: payload.messageId || Math.random().toString(),
              sender: 'peer',
              senderName: channelInfoRef.current?.peerName || 'Peer',
              plaintext,
              media,
              payload,
              timestamp: payload.timestamp || Date.now(),
              status: 'decrypted',
              ephemeralSeconds: payload.ephemeralSeconds,
              expiresAt: payload.ephemeralSeconds
                ? Date.now() + payload.ephemeralSeconds * 1000
                : undefined,
            };

            setMessages((prev) => [...prev, newMsg]);
            sounds.playReceived();
          } catch (decryptErr) {
            console.error('Decryption failed:', decryptErr);
          }
        }
      };
    };

    connectSocket();

    return () => {
      active = false;
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Join Channel
  const handleJoinChannel = async (code: string, _passphrase?: string, name?: string) => {
    setIsJoining(true);
    setErrorMessage(null);
    const chosenName = name && name.trim() ? name.trim() : 'You';
    setMyUserName(chosenName);

    try {
      const keyDetails = await deriveChannelKey(code);
      activeCryptoKey.current = keyDetails.key;

      setChannelInfo({
        code,
        participants: 1,
        peerPresent: false,
        safetyNumber: keyDetails.safetyNumber,
        fingerprintHex: keyDetails.fingerprintHex,
        joinedAt: Date.now(),
      });

      setMessages([]);

      sendWs({
        type: 'join',
        code,
        name: chosenName,
      });
    } catch (err: any) {
      console.error('Join error:', err);
      setErrorMessage(err.message || 'Couldn’t join channel. Check the code and try again.');
      setIsJoining(false);
    }
  };

  const handleLeaveChannel = () => {
    sendWs({ type: 'leave' });
    activeCryptoKey.current = null;
    setChannelInfo(null);
    setMessages([]);
    setPeerIsTyping(false);
  };

  // Send Message (Text + Media Attachments)
  const handleSendMessage = async (
    text: string,
    ephemeralSeconds?: number,
    media?: MediaAttachment
  ) => {
    if (!activeCryptoKey.current || !channelInfo) return;

    try {
      // Serialize payload if media exists or if text message
      const envelope: WireEnvelope = {
        text,
        media,
      };
      const serialized = JSON.stringify(envelope);

      const payload = await encryptMessage(serialized, activeCryptoKey.current, {
        ephemeralSeconds,
      });

      const selfMessage: ChatMessage = {
        id: payload.messageId,
        sender: 'self',
        plaintext: text,
        media,
        payload,
        timestamp: payload.timestamp,
        status: channelInfo.peerPresent ? 'delivered' : 'sent',
        ephemeralSeconds,
        expiresAt: ephemeralSeconds ? Date.now() + ephemeralSeconds * 1000 : undefined,
      };

      setMessages((prev) => [...prev, selfMessage]);
      sounds.playSent();

      sendWs({
        type: 'ciphertext',
        payload,
      });
    } catch (err) {
      console.error('Encryption or send error:', err);
      setErrorMessage('Failed to encrypt and send message.');
    }
  };

  // Delete message handler (for user's own message, synced across channel)
  const handleDeleteMessage = (messageId: string) => {
    // 1. Remove locally
    setMessages((prev) => prev.filter((m) => m.id !== messageId));

    // 2. Broadcast delete event to channel peer
    sendWs({
      type: 'delete-message',
      messageId,
    });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!channelInfo) return;
    sendWs({
      type: 'typing',
      isTyping,
    });
  };

  const handleOpenChat = (code?: string) => {
    if (code) {
      handleJoinChannel(code);
    }
    navigateTo('chat');
  };

  const handleScrollToHowItWorks = () => {
    if (currentRoute === 'home') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // URL query channel (?channel=234)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const channelParam = params.get('channel');
    if (channelParam && /^\d{3,6}$/.test(channelParam)) {
      handleJoinChannel(channelParam);
      setCurrentRoute('chat');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0d1117] flex flex-col font-sans text-slate-900 dark:text-[#f0f6fc] transition-colors selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Product Toolbar Header */}
      <Header
        status={connectionStatus}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        onNavigateHome={() => navigateTo('home')}
        onNavigateAbout={() => navigateTo('about')}
        onNavigateMessages={() => navigateTo('chat')}
        onScrollToHowItWorks={handleScrollToHowItWorks}
        activeRoute={currentRoute}
      />

      {/* Main Workspace Router */}
      <main className="flex-1 flex flex-col min-h-0">
        {currentRoute === 'home' && (
          <HomePage
            onOpenChat={handleOpenChat}
            onOpenAbout={() => navigateTo('about')}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onStartMessaging={() => navigateTo('chat')}
            onBackHome={() => navigateTo('home')}
          />
        )}

        {/* Message Workspace: Fits screen seamlessly on Mobile and Desktop */}
        {currentRoute === 'chat' && (
          <div className="h-[calc(100dvh-3.5rem)] max-w-[960px] w-full mx-auto p-2 sm:p-3 flex flex-col overflow-hidden">
            {/* Error banner if something fails */}
            {errorMessage && (
              <div className="mb-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 shadow-2xs shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Channel Setup Panel */}
            <div className="mb-2 shrink-0">
              <ChannelSetup
                channelInfo={channelInfo}
                onJoin={handleJoinChannel}
                onLeave={handleLeaveChannel}
                isLoading={isJoining}
                myUserName={myUserName}
              />
            </div>

            {/* Messages Container: Flex-1, scrollable, pinned composer */}
            <section className="bg-white dark:bg-[#161b22] border border-slate-200/90 dark:border-[#2b323c] rounded-xl flex-1 flex flex-col min-h-0 shadow-xs overflow-hidden transition-colors">
              {/* Section Header */}
              <div className="px-3.5 py-1.5 sm:py-2 border-b border-slate-200/90 dark:border-[#2b323c] bg-slate-50/70 dark:bg-[#1f242c]/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <BrandLogo size="xs" withBorder={false} />
                  <h2 className="text-xs font-semibold text-slate-800 dark:text-[#f0f6fc]">
                    CipherLink Encrypted Session
                  </h2>
                </div>

                {channelInfo ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        channelInfo.peerPresent ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    <span className="text-slate-500 dark:text-[#8b949e]">
                      {channelInfo.peerPresent ? 'online' : 'waiting for partner'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-[#6e7681]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>offline</span>
                  </div>
                )}
              </div>

              {/* Messages Timeline */}
              <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto space-y-1 bg-[#fafbfc] dark:bg-[#0d1117]/30">
                {!channelInfo ? (
                  /* Before joining */
                  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-[#8b949e]">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1f242c] border border-slate-200/90 dark:border-[#2b323c] flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-2xs">
                      <Lock className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-[#f0f6fc]">
                      No channel connected
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1 max-w-xs leading-relaxed">
                      Enter a 3–6 digit channel code above or choose a random number to begin your private conversation.
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  /* After joining: 0 messages */
                  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-[#8b949e]">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/90 dark:border-emerald-800/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400 mb-3 shadow-2xs">
                      <Lock className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-[#f0f6fc]">
                      Channel #{channelInfo.code} is ready.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1 max-w-xs leading-relaxed">
                      {channelInfo.peerPresent
                        ? 'Your partner is here. Say hello or send photos, videos, and files!'
                        : 'Share channel #' + channelInfo.code + ' with your partner. Messages and files are encrypted directly in your browser.'}
                    </p>
                  </div>
                ) : (
                  /* Messages stream */
                  <>
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        onDeleteMessage={handleDeleteMessage}
                      />
                    ))}

                    {/* Peer typing indicator */}
                    {peerIsTyping && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8b949e] py-1 px-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
                        <span className="text-[11px]">Peer is typing…</span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Composer (Fixed at bottom) */}
              <MessageComposer
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={!channelInfo}
                peerPresent={Boolean(channelInfo?.peerPresent)}
              />
            </section>

            {/* Quiet Footer with All rights reserved */}
            <div className="text-center py-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-[#6e7681] shrink-0">
              © 2026 CipherLink. All rights reserved. · Client-side AES-256-GCM encryption
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
