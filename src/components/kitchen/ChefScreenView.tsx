import React from 'react';
import { Order, OrderStatus } from '../../types';
import { ShieldAlert, Clock, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface ChefScreenViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const ChefScreenView: React.FC<ChefScreenViewProps> = ({ orders, onUpdateStatus }) => {
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-[#FFF6DE] text-[#1C1917] p-3 sm:p-6 space-y-4 sm:space-y-5 font-sans select-none pb-20">
      {/* Top Chef Header */}
      <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F48F68] text-white font-bold flex items-center justify-center text-xl shadow-xs">
            👨‍🍳
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">Executive Chef Touch Station</h1>
            <p className="text-xs text-[#78716C]">Streamlined touch checklist with instant allergy safeguards</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg sm:text-xl font-bold text-[#F48F68] font-serif">{activeOrders.length} Active Tickets</div>
          <div className="text-[11px] text-[#78716C]">Live KDS Synchronization</div>
        </div>
      </div>

      {/* Grid of Minimalist Touch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {activeOrders.length === 0 ? (
          <div className="col-span-full h-72 bg-[#FFFFFF] rounded-xl border border-[#EADBBA] flex flex-col items-center justify-center text-[#78716C] shadow-xs">
            <CheckCircle2 className="w-12 h-12 stroke-[1.5] text-[#309694] mb-2.5" />
            <h3 className="text-base font-bold text-[#1C1917]">Chef Station Clear</h3>
            <p className="text-xs text-[#78716C] mt-0.5">All dishes have been prepared and served to dining tables.</p>
          </div>
        ) : (
          activeOrders.map(ord => {
            const timeMins = Math.floor((Date.now() - new Date(ord.timestamp).getTime()) / 60000);

            return (
              <div 
                key={ord.id}
                className="p-5 rounded-xl border border-[#EADBBA] bg-[#FFFFFF] space-y-4 shadow-sm transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBBA]">
                  <div>
                    <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">Table {ord.tableNumber}</div>
                    <div className="text-xs font-semibold text-[#F48F68] mt-0.5">#{ord.orderNumber} • {ord.items.length} Items</div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                      ord.status === 'cooking' ? 'bg-[#8BDFDD]/25 text-[#1C1917] border border-[#8BDFDD]' :
                      ord.status === 'ready' ? 'bg-[#FFE394] text-[#1C1917] border border-[#EADBBA]' :
                      'bg-[#FFF6DE] text-[#1C1917] border border-[#EADBBA]'
                    }`}>
                      {ord.status}
                    </span>
                    <div className="text-xs text-[#78716C] flex items-center justify-end gap-1 font-medium mt-1">
                      <Clock className="w-3 h-3 text-[#F48F68]" /> {timeMins}m elapsed
                    </div>
                  </div>
                </div>

                {/* Prominent Allergy Warning */}
                {ord.allergyAlerts.length > 0 && (
                  <div className="bg-[#F48F68]/15 text-[#F48F68] p-2.5 rounded-md font-semibold text-xs flex items-center gap-2 border border-[#F48F68]/30">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>ALLERGY WARNING: {ord.allergyAlerts.join(', ')}</span>
                  </div>
                )}

                {/* Items Checklist */}
                <div className="space-y-1.5">
                  {ord.items.map((ci, idx) => (
                    <div key={idx} className="bg-[#FFFDF7] p-2.5 rounded-md border border-[#EADBBA] flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1C1917]">
                        <span className="text-[#F48F68] font-bold mr-2">{ci.quantity}x</span>
                        {ci.menuItem.name}
                      </span>
                      {ci.specialInstructions && (
                        <span className="text-xs font-medium text-[#309694] bg-[#8BDFDD]/15 px-2 py-0.5 rounded border border-[#8BDFDD]/30">
                          "{ci.specialInstructions}"
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Touch Action Buttons */}
                <div className="pt-1 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateStatus(ord.id, 'cooking')}
                    className={`py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs ${
                      ord.status === 'cooking' 
                        ? 'bg-[#8BDFDD] text-[#1C1917]' 
                        : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" /> Start Cook
                  </button>

                  <button
                    onClick={() => onUpdateStatus(ord.id, 'ready')}
                    className={`py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs ${
                      ord.status === 'ready' 
                        ? 'bg-[#FFE394] text-[#1C1917]' 
                        : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Mark Ready
                  </button>

                  <button
                    onClick={() => onUpdateStatus(ord.id, 'delivered')}
                    className="py-2.5 rounded-md bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Serve Table
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
