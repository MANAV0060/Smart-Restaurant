import React from 'react';
import { AISchedulerSuggestion } from '../../types';
import { Sparkles, ChefHat, Clock } from 'lucide-react';

interface AISchedulerPanelProps {
  suggestions: AISchedulerSuggestion[];
}

export const AISchedulerPanel: React.FC<AISchedulerPanelProps> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 shadow-sm space-y-3 font-sans select-none text-[#1C1917]">
      <div className="flex items-center gap-2.5 pb-2 border-b border-[#EADBBA]">
        <div className="w-8 h-8 rounded-lg bg-[#8BDFDD]/20 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/40">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-[#1C1917] text-base">AI Kitchen Parallel Scheduler</h3>
          <p className="text-xs text-[#78716C]">Optimized line timing & combined workstation firing order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {suggestions.map((sug, idx) => (
          <div 
            key={idx}
            className="p-3.5 rounded-lg bg-[#FFFDF7] border border-[#EADBBA] space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1C1917] flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-[#F48F68]" /> Table {sug.tableNumber}
              </span>
              <span className="text-[10px] font-bold text-[#309694] bg-[#8BDFDD]/20 px-2 py-0.5 rounded border border-[#8BDFDD]/30">
                Slot {sug.parallelSlot}
              </span>
            </div>

            <div className="text-xs font-semibold text-[#1C1917] bg-[#FFF6DE] p-2 rounded border border-[#EADBBA]">
              {sug.dishName}
            </div>

            <div className="text-[11px] text-[#78716C] leading-snug">
              {sug.rationale}
            </div>

            <div className="text-[10px] text-[#78716C] flex items-center gap-1 pt-1 font-medium">
              <Clock className="w-3 h-3 text-[#F48F68]" /> Est: {sug.estimatedMinutes}m • Start: {sug.suggestedStartTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
