import React from 'react';
import { MenuItem } from '../../types';
import { Star, Clock, Flame, Sparkles, Box, Camera, Heart, Plus, ShieldAlert, Check } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
  onOpen3D: (item: MenuItem) => void;
  onOpenAR: (item: MenuItem) => void;
  onOpenDetail: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  activeAllergies: string[];
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onOpen3D,
  onOpenAR,
  onOpenDetail,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  activeAllergies
}) => {
  const hasAllergyConflict = item.allergens.some(a => activeAllergies.includes(a));

  return (
    <div className={`group relative bg-slate-900/80 rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:-translate-y-1 ${
      hasAllergyConflict 
        ? 'border-red-500/50 bg-red-950/20' 
        : 'border-slate-800 hover:border-orange-500/40 hover:shadow-orange-500/10'
    }`}>
      {/* Food Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-950">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
            {/* Veg / Non-Veg Indicator */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
              item.vegType === 'veg' 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : item.vegType === 'vegan'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                item.vegType === 'veg' ? 'bg-emerald-400' : item.vegType === 'vegan' ? 'bg-teal-300' : 'bg-rose-500'
              }`}></span>
              {item.vegType.toUpperCase()}
            </span>

            {/* Popularity / Chef Badges */}
            {item.isChefSpecial && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Chef Rec
              </span>
            )}
            {item.isPopular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                Popular
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all pointer-events-auto ${
              isFavorite 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Allergy Warning Overlay Badge */}
        {hasAllergyConflict && (
          <div className="absolute bottom-3 left-3 right-3 bg-red-500/90 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md z-10">
            <ShieldAlert className="w-4 h-4" />
            <span>Contains Allergy: {item.allergens.filter(a => activeAllergies.includes(a)).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onOpenDetail(item)}
              className="font-bold text-white text-base hover:text-orange-400 cursor-pointer line-clamp-1"
            >
              {item.name}
            </h3>
            <span className="text-base font-extrabold text-orange-400 font-sans">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Dish Attributes HUD */}
        <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-slate-800/80 text-[11px] text-slate-300">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{item.cookingTimeMinutes}m cook</span>
          </div>

          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{item.calories} kcal</span>
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-100">{item.rating}</span>
            <span className="text-[10px] text-slate-500">({item.reviewCount})</span>
          </div>
        </div>

        {/* Card Action Buttons Bar */}
        <div className="flex items-center gap-2 pt-1">
          <button 
            onClick={() => onOpen3D(item)}
            className="flex-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-orange-400" />
            View 3D
          </button>

          <button 
            onClick={() => onOpenAR(item)}
            className="flex-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            View AR
          </button>

          <button 
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md ${
              !item.isAvailable 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
