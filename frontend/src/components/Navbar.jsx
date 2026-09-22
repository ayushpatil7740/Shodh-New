import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, AlertCircle, Compass, ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition duration-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                Lost <span className="text-indigo-600">&</span> Found
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Campus Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/')
                  ? 'text-indigo-600 bg-indigo-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </Link>

            <Link
              to="/browse"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5 ${
                isActive('/browse')
                  ? 'text-indigo-600 bg-indigo-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Browse All</span>
            </Link>

            <Link
              to="/admin"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5 ${
                isActive('/admin')
                  ? 'text-indigo-600 bg-indigo-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Action CTAs: Lost / Found */}
          <div className="hidden md:flex items-center space-x-2.5">
            <Link
              to="/report-lost"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition duration-150 shadow-2xs cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              <span>I Lost Something</span>
            </Link>

            <Link
              to="/report-found"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition duration-150 shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>I Found Something</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          <Link
            to="/"
            onClick={closeMenu}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
              isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/browse"
            onClick={closeMenu}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
              isActive('/browse') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Browse All Items
          </Link>
          <Link
            to="/admin"
            onClick={closeMenu}
            className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
              isActive('/admin') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Admin Dashboard
          </Link>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              to="/report-lost"
              onClick={closeMenu}
              className="w-full text-center py-2.5 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200"
            >
              I Lost Something
            </Link>
            <Link
              to="/report-found"
              onClick={closeMenu}
              className="w-full text-center py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200"
            >
              I Found Something
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
