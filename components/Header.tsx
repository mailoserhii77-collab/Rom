import React from 'react';
import { Video, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Gemini Video Insight
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>Powered by Gemini 3 Pro</span>
        </div>
      </div>
    </header>
  );
};