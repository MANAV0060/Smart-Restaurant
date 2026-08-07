import React from 'react';
import { MenuItem } from '../../types';
import { Box, Camera, Heart, Plus, ShieldAlert } from 'lucide-react';

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
    <div className={`group relative rounded-xl border transition-all duration-200 flex flex-col overflow-hidden bg-[#FFFFFF] shadow-xs ${
      hasAllergyConflict 
        ? 'border-[#F48F68] bg-[#FFFBF7]' 
        : 'border-[#EADBBA] hover:border-[#F48F68] hover:shadow-md'
    }`}>
      {/* Food Image Container */}
      <div className="relative w-full h-44 overflow-hidden bg-[#FFF6DE] cursor-pointer" onClick={() => onOpenDetail(item)}>
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-103" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Veg / Non-Veg Indicator Dot */}
            <span className={`w-4 h-4 rounded-xs border flex items-center justify-center bg-white shadow-2xs ${
              item.vegType === 'veg' 
                ? 'border-emerald-600' 
                : item.vegType === 'vegan'
                ? 'border-teal-600'
                : 'border-rose-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                item.vegType === 'veg' ? 'bg-emerald-600' : item.vegType === 'vegan' ? 'bg-teal-600' : 'bg-rose-600'
              }`}></span>
            </span>

            {item.isChefSpecial && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFE394] text-[#1C1917] border border-[#EADBBA] shadow-2xs">
                Chef's Special
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors pointer-events-auto shadow-2xs ${
              isFavorite 
                ? 'bg-[#F48F68] text-white' 
                : 'bg-white/90 text-[#78716C] hover:text-[#F48F68] border border-[#EADBBA]'
            }`}
            title={isFavorite ? "Remove favorite" : "Add to favorites"}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Allergy Warning Overlay Badge */}
        {hasAllergyConflict && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#F48F68] text-white px-2 py-0.8 rounded text-[10px] font-bold flex items-center gap-1 z-10 shadow-xs">
            <ShieldAlert className="w-3 h-3 text-white flex-shrink-0" />
            <span className="truncate">Contains: {item.allergens.filter(a => activeAllergies.includes(a)).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-[#FFFFFF]">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 
              onClick={() => onOpenDetail(item)}
              className="font-serif font-bold text-[#1C1917] text-sm hover:text-[#F48F68] transition-colors cursor-pointer line-clamp-1"
            >
              {item.name}
            </h3>
            <span className="text-sm font-bold text-[#F48F68] font-sans tracking-tight flex-shrink-0">
              ₹{item.price}
            </span>
          </div>

          <p className="text-[11px] text-[#57534E] line-clamp-1 mt-0.5 font-sans">
            {item.description}
          </p>
        </div>

        {/* Card Action Buttons Bar */}
        <div className="flex items-center gap-1.5 pt-1 font-sans">
          <button 
            onClick={() => onOpen3D(item)}
            className="flex-1 py-1.5 px-2 rounded-md bg-[#FFFBF0] hover:bg-[#FFF6DE] text-[#1C1917] hover:text-[#F48F68] font-semibold text-[11px] flex items-center justify-center gap-1 border border-[#EADBBA] shadow-2xs transition-colors"
          >
            <Box className="w-3 h-3 text-[#309694]" />
            <span>{isExternal ? '3D GLTF' : '3D View'}</span>
          </button>

          <button 
            onClick={() => onOpenAR(item)}
            className="py-1.5 px-2.5 rounded-md bg-[#FFFBF0] hover:bg-[#FFF6DE] text-[#57534E] hover:text-[#1C1917] font-semibold text-[11px] flex items-center justify-center gap-1 border border-[#EADBBA] shadow-2xs transition-colors"
            title="View in Live AR"
          >
            <Camera className="w-3 h-3 text-[#309694]" />
            <span>AR</span>
          </button>

          <button 
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable}
            className={`py-1.5 px-3 rounded-md font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs ${
              !item.isAvailable 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
