import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ItemGrid from '../components/ItemGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getItems } from '../services/api';
import { ArrowRight, Search, ShieldCheck, Zap, HeartHandshake, Compass } from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getItems();
      if (response && response.data) {
        setItems(response.data);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Unable to load items from server. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const lostItems = items.filter((item) => item.type === 'lost');
  const foundItems = items.filter((item) => item.type === 'found');
  const recentItems = items.slice(0, 4);

  const stats = {
    total: items.length,
    lost: lostItems.length,
    found: foundItems.length
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero stats={stats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Error Alert if any */}
        {error && <ErrorMessage message={error} onRetry={fetchItems} />}

        {/* Recently Reported Items Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <Zap className="w-3.5 h-3.5 mr-1" />
                Latest Updates
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recently Reported Items
              </h2>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>View all ({items.length})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <ItemGrid
            items={recentItems}
            isLoading={isLoading}
            emptyTitle="No recent reports"
            emptyDescription="Be the first to report a lost or found item."
          />
        </section>

        {/* Lost Items Section */}
        <section className="bg-rose-50/40 border border-rose-100/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Lost Items
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Have you seen any of these?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Items reported missing by their owners. Help them recover their belongings.
              </p>
            </div>
            <Link
              to="/browse?type=lost"
              className="inline-flex items-center text-sm font-semibold text-rose-700 hover:text-rose-900 transition"
            >
              <span>Browse all lost items ({lostItems.length})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <ItemGrid
            items={lostItems.slice(0, 4)}
            isLoading={isLoading}
            emptyTitle="No lost items reported"
            emptyDescription="Currently there are no active lost item reports."
          />
        </section>

        {/* Found Items Section */}
        <section className="bg-emerald-50/40 border border-emerald-100/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Found Items
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Found items awaiting owners
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Items discovered on campus and safely kept. Check if any belong to you.
              </p>
            </div>
            <Link
              to="/browse?type=found"
              className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition"
            >
              <span>Browse all found items ({foundItems.length})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <ItemGrid
            items={foundItems.slice(0, 4)}
            isLoading={isLoading}
            emptyTitle="No found items reported"
            emptyDescription="Currently there are no active found items."
          />
        </section>

        {/* How It Works Section */}
        <section className="py-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How Lost & Found Works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              A simple, 3-step process designed to safely reunite lost belongings with campus students and staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center relative group hover:border-indigo-300 transition">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-xl font-black group-hover:scale-110 transition">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Report Your Item</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Submit details such as category, location, date, description, and an optional photo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center relative group hover:border-indigo-300 transition">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-4 text-xl font-black group-hover:scale-110 transition">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Matching</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our algorithm scores category, name, location, and date to instantly suggest possible matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center relative group hover:border-indigo-300 transition">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl font-black group-hover:scale-110 transition">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connect & Reunite</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Verify the matching details, reach out via secure contact info, and claim your belongings safely.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
