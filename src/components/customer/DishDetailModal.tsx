import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Food3DViewer } from '../3d/Food3DViewer';
import { Star, Clock, Flame, ShieldAlert, Sparkles, Box, CheckCircle2, X, Heart, Plus, ArrowLeft } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header Bar with Prominent Back Button */}
        <div className="sticky top-0 z-30 bg-[#070a0f]/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between font-sans">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            <span>Back to Menu</span>
          </button>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95"
            title="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1">
          {/* Header Media Container */}
          <div className="relative w-full">
            {show3D ? (
              <div className="relative">
                <Food3DViewer item={item} />
                <button 
                  onClick={() => setShow3D(false)}
                  className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 text-xs font-bold text-slate-200 border border-slate-700 backdrop-blur-md hover:bg-slate-800"
                >
                  ← Return to Photo
                </button>
              </div>
            ) : (
              <div className="relative h-56 sm:h-72 w-full bg-slate-950">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-black/50"></div>

                {/* Media Toggle Button */}
                <button 
                  onClick={() => setShow3D(true)}
                  className="absolute bottom-4 right-4 z-10 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95"
                >
                  <Box className="w-4 h-4" /> {isExternal ? '3D GLTF Model' : 'Switch to 3D View'}
                </button>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-bold">
                  <span className="text-amber-400 uppercase tracking-wider">{item.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{item.portionSize}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">{item.name}</h2>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-sans">
                ₹{item.price}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center font-sans">
              <div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Cooking Time</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {item.cookingTimeMinutes}m
                </div>
              </div>

              <div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Calories</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> {item.calories}
                </div>
              </div>

              <div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Rating</div>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating}
                </div>
              </div>

              <div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Freshness</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">
                  {item.freshnessScore}%
                </div>
              </div>
            </div>

            {/* Description & Culinary Origin */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Description & Origin</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 font-sans">
                {item.description}
              </p>
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-4 font-sans">
                <span><strong>Style:</strong> {item.cookingStyle}</span>
                <span><strong>Origin:</strong> {item.origin}</span>
              </div>
            </div>

            {/* Macros & Nutritional Info */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Nutritional Macros</h4>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center font-sans">
                <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[10px] text-amber-300 font-medium">Protein</div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-400">{item.macros.protein}g</div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <div className="text-[10px] text-orange-300 font-medium">Carbs</div>
                  <div className="text-sm sm:text-base font-extrabold text-orange-400">{item.macros.carbs}g</div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                  <div className="text-[10px] text-indigo-300 font-medium">Fats</div>
                  <div className="text-sm sm:text-base font-extrabold text-indigo-400">{item.macros.fat}g</div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <div className="text-[10px] text-rose-300 font-medium">Sugar</div>
                  <div className="text-sm sm:text-base font-extrabold text-rose-400">{item.macros.sugar}g</div>
                </div>
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Ingredients</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Allergens Present</h4>
                {item.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {item.allergens.map((all, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-400" /> {all}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Allergen Free
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sticky Action Bar */}
        <div className="p-4 bg-[#070a0f]/95 border-t border-slate-800 flex items-center gap-2 font-sans">
          <button 
            onClick={onClose}
            className="px-3.5 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" /> Back
          </button>

          <button 
            onClick={() => onToggleFavorite(item.id)}
            className={`p-3 rounded-2xl border flex items-center justify-center transition-all active:scale-95 ${
              isFavorite 
                ? 'bg-rose-500 text-white border-rose-500' 
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={() => {
              onAddToCart(item);
              onClose();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4.5 h-4.5 stroke-[3]" /> Add to Order • ₹{item.price}
          </button>
        </div>
      </div>
    </div>
  );
};
