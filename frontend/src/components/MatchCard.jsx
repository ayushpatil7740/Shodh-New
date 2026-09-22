import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

export default function MatchCard({ match }) {
  const { item, matchScore, matchPercentage, reasons = [] } = match;

  // Determine badge color tone based on match percentage
  const getBadgeColors = (score) => {
    if (score >= 70) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (score >= 45) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const isLost = item.type === 'lost';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col md:flex-row group">
      {/* Item Image */}
      <div className="md:w-48 h-44 md:h-auto shrink-0 relative bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.itemName}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <div className="absolute top-2 left-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isLost
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Match Score Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColors(
                matchScore
              )}`}
            >
              Possible Match — {matchPercentage || `${matchScore}%`}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Category: {item.category}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
            {item.itemName}
          </h4>

          {/* Location and Date */}
          <div className="mt-2.5 space-y-1 text-xs text-slate-600">
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {isLost ? 'Lost at: ' : 'Found near: '}
                <strong className="text-slate-800 font-medium">{item.location}</strong>
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
              <span>
                {isLost ? 'Lost on: ' : 'Found on: '}
                <strong className="text-slate-800 font-medium">{item.date}</strong>
              </span>
            </div>
          </div>

          {/* Match criteria pills */}
          {reasons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {reasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                  {reason}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 flex items-center">
            <ShieldAlert className="w-3 h-3 mr-1 text-amber-500 shrink-0" />
            Please inspect and verify details
          </p>
          <Link
            to={`/item/${item.id}`}
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition group/btn"
          >
            <span>View & Verify</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
