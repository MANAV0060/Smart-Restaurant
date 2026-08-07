import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Food3DViewer } from '../3d/Food3DViewer';
import { Star, Clock, Flame, ShieldAlert, Box, CheckCircle2, X, Heart, Plus, ArrowLeft } from 'lucide-react';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  const [show3D, setShow3D] = useState(false);

  if (!item) return null;

  const isExternal = Boolean(item.externalModelUrl);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#FFFFFF] border border-[#EADBBA] rounded-2xl shadow-2xl overflow-hidden my-auto relative max-h-[88vh] flex flex-col text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#FFF6DE] border-b border-[#EADBBA] px-3.5 py-2 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#FFFDF7] text-[#1C1917] font-semibold text-xs flex items-center gap-1.5 border border-[#EADBBA] transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F48F68]" />
            <span>Back to Menu</span>
          </button>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#FFFFFF] hover:bg-[#FFFDF7] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center border border-[#EADBBA] transition-colors shadow-2xs"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 bg-[#FFFFFF]">
          {/* Header Media Container */}
          <div className="relative w-full">
            {show3D ? (
              <div className="relative bg-[#FFFDF7]">
                <Food3DViewer item={item} />
                <button 
                  onClick={() => setShow3D(false)}
                  className="absolute top-2.5 left-2.5 z-20 px-2.5 py-1 rounded-md bg-[#FFFFFF] text-xs font-semibold text-[#1C1917] border border-[#EADBBA] shadow-md hover:bg-[#FFF6DE] transition-colors"
                >
                  ← Return to Photo
                </button>
              </div>
            ) : (
              <div className="relative h-48 sm:h-60 w-full bg-[#FFF6DE]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Media Toggle Button */}
                <button 
                  onClick={() => setShow3D(true)}
                  className="absolute bottom-2.5 right-2.5 z-10 px-3 py-1.5 rounded-md bg-[#8BDFDD] hover:bg-[#74d2d0] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Box className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isExternal ? '3D GLTF Model' : '3D View'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] sm:text-xs font-bold">
                  <span className="text-[#309694] uppercase tracking-wider">{item.category}</span>
                  <span className="text-[#EADBBA]">•</span>
                  <span className="text-[#78716C]">{item.portionSize}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917] tracking-tight">{item.name}</h2>
              </div>
              <div className="text-lg sm:text-xl font-bold text-[#F48F68] font-sans">
                ₹{item.price}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-1.5 bg-[#FFFDF7] p-2.5 rounded-xl border border-[#EADBBA] text-center text-xs">
              <div>
                <div className="text-[9px] sm:text-[10px] text-[#78716C] uppercase font-bold">Cooking</div>
                <div className="font-bold text-[#1C1917] flex items-center justify-center gap-0.5 mt-0.5 text-xs">
                  <Clock className="w-3 h-3 text-[#F48F68]" /> {item.cookingTimeMinutes}m
                </div>
              </div>

              <div>
                <div className="text-[9px] sm:text-[10px] text-[#78716C] uppercase font-bold">Calories</div>
                <div className="font-bold text-[#1C1917] flex items-center justify-center gap-0.5 mt-0.5 text-xs">
                  <Flame className="w-3 h-3 text-[#F48F68]" /> {item.calories}
                </div>
              </div>

              <div>
                <div className="text-[9px] sm:text-[10px] text-[#78716C] uppercase font-bold">Rating</div>
                <div className="font-bold text-[#1C1917] flex items-center justify-center gap-0.5 mt-0.5 text-xs">
                  <Star className="w-3 h-3 fill-[#FFE394] text-[#D97706]" /> {item.rating}
                </div>
              </div>

              <div>
                <div className="text-[9px] sm:text-[10px] text-[#78716C] uppercase font-bold">Freshness</div>
                <div className="font-bold text-[#309694] mt-0.5 text-xs">
                  {item.freshnessScore}%
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Description & Preparation</h4>
              <p className="text-xs text-[#44403C] leading-relaxed bg-[#FFFDF7] p-3 rounded-lg border border-[#EADBBA]">
                {item.description}
              </p>
            </div>

            {/* Macros */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Nutritional Breakdown</h4>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#FFFDF7] border border-[#EADBBA]">
                  <div className="text-[9px] text-[#78716C] font-semibold">Protein</div>
                  <div className="font-bold text-[#F48F68] mt-0.5">{item.macros.protein}g</div>
                </div>

                <div className="p-2 rounded-lg bg-[#FFFDF7] border border-[#EADBBA]">
                  <div className="text-[9px] text-[#78716C] font-semibold">Carbs</div>
                  <div className="font-bold text-[#1C1917] mt-0.5">{item.macros.carbs}g</div>
                </div>

                <div className="p-2 rounded-lg bg-[#FFFDF7] border border-[#EADBBA]">
                  <div className="text-[9px] text-[#78716C] font-semibold">Fats</div>
                  <div className="font-bold text-[#309694] mt-0.5">{item.macros.fat}g</div>
                </div>

                <div className="p-2 rounded-lg bg-[#FFFDF7] border border-[#EADBBA]">
                  <div className="text-[9px] text-[#78716C] font-semibold">Sugar</div>
                  <div className="font-bold text-[#D97706] mt-0.5">{item.macros.sugar}g</div>
                </div>
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              <div>
                <h4 className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5">Key Ingredients</h4>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ing, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#FFFDF7] text-[#44403C] text-[11px] font-semibold border border-[#EADBBA]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5">Allergen Safety</h4>
                {item.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map((all, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#F48F68]/15 text-[#F48F68] text-[11px] font-bold border border-[#F48F68]/30 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-[#F48F68]" /> {all}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#309694] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Allergen Free
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-3 sm:p-4 bg-[#FFF6DE] border-t border-[#EADBBA] flex items-center gap-2">
          <button 
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2.5 rounded-lg border flex items-center justify-center transition-colors shadow-2xs ${
              isFavorite 
                ? 'bg-[#F48F68] text-white border-[#F48F68] font-bold' 
                : 'bg-[#FFFFFF] text-[#78716C] hover:text-[#1C1917] border-[#EADBBA]'
            }`}
            title="Save to favorites"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button 
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Order • ₹{item.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
