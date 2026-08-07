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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#14171f] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden my-auto relative max-h-[92vh] flex flex-col text-[#FFF6DE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#101318] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-[#1a1e27] hover:bg-[#222733] text-[#FFF6DE] font-semibold text-xs flex items-center gap-1.5 border border-white/[0.08] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F48F68]" />
            <span>Back to Menu</span>
          </button>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#1a1e27] hover:bg-[#222733] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 bg-[#14171f]">
          {/* Header Media Container */}
          <div className="relative w-full">
            {show3D ? (
              <div className="relative bg-[#0e1014]">
                <Food3DViewer item={item} />
                <button 
                  onClick={() => setShow3D(false)}
                  className="absolute top-3 left-3 z-20 px-3 py-1 rounded-md bg-[#14171f] text-xs font-semibold text-white border border-white/[0.1] shadow-md hover:bg-[#1a1e27] transition-colors"
                >
                  ← Return to Photo
                </button>
              </div>
            ) : (
              <div className="relative h-56 sm:h-64 w-full bg-black">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14171f] via-transparent to-black/30"></div>

                {/* Media Toggle Button */}
                <button 
                  onClick={() => setShow3D(true)}
                  className="absolute bottom-3 right-3 z-10 px-3.5 py-2 rounded-md bg-[#8BDFDD] hover:bg-[#74d2d0] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Box className="w-4 h-4 text-slate-950" />
                  <span>{isExternal ? '3D GLTF Model' : 'Interactive 3D View'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-bold">
                  <span className="text-[#8BDFDD] uppercase tracking-wider">{item.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{item.portionSize}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF6DE] tracking-tight">{item.name}</h2>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#FFE394] font-sans">
                ₹{item.price}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 bg-[#0e1014] p-3 rounded-lg border border-white/[0.06] text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Cooking Time</div>
                <div className="font-bold text-[#FFF6DE] flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-[#F48F68]" /> {item.cookingTimeMinutes}m
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Calories</div>
                <div className="font-bold text-[#FFF6DE] flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-3 h-3 text-[#F48F68]" /> {item.calories}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Rating</div>
                <div className="font-bold text-[#FFE394] flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-[#FFE394] text-[#FFE394]" /> {item.rating}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Freshness</div>
                <div className="font-bold text-[#8BDFDD] mt-0.5">
                  {item.freshnessScore}%
                </div>
              </div>
            </div>

            {/* Description & Culinary Origin */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description & Preparation</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#0e1014] p-3.5 rounded-lg border border-white/[0.06]">
                {item.description}
              </p>
              <div className="text-xs text-slate-400 flex items-center gap-4 pt-1">
                <span><strong>Style:</strong> {item.cookingStyle}</span>
                <span><strong>Origin:</strong> {item.origin}</span>
              </div>
            </div>

            {/* Macros & Nutritional Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nutritional Breakdown</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-[#0e1014] border border-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">Protein</div>
                  <div className="font-bold text-[#F48F68] mt-0.5">{item.macros.protein}g</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1014] border border-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">Carbs</div>
                  <div className="font-bold text-[#FFF6DE] mt-0.5">{item.macros.carbs}g</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1014] border border-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">Fats</div>
                  <div className="font-bold text-[#8BDFDD] mt-0.5">{item.macros.fat}g</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1014] border border-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">Sugar</div>
                  <div className="font-bold text-[#FFE394] mt-0.5">{item.macros.sugar}g</div>
                </div>
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Ingredients</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#1a1e27] text-slate-200 text-xs font-semibold border border-white/[0.08]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Allergen Safety</h4>
                {item.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {item.allergens.map((all, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#F48F68]/20 text-[#F48F68] text-xs font-bold border border-[#F48F68]/40 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-[#F48F68]" /> {all}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-[#8BDFDD] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Allergen Free
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 bg-[#101318] border-t border-white/[0.08] flex items-center gap-2">
          <button 
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2.5 rounded-md border flex items-center justify-center transition-colors shadow-sm ${
              isFavorite 
                ? 'bg-[#F48F68] text-slate-950 border-[#F48F68] font-bold' 
                : 'bg-[#1a1e27] text-slate-400 hover:text-white border-white/[0.08]'
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
            className="flex-1 py-2.5 rounded-md bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Order • ₹{item.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
