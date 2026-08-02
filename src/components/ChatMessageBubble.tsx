import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  RefreshCw,
  Share2,
  Volume2,
  Sparkles,
  User,
  MessageSquareOff,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { ChatMessage, ToneOption } from '../types';
import { DAILY_COMMUNICATION_TIPS } from '../constants/prompt';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onRegenerate,
  isLastAssistant,
}) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NoGPT Response',
          text: message.content,
        });
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
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
    }
  };

  const tipText =
    message.communicationTip ||
    DAILY_COMMUNICATION_TIPS[Math.abs(message.timestamp) % DAILY_COMMUNICATION_TIPS.length];

  if (isUser) {
    return (
      <div className="flex justify-end my-3 animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 my-4 animate-fadeIn">
      {/* Assistant Avatar Icon */}
      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs mt-1">
        <MessageSquareOff className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Main Response Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-slate-800 text-xs sm:text-sm space-y-3">
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-slate-500 font-medium py-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Thinking and creating personalized boundary script...</span>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-base font-bold text-slate-900 mt-3 mb-2">{children}</h1>,
                  h2: ({ children }) => (
                    <div className="pt-3 pb-1 border-b border-slate-100 mt-4 mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 m-0">
                        {children}
                      </h2>
                    </div>
                  ),
                  h3: ({ children }) => (
                    <div className="pt-2 pb-1 border-b border-slate-100 mt-3 mb-1.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 m-0">
                        {children}
                      </h3>
                    </div>
                  ),
                  p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5 text-slate-700">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5 text-slate-700">{children}</ol>,
                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 border-blue-500 bg-slate-50 p-3 my-2 rounded-r-lg font-medium text-slate-800 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Communication Tip Box */}
          {!message.isStreaming && message.content && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-700 text-[11px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>Coach Tip</span>
              </div>
              <p className="text-slate-600 italic">"{tipText}"</p>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        {!message.isStreaming && message.content && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleTextToSpeech}
              className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                speaking ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {isLastAssistant && onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="flex items-center gap-1 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
