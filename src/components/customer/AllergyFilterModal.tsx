import React from 'react';
import { AllergyType } from '../../types';
import { ShieldAlert, Check, X, Info, Sparkles } from 'lucide-react';

interface AllergyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergies: AllergyType[];
  onToggleAllergy: (allergy: AllergyType) => void;
  onClearAll: () => void;
}

const ALLERGEN_LIST: { name: AllergyType; description: string; icon: string }[] = [
  { name: 'Peanut', description: 'Groundnuts & peanut oil derivative', icon: '🥜' },
  { name: 'Milk', description: 'Dairy, cheese, butter & cream', icon: '🥛' },
  { name: 'Egg', description: 'Eggs, mayonnaise & egg pasta', icon: '🥚' },
  { name: 'Fish', description: 'Freshwater & marine fish oils', icon: '🐟' },
  { name: 'Gluten', description: 'Wheat flour, rye, barley & breading', icon: '🌾' },
  { name: 'Soy', description: 'Soybeans, soy sauce & tofu', icon: '🫘' },
  { name: 'Shellfish', description: 'Crabs, prawns & lobsters', icon: '🦐' },
  { name: 'Sesame', description: 'Sesame seeds, tahini & sesame oil', icon: '🌱' },
  { name: 'Tree Nuts', description: 'Almonds, cashews, hazelnuts & walnuts', icon: '🌰' },
  { name: 'Mustard', description: 'Mustard seeds, pastes & spicy oils', icon: '🟡' },
];

export const AllergyFilterModal: React.FC<AllergyFilterModalProps> = ({
  isOpen,
  onClose,
  selectedAllergies,
  onToggleAllergy,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Allergy Protection Guard
              </h3>
              <span className="text-xs text-slate-400">Select your dietary restrictions for safety</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checkbox Grid */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Dishes containing any selected allergens will be hidden automatically or flagged with explicit red safety warnings across the app.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALLERGEN_LIST.map((item) => {
              const isSelected = selectedAllergies.includes(item.name);
              return (
                <div
                  key={item.name}
                  onClick={() => onToggleAllergy(item.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-500/20 border-red-500 text-white shadow-lg shadow-red-500/10'
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.description}</div>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    isSelected ? 'bg-red-500 border-red-400 text-white' : 'border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button 
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            Clear All Selections
          </button>

          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25"
          >
            Save & Apply Guard ({selectedAllergies.length})
          </button>
        </div>
      </div>
    </div>
  );
};
