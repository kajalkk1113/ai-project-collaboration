import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
        type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;