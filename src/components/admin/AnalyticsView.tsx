import React from 'react';
import { Order, MenuItem } from '../../types';
import { DollarSign, ShoppingBag, TrendingUp, Users, Clock, Award } from 'lucide-react';

interface AnalyticsViewProps {
  orders: Order[];
  menuItems: MenuItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ orders, menuItems }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalCompletedOrders = orders.filter(o => o.status === 'delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const activeVIPOrders = orders.filter(o => o.isVIP).length;

  return (
    <div className="space-y-4 sm:space-y-5 font-sans select-none text-[#1C1917]">
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold">
            <span>Total Sales Revenue</span>
            <div className="w-7 h-7 rounded-md bg-[#8BDFDD]/20 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/30">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">₹{totalRevenue}</div>
          <div className="text-[11px] text-[#309694] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this week
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold">
            <span>Completed Orders</span>
            <div className="w-7 h-7 rounded-md bg-[#F48F68]/15 text-[#F48F68] flex items-center justify-center border border-[#F48F68]/30">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">{orders.length}</div>
          <div className="text-[11px] text-[#78716C]">{totalCompletedOrders} served successfully</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold">
            <span>Average Order Value</span>
            <div className="w-7 h-7 rounded-md bg-[#FFE394] text-[#1C1917] flex items-center justify-center border border-[#EADBBA]">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">₹{avgOrderValue}</div>
          <div className="text-[11px] text-[#78716C]">Per dining table check</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold">
            <span>VIP Guest Guests</span>
            <div className="w-7 h-7 rounded-md bg-[#8BDFDD]/20 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/30">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">{activeVIPOrders} Tables</div>
          <div className="text-[11px] text-[#78716C]">Priority culinary routing</div>
        </div>
      </div>

      {/* Top Best-Selling Dishes */}
      <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm">
        <h3 className="font-serif font-bold text-[#1C1917] text-base">Top Performing Dishes & 3D Engagement</h3>
        <div className="space-y-2">
          {menuItems.slice(0, 5).map((dish, i) => (
            <div key={dish.id} className="p-3 bg-[#FFFDF7] rounded-lg border border-[#EADBBA] flex items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-sm text-[#F48F68] w-5 text-center">#{i + 1}</span>
                <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-md object-cover" />
                <div>
                  <div className="font-bold text-[#1C1917]">{dish.name}</div>
                  <div className="text-[11px] text-[#78716C]">₹{dish.price} • {dish.category}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-[#309694]">{95 - i * 6}% Order Conversion</div>
                <div className="text-[10px] text-[#78716C]">3D Previewed 420+ times</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
