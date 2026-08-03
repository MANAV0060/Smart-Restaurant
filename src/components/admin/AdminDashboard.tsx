import React, { useState } from 'react';
import { Order, MenuItem } from '../../types';
import { AnalyticsView } from './AnalyticsView';
import { MenuManager } from './MenuManager';
import { QRCodeGeneratorModal } from './QRCodeGeneratorModal';
import { LayoutDashboard, Utensils, QrCode, BarChart3, Users, Settings } from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: MenuItem[];
  onSaveMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  menuItems,
  onSaveMenuItem,
  onDeleteMenuItem,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'menu'>('analytics');
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Admin Top Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">GourmetVerse Admin Console</h1>
            <p className="text-xs text-slate-400 font-semibold">Restaurant Intelligence, Menu CRUD & Table Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'analytics' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Live Analytics
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'menu' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Utensils className="w-4 h-4" /> Menu Manager
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold text-xs flex items-center gap-2 border border-slate-700"
          >
            <QrCode className="w-4 h-4" /> Generate Table QRs
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'analytics' ? (
        <AnalyticsView orders={orders} menuItems={menuItems} />
      ) : (
        <MenuManager 
          menuItems={menuItems} 
          onSaveMenuItem={onSaveMenuItem} 
          onDeleteMenuItem={onDeleteMenuItem} 
        />
      )}

      {/* QR Code Modal */}
      <QRCodeGeneratorModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </div>
  );
};
