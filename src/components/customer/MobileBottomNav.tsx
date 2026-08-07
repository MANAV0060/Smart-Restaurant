import React from 'react';
import { Utensils, Bot, ShoppingBag, ShieldAlert, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeScreen: 'menu' | 'cart' | 'ai' | 'allergies' | 'profile';
  cartItemCount: number;
  activeAllergiesCount: number;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onOpenAIChef: () => void;
  onOpenAllergies: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartItemCount,
  activeAllergiesCount,
  onOpenMenu,
  onOpenCart,
  onOpenAIChef,
  onOpenAllergies,
  onOpenProfile,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070a0f]/95 backdrop-blur-2xl border-t border-slate-800/90 py-2 px-3 pb-safe md:hidden select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Menu Tab */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-3 text-amber-400 font-bold active:scale-95 transition-transform"
        >
          <Utensils className="w-5 h-5 mb-0.5 text-amber-400 stroke-[2.2]" />
          <span className="text-[10px] font-extrabold tracking-tight">Menu</span>
        </button>

        {/* AI Sommelier Tab */}
        <button
          onClick={onOpenAIChef}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-amber-300 font-bold active:scale-95 transition-transform"
        >
          <Bot className="w-5 h-5 mb-0.5 text-amber-400 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">AI Chef</span>
        </button>

        {/* Floating Order Cart Tab */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-amber-300 relative active:scale-95 transition-transform"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-amber-400 stroke-[2.2]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Order ({cartItemCount})</span>
        </button>

        {/* Allergy Guard Tab */}
        <button
          onClick={onOpenAllergies}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-amber-300 relative active:scale-95 transition-transform"
        >
          <div className="relative">
            <ShieldAlert className={`w-5 h-5 mb-0.5 stroke-[2.2] ${activeAllergiesCount > 0 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            {activeAllergiesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {activeAllergiesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Allergies</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-white active:scale-95 transition-transform"
        >
          <User className="w-5 h-5 mb-0.5 text-slate-300 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
