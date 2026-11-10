import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Users, Globe, Lock } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FolderKanban className="w-5 h-5" />
          </div>
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              project.visibility === 'public'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {project.visibility === 'public' ? (
              <Globe className="w-3 h-3 mr-1" />
            ) : (
              <Lock className="w-3 h-3 mr-1" />
            )}
            {project.visibility}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500 space-x-1">
          <Users className="w-4 h-4" />
          <span>{project.members ? project.members.length : 1} Members</span>
        </div>
        <Link
          to={`/projects/${project._id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Open Workspace &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;