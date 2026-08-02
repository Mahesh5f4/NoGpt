import React, { useRef } from 'react';
import {
  X,
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  Lock,
  Globe,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  onExportData: (format: 'json' | 'txt') => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearHistory: () => void;
  totalSessions: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  onExportData,
  onImportData,
  onClearHistory,
  totalSessions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-slate-900 text-base">Settings & Privacy</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Privacy & Architecture Guarantee */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-800 text-xs">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>100% Private & Local Storage</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              NoGPT stores all your conversation history directly on your device via browser local storage.
              No backend database or remote account tracking is used.
            </p>
          </div>

          {/* Language Preference */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Default Coach Output Language</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`p-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedLanguage === lang.code
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">
                    {lang.flag} {lang.name}
                  </span>
                  {selectedLanguage === lang.code && <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Data Management & Export */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export & Import Conversations</span>
            </label>
            <p className="text-slate-500 text-[11px]">
              You currently have <strong className="text-slate-800">{totalSessions}</strong> saved conversation session(s).
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => onExportData('json')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => onExportData('txt')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Text</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 px-3 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
            </div>
          </div>

          {/* Danger Zone: Clear History */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-900 block text-xs">Clear All Chat History</span>
                <span className="text-rose-600 text-[11px]">Permanently remove all local conversations.</span>
              </div>
              <button
                type="button"
                onClick={onClearHistory}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-1.5 px-3 rounded-lg shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>NoGPT v3.0 • Boundaries Coach</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
