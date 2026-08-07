import React from 'react';
import { Utensils, Bot, ShoppingBag, ShieldAlert } from 'lucide-react';

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
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f1117] border-t border-black/30 shadow-2xl py-2.5 px-6 pb-safe md:hidden select-none">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {/* Menu Tab */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center text-[#F48F68] font-semibold"
        >
          <Utensils className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>

        {/* AI Sommelier Tab */}
        <button
          onClick={onOpenAIChef}
          className="flex flex-col items-center justify-center text-[#8BDFDD] font-medium hover:text-white"
        >
          <Bot className="w-4 h-4 mb-0.5 text-[#8BDFDD]" />
          <span className="text-[10px] tracking-tight">AI Sommelier</span>
        </button>

        {/* Allergy Guard Tab */}
        <button
          onClick={onOpenAllergies}
          className="flex flex-col items-center justify-center text-slate-400 hover:text-white relative font-medium"
        >
          <div className="relative">
            <ShieldAlert className={`w-4 h-4 mb-0.5 ${activeAllergiesCount > 0 ? 'text-[#F48F68]' : 'text-slate-400'}`} />
            {activeAllergiesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F48F68] text-slate-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {activeAllergiesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Dietary</span>
        </button>

        {/* Cart Tab */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center text-[#FFE394] relative font-medium hover:text-white"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5 text-[#FFE394]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F48F68] text-slate-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>
      </div>
    </nav>
  );
};
