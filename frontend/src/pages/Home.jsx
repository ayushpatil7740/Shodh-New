import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Package,
  Compass,
  Sparkles,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { itemService } from '../services/api';
import ItemCard from '../components/items/ItemCard';
import StatCard from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CATEGORIES } from '../utils/constants';

export const Home = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await itemService.getStatsSummary();
        if (res.data && res.data.success) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200/60">
        {/* Background decorative glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-brand-300/20 via-teal-300/20 to-blue-300/20 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Community-Driven Lost & Found Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
            Misplaced Something? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-700 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Shodh Connects & Reclaims.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A secure campus and community portal to report lost belongings, list items you found,
            and match verified claims with zero hassle.
          </p>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-elevated border border-slate-200/80 flex items-center space-x-2"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by keyword, item name, or location (e.g. MacBook, Library, Keys)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-2 text-sm bg-transparent border-0 focus:outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs shadow-brand-500/20"
            >
              Search
            </button>
          </form>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/report-lost"
              className="inline-flex items-center px-5 py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 transition hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="inline-flex items-center px-5 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Report Found Item
            </Link>
            <Link
              to="/items"
              className="inline-flex items-center px-5 py-3 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition"
            >
              <Compass className="w-4 h-4 mr-2 text-slate-400" />
              Browse All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Realtime Statistics Banner */}
      {statsData && statsData.stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Reported"
              value={statsData.stats.totalItems || 0}
              subtitle="Lost & Found listings"
              icon={Package}
              color="brand"
            />
            <StatCard
              title="Successfully Resolved"
              value={statsData.stats.totalResolved || 0}
              subtitle="Reunited with owners"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Recovery Rate"
              value={`${statsData.stats.resolutionRate || 0}%`}
              subtitle="Community resolution"
              icon={TrendingUp}
              color="blue"
            />
            <StatCard
              title="Community Members"
              value={statsData.stats.totalUsers || 0}
              subtitle="Active participants"
              icon={HeartHandshake}
              color="purple"
            />
          </div>
        </section>
      )}

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly jump to the category that matches your item
            </p>
          </div>
          <Link
            to="/items"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center"
          >
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((category) => {
            const count =
              statsData?.categoryBreakdown?.find((c) => c.category === category)?.count || 0;

            return (
              <Link
                key={category}
                to={`/items?category=${encodeURIComponent(category)}`}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 hover:border-brand-300 transition text-center group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-2.5 line-clamp-1 group-hover:text-brand-600">
                  {category}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{count} items</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Lost Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-800 mb-1">
              Urgent Help Needed
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recently Reported Lost Items
            </h2>
          </div>
          <Link
            to="/items?type=lost"
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center"
          >
            See all lost items <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching recent lost items..." />
        ) : statsData?.recentLost?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.recentLost.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No active lost items reported recently.
          </div>
        )}
      </section>

      {/* Recent Found Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 mb-1">
              Safe & Kept For Claiming
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Recently Found Items
            </h2>
          </div>
          <Link
            to="/items?type=found"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center"
          >
            See all found items <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching recent found items..." />
        ) : statsData?.recentFound?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.recentFound.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No active found items reported recently.
          </div>
        )}
      </section>

      {/* How Shodh Works 3-Step Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-8 sm:p-12 shadow-elevated">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How Shodh Portal Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              A transparent, 3-step verification system ensuring items are safely reclaimed by their rightful owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-black text-xl mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-white">Post with Details</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Submit an item with its landmark, category, and date. You can also add a secret verification question or reward.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xl mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-white">File & Review Proof</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Claimants provide identifying marks, photos, or answers to the secret question. The finder reviews the proof privately.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-white">Safe Handover</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Upon claim approval, verified contact details unlock. Both parties meet at a secure campus desk to complete the return.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
