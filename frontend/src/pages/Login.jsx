import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, Zap, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../utils/constants';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoFill = async (accountKey) => {
    const account = DEMO_ACCOUNTS[accountKey];
    if (account) {
      setFormData({
        email: account.email,
        password: account.password,
      });
      setError('');
      setLoading(true);
      try {
        await login(account.email, account.password);
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.response?.data?.message || 'Demo login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            शोध Shodh
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Access your reported items, review claims, and reconnect with belongings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-elevated space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Helper Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant One-Click Demo Logins</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Click any profile below to immediately test the platform:
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                disabled={loading}
                className="w-full text-left p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition text-xs flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <div>
                    <p className="font-bold text-purple-900">Campus Admin Desk</p>
                    <p className="text-[10px] text-purple-600">Full moderation & analytics panel</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('user1')}
                disabled={loading}
                className="w-full text-left p-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 transition text-xs flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <div>
                    <p className="font-bold text-brand-900">Student: Aarav Sharma</p>
                    <p className="text-[10px] text-brand-600">Lost MacBook & active listings</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@shodh.org"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
