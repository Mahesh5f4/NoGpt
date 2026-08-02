import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';

interface NameOnboardingModalProps {
  isOpen: boolean;
  onSubmitName: (name: string) => void;
}

export const NameOnboardingModal: React.FC<NameOnboardingModalProps> = ({
  isOpen,
  onSubmitName,
}) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmitName(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 sm:p-8">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-sm border border-blue-200">
            <User className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Welcome to NoGPT!
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Before we get started, please tell us your name so we can personalize your experience. Your data never leaves your device.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user-name" className="sr-only">
                Your Name
              </label>
              <input
                id="user-name"
                type="text"
                autoFocus
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
