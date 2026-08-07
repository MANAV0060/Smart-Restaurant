import React, { useState } from 'react';
import { Lock, Tv, BarChart3, ChefHat, X, ChevronRight } from 'lucide-react';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole?: (role: 'admin' | 'kds' | 'chef') => void;
  onSelectStaffView?: (view: any) => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onSelectStaffView,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickEnter = (role: 'admin' | 'kds' | 'chef') => {
    if (onSelectRole) onSelectRole(role);
    if (onSelectStaffView) onSelectStaffView(role);
    onClose();
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === '0000' || pin === 'admin') {
      handleQuickEnter('admin');
    } else if (pin === '5678' || pin === 'kds') {
      handleQuickEnter('kds');
    } else if (pin === '9999' || pin === 'chef') {
      handleQuickEnter('chef');
    } else {
      setError('Invalid PIN. Use default pin: 1234 (Admin), 5678 (KDS), 9999 (Chef)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#FFFFFF] text-[#1C1917] border border-[#EADBBA] rounded-2xl p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EADBBA] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F48F68] text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1C1917] text-base">Bistro Staff Terminal</h3>
              <p className="text-[11px] text-[#78716C]">Authorized management access</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center text-xs transition-colors border border-[#EADBBA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Role Selectors */}
        <div className="space-y-2.5">
          <button
            onClick={() => handleQuickEnter('kds')}
            className="w-full p-3 rounded-xl bg-[#FFFDF7] hover:bg-[#FFF6DE] border border-[#EADBBA] flex items-center justify-between transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-[#8BDFDD]/20 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/30">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#1C1917]">Kitchen Display System (KDS)</div>
                <div className="text-[11px] text-[#78716C]">Live line tickets & parallel scheduler</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:text-[#F48F68] transition-colors" />
          </button>

          <button
            onClick={() => handleQuickEnter('chef')}
            className="w-full p-3 rounded-xl bg-[#FFFDF7] hover:bg-[#FFF6DE] border border-[#EADBBA] flex items-center justify-between transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-[#FFE394] text-[#1C1917] flex items-center justify-center border border-[#EADBBA]">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#1C1917]">Executive Chef Touch Screen</div>
                <div className="text-[11px] text-[#78716C]">Streamlined ticket touch fulfillment</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:text-[#F48F68] transition-colors" />
          </button>

          <button
            onClick={() => handleQuickEnter('admin')}
            className="w-full p-3 rounded-xl bg-[#FFFDF7] hover:bg-[#FFF6DE] border border-[#EADBBA] flex items-center justify-between transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-[#F48F68]/15 text-[#F48F68] flex items-center justify-center border border-[#F48F68]/30">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#1C1917]">Admin Manager & Analytics</div>
                <div className="text-[11px] text-[#78716C]">Menu management, QR export & sales</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:text-[#F48F68] transition-colors" />
          </button>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handlePinSubmit} className="space-y-3 pt-1 border-t border-[#EADBBA]">
          <div className="text-xs text-[#78716C] font-semibold">Or enter PIN code:</div>
          <div className="flex gap-2">
            <input 
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="e.g. 1234, 5678, 9999"
              className="flex-1 bg-[#FFFDF7] border border-[#EADBBA] rounded-lg px-3 py-2 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#F48F68]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs shadow-xs"
            >
              Verify
            </button>
          </div>
          {error && (
            <p className="text-[11px] text-rose-600 font-semibold">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};
