import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Save, Eye, Edit3, FileCode2 } from 'lucide-react';

const MarkdownEditor = ({
  title,
  setTitle,
  content,
  setContent,
  onSave,
  onExplain,
  onGenerateDocs,
  loadingAI,
}) => {
  const [tab, setTab] = useState('write');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Note Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., System Architecture & API Endpoints"
          className="w-full text-lg font-semibold border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-600"
        />
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 pb-2 flex-wrap gap-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium ${
              tab === 'write' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium ${
              tab === 'preview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        <div className="flex space-x-2">
          {/* AI Explain Button */}
          <button
            type="button"
            onClick={onExplain}
            disabled={loadingAI}
            className="flex items-center space-x-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loadingAI ? 'Working...' : 'AI Explain Note'}</span>
          </button>

          {/* AI Generate Docs Button */}
          <button
            type="button"
            onClick={onGenerateDocs}
            disabled={loadingAI}
            className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{loadingAI ? 'Working...' : 'Generate Code Docs'}</span>
          </button>

          {/* Save Note Button */}
          <button
            type="button"
            onClick={onSave}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste your code/markdown content here..."
          className="w-full font-mono text-sm border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      ) : (
        <div className="prose prose-sm max-w-none border border-gray-100 rounded-lg p-4 min-h-[250px] bg-gray-50 overflow-y-auto">
          <ReactMarkdown>{content || '*Nothing to preview*'}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;