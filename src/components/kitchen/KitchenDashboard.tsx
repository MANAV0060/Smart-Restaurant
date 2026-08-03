import React, { useState } from 'react';
import { Order, OrderStatus, KDSQueueMode } from '../../types';
import { calculateAISchedule } from '../../services/store';
import { AISchedulerPanel } from './AISchedulerPanel';
import { Tv, Clock, ShieldAlert, Sparkles, CheckCircle2, XCircle, Play, Pause, AlertTriangle, ArrowUpDown, Volume2 } from 'lucide-react';

interface KitchenDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  queueMode: KDSQueueMode;
  onSetQueueMode: (mode: KDSQueueMode) => void;
}

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({
  orders,
  onUpdateStatus,
  queueMode,
  onSetQueueMode,
}) => {
  const [showAIScheduler, setShowAIScheduler] = useState(true);

  // Filter active kitchen orders
  let kitchenOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  // Sort according to selected algorithm
  if (queueMode === 'priority') {
    const priorityWeight = { red: 5, purple: 4, yellow: 3, blue: 2, green: 1 };
    kitchenOrders.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  } else if (queueMode === 'sjf') {
    kitchenOrders.sort((a, b) => a.estimatedPrepMinutes - b.estimatedPrepMinutes);
  } else if (queueMode === 'fifo') {
    kitchenOrders.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  const aiSuggestions = calculateAISchedule(orders);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* TV Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Kitchen Display System (KDS TV)</h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-xs text-slate-400">Live Kitchen Dispatch • Real-time Sync • Large Screen Mode</p>
          </div>
        </div>

        {/* Algorithm Queue Mode Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1 mr-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Queue Mode:
          </span>

          <button
            onClick={() => onSetQueueMode('ai_parallel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              queueMode === 'ai_parallel' 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Parallel
          </button>

          <button
            onClick={() => onSetQueueMode('fifo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              queueMode === 'fifo' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            FIFO
          </button>

          <button
            onClick={() => onSetQueueMode('priority')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              queueMode === 'priority' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Priority Queue
          </button>

          <button
            onClick={() => onSetQueueMode('sjf')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              queueMode === 'sjf' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            SJF (Shortest Job)
          </button>
        </div>
      </div>

      {/* AI Kitchen Parallel Schedule Panel */}
      {queueMode === 'ai_parallel' && (
        <AISchedulerPanel suggestions={aiSuggestions} />
      )}

      {/* Active Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kitchenOrders.length === 0 ? (
          <div className="col-span-full h-80 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-slate-500">
            <CheckCircle2 className="w-16 h-16 stroke-[1.5] text-emerald-500 mb-3" />
            <h3 className="text-xl font-bold text-slate-200">Kitchen Queue Clean!</h3>
            <p className="text-sm text-slate-400 mt-1">All orders cooked and served to customers.</p>
          </div>
        ) : (
          kitchenOrders.map((ord) => {
            const timeAgoMins = Math.floor((Date.now() - new Date(ord.timestamp).getTime()) / 60000);
            
            // Priority Border Color mapping
            const borderColors = {
              green: 'border-emerald-500 bg-slate-900',
              yellow: 'border-amber-500 bg-slate-900',
              blue: 'border-indigo-500 bg-slate-900',
              red: 'border-red-500 bg-red-950/20 shadow-red-500/10',
              purple: 'border-purple-500 bg-slate-900 shadow-purple-500/10',
            };

            return (
              <div 
                key={ord.id}
                className={`rounded-3xl border-2 p-5 shadow-2xl space-y-4 transition-all ${borderColors[ord.priority]}`}
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-white">Table {ord.tableNumber}</span>
                      {ord.isVIP && (
                        <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-500/40">
                          VIP GUEST
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-bold">{ord.orderNumber} • {ord.items.length} Dishes</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                      timeAgoMins > 15 ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-slate-800 text-slate-300'
                    }`}>
                      <Clock className="w-3.5 h-3.5" /> {timeAgoMins}m ago
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Est: ~{ord.estimatedPrepMinutes}m</span>
                  </div>
                </div>

                {/* URGENT ALLERGY ALERT BANNER */}
                {ord.allergyAlerts.length > 0 && (
                  <div className="bg-red-500/90 text-white p-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div>SAFETY ALLERGY ALERT!</div>
                      <div className="text-[11px] font-medium opacity-90">Avoid: {ord.allergyAlerts.join(', ')}</div>
                    </div>
                  </div>
                )}

                {/* Dish Items Checklist */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {ord.items.map((cartItem, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-sm">
                          <span className="text-orange-400 font-black mr-2">{cartItem.quantity}x</span>
                          {cartItem.menuItem.name}
                        </div>
                        {cartItem.specialInstructions && (
                          <div className="text-xs font-semibold text-amber-300 mt-0.5">
                            Note: "{cartItem.specialInstructions}"
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded-lg border border-slate-800">
                        {cartItem.menuItem.cookingTimeMinutes}m
                      </span>
                    </div>
                  ))}
                </div>

                {/* Special Notes */}
                {ord.specialNotes.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-200">
                    <strong>Instructions:</strong> {ord.specialNotes.join(', ')}
                  </div>
                )}

                {/* Kitchen Status Buttons */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                    <span>Current Status:</span>
                    <span className="text-orange-400 uppercase font-black">{ord.status}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onUpdateStatus(ord.id, 'cooking')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        ord.status === 'cooking' 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" /> Cooking
                    </button>

                    <button
                      onClick={() => onUpdateStatus(ord.id, 'ready')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        ord.status === 'ready' 
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Ready
                    </button>

                    <button
                      onClick={() => onUpdateStatus(ord.id, 'delivered')}
                      className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Serve
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
