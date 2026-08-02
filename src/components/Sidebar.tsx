import React, { useState } from 'react';
import {
  Plus,
  MessageSquareOff,
  Search,
  Pin,
  Trash2,
  Edit2,
  Settings,
  X,
  Lock,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ChatSession } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onTogglePinSession: (id: string, e: React.MouseEvent) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  selectedLanguage: string;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onTogglePinSession,
  onRenameSession,
  selectedLanguage,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      s.messages.some((m) => m.content.toLowerCase().includes(query))
    );
  });

  const pinnedSessions = filteredSessions.filter((s) => s.pinned);
  const unpinnedSessions = filteredSessions.filter((s) => !s.pinned);

  const startEditing = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditingTitle(s.title);
  };

  const saveEditing = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-[#F9FAFB] text-slate-800 flex flex-col justify-between border-r border-slate-200 shadow-sm transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding & New Chat */}
        <div className="p-3.5 space-y-3 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <MessageSquareOff className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                No<span className="text-blue-600">GPT</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-2 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>New conversation</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">⌘N</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-slate-100 text-xs text-slate-800 placeholder:text-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
          {/* Pinned Section */}
          {pinnedSessions.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Pin className="w-3 h-3 fill-amber-500" />
                <span>Pinned</span>
              </div>
              {pinnedSessions.map((s) => (
                <ChatItem
                  key={s.id}
                  session={s}
                  isActive={s.id === activeSessionId}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  onSelect={() => {
                    onSelectSession(s.id);
                    onCloseMobile();
                  }}
                  onTogglePin={(e) => onTogglePinSession(s.id, e)}
                  onStartEditing={(e) => startEditing(s, e)}
                  onSaveEditing={(e) => saveEditing(s.id, e)}
                  onChangeTitle={setEditingTitle}
                  onDelete={(e) => onDeleteSession(s.id, e)}
                />
              ))}
            </div>
          )}

          {/* All Chats Section */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Recent Conversations</span>
              <span>{unpinnedSessions.length}</span>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 bg-white/50 rounded-lg border border-dashed border-slate-200">
                {searchQuery ? 'No matching chats.' : 'No saved chats.'}
              </div>
            ) : (
              unpinnedSessions.map((s) => (
                <ChatItem
                  key={s.id}
                  session={s}
                  isActive={s.id === activeSessionId}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  onSelect={() => {
                    onSelectSession(s.id);
                    onCloseMobile();
                  }}
                  onTogglePin={(e) => onTogglePinSession(s.id, e)}
                  onStartEditing={(e) => startEditing(s, e)}
                  onSaveEditing={(e) => saveEditing(s.id, e)}
                  onChangeTitle={setEditingTitle}
                  onDelete={(e) => onDeleteSession(s.id, e)}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer Language & Settings */}
        <div className="p-3 border-t border-slate-200 bg-white space-y-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 p-2 rounded-lg flex items-center justify-between text-xs font-medium transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings & Privacy</span>
            </div>
            <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-600">
              Local
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

interface ChatItemProps {
  session: ChatSession;
  isActive: boolean;
  editingId: string | null;
  editingTitle: string;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onStartEditing: (e: React.MouseEvent) => void;
  onSaveEditing: (e: React.FormEvent) => void;
  onChangeTitle: (val: string) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  session,
  isActive,
  editingId,
  editingTitle,
  onSelect,
  onTogglePin,
  onStartEditing,
  onSaveEditing,
  onChangeTitle,
  onDelete,
}) => {
  const isEditing = editingId === session.id;

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
        isActive
          ? 'bg-blue-50 text-blue-900 border-blue-200 font-semibold shadow-2xs'
          : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-200/50'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 pr-10">
        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
        {isEditing ? (
          <form onSubmit={onSaveEditing} className="w-full">
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => onChangeTitle(e.target.value)}
              autoFocus
              onBlur={onSaveEditing}
              className="w-full bg-white text-slate-900 text-xs px-1.5 py-0.5 rounded border border-blue-500 focus:outline-none"
            />
          </form>
        ) : (
          <div className="truncate">
            <div className="truncate">{session.title}</div>
          </div>
        )}
      </div>

      {/* Hover Action Toolbar */}
      {!isEditing && (
        <div className="absolute right-1.5 top-1.5 hidden group-hover:flex items-center gap-0.5 bg-white p-0.5 rounded-md border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={onTogglePin}
            title={session.pinned ? 'Unpin' : 'Pin'}
            className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer"
          >
            <Pin className={`w-3 h-3 ${session.pinned ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onStartEditing}
            title="Rename"
            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
