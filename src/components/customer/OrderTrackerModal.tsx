import React from 'react';
import { Order } from '../../types';
import { Clock, CheckCircle2, X } from 'lucide-react';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const STEPS = [
    { key: 'received', title: 'Order Received', desc: 'Sent to Kitchen Display' },
    { key: 'cooking', title: 'Culinary Preparation', desc: 'Chef station crafting dishes' },
    { key: 'ready', title: 'Plated & Ready', desc: 'Garnished for table dispatch' },
    { key: 'delivered', title: 'Served at Table', desc: 'Enjoy your dining experience' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'received': return 0;
      case 'cooking': return 1;
      case 'ready': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentIdx = getStepIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#14171d] text-[#FFF6DE] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#101318] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#F48F68]/15 text-[#F48F68] flex items-center justify-center border border-[#F48F68]/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#FFF6DE] text-base">Order #{order.orderNumber}</h3>
              <span className="text-[11px] text-[#FFE394]">Table {order.tableNumber} • Real-time Tracker</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-md bg-[#1a1e27] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone Stepper */}
        <div className="p-5 space-y-4 bg-[#0e1014]">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="flex items-start gap-3 relative">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCurrent 
                    ? 'bg-[#F48F68] text-slate-950 ring-4 ring-[#F48F68]/20' 
                    : isCompleted 
                    ? 'bg-[#8BDFDD] text-slate-950' 
                    : 'bg-[#14171d] text-slate-500 border border-white/[0.08]'
                }`}>
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex-1">
                  <div className={`text-xs font-bold ${isCompleted ? 'text-[#FFF6DE]' : 'text-slate-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400">{step.desc}</div>
                </div>
              </div>
            );
          })}

          {/* Itemized Order List */}
          <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
            <div className="text-[11px] font-semibold text-[#FFE394] uppercase tracking-wider">Ordered Items:</div>
            {order.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-300">
                <span>{it.quantity}x {it.menuItem.name}</span>
                <span className="font-semibold text-[#FFF6DE]">₹{it.menuItem.price * it.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#101318] border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-400">Total Paid: <strong className="text-[#FFE394]">₹{order.totalAmount}</strong></div>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#F48F68] hover:bg-[#f27c50] text-slate-950 font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
