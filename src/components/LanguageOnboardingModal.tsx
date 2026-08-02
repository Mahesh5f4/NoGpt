import React from 'react';
import { Globe, Check, MessageSquareOff } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

interface LanguageOnboardingModalProps {
  isOpen: boolean;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  onConfirm: () => void;
}

export const LanguageOnboardingModal: React.FC<LanguageOnboardingModalProps> = ({
  isOpen,
  selectedLanguage,
  onSelectLanguage,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-fadeIn text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md">
          <MessageSquareOff className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome to <span className="text-blue-600">NoGPT</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Choose your preferred language for generated boundary conversations and coaching responses.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                selectedLanguage === lang.code
                  ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-base">{lang.flag}</span>
                <span className="truncate">{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer text-xs"
        >
          Start Communication Coach
        </button>
      </div>
    </div>
  );
};
