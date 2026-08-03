import React from 'react';
import { Order, OrderStatus } from '../../types';
import { ShieldAlert, Clock, CheckCircle2, Play, Sparkles, UtensilsCrossed } from 'lucide-react';

interface ChefScreenViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const ChefScreenView: React.FC<ChefScreenViewProps> = ({ orders, onUpdateStatus }) => {
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-6">
      {/* Top Chef Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
            👨‍🍳
          </div>
          <div>
            <h1 className="text-2xl font-black">Executive Chef Station</h1>
            <p className="text-xs text-slate-400 font-semibold">Touch-Friendly Streamlined Kitchen Dispatch</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-orange-400">{activeOrders.length} Active</div>
          <div className="text-xs text-slate-500 font-bold">Real-Time Kitchen Sync</div>
        </div>
      </div>

      {/* Grid of Minimalist Touch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeOrders.length === 0 ? (
          <div className="col-span-full h-72 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-slate-500">
            <CheckCircle2 className="w-16 h-16 stroke-[1.5] text-emerald-500 mb-3" />
            <h3 className="text-xl font-bold text-slate-200">Executive Station Ready</h3>
            <p className="text-xs text-slate-400 mt-1">All orders prepped and served to guests.</p>
          </div>
        ) : (
          activeOrders.map(ord => {
            const timeMins = Math.floor((Date.now() - new Date(ord.timestamp).getTime()) / 60000);

            return (
              <div 
                key={ord.id}
                className={`p-6 rounded-3xl border-2 space-y-4 shadow-2xl transition-all ${
                  ord.allergyAlerts.length > 0 
                    ? 'border-red-500 bg-red-950/20' 
                    : ord.status === 'ready'
                    ? 'border-indigo-500 bg-slate-900 shadow-indigo-500/10'
                    : ord.status === 'cooking' 
                    ? 'border-emerald-500 bg-slate-900' 
                    : 'border-slate-800 bg-slate-900'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-3xl font-black text-white">Table {ord.tableNumber}</div>
                    <div className="text-xs font-bold text-orange-400 mt-0.5">{ord.orderNumber} • {ord.items.length} Items</div>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                      ord.status === 'cooking' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      ord.status === 'ready' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {ord.status}
                    </span>
                    <div className="text-xs text-slate-400 flex items-center justify-end gap-1 font-bold mt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {timeMins}m elapsed
                    </div>
                  </div>
                </div>

                {/* Prominent Allergy Warning */}
                {ord.allergyAlerts.length > 0 && (
                  <div className="bg-red-500 text-white p-3 rounded-2xl font-black text-sm flex items-center gap-3 animate-pulse">
                    <ShieldAlert className="w-6 h-6 flex-shrink-0" />
                    <span>ALLERGY WARNING: {ord.allergyAlerts.join(', ')}</span>
                  </div>
                )}

                {/* Items Checklist */}
                <div className="space-y-2">
                  {ord.items.map((ci, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <span className="text-base font-bold text-white">
                        <span className="text-orange-400 font-black mr-3">{ci.quantity}x</span>
                        {ci.menuItem.name}
                      </span>
                      {ci.specialInstructions && (
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                          "{ci.specialInstructions}"
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Big Touch Action Buttons */}
                <div className="pt-2 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'cooking')}
                    className={`py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                      ord.status === 'cooking' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Play className="w-4 h-4" /> Start Cooking
                  </button>

                  <button
                    onClick={() => onUpdateStatus(ord.id, 'ready')}
                    className={`py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                      ord.status === 'ready' 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> Mark Ready
                  </button>

                  <button
                    onClick={() => onUpdateStatus(ord.id, 'delivered')}
                    className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Serve Guest
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
