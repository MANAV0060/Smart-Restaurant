import React from 'react';
import { VoiceAssistant } from './VoiceAssistant';
import { Bot, ShoppingBag, ShieldAlert, Search, ChevronDown } from 'lucide-react';

interface CustomerHeaderProps {
  tableNumber: number;
  restaurantName: string;
  estimatedWaitMinutes: number;
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenAIChef: () => void;
  onOpenAllergyModal: () => void;
  onOpenProfile: () => void;
  onOpenStaffPortal: () => void;
  activeAllergiesCount: number;
  activeLanguage: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
  onSearchQuery: (query: string) => void;
  searchQuery: string;
  onReturnToLanding: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  tableNumber,
  restaurantName,
  cartItemCount,
  onOpenCart,
  onOpenAIChef,
  onOpenAllergyModal,
  activeAllergiesCount,
  activeLanguage,
  onLanguageChange,
  onSearchQuery,
  searchQuery,
  onReturnToLanding
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF6DE]/95 border-b border-[#EADBBA] backdrop-blur-md font-sans select-none shadow-xs text-[#1C1917]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Table Badge */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onReturnToLanding}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F48F68] text-white font-serif font-black text-base flex items-center justify-center shadow-xs">
              R
            </div>
            <div>
              <h1 className="font-serif font-bold text-[#1C1917] text-base tracking-tight leading-none">
                {restaurantName}
              </h1>
              <span className="text-[11px] text-[#78716C] font-medium flex items-center gap-1 mt-0.5">
                Table <strong className="text-[#1C1917] font-bold">{tableNumber}</strong> <ChevronDown className="w-3 h-3 text-[#F48F68]" />
              </span>
            </div>
          </div>
        </div>

        {/* Clean Center Search with Warm White Surface */}
        <div className="hidden sm:flex flex-1 max-w-sm relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder="Search dishes or ingredients..."
            className="w-full bg-[#FFFFFF] border border-[#EADBBA] rounded-full pl-8 pr-7 py-1.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#F48F68] focus:ring-1 focus:ring-[#F48F68] shadow-2xs transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-2.5 top-2" />
          {searchQuery && (
            <button onClick={() => onSearchQuery('')} className="absolute right-2.5 top-1.5 text-xs text-[#78716C] hover:text-[#1C1917]">✕</button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Voice Assistant */}
          <VoiceAssistant 
            activeLanguage={activeLanguage}
            onLanguageChange={onLanguageChange}
            onSpeechResult={(query) => onSearchQuery(query)}
          />

          {/* AI Sommelier Button */}
          <button 
            onClick={onOpenAIChef}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#8BDFDD] text-xs font-semibold shadow-2xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-[#309694]" />
            <span>AI Sommelier</span>
          </button>

          {/* Allergy Filter Button */}
          <button 
            onClick={onOpenAllergyModal}
            className={`p-1.5 rounded-full border transition-colors relative shadow-2xs ${
              activeAllergiesCount > 0 
                ? 'bg-[#F48F68] border-[#F48F68] text-white' 
                : 'bg-[#FFFFFF] border-[#EADBBA] text-[#78716C] hover:text-[#1C1917]'
            }`}
            title="Dietary & Allergy Filter"
          >
            <ShieldAlert className="w-4 h-4" />
            {activeAllergiesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1C1917] text-white text-[9px] font-bold flex items-center justify-center">
                {activeAllergiesCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-white font-bold text-xs transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.4]" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-white text-[#F48F68] text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5 shadow-2xs">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
