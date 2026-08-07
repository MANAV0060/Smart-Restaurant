import React from 'react';
import { Order, OrderStatus, KDSQueueMode } from '../../types';
import { calculateAISchedule } from '../../services/store';
import { AISchedulerPanel } from './AISchedulerPanel';
import { Tv, Clock, ShieldAlert, Sparkles, CheckCircle2, Play, ArrowUpDown } from 'lucide-react';

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
  let kitchenOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

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
    <div className="min-h-screen bg-[#FFF6DE] text-[#1C1917] p-3 sm:p-6 space-y-4 sm:space-y-5 font-sans select-none pb-20">
      {/* Header Bar */}
      <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F48F68] text-white font-bold flex items-center justify-center text-lg shadow-xs">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">Kitchen Display System (KDS)</h1>
              <span className="w-2 h-2 rounded-full bg-[#309694]"></span>
            </div>
            <p className="text-xs text-[#78716C]">Live Kitchen Dispatch • Real-time Sync • Station Terminal</p>
          </div>
        </div>

        {/* Algorithm Queue Mode Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-[#78716C] font-semibold flex items-center gap-1 mr-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#309694]" /> Queue:
          </span>

          <button
            onClick={() => onSetQueueMode('ai_parallel')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              queueMode === 'ai_parallel' 
                ? 'bg-[#F48F68] text-white font-bold' 
                : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Parallel Scheduler
          </button>

          <button
            onClick={() => onSetQueueMode('fifo')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-2xs ${
              queueMode === 'fifo' 
                ? 'bg-[#F48F68] text-white font-bold' 
                : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
            }`}
          >
            FIFO
          </button>

          <button
            onClick={() => onSetQueueMode('priority')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-2xs ${
              queueMode === 'priority' 
                ? 'bg-[#F48F68] text-white font-bold' 
                : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
            }`}
          >
            Priority
          </button>

          <button
            onClick={() => onSetQueueMode('sjf')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-2xs ${
              queueMode === 'sjf' 
                ? 'bg-[#F48F68] text-white font-bold' 
                : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
            }`}
          >
            SJF
          </button>
        </div>
      </div>

      {/* AI Kitchen Parallel Schedule Panel */}
      {queueMode === 'ai_parallel' && (
        <AISchedulerPanel suggestions={aiSuggestions} />
      )}

      {/* Active Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {kitchenOrders.length === 0 ? (
          <div className="col-span-full h-72 bg-[#FFFFFF] rounded-xl border border-[#EADBBA] flex flex-col items-center justify-center text-[#78716C] shadow-xs">
            <CheckCircle2 className="w-12 h-12 stroke-[1.5] text-[#309694] mb-2.5" />
            <h3 className="text-base font-bold text-[#1C1917]">Kitchen Line Clean</h3>
            <p className="text-xs text-[#78716C] mt-0.5">All active tickets have been prepared and served.</p>
          </div>
        ) : (
          kitchenOrders.map((ord) => {
            const timeAgoMins = Math.floor((Date.now() - new Date(ord.timestamp).getTime()) / 60000);

            return (
              <div 
                key={ord.id}
                className="rounded-xl border border-[#EADBBA] bg-[#FFFFFF] p-4 sm:p-5 space-y-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-[#EADBBA] pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-serif font-bold text-[#1C1917]">Table {ord.tableNumber}</span>
                      {ord.isVIP && (
                        <span className="bg-[#FFE394] text-[#1C1917] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#EADBBA]">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#78716C] font-medium">#{ord.orderNumber} • {ord.items.length} Dishes</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 bg-[#FFF6DE] text-[#1C1917] border border-[#EADBBA]">
                      <Clock className="w-3 h-3 text-[#F48F68]" /> {timeAgoMins}m ago
                    </div>
                    <span className="text-[10px] text-[#78716C] font-medium block mt-0.5">Est: ~{ord.estimatedPrepMinutes}m</span>
                  </div>
                </div>

                {/* Allergy Alert */}
                {ord.allergyAlerts.length > 0 && (
                  <div className="bg-[#F48F68]/15 text-[#F48F68] p-2.5 rounded-md font-semibold text-xs flex items-center gap-2 border border-[#F48F68]/30">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <div>ALLERGY ALERT: Avoid {ord.allergyAlerts.join(', ')}</div>
                  </div>
                )}

                {/* Dish Items Checklist */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {ord.items.map((cartItem, idx) => (
                    <div key={idx} className="bg-[#FFFDF7] p-2.5 rounded-md border border-[#EADBBA] flex items-start justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-[#1C1917]">
                          <span className="text-[#F48F68] font-bold mr-1.5">{cartItem.quantity}x</span>
                          {cartItem.menuItem.name}
                        </div>
                        {cartItem.specialInstructions && (
                          <div className="text-[11px] font-medium text-[#309694] mt-0.5">
                            Note: "{cartItem.specialInstructions}"
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-[#78716C] bg-[#FFF6DE] px-1.5 py-0.5 rounded border border-[#EADBBA] flex-shrink-0">
                        {cartItem.menuItem.cookingTimeMinutes}m
                      </span>
                    </div>
                  ))}
                </div>

                {/* Kitchen Status Buttons */}
                <div className="pt-2 border-t border-[#EADBBA] space-y-2">
                  <div className="text-[11px] font-semibold text-[#78716C] flex items-center justify-between">
                    <span>Status:</span>
                    <span className="text-[#F48F68] uppercase font-bold">{ord.status}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onUpdateStatus(ord.id, 'cooking')}
                      className={`py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs ${
                        ord.status === 'cooking' 
                          ? 'bg-[#8BDFDD] text-[#1C1917] font-bold border border-[#8BDFDD]' 
                          : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
                      }`}
                    >
                      <Play className="w-3 h-3" /> Cooking
                    </button>

                    <button
                      onClick={() => onUpdateStatus(ord.id, 'ready')}
                      className={`py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs ${
                        ord.status === 'ready' 
                          ? 'bg-[#FFE394] text-[#1C1917] font-bold border border-[#FFE394]' 
                          : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" /> Ready
                    </button>

                    <button
                      onClick={() => onUpdateStatus(ord.id, 'delivered')}
                      className="py-2 rounded-md bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Served
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
