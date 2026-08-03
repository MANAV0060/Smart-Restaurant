import React from 'react';
import { Lock, Tv, ChefHat, LayoutDashboard, X, ChevronRight } from 'lucide-react';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStaffView: (view: 'kitchen' | 'chef' | 'admin') => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectStaffView
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Restaurant Staff Portal</h3>
              <span className="text-xs text-slate-400">Authorized Kitchen & Management Console</span>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          <button
            onClick={() => {
              onSelectStaffView('kitchen');
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 group-hover:scale-105 transition-transform">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Kitchen Display System (KDS TV)</div>
                <div className="text-xs text-slate-400 mt-0.5">Large screen mode with AI Parallel Scheduler</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
          </button>

          <button
            onClick={() => {
              onSelectStaffView('chef');
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Executive Chef Touch Screen</div>
                <div className="text-xs text-slate-400 mt-0.5">Streamlined order checklist with allergy alerts</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </button>

          <button
            onClick={() => {
              onSelectStaffView('admin');
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Admin & QR Console</div>
                <div className="text-xs text-slate-400 mt-0.5">Menu CRUD, Table QR Generator & Live Analytics</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
