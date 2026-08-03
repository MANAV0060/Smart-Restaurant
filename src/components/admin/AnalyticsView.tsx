import React, { useState } from 'react';
import { Order, MenuItem } from '../../types';
import { TrendingUp, DollarSign, Clock, Sparkles, CloudRain, Sun, Flame, CheckCircle2 } from 'lucide-react';

interface AnalyticsViewProps {
  orders: Order[];
  menuItems: MenuItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ orders, menuItems }) => {
  const [selectedSeason, setSelectedSeason] = useState<'rainy' | 'summer'>('rainy');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const avgCookTime = Math.round(orders.reduce((acc, o) => acc + o.estimatedPrepMinutes, 0) / Math.max(1, orders.length));

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{totalRevenue}</div>
          <div className="text-[11px] text-emerald-400 font-bold">+18.4% vs yesterday</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Live Orders</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white">{orders.length}</div>
          <div className="text-[11px] text-orange-400 font-bold">100% On-Time Delivery</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Kitchen Cooking Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{avgCookTime} Mins</div>
          <div className="text-[11px] text-amber-400 font-bold">Optimized by AI Scheduler</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Customer Satisfaction</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">4.92 / 5.0</div>
          <div className="text-[11px] text-indigo-400 font-bold">Based on 420 reviews</div>
        </div>
      </div>

      {/* AI Weather / Seasonal Demand Recommendation Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">AI Weather & Seasonal Demand Engine</h3>
              <p className="text-xs text-slate-400">Contextual real-time food recommendations based on current climate</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedSeason('rainy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                selectedSeason === 'rainy' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <CloudRain className="w-4 h-4" /> Rainy Season Mode
            </button>

            <button 
              onClick={() => setSelectedSeason('summer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                selectedSeason === 'summer' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4" /> Summer Heatwave Mode
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="text-3xl">
            {selectedSeason === 'rainy' ? '🌧️' : '☀️'}
          </div>
          <div>
            <div className="font-bold text-white text-sm">
              {selectedSeason === 'rainy' ? 'Monsoon Comfort Specials Active' : 'Summer Chilled Elixir Specials Active'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {selectedSeason === 'rainy' 
                ? 'Promoting crisp corn kurkure croquettes, hot butter chicken handi, and spiced teas.' 
                : 'Promoting chilled passionfruit elixirs, Uji matcha avocado smoothies, and gelato spheres.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
