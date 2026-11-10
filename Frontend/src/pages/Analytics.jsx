
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import API from '../service/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { FileText, Folder, Users, Award } from 'lucide-react';

const Analytics = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get('/projects');

        
        const projectList = Array.isArray(data)
          ? data
          : data.projects || [];

        setProjects(projectList);

        if (projectList.length > 0) {
          setSelectedProject(projectList[0]._id);
        }
      } catch (error) {
        console.error(
          'PROJECT FETCH ERROR:',
          error.response?.data || error.message
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // STEP 2: Fetch analytics for selected project
  useEffect(() => {
    if (!selectedProject) {
      setAnalyticsData(null);
      return;
    }

    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);

      try {
        const { data } = await API.get(
          `/analytics/project/${selectedProject}`
        );

        console.log('ANALYTICS RESPONSE:', data);

        setAnalyticsData({
          ...data,
          totalMembers: data.memberStats?.length || 0,
        });
      } catch (error) {
        console.error(
          'ANALYTICS ERROR:',
          error.response?.data || error.message
        );

        setAnalyticsData(null);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [selectedProject]);

  if (loadingProjects) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Contribution Analytics
          </h1>

          {projects.length > 0 && (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* No Projects */}
        {projects.length === 0 && (
          <p className="text-gray-500">
            No projects available. Create a project first.
          </p>
        )}

        {/* Analytics Loading */}
        {loadingAnalytics && <Loading />}

        {/* Analytics Data */}
        {!loadingAnalytics && analyticsData && (
          <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
                <FileText className="text-indigo-600 w-6 h-6" />
                <div>
                  <p className="text-gray-500 text-sm">Total Notes</p>
                  <h3 className="text-2xl font-bold">
                    {analyticsData.totalNotes}
                  </h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
                <Folder className="text-purple-600 w-6 h-6" />
                <div>
                  <p className="text-gray-500 text-sm">Total Files</p>
                  <h3 className="text-2xl font-bold">
                    {analyticsData.totalFiles}
                  </h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
                <Users className="text-emerald-600 w-6 h-6" />
                <div>
                  <p className="text-gray-500 text-sm">Team Members</p>
                  <h3 className="text-2xl font-bold">
                    {analyticsData.totalMembers}
                  </h3>
                </div>
              </div>

            </div>

            {/* Bar Chart */}
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-bold mb-4">
                Member Activity Comparison
              </h3>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.memberStats || []}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />

                    <Bar
                      dataKey="notesCreated"
                      name="Notes Created"
                      fill="#6366f1"
                    />

                    <Bar
                      dataKey="filesUploaded"
                      name="Files Uploaded"
                      fill="#a855f7"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Member Contribution Table */}
            <div className="bg-white border rounded-xl overflow-hidden">

              <div className="p-4 border-b flex items-center gap-2">
                <Award className="text-indigo-600" />
                <h3 className="font-bold">
                  Member Contribution Summary
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Notes</th>
                      <th className="p-3">Files</th>
                      <th className="p-3">Contributions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {analyticsData.memberStats?.map((member) => (
                      <tr key={member.memberId}>
                        <td className="p-3 font-semibold">
                          {member.name}
                        </td>

                        <td className="p-3 text-gray-500">
                          {member.email}
                        </td>

                        <td className="p-3 text-center">
                          {member.notesCreated}
                        </td>

                        <td className="p-3 text-center">
                          {member.filesUploaded}
                        </td>

                        <td className="p-3 text-center font-bold text-indigo-600">
                          {member.totalContributions}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Analytics;
