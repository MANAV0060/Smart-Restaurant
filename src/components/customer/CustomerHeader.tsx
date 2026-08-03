import React from 'react';
import { VoiceAssistant } from './VoiceAssistant';
import { Bot, ShoppingBag, ShieldAlert, User, Clock, Utensils, Lock, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
      {/* Table & Restaurant Info Ribbon */}
      <div className="bg-slate-900/90 px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-extrabold text-slate-200">Table QR Session: Table {tableNumber}</span>
          <button 
            onClick={onReturnToLanding}
            className="text-[11px] text-orange-400 hover:underline font-semibold ml-2"
          >
            (Change Table)
          </button>
        </div>

        <button 
          onClick={onOpenStaffPortal}
          className="text-slate-400 hover:text-white font-semibold text-[11px] flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <Lock className="w-3 h-3 text-slate-500" /> Staff Portal
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReturnToLanding}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30">
            R
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base leading-tight tracking-tight">
              {restaurantName}
            </h1>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="text-orange-400 font-bold">Table {tableNumber}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Est. Cook Wait: ~{estimatedWaitMinutes}m
              </span>
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder="Search 'Burger', 'Paneer', 'Under ₹300', 'Spicy'..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all shadow-inner"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Assistant */}
          <VoiceAssistant 
            activeLanguage={activeLanguage}
            onLanguageChange={onLanguageChange}
            onSpeechResult={(query) => onSearchQuery(query)}
          />

          {/* AI Chef Assistant */}
          <button 
            onClick={onOpenAIChef}
            className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-105 flex items-center gap-1.5 text-xs font-bold px-3"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Chef</span>
          </button>

          {/* Allergy Protection */}
          <button 
            onClick={onOpenAllergyModal}
            className={`p-2.5 rounded-full border transition-all flex items-center justify-center relative ${
              activeAllergiesCount > 0 
                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Allergy Guard"
          >
            <ShieldAlert className="w-4 h-4" />
            {activeAllergiesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                {activeAllergiesCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button 
            onClick={onOpenCart}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 relative transition-all"
            title="Basket"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-orange-500/40 animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button 
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
