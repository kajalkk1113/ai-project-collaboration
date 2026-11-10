import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FolderKanban, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <Link to="/" className="flex items-center space-x-2">
        <FolderKanban className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          CollabSphere
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 font-medium text-sm"
            >
              Dashboard
            </Link>
            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 px-4 py-2 font-medium text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;