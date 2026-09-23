import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Menu,
  X,
  Compass,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { timeAgo } from '../../utils/formatters';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-800 to-brand-600 bg-clip-text text-transparent">
                  शोध <span className="font-bold text-slate-800 text-lg">Shodh</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-slate-400 -mt-1">
                  Lost & Found Portal
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/')
                    ? 'text-brand-700 bg-brand-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/items"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/items')
                    ? 'text-brand-700 bg-brand-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Listings
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/dashboard')
                      ? 'text-brand-700 bg-brand-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin')
                      ? 'text-purple-700 bg-purple-50 font-semibold'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
                  }`}
                >
                  <span className="inline-flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    Admin Panel
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Report Buttons */}
            <Link
              to="/report-lost"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1 text-rose-500" />
              Report Lost
            </Link>

            <Link
              to="/report-found"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Report Found
            </Link>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-elevated border border-slate-200/80 z-50 slide-up">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => markAsRead(notif._id)}
                            className={`p-3 rounded-xl transition cursor-pointer flex items-start space-x-3 ${
                              notif.read ? 'opacity-70 hover:bg-slate-50' : 'bg-brand-50/50 hover:bg-brand-50'
                            }`}
                          >
                            <div className="mt-0.5">
                              {notif.type === 'claim_approved' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Bell className="w-4 h-4 text-brand-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-800 font-medium leading-relaxed line-clamp-3">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {timeAgo(notif.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {user?.name || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white py-2 shadow-elevated border border-slate-200/80 z-50 slide-up">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                          Platform Admin
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2 text-slate-400" />
                      Dashboard & Reports
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-medium"
                      >
                        <Shield className="w-4 h-4 mr-2 text-purple-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-2 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition shadow-xs shadow-brand-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 slide-up">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/') ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/items"
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/items') ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'
              }`}
            >
              Browse Listings
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/dashboard') ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/profile') ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  My Profile
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/admin') ? 'bg-purple-50 text-purple-700 font-bold' : 'text-purple-600'
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              to="/report-lost"
              className="w-full text-center py-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="w-full text-center py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              Report Found Item
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 text-center"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-brand-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
