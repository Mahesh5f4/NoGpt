import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { ChatComposer } from './components/ChatComposer';
import { SettingsModal } from './components/SettingsModal';
import { LanguageOnboardingModal } from './components/LanguageOnboardingModal';
import { NameOnboardingModal } from './components/NameOnboardingModal';
import { streamNoGptResponse } from './lib/gemini';
import { ChatMessage, ChatSession, ToneOption } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY_SESSIONS = 'nogpt_sessions_v3';
const STORAGE_KEY_LANG = 'nogpt_language_v3';
const STORAGE_KEY_NAME = 'nogpt_username_v3';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved sessions:', e);
    }
    return [];
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_LANG) || '';
  });

  const [showLanguageOnboarding, setShowLanguageOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_KEY_LANG);
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NAME) || '';
  });

  const [showNameOnboarding, setShowNameOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_KEY_NAME);
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [situation, setSituation] = useState<string>('');
  const [tone, setTone] = useState<ToneOption>('Friendly');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const responseBottomRef = useRef<HTMLDivElement>(null);

  // Save sessions & language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem(STORAGE_KEY_LANG, selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem(STORAGE_KEY_NAME, userName);
    }
  }, [userName]);

  // Keyboard shortcut Cmd/Ctrl+N for New Chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const activeMessages = activeSession?.messages || [];

  // Auto scroll to bottom when messages update
  useEffect(() => {
    responseBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isLoading]);

  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setActiveSessionId('');
    setSituation('');
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageOnboarding(false);
  };

  const handleTogglePinSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId('');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all saved conversations?')) {
      setSessions([]);
      setActiveSessionId('');
      setIsSettingsOpen(false);
    }
  };

  const handleExportData = (format: 'json' | 'txt') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nogpt_conversations_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      let txtContent = "NoGPT Conversations Export\n===========================\n\n";
      sessions.forEach((s, idx) => {
        txtContent += `[${idx + 1}] ${s.title}\n`;
        txtContent += `Date: ${new Date(s.createdAt).toLocaleString()}\n`;
        txtContent += `----------------------------------------\n`;
        s.messages.forEach((m) => {
          txtContent += `${m.role.toUpperCase()}: ${m.content}\n\n`;
        });
        txtContent += `\n\n`;
      });
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nogpt_export_${Date.now()}.txt`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setSessions(parsed);
            if (parsed.length > 0) setActiveSessionId(parsed[0].id);
            alert('Conversations imported successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  // Generate conversation response from Gemini
  const handleSend = async (overrideText?: string, overrideTone?: ToneOption) => {
    const promptText = (overrideText || situation).trim();
    const activeTone = overrideTone || tone;

    if (!promptText || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage(null);
    setSituation(''); // Clear composer input for clean UX

    let targetSessionId = activeSessionId;
    let existingMessages: ChatMessage[] = [];

    // Create session if not present
    if (!targetSessionId || !sessions.some((s) => s.id === targetSessionId)) {
      const newSessionId = `session_${Date.now()}`;
      const title = promptText.length > 30 ? `${promptText.slice(0, 30)}...` : promptText;

      const newSession: ChatSession = {
        id: newSessionId,
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tone: activeTone,
      };

      setSessions((prev) => [newSession, ...prev]);
      targetSessionId = newSessionId;
      setActiveSessionId(newSessionId);
    } else {
      const currentSess = sessions.find((s) => s.id === targetSessionId);
      if (currentSess) {
        existingMessages = currentSess.messages;
      }
    }

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    const assistantMessageId = `msg_asst_${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      tone: activeTone,
      timestamp: Date.now(),
      isStreaming: true,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, userMessage, initialAssistantMessage],
          };
        }
        return s;
      })
    );

    const chatHistoryForGemini = existingMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      await streamNoGptResponse({
        situation: promptText,
        tone: activeTone,
        languageCode: selectedLanguage || 'en',
        chatHistory: chatHistoryForGemini,
        onChunk: (accumulated) => {
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === targetSessionId) {
                return {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: accumulated, isStreaming: true }
                      : m
                  ),
                };
              }
              return s;
            })
          );
        },
        signal: controller.signal,
      });

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessageId ? { ...m, isStreaming: false } : m
              ),
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      if (err.message === 'Request cancelled') return;

      const errorText = err.message || 'Failed to generate response.';
      setErrorMessage(errorText);

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      content: m.content || 'Unable to generate response.',
                      isStreaming: false,
                      error: errorText,
                    }
                  : m
              ),
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (!activeSession || activeSession.messages.length < 2) return;
    const lastUserMsg = [...activeSession.messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content, tone);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* Name Onboarding Modal */}
      <NameOnboardingModal
        isOpen={showNameOnboarding && !showLanguageOnboarding}
        onSubmitName={(name) => {
          setUserName(name);
          setShowNameOnboarding(false);
        }}
      />

      {/* Language Onboarding Modal */}
      <LanguageOnboardingModal
        isOpen={showLanguageOnboarding}
        selectedLanguage={selectedLanguage || 'en'}
        onSelectLanguage={handleSelectLanguage}
        onConfirm={() => setShowLanguageOnboarding(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedLanguage={selectedLanguage || 'en'}
        onSelectLanguage={handleSelectLanguage}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onClearHistory={handleClearHistory}
        totalSessions={sessions.length}
      />

      {/* Navigation Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onTogglePinSession={handleTogglePinSession}
        onRenameSession={handleRenameSession}
        selectedLanguage={selectedLanguage || 'en'}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
        {/* Header */}
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          onNewChat={handleNewChat}
          selectedLanguage={selectedLanguage || 'en'}
          onSelectLanguage={handleSelectLanguage}
          selectedTone={tone}
          onSelectTone={setTone}
          onOpenSettings={() => setIsSettingsOpen(true)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          userName={userName}
        />

        {/* Scrollable Conversation History View */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              </div>
            )}

            {/* Conversation Messages Thread */}
            {activeMessages.map((msg, idx) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onRegenerate={handleRegenerate}
                isLastAssistant={idx === activeMessages.length - 1 && msg.role === 'assistant'}
              />
            ))}

            <div ref={responseBottomRef} />
          </div>
        </div>

        {/* Fixed Bottom Input Composer */}
        <ChatComposer
          situation={situation}
          onChangeSituation={setSituation}
          onSend={() => handleSend()}
          isLoading={isLoading}
          hasMessages={activeMessages.length > 0}
          selectedTone={tone}
          selectedLanguage={selectedLanguage || 'en'}
          onSelectLanguage={handleSelectLanguage}
        />
      </div>
    </div>
  );
}
