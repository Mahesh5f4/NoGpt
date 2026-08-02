import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Plus,
  Settings,
  MessageSquareOff,
  ChevronDown,
  History,
  MessageSquare,
  Pin,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { TONE_CHIPS } from '../constants/prompt';
import { ChatSession, ToneOption } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  selectedTone: ToneOption;
  onSelectTone: (tone: ToneOption) => void;
  onOpenSettings: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  selectedLanguage,
  onSelectLanguage,
  selectedTone,
  onSelectTone,
  onOpenSettings,
  sessions,
  activeSessionId,
  onSelectSession,
}) => {
  const [showAllChatsMenu, setShowAllChatsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const pinnedSessions = sessions.filter((s) => s.pinned);
  const recentSessions = sessions.filter((s) => !s.pinned);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAllChatsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border-b border-slate-200 shrink-0 z-20 sticky top-0 shadow-xs">
      {/* Top Main Header for NoGPT */}
      <header className="h-14 px-3 sm:px-5 flex items-center justify-between border-b border-slate-100">
        {/* Left Branding & Sidebar Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Open conversation drawer"
          >
            <Menu className="w-5 h-5 text-slate-700" />
            <span className="hidden md:inline text-slate-600">History</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* NoGPT Main Branding Header */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <MessageSquareOff className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  No<span className="text-blue-600">GPT</span>
                </span>
                <span className="hidden sm:inline-block bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Boundary Coach
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate hidden sm:block">
                Say "No" with confidence and respect
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Tone Dropdown, Settings, New Chat */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tone Dropdown Selector */}
          <div className="relative inline-block">
            <select
              value={selectedTone}
              onChange={(e) => onSelectTone(e.target.value as ToneOption)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors max-w-[110px] sm:max-w-none truncate"
              title="Select Communication Tone"
            >
              {TONE_CHIPS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Settings button */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="App Settings"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={onNewChat}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </header>

      {/* Navbar for Chat History */}
      <nav className="px-3 sm:px-5 py-1.5 bg-slate-50/90 flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs">
        {/* All Chats Popover Trigger */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowAllChatsMenu((prev) => !prev)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-2xs"
            title="View All Chats"
          >
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>All Chats ({sessions.length})</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* All Chats Dropdown Menu */}
          {showAllChatsMenu && (
            <div className="absolute left-0 top-8 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-blue-600" /> All Conversations
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllChatsMenu(false)}
                  className="p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search in Dropdown */}
              <div className="relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter chats..."
                  className="w-full text-xs pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              {/* Chat items list */}
              <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                {filteredSessions.length === 0 ? (
                  <p className="text-[11px] text-slate-400 p-2 text-center">No chats found.</p>
                ) : (
                  filteredSessions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectSession(s.id);
                        setShowAllChatsMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        s.id === activeSessionId
                          ? 'bg-blue-50 text-blue-900 font-semibold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{s.title}</span>
                      </div>
                      {s.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Horizontal navbar list of chats for quick switching */}
        {sessions.length === 0 ? (
          <span className="text-slate-400 italic text-[11px] shrink-0">
            No saved conversations. Start typing below!
          </span>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Pinned sessions in navbar */}
            {pinnedSessions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSession(s.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 max-w-[150px] sm:max-w-[200px] truncate transition-colors cursor-pointer border ${
                  s.id === activeSessionId
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                    : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Pin className={`w-3 h-3 shrink-0 ${s.id === activeSessionId ? 'text-white' : 'text-amber-600 fill-amber-500'}`} />
                <span className="truncate">{s.title}</span>
              </button>
            ))}

            {/* Recent sessions in navbar */}
            {recentSessions.slice(0, 8).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSession(s.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 max-w-[150px] sm:max-w-[200px] truncate transition-colors cursor-pointer border ${
                  s.id === activeSessionId
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className={`w-3 h-3 shrink-0 ${s.id === activeSessionId ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};

