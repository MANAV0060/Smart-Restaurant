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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF6DE]/95 backdrop-blur-md border-t border-[#EADBBA] shadow-lg py-2 px-4 pb-safe md:hidden select-none text-[#1C1917]">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* Menu Tab */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center text-[#F48F68] font-bold p-1"
        >
          <Utensils className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>

        {/* AI Sommelier Tab */}
        <button
          onClick={onOpenAIChef}
          className="flex flex-col items-center justify-center text-[#78716C] hover:text-[#309694] font-medium p-1"
        >
          <Bot className="w-4 h-4 mb-0.5 text-[#309694]" />
          <span className="text-[10px] tracking-tight">AI Sommelier</span>
        </button>

        {/* Allergy Guard Tab */}
        <button
          onClick={onOpenAllergies}
          className="flex flex-col items-center justify-center text-[#78716C] hover:text-[#1C1917] relative font-medium p-1"
        >
          <div className="relative">
            <ShieldAlert className={`w-4 h-4 mb-0.5 ${activeAllergiesCount > 0 ? 'text-[#F48F68]' : 'text-[#78716C]'}`} />
            {activeAllergiesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F48F68] text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                {activeAllergiesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Dietary</span>
        </button>

        {/* Cart Tab */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center text-[#78716C] hover:text-[#1C1917] relative font-medium p-1"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5 text-[#1C1917]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F48F68] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs">
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
