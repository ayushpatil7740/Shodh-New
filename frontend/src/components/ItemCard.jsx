import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowUpRight, CheckCircle } from 'lucide-react';

export default function ItemCard({ item }) {
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.itemName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type Badge (Lost vs Found) */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-xs ${
              isLost
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'Lost' : 'Found'}
          </span>
          {isResolved && (
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center shadow-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Reunited
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-xs text-slate-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs">
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.itemName}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Metadata: Location & Date */}
          <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <div className="flex items-center text-slate-600">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-500 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                <span>{item.date}</span>
              </div>
              {item.time && (
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                  <span>{item.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <Link
            to={`/item/${item.id}`}
            className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-semibold transition-all duration-200 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white cursor-pointer"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
