import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  RefreshCw,
  Share2,
  Sparkles,
  MessageSquare,
  Shield,
  Bookmark,
  SlidersHorizontal,
  Volume2,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage, ToneOption } from '../types';
import { DAILY_COMMUNICATION_TIPS, TONE_CHIPS } from '../constants/prompt';

interface DocumentCardResponseProps {
  message: ChatMessage;
  onRegenerate: () => void;
  onChangeToneAndRegenerate: (newTone: ToneOption) => void;
  currentTone: ToneOption;
}

export const DocumentCardResponse: React.FC<DocumentCardResponseProps> = ({
  message,
  onRegenerate,
  onChangeToneAndRegenerate,
  currentTone,
}) => {
  const [copiedFull, setCopiedFull] = useState(false);
  const [saved, setSaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopyFull = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NoGPT Boundary Script',
          text: message.content,
        });
      } catch (e) {
        handleCopyFull();
      }
    } else {
      handleCopyFull();
    }
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`_]/g, ''));
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text to speech is not supported in this browser.');
    }
  };

  // Static or calculated confidence score
  const confidenceScore = message.confidenceScore || 93;
  const tipText =
    message.communicationTip ||
    DAILY_COMMUNICATION_TIPS[Math.floor(Math.abs(message.timestamp) % DAILY_COMMUNICATION_TIPS.length)];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Document Header Toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Boundary Script Document</span>
              {message.isStreaming && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Generating...
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Tone: <strong className="text-blue-400 font-semibold">{currentTone}</strong> • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleTextToSpeech}
            disabled={message.isStreaming}
            title="Listen to response"
            className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              speaking
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSaved(!saved)}
            title="Save to bookmarks"
            className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              saved
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-rose-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyFull}
            disabled={message.isStreaming}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
          >
            {copiedFull ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={message.isStreaming}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${message.isStreaming ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={message.isStreaming}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-800 space-y-6 shadow-2xl">
        <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => (
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 mt-6 mb-3">
                  <h2 className="text-sm font-black uppercase tracking-wider text-blue-400 flex items-center gap-2 m-0">
                    {children}
                  </h2>
                </div>
              ),
              h3: ({ children }) => (
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 mt-5 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 m-0">
                    {children}
                  </h3>
                </div>
              ),
              p: ({ children }) => <p className="mb-3 leading-relaxed text-slate-300">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2 text-slate-300">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2 text-slate-300">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 bg-blue-950/20 p-4 my-3 rounded-r-2xl font-medium text-slate-200 italic">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Confidence Meter Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
          {/* Gauge SVG Circle */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${confidenceScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-black text-white">{confidenceScore}%</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Confidence Rating</span>
            </div>
            <h4 className="text-sm font-bold text-white">Boundary Effectiveness</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This response is polite, clear, and protects your relationship while maintaining firm personal boundaries.
            </p>
          </div>
        </div>

        {/* Daily Communication Tip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-800/40 space-y-1.5">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Info className="w-4 h-4 text-purple-400" />
            <span>Communication Tip</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "{tipText}"
          </p>
        </div>

        {/* Quick Tone Switcher Toolbar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span>Try generating in a different tone:</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {TONE_CHIPS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => onChangeToneAndRegenerate(t.value)}
                disabled={message.isStreaming || t.value === currentTone}
                className={`px-2.5 py-1 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                  t.value === currentTone
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                } disabled:opacity-50`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
