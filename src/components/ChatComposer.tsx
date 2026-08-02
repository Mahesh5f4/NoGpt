import React, { useRef, useEffect } from 'react';
import { Send, ChevronDown, Globe } from 'lucide-react';
import { SUGGESTED_EXAMPLES } from '../constants/prompt';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { QuickChip, ToneOption } from '../types';

interface ChatComposerProps {
  situation: string;
  onChangeSituation: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  hasMessages: boolean;
  selectedTone: ToneOption;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  situation,
  onChangeSituation,
  onSend,
  isLoading,
  hasMessages,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height up to 160px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [situation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (situation.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const handleChipClick = (example: QuickChip) => {
    onChangeSituation(example.promptText);
    textareaRef.current?.focus();
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4 space-y-3">
      {/* Quick Suggestion Chips if no active messages */}
      {!hasMessages && (
        <div className="space-y-2 animate-fadeIn">
          <div className="text-center space-y-1 py-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learn to Say <span className="text-blue-600">"No"</span> Respectfully
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Describe your situation and get a realistic conversation script to protect your boundaries with confidence.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Popular Situation Examples
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_EXAMPLES.slice(0, 6).map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleChipClick(ex)}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left text-xs font-medium text-slate-700 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <span className="truncate">{ex.label}</span>
                  <span className="text-slate-400 group-hover:text-blue-600 font-bold ml-2">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Message Input Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-2 flex items-end gap-1.5 sm:gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <textarea
          ref={textareaRef}
          value={situation}
          onChange={(e) => onChangeSituation(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder="Describe your situation... (e.g. My boss asks me to work overtime)"
          className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm px-2 py-1.5 focus:outline-none resize-none max-h-40 min-h-[38px]"
        />

        {/* Language Selector Pill directly beside Send Button */}
        <div className="relative shrink-0">
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value)}
            className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 pl-2.5 pr-6 rounded-xl border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors h-9 flex items-center"
            title="Select Output Language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 top-3 pointer-events-none" />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!situation.trim() || isLoading}
          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-blue-600" />
          <span>Outputting in <strong>{currentLang.name} ({currentLang.nativeName})</strong></span>
        </span>
        <span className="hidden sm:inline">Shift + Enter for new line</span>
      </div>
    </div>
  );
};
