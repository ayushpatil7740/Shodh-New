import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, Award, Sparkles, Gift } from 'lucide-react';
import { StatusBadge, TypeBadge, CategoryBadge } from '../common/Badge';
import { formatDate, resolveImageUrl, getCategoryGradient } from '../../utils/formatters';

export const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const imageUrl = resolveImageUrl(item.imageUrl);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(
              item.category
            )} flex flex-col items-center justify-center text-white p-4`}
          >
            <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl mb-2 shadow-xs">
              <Sparkles className="w-8 h-8 text-white/90" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {item.category}
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <TypeBadge type={item.type} />
          <StatusBadge status={item.status} />
        </div>

        {/* Reward Tag */}
        {item.reward && (
          <div className="absolute bottom-3 left-3 bg-amber-500/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center shadow-md">
            <Gift className="w-3.5 h-3.5 mr-1" />
            <span>Reward: {item.reward}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CategoryBadge category={item.category} />
          </div>

          <Link to={`/items/${item._id}`} className="block group-hover:text-brand-600 transition">
            <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-brand-600 transition">
              {item.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center text-slate-600">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
            <span className="truncate">{item.location?.placeName || 'Campus'}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center text-slate-500">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{formatDate(item.dateLostOrFound)}</span>
            </div>

            <div className="flex items-center text-slate-400">
              <Eye className="w-3 h-3 mr-1" />
              <span>{item.viewsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
