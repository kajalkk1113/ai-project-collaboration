import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sparkles, Users, FileCode2, BarChart, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Collaboration Platform</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Collaborate Smarter. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Build Projects Together.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-gray-600">
          CollabSphere brings code notes, file sharing, contribution analytics, and Google Gemini AI insights into a single unified workspace.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-100"
          >
            Start Free Project
          </Link>
          <Link
            to="/login"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Everything You Need for Team Productivity
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Gemini AI Assistant</h3>
              <p className="text-sm text-gray-500">
                Instantly explain complex notes, generate README docs, and get code improvements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <FileCode2 className="w-8 h-8 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Markdown & File Sharing</h3>
              <p className="text-sm text-gray-500">
                Upload local source code, documentation, and preview structured markdown seamlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
              <BarChart className="w-8 h-8 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contribution Analytics</h3>
              <p className="text-sm text-gray-500">
                Track note creation, file uploads, and team member activities with interactive visual charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-xs text-gray-500">
        CollabSphere Project Collaboration Platform. Built with MongoDB, Express, React & Node.js.
      </footer>
    </div>
  );
};

export default LandingPage;