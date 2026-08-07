import React from 'react';
import { CATEGORIES } from '../../data/mockMenu';
import { CategoryId } from '../../types';
import { Sparkles, Utensils, Flame, Pizza, Beef, Wheat, Soup, UtensilsCrossed, Cake, Wine, Sun, HeartPulse, Leaf, Smile } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

const ICON_MAP: Record<string, any> = {
  Utensils,
  Sparkles,
  Flame,
  Pizza,
  Beef,
  Wheat,
  Soup,
  Chopsticks: UtensilsCrossed,
  Cake,
  Wine,
  Sun,
  HeartPulse,
  Leaf,
  Smile
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full bg-[#FFF6DE] border-b border-[#EADBBA] py-2.5 sticky top-[57px] z-30 select-none shadow-xs">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 touch-pan-x">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = ICON_MAP[cat.icon] || Utensils;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-[#F48F68] text-white font-bold shadow-xs scale-102'
                    : 'bg-[#FFFFFF] text-[#44403C] hover:text-[#1C1917] hover:bg-[#FFFDF7] border border-[#EADBBA]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white stroke-[2.5]' : 'text-[#309694]'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
