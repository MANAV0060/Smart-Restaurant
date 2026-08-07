import React, { useState } from 'react';
import { MenuItem, Order } from '../../types';
import { MenuManager } from './MenuManager';
import { AnalyticsView } from './AnalyticsView';
import { QRCodeGeneratorModal } from './QRCodeGeneratorModal';
import { BarChart3, Utensils, QrCode, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  orders: Order[];
  onSaveMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onExit?: () => void;
  onResetMenu?: () => void;
  restaurantName?: string;
  totalTables?: number;
  onAddTable?: () => void;
  onRemoveTable?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  menuItems,
  orders,
  onSaveMenuItem,
  onDeleteMenuItem,
  onExit = () => {},
  onResetMenu,
  restaurantName = "The Royal Gourmet Bistro",
  totalTables = 5,
  onAddTable,
  onRemoveTable,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'menu'>('analytics');
  const [isQROpen, setIsQROpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF6DE] text-[#1C1917] p-3 sm:p-6 space-y-4 sm:space-y-5 font-sans select-none pb-20">
      {/* Top Header */}
      <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] transition-colors shadow-2xs"
            title="Return to Menu"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">{restaurantName} — Management</h1>
            <p className="text-xs text-[#78716C]">Executive Manager Portal • Analytics & Dynamic Catalog</p>
          </div>
        </div>

        {/* Tab Switcher & QR Modal Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              activeTab === 'analytics' 
                ? 'bg-[#F48F68] text-white font-bold' 
                : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              activeTab === 'menu' 
                ? 'bg-[#F48F68] text-white font-bold' 
                : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Menu Manager
          </button>

          <button
            onClick={() => setIsQROpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#8BDFDD]/20 hover:bg-[#8BDFDD]/35 text-[#309694] border border-[#8BDFDD]/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5" /> Table QR Codes
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'analytics' ? (
        <AnalyticsView orders={orders} menuItems={menuItems} />
      ) : (
        <MenuManager 
          menuItems={menuItems} 
          onSaveMenuItem={onSaveMenuItem} 
          onDeleteMenuItem={onDeleteMenuItem} 
        />
      )}

      {/* QR Modal */}
      <QRCodeGeneratorModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        totalTables={totalTables}
        restaurantName={restaurantName}
        onAddTable={onAddTable}
        onRemoveTable={onRemoveTable}
      />
    </div>
  );
};
