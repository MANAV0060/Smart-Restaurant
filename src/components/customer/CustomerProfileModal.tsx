import React from 'react';
import { Order, MenuItem } from '../../types';
import { User, Award, Heart, History, X } from 'lucide-react';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  favorites: MenuItem[];
  savedAllergies: string[];
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  orders,
  favorites,
  savedAllergies
}) => {
  if (!isOpen) return null;

  const loyaltyPoints = orders.length * 150 + 200;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#14171d] text-[#FFF6DE] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#101318] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#8BDFDD]/15 text-[#8BDFDD] flex items-center justify-center border border-[#8BDFDD]/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#FFF6DE] text-base">Guest Dining Profile</h3>
              <span className="text-[11px] text-[#FFE394]">VIP Bistro Dining Member</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-md bg-[#1a1e27] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 bg-[#0e1014]">
          {/* Rewards Card */}
          <div className="bg-[#14171d] p-4 rounded-xl border border-white/[0.08] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFE394]/15 text-[#FFE394] flex items-center justify-center border border-[#FFE394]/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Bistro Loyalty Points</div>
                <div className="text-lg font-bold text-[#FFE394] font-serif">{loyaltyPoints} Pts</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#F48F68] bg-[#F48F68]/15 px-2.5 py-1 rounded border border-[#F48F68]/30">
              Gold Tier
            </span>
          </div>

          {/* Favorite Items */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#FFF6DE] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#F48F68]" /> Saved Dishes ({favorites.length})
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
              {favorites.map((fav) => (
                <div key={fav.id} className="bg-[#14171d] p-2 rounded-lg border border-white/[0.06] flex items-center gap-2">
                  <img src={fav.image} alt={fav.name} className="w-8 h-8 rounded object-cover" />
                  <div className="truncate">
                    <div className="font-semibold text-xs text-[#FFF6DE] truncate">{fav.name}</div>
                    <div className="text-[10px] text-[#FFE394] font-bold">₹{fav.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Allergies */}
          {savedAllergies.length > 0 && (
            <div className="p-3 bg-[#14171d] rounded-lg border border-white/[0.06] space-y-1">
              <div className="text-xs font-semibold text-[#F48F68]">Active Dietary Safeguards:</div>
              <div className="text-xs text-slate-300">{savedAllergies.join(', ')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
