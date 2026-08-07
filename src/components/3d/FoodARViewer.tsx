import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Camera, X, Smartphone, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';

interface FoodARViewerProps {
  item: MenuItem;
  onClose: () => void;
}

export const FoodARViewer: React.FC<FoodARViewerProps> = ({ item, onClose }) => {
  const [placed, setPlaced] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-between p-4 font-sans select-none text-[#1C1917]">
      {/* Top Floating HUD in Warm White */}
      <div className="max-w-md mx-auto w-full bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8BDFDD]/25 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/40">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1C1917] text-xs sm:text-sm">{item.name}</h3>
            <span className="text-[10px] text-[#78716C]">Live Table AR Simulation</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] flex items-center justify-center border border-[#EADBBA] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* AR Live Viewport Center Area */}
      <div className="max-w-md mx-auto w-full my-auto text-center space-y-4">
        <div className="relative w-64 h-64 mx-auto rounded-2xl border-2 border-dashed border-[#F48F68]/70 flex items-center justify-center bg-black/40 shadow-2xl">
          <img 
            src={item.image} 
            alt={item.name} 
            className={`w-44 h-44 object-cover rounded-xl shadow-2xl transition-all duration-500 ${
              placed ? 'scale-110 rotate-0' : 'scale-90 rotate-3 opacity-90'
            }`}
          />

          <div className="absolute top-2 right-2 bg-[#FFFFFF]/90 text-[#1C1917] text-[10px] font-bold px-2 py-0.5 rounded border border-[#EADBBA] shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F48F68]" /> 100% Realistic Scale
          </div>
        </div>

        <p className="text-xs text-white/90 font-medium drop-shadow-md">
          {placed 
            ? '✓ Model anchored to dining table surface. Walk around or rotate to inspect.' 
            : 'Point your camera at the dining table surface and tap "Place on Table".'}
        </p>
      </div>

      {/* Bottom AR Controls */}
      <div className="max-w-md mx-auto w-full bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-3.5 flex items-center gap-2 shadow-2xl">
        <button
          onClick={() => setPlaced(!placed)}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
            placed
              ? 'bg-[#8BDFDD] text-[#1C1917]'
              : 'bg-[#F48F68] hover:bg-[#f27c50] text-white'
          }`}
        >
          {placed ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{placed ? 'Dish Placed on Table' : 'Place Dish on Table'}</span>
        </button>

        <button
          onClick={() => setPlaced(false)}
          className="p-2.5 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] transition-colors shadow-2xs"
          title="Reset AR positioning"
        >
          <RotateCw className="w-4 h-4 text-[#F48F68]" />
        </button>
      </div>
    </div>
  );
};
