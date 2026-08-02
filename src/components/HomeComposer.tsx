import React, { useRef } from 'react';
import { Send, Sparkles, SlidersHorizontal, Layers, ArrowRight } from 'lucide-react';
import { CATEGORIES, SUGGESTED_EXAMPLES, TONE_CHIPS } from '../constants/prompt';
import { CategoryOption, QuickChip, ToneOption } from '../types';

interface HomeComposerProps {
  situation: string;
  onChangeSituation: (val: string) => void;
  tone: ToneOption;
  onChangeTone: (t: ToneOption) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const HomeComposer: React.FC<HomeComposerProps> = ({
  situation,
  onChangeSituation,
  tone,
  onChangeTone,
  selectedCategory,
  onSelectCategory,
  onGenerate,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 1000;

  const handleExampleClick = (example: QuickChip) => {
    onChangeSituation(example.promptText);
    onSelectCategory(example.category);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (situation.trim() && !isLoading) {
        onGenerate();
      }
    }
  };

  const activeToneObj = TONE_CHIPS.find((t) => t.value === tone) || TONE_CHIPS[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4 px-4 sm:px-6 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-3 pt-2 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>NoGPT AI Boundary Coach</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mx-auto">
          Learn to Say <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">"No"</span> Without Feeling Guilty
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Describe your situation and receive a realistic, respectful conversation you can confidently use in real life.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Select Category</span>
          </span>
          {selectedCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory('')}
              className="text-blue-400 hover:underline cursor-pointer text-[11px]"
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? '' : cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                    : 'bg-[#161B26]/80 hover:bg-[#1C2331] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-xs font-bold truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Composer Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl space-y-6">
        {/* Tone Selector Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Choose Tone:</span>
            </span>
            <span className="text-purple-400 font-semibold">{activeToneObj.label} ({activeToneObj.icon})</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TONE_CHIPS.map((t) => {
              const isSelected = t.value === tone;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChangeTone(t.value)}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                      : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 italic pt-1">
            "{activeToneObj.description}"
          </p>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={situation}
              onChange={(e) => onChangeSituation(e.target.value.slice(0, maxChars))}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={4}
              placeholder="Describe your situation...\n\nExample:\nMy friend keeps asking me to lend money, but I don't want to anymore."
              className="w-full bg-[#0B0F17]/90 text-slate-100 placeholder:text-slate-500 text-sm sm:text-base p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y min-h-[120px] transition-all disabled:opacity-50"
            />

            {/* Character counter & clear */}
            <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500">
              {situation.length > 0 ? (
                <button
                  type="button"
                  onClick={() => onChangeSituation('')}
                  className="hover:text-slate-300 cursor-pointer font-medium"
                >
                  Clear text
                </button>
              ) : (
                <span className="text-[11px]">Tip: Cmd+Enter / Ctrl+Enter to generate</span>
              )}
              <span className={situation.length >= maxChars ? 'text-rose-400 font-bold' : ''}>
                {situation.length} / {maxChars}
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Examples Chips */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Suggested Examples:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleExampleClick(ex)}
                disabled={isLoading}
                className="text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 py-1.5 px-3 rounded-xl transition-colors cursor-pointer text-left"
              >
                • {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!situation.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Send className="w-5 h-5 text-amber-300" />
            <span>Generate Conversation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
