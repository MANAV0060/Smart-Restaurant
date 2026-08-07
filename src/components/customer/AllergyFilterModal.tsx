import React from 'react';
import { AllergyType } from '../../types';
import { ShieldAlert, Check, X } from 'lucide-react';

interface AllergyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergies: AllergyType[];
  onToggleAllergy: (allergy: AllergyType) => void;
  onClearAll: () => void;
}

const ALLERGY_LIST: { id: AllergyType; name: string; icon: string; desc: string }[] = [
  { id: 'Peanut', name: 'Peanut & Tree Nuts', icon: '🥜', desc: 'Peanuts, cashews, almonds & walnuts' },
  { id: 'Milk', name: 'Milk & Lactose', icon: '🥛', desc: 'Milk, cheese, butter & cream products' },
  { id: 'Gluten', name: 'Gluten & Wheat', icon: '🌾', desc: 'Wheat flour, pasta, bread & crusts' },
  { id: 'Soy', name: 'Soy & Soya', icon: '🌱', desc: 'Soybean oil, soy sauce & tofu derivatives' },
  { id: 'Shellfish', name: 'Shellfish & Seafood', icon: '🦐', desc: 'Prawns, crab, shrimp & mollusks' },
  { id: 'Egg', name: 'Egg & Poultry', icon: '🥚', desc: 'Whole eggs, egg yolk, mayonnaise & batters' },
];

export const AllergyFilterModal: React.FC<AllergyFilterModalProps> = ({
  isOpen,
  onClose,
  selectedAllergies,
  onToggleAllergy,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#14171d] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden text-[#FFF6DE]">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#101318] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#F48F68]/15 text-[#F48F68] flex items-center justify-center border border-[#F48F68]/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#FFF6DE] text-base">Dietary & Allergy Filter</h3>
              <span className="text-[11px] text-[#FFE394]">Automatic kitchen safety alerts</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-md bg-[#1a1e27] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Allergy List */}
        <div className="p-4 space-y-2 bg-[#0e1014] max-h-80 overflow-y-auto">
          {ALLERGY_LIST.map((all) => {
            const isChecked = selectedAllergies.includes(all.id);

            return (
              <div 
                key={all.id}
                onClick={() => onToggleAllergy(all.id)}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                  isChecked 
                    ? 'bg-[#F48F68]/15 border-[#F48F68] text-[#FFF6DE]' 
                    : 'bg-[#14171d] border-white/[0.06] hover:border-white/[0.12] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{all.icon}</span>
                  <div>
                    <div className="font-semibold text-xs text-[#FFF6DE]">{all.name}</div>
                    <div className="text-[10px] text-slate-400">{all.desc}</div>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  isChecked ? 'bg-[#F48F68] border-[#F48F68] text-slate-950 font-bold' : 'border-white/[0.15] bg-[#0e1014]'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#101318] border-t border-white/[0.08] flex items-center justify-between gap-2">
          <button 
            onClick={onClearAll}
            disabled={selectedAllergies.length === 0}
            className="text-xs text-slate-400 hover:text-white font-semibold disabled:opacity-40"
          >
            Reset All
          </button>

          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#F48F68] hover:bg-[#f27c50] text-slate-950 font-bold text-xs transition-colors shadow-xs"
          >
            Apply Protection ({selectedAllergies.length})
          </button>
        </div>
      </div>
    </div>
  );
};
