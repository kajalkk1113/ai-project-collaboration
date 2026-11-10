import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MarkdownEditor from '../components/MarkdownEditor';
import FileUpload from '../components/FileUpload';
import FilePreview from '../components/FilePreview';
import AIResponse from '../components/AIResponse';
import Loading from '../components/Loading';
import API from '../service/api';
import { AuthContext } from '../context/AuthContext';
import { FileText, Folder, Users, Settings, Sparkles, Copy, Trash2, FileCode2, BookOpen } from 'lucide-react';

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tab, setTab] = useState('notes'); // notes, files, members, settings
  const [loading, setLoading] = useState(true);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Files state
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // AI State
  const [aiResult, setAiResult] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Member State
  const [memberEmail, setMemberEmail] = useState('');

  const loadData = async () => {
    try {
      const [pRes, nRes, fRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/notes/${id}`),
        API.get(`/files/${id}`),
      ]);
      setProject(pRes.data);
      setNotes(nRes.data);
      setFiles(fRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSaveNote = async () => {
    if (!noteTitle || !noteContent) return alert('Title and content are required');
    try {
      await API.post(`/notes/${id}`, { title: noteTitle, content: noteContent });
      setNoteTitle('');
      setNoteContent('');
      loadData();
    } catch (err) {
      alert('Failed to save note');
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await API.post(`/files/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      loadData();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // 1. Gemini AI: Explain Note / Text
  const handleExplainNote = async () => {
    if (!noteContent) return alert('Please enter note content to explain');
    setLoadingAI(true);
    try {
      const { data } = await API.post('/gemini/explain', { text: noteContent, type: 'note' });
      setAiResult(data.explanation);
    } catch (err) {
      alert('AI analysis failed');
    } finally {
      setLoadingAI(false);
    }
  };

  // 2. Gemini AI: Generate Code Documentation
  const handleGenerateDocs = async () => {
    if (!noteContent) return alert('Please write code or notes in the editor first');
    setLoadingAI(true);
    try {
      const { data } = await API.post('/gemini/docs', { code: noteContent });
      setAiResult(data.docs);
    } catch (err) {
      alert('Failed to generate code documentation');
    } finally {
      setLoadingAI(false);
    }
  };

  // 3. Gemini AI: Generate README.md for Project
  const handleGenerateReadme = async () => {
    setLoadingAI(true);
    try {
      const { data } = await API.post('/gemini/readme', {
        projectTitle: project?.title,
        projectDescription: project?.description,
        features: ['Notes Management', 'File Storage', 'Gemini AI Integration', 'Contribution Analytics'],
      });
      setAiResult(data.readme);
    } catch (err) {
      alert('Failed to generate README');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleExplainFile = async (file) => {
    setLoadingAI(true);
    try {
      const { data } = await API.post('/gemini/explain', {
        text: `File Name: ${file.originalName}`,
        type: 'file code',
      });
      setAiResult(data.explanation);
    } catch (err) {
      alert('AI file analysis failed');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/members`, { email: memberEmail });
      setMemberEmail('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  // Project Delete Handler inside Settings
  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project?.title}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${id}`);
      alert('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  if (loading) return <Loading />;

  const isOwner = project?.owner?._id === user?._id || project?.owner === user?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
     
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project?.title}</h1>
              <p className="text-xs text-gray-500">{project?.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleGenerateReadme}
                disabled={loadingAI}
                className="flex items-center space-x-1 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Generate README with AI</span>
              </button>
              {project?.visibility === 'public' && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/public/${project.shareToken}`);
                    alert('Public link copied to clipboard!');
                  }}
                  className="flex items-center space-x-1 border border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Share Link</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-2 border-b border-gray-200 mb-6">
            {['notes', 'files', 'members', 'settings'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  tab === t
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <AIResponse response={aiResult} onClose={() => setAiResult('')} />

          {/* Workspace Views */}
          {tab === 'notes' && (
            <div className="space-y-6">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleGenerateDocs}
                  disabled={loadingAI || !noteContent}
                  className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Generate Code Docs</span>
                </button>
              </div>

              <MarkdownEditor
                title={noteTitle}
                setTitle={setNoteTitle}
                content={noteContent}
                setContent={setNoteContent}
                onSave={handleSaveNote}
                onExplain={handleExplainNote}
                loadingAI={loadingAI}
              />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase">Saved Notes</h3>
                {notes.map((n) => (
                  <div key={n._id} className="bg-white p-4 border rounded-xl space-y-1">
                    <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'files' && (
            <div className="space-y-6">
              <FileUpload onUpload={handleFileUpload} uploading={uploading} />
              <div className="space-y-2">
                {files.map((f) => (
                  <FilePreview
                    key={f._id}
                    file={f}
                    onDelete={async (fileId) => {
                      await API.delete(`/files/${fileId}`);
                      loadData();
                    }}
                    onExplain={handleExplainFile}
                  />
                ))}
              </div>
            </div>
          )}

          {tab === 'members' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
              <form onSubmit={handleAddMember} className="flex space-x-2">
                <input
                  type="email"
                  required
                  placeholder="Member email address"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm flex-1"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-medium">
                  Add Member
                </button>
              </form>

              <div className="divide-y">
                {project?.members?.map((m) => (
                  <div key={m._id} className="py-2 flex items-center justify-between text-sm">
                    <span>{m.name} ({m.email})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Project Settings</h3>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Project Title:</span> {project?.title}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Visibility:</span> {project?.visibility}
                </p>
              </div>

              {/* Danger Zone: Delete Project Option */}
              <div className="pt-6 border-t border-red-100">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Danger Zone</h4>
                    <p className="text-xs text-red-600">
                      Permanently delete this project along with all saved notes and uploaded files.
                    </p>
                  </div>
                  {isOwner ? (
                    <button
                      onClick={handleDeleteProject}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Project</span>
                    </button>
                  ) : (
                    <span className="text-xs text-red-400 italic">Only owner can delete</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectWorkspace;