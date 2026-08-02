import React from 'react';
import { Sparkles, MessageSquareOff, Shield } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-fadeIn">
      <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Shimmer Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-shimmer" />
        </div>

        {/* Pulse Logo Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-blue-500/20 animate-ping opacity-75" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-xl shadow-blue-500/30">
            <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
            <span>✨ Thinking...</span>
          </h3>
          <p className="text-sm font-semibold text-slate-400">
            Creating your personalized conversation script...
          </p>
        </div>

        {/* Shimmer Placeholder Cards */}
        <div className="space-y-3 pt-4 max-w-xl mx-auto">
          <div className="h-12 bg-slate-900/80 rounded-2xl border border-slate-800 animate-pulse" />
          <div className="h-24 bg-slate-900/60 rounded-2xl border border-slate-800/80 animate-pulse" />
          <div className="h-16 bg-slate-900/40 rounded-2xl border border-slate-800/60 animate-pulse" />
        </div>

        <div className="text-xs text-slate-500 pt-2 font-medium">
          Structuring polite refusal • Crafting follow-ups • Calculating confidence score
        </div>
      </div>
    </div>
  );
};
