import React from 'react';
import { UserProfile, Order, MenuItem } from '../../types';
import { Award, Gift, Heart, ShieldAlert, Clock, Sparkles, User, X, CheckCircle2, ChevronRight } from 'lucide-react';

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

  const mockUser: UserProfile = {
    name: 'Alex Mercer',
    email: 'alex.mercer@gourmetverse.com',
    phone: '+1 (555) 019-2834',
    savedAllergies: savedAllergies as any,
    preferences: ['Spicy Food', 'High Protein', 'Gluten Free Option'],
    loyaltyPoints: 1250,
    unlockedBadges: [
      { id: 'b1', name: 'Food Explorer', icon: '🧭', description: 'Tried dishes from 5 distinct culinary categories', dateUnlocked: '2026-07-28' },
      { id: 'b2', name: 'Burger Connoisseur', icon: '🍔', description: 'Ordered Wagyu Smash Burger 3 times', dateUnlocked: '2026-08-01' },
      { id: 'b3', name: 'VIP Diner', icon: '👑', description: 'Spent over ₹3000 at GourmetVerse', dateUnlocked: '2026-08-03' },
    ],
    orderHistory: orders,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale-up">
        {/* Profile Banner */}
        <div className="p-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-black shadow-xl">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{mockUser.name}</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  VIP LEVEL 3
                </span>
              </div>
              <p className="text-xs text-orange-100 mt-0.5">{mockUser.email}</p>
            </div>
          </div>

          {/* Points HUD */}
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold text-orange-100">Gourmet Rewards Points:</span>
              <span className="text-lg font-black text-amber-300">{mockUser.loyaltyPoints} PTS</span>
            </div>

            <span className="text-xs text-white/80 font-medium">₹100 = 10 PTS</span>
          </div>
        </div>

        {/* Modal Tabs Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Gamification Badges */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Unlocked Culinary Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mockUser.unlockedBadges.map(b => (
                <div key={b.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <div className="font-bold text-white text-xs">{b.name}</div>
                    <div className="text-[10px] text-slate-400">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Allergy Safeguards */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Saved Allergy Protection Profile
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedAllergies.length > 0 ? (
                savedAllergies.map(a => (
                  <span key={a} className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No allergy filters selected.</span>
              )}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" /> Your Favorite Dishes ({favorites.length})
            </h3>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {favorites.map(f => (
                  <div key={f.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <img src={f.image} alt={f.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">{f.name}</div>
                      <div className="text-[11px] text-orange-400 font-semibold">₹{f.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No favorites added yet.</p>
            )}
          </div>

          {/* Recent Order History */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" /> Recent Order History
            </h3>
            <div className="space-y-2">
              {orders.map(ord => (
                <div key={ord.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{ord.orderNumber} • Table {ord.tableNumber}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{ord.items.length} items • {new Date(ord.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-orange-400">₹{ord.totalAmount}</div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
