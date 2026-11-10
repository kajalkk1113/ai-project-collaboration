import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';
import API from '../service/api';
import { FolderKanban, FileText, Upload, Activity as ActivityIcon } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
         const { data } = await API.get('/analytics/dashboard');

console.log("DASHBOARD API RESPONSE:", data);

setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

          {loading ? (
            <Loading />
          ) : (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Total Projects</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalProjects || 0}</h3>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Total Notes</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalNotes || 0}</h3>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center space-x-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Total Files</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalFiles || 0}</h3>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center space-x-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <ActivityIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Created / Joined</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats?.createdProjects || 0} / {stats?.joinedProjects || 0}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Recent Projects & Activity Stream */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h2>
                  <div className="space-y-4">
                    {stats?.recentProjects?.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity Stream</h2>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 divide-y divide-gray-100">
                    {stats?.recentActivities?.map((act) => (
                      <div key={act._id} className="py-3 flex items-start justify-between text-xs">
                        <div>
                          <p className="font-semibold text-gray-800">{act.action}</p>
                          <p className="text-gray-500">{act.description}</p>
                        </div>
                        <span className="text-gray-400">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;