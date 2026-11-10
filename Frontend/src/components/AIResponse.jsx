import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, X } from 'lucide-react';

const AIResponse = ({ response, onClose }) => {
  if (!response) return null;

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 my-4 relative">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-purple-200">
        <div className="flex items-center space-x-2 text-purple-900 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Gemini AI Insights</span>
        </div>
        <button onClick={onClose} className="text-purple-400 hover:text-purple-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="prose prose-sm text-purple-900 max-w-none text-xs leading-relaxed">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AIResponse;