import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';
import API from '../service/api';
import { Plus } from 'lucide-react';
import Analytics from './Analytics';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');

  
const fetchProjects = async () => {
  try {
    const { data } = await API.get('/projects');
    setProjects(data.projects || data);
    
  } catch (err) {
    console.error(
      'Projects API Error:',
      err.response?.status,
      err.response?.data
    );
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', { title, description, visibility });
      setTitle('');
      setDescription('');
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />     
      <div className="flex">
        <Sidebar />
         
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
                <h3 className="text-lg font-bold text-gray-900">New Project</h3>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                      Visibility
                    </label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public Shareable</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <Analytics/>
        </main>
      </div>
    </div>
  );
};

export default Projects;