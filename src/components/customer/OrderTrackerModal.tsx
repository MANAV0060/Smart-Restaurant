import React, { useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { Clock, CheckCircle2, ChefHat, UtensilsCrossed, Sparkles, Bell, X, ShieldAlert } from 'lucide-react';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
}

const STAGES: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  { status: 'received', label: 'Order Received', desc: 'Sent directly to Kitchen Display System', icon: Bell },
  { status: 'cooking', label: 'Master Chef Cooking', desc: 'Ingredients prepped & cooking on fire', icon: ChefHat },
  { status: 'plating', label: 'Gourmet Plating', desc: 'Artisanal garnish & quality inspection', icon: UtensilsCrossed },
  { status: 'ready', label: 'Ready for Service', desc: 'Hot & fresh on kitchen pickup pass', icon: Sparkles },
  { status: 'serving', label: 'En Route to Table', desc: 'Waiter serving to Table', icon: CheckCircle2 },
  { status: 'delivered', label: 'Delivered & Served', desc: 'Bon Appétit! Enjoy your culinary meal.', icon: CheckCircle2 },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const currentStageIndex = STAGES.findIndex(s => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Live Status: {order.status.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Table {order.tableNumber}</span>
            </div>
            <h3 className="font-extrabold text-white text-lg mt-1">Order {order.orderNumber}</h3>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Queue Banner */}
        <div className="p-4 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-orange-500/30">
              #{order.queuePosition}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Kitchen Queue Position</div>
              <div className="text-[11px] text-slate-400">Estimated Waiting Time: ~{order.estimatedPrepMinutes} Mins</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-orange-400 font-sans">₹{order.totalAmount}</span>
            <div className="text-[10px] text-slate-500">{order.items.length} Items Ordered</div>
          </div>
        </div>

        {/* Timeline Progression */}
        <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
          {STAGES.map((stage, idx) => {
            const isPassed = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="relative flex items-start gap-4">
                {/* Vertical connecting line */}
                {idx < STAGES.length - 1 && (
                  <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                    idx < currentStageIndex ? 'bg-orange-500' : 'bg-slate-800'
                  }`} />
                )}

                {/* Status Dot/Icon */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCurrent 
                    ? 'bg-orange-500 text-white ring-4 ring-orange-500/30 animate-pulse' 
                    : isPassed 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-sm ${isPassed ? 'text-white' : 'text-slate-500'}`}>
                      {stage.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">
                        ACTIVE STAGE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Item Brief */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-400 mb-2">Dishes in this Order</div>
          <div className="flex flex-wrap gap-2">
            {order.items.map((item, idx) => (
              <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-xl">
                {item.quantity}x {item.menuItem.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
