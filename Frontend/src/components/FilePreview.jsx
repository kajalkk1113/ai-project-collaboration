import React, { useState } from 'react';
import { FileCode, Image as ImageIcon, FileText, Download, Trash2, Sparkles } from 'lucide-react';
import API from '../service/api';

const FilePreview = ({ file, onDelete, onExplain }) => {
  const isImage = file.mimeType.startsWith('image/');
  const backendBase = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          {isImage ? <ImageIcon className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{file.originalName}</h4>
          <p className="text-xs text-gray-400">
            {(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onExplain(file)}
          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg text-xs flex items-center space-x-1"
          title="Explain file using AI"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <a
          href={`${backendBase}/api/files/download/${file._id}`}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          title="Download File"
        >
          <Download className="w-4 h-4" />
        </a>
        <button
          onClick={() => onDelete(file._id)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
          title="Delete File"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FilePreview;