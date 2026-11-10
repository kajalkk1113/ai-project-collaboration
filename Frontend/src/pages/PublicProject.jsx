import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../service/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

const PublicProject = () => {
  const { shareToken } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const { data } = await API.get(`/public/projects/${shareToken}`);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublic();
  }, [shareToken]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold">
            Public View Only
          </span>
          <h1 className="text-3xl font-bold text-gray-900">{project?.title}</h1>
          <p className="text-sm text-gray-600">{project?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicProject;