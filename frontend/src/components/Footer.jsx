import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Lost <span className="text-indigo-600">&</span> Found
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              Lost something? Found something? Help reunite lost belongings with their rightful owners across the campus community through intelligent matching and quick reporting.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Privacy protected — Personal contact info is hidden from public cards</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-indigo-600 transition">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-rose-600 transition">
                  Report Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-emerald-600 transition">
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-600 transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Project Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              College Project
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed & developed for demonstration. Implemented using React, Node.js, Express, Cloudinary, and local JSON storage.
            </p>
            <div className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Smart Match Engine
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Lost & Found System. Built for academic demonstration.</p>
          <p className="flex items-center">
            Built with modern React & Express
          </p>
        </div>
      </div>
    </footer>
  );
}
