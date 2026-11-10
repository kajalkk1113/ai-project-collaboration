import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

const FileUpload = ({ onUpload, uploading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase">
        Upload Project File / Code
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>
    </form>
  );
};

export default FileUpload;