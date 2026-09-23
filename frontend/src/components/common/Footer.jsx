import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, HeartHandshake, PhoneCall, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">शोध Shodh</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A community-driven lost and found platform engineered to reunite people with their misplaced belongings safely and securely.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus & Community Safety First</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/items" className="hover:text-white transition">All Listings</Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-rose-400 transition">Report Lost Item</Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-emerald-400 transition">Report Found Item</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Safety & Guidelines</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                <span>Always meet in public, well-lit campus areas for handovers.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                <span>Verify item serial numbers, photos, or secret questions before returning.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                <span>Never share banking passwords or OTPs for rewards.</span>
              </li>
            </ul>
          </div>

          {/* Campus Desk & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Central Desk Support</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>support@shodh.org</span>
              </p>
              <p className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>+91 (0) 1234-567890 (Campus Helpline)</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-2">
                Central Security Office, Student Center Level 1, Open 24/7 for high-value handover safekeeping.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Shodh Portal. Built with MERN Stack for Field Visit & Community Safety.</p>
          <p className="text-slate-400">Developed with Pair-Programming & Clean Architecture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
