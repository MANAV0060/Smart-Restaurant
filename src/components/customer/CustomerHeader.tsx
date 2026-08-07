import React from 'react';
import { VoiceAssistant } from './VoiceAssistant';
import { Bot, ShoppingBag, ShieldAlert, User, Clock, Utensils, Lock, Sparkles, Search } from 'lucide-react';

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
  estimatedWaitMinutes,
  cartItemCount,
  onOpenCart,
  onOpenAIChef,
  onOpenAllergyModal,
  onOpenProfile,
  onOpenStaffPortal,
  activeAllergiesCount,
  activeLanguage,
  onLanguageChange,
  onSearchQuery,
  searchQuery,
  onReturnToLanding
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a0f]/95 border-b border-slate-800/90 backdrop-blur-2xl font-sans select-none">
      {/* Top Session Bar */}
      <div className="bg-slate-950 border-b border-slate-900 px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-extrabold text-amber-400">Live Dining Session: Table {tableNumber}</span>
          <button 
            onClick={onReturnToLanding}
            className="text-slate-400 hover:text-white underline text-[11px] font-semibold ml-1"
          >
            (Switch Table)
          </button>
        </div>

        <button 
          onClick={onOpenStaffPortal}
          className="text-slate-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
        >
          <Lock className="w-3 h-3 text-amber-400" /> Staff Portal
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Crest */}
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onReturnToLanding}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-serif font-black text-lg sm:text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            R
          </div>
          <div>
            <h1 className="font-serif font-black text-white text-sm sm:text-lg leading-tight tracking-tight gold-gradient-text">
              {restaurantName}
            </h1>
            <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5 font-sans">
              <span className="text-amber-400 font-extrabold">Table {tableNumber}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> ~{estimatedWaitMinutes}m cook
              </span>
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder="Search 'Wagyu', 'Truffle Pizza', 'Under ₹500', 'Spicy'..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          {searchQuery && (
            <button onClick={() => onSearchQuery('')} className="absolute right-3 top-2 text-xs text-slate-400 hover:text-white">✕</button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Assistant */}
          <VoiceAssistant 
            activeLanguage={activeLanguage}
            onLanguageChange={onLanguageChange}
            onSpeechResult={(query) => onSearchQuery(query)}
          />

          {/* Desktop Only Action Icons (Hidden on Mobile to prevent duplicate icons with MobileBottomNav) */}
          <div className="hidden md:flex items-center gap-2">
            {/* AI Sommelier / Chef Assistant */}
            <button 
              onClick={onOpenAIChef}
              className="p-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-1.5 text-xs font-black px-3.5"
            >
              <Bot className="w-4 h-4 stroke-[2.5]" />
              <span className="font-sans">AI Sommelier</span>
            </button>

            {/* Allergy Protection */}
            <button 
              onClick={onOpenAllergyModal}
              className={`p-2.5 rounded-full border transition-all flex items-center justify-center relative ${
                activeAllergiesCount > 0 
                  ? 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/20' 
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Allergy Filter"
            >
              <ShieldAlert className="w-4 h-4" />
              {activeAllergiesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {activeAllergiesCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Button */}
            <button 
              onClick={onOpenCart}
              className="p-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:bg-slate-800 relative transition-all"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button 
              onClick={onOpenProfile}
              className="w-9.5 h-9.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs hover:border-amber-500/50 transition-colors"
            >
              <User className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
