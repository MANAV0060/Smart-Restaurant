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
    <div className="w-full bg-slate-950/80 border-b border-slate-800/80 py-3 sticky top-[105px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = ICON_MAP[cat.icon] || Utensils;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
