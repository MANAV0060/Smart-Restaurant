import React from 'react';
import { VoiceAssistant } from './VoiceAssistant';
import { Bot, ShoppingBag, ShieldAlert, Search, ChevronDown, Lock } from 'lucide-react';

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
  onOpenStaffPortal,
  activeAllergiesCount,
  activeLanguage,
  onLanguageChange,
  onSearchQuery,
  searchQuery,
  onReturnToLanding
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF6DE]/95 border-b border-[#EADBBA] backdrop-blur-md font-sans select-none shadow-2xs text-[#1C1917]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Table Badge (Mobile Optimized) */}
        <div 
          onClick={onReturnToLanding}
          className="cursor-pointer flex items-center gap-2 sm:gap-2.5 min-w-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F48F68] text-white font-serif font-black text-sm sm:text-base flex items-center justify-center shadow-2xs flex-shrink-0">
            R
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-[#1C1917] text-xs sm:text-base tracking-tight leading-tight truncate">
              {restaurantName}
            </h1>
            <span className="text-[10px] sm:text-[11px] text-[#78716C] font-medium flex items-center gap-0.5 mt-0.5">
              Table <strong className="text-[#1C1917] font-bold">{tableNumber}</strong> <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F48F68]" />
            </span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
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

        {/* Right Actions (Compact & Responsive on Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Voice Assistant */}
          <VoiceAssistant 
            activeLanguage={activeLanguage}
            onLanguageChange={onLanguageChange}
            onSpeechResult={(query) => onSearchQuery(query)}
          />

          {/* AI Sommelier Button (Desktop) */}
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
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {activeAllergiesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1C1917] text-white text-[9px] font-bold flex items-center justify-center">
                {activeAllergiesCount}
              </span>
            )}
          </button>

          {/* Cart Button (Responsive Pill) */}
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-white font-bold text-[11px] sm:text-xs transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.4]" />
            <span className="hidden xs:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-white text-[#F48F68] text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Pill (Sub-header) */}
      <div className="md:hidden px-3 pb-2 pt-0.5">
        <div className="relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder="Search pizza, pasta, burgers..."
            className="w-full bg-[#FFFFFF] border border-[#EADBBA] rounded-full pl-8 pr-7 py-1 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#F48F68] shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-2.5 top-1.5" />
          {searchQuery && (
            <button onClick={() => onSearchQuery('')} className="absolute right-2.5 top-1 text-xs text-[#78716C]">✕</button>
          )}
        </div>
      </div>
    </header>
  );
};
