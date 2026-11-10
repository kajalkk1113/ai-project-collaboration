import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md space-y-3">
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase">Name</label>
              <p className="text-lg font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase">Email</label>
              <p className="text-sm text-gray-700">{user?.email}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;