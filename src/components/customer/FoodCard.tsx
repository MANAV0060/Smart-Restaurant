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
  const isExternal = Boolean(item.externalModelUrl);

  return (
    <div className={`group relative rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden bistro-card ${
      hasAllergyConflict 
        ? 'border-rose-500/50 bg-rose-950/20' 
        : 'border-slate-800/90 hover:border-amber-500/40 hover:shadow-2xl'
    }`}>
      {/* Food Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onOpenDetail(item)}>
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-slate-950/20 to-black/40"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
            {/* Veg / Non-Veg Indicator Dot */}
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border backdrop-blur-md ${
              item.vegType === 'veg' 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
                : item.vegType === 'vegan'
                ? 'bg-teal-950/80 text-teal-300 border-teal-500/50'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                item.vegType === 'veg' ? 'bg-emerald-400 animate-pulse' : item.vegType === 'vegan' ? 'bg-teal-300' : 'bg-rose-500'
              }`}></span>
              {item.vegType.toUpperCase()}
            </span>

            {/* Popularity / Chef Badges */}
            {item.isChefSpecial && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-950/80 text-amber-300 border border-amber-500/50 flex items-center gap-1 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-400" /> Signature
              </span>
            )}
            {item.isPopular && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-950/80 text-orange-300 border border-orange-500/50 backdrop-blur-md">
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
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/80'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Allergy Warning Overlay Badge */}
        {hasAllergyConflict && (
          <div className="absolute bottom-3 left-3 right-3 bg-rose-600/90 text-white px-3 py-1.5 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md z-10">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>Contains: {item.allergens.filter(a => activeAllergies.includes(a)).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onOpenDetail(item)}
              className="font-serif font-black text-white text-base hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 tracking-tight"
            >
              {item.name}
            </h3>
            <span className="text-base font-extrabold text-amber-400 font-sans tracking-tight">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {item.description}
          </p>
        </div>

        {/* Dish Attributes HUD */}
        <div className="grid grid-cols-3 gap-1 py-2 border-y border-slate-800/80 text-[11px] text-slate-300 font-sans">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{item.cookingTimeMinutes}m cook</span>
          </div>

          <div className="flex items-center gap-1 justify-center">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{item.calories} kcal</span>
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">{item.rating}</span>
            <span className="text-[10px] text-slate-500">({item.reviewCount})</span>
          </div>
        </div>

        {/* Card Action Buttons Bar */}
        <div className="flex items-center gap-2 pt-1 font-sans">
          <button 
            onClick={() => onOpen3D(item)}
            className="flex-1 py-2 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all shadow-sm"
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            {isExternal ? '3D GLTF' : '3D View'}
          </button>

          <button 
            onClick={() => onOpenAR(item)}
            className="flex-1 py-2 px-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            AR Table
          </button>

          <button 
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable}
            className={`py-2 px-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all shadow-md ${
              !item.isAvailable 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
