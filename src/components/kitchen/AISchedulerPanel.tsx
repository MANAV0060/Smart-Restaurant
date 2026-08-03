import React from 'react';
import { AISchedulerSuggestion } from '../../types';
import { Sparkles, Clock, Flame, CheckCircle2, ArrowRight } from 'lucide-react';

interface AISchedulerPanelProps {
  suggestions: AISchedulerSuggestion[];
}

export const AISchedulerPanel: React.FC<AISchedulerPanelProps> = ({ suggestions }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">AI Kitchen Parallel Scheduler</h3>
            <p className="text-xs text-slate-400">Intelligent cook-time staggering to serve all table items simultaneously</p>
          </div>
        </div>

        <span className="bg-orange-500/20 text-orange-400 text-xs font-extrabold px-3 py-1 rounded-full border border-orange-500/30">
          AI Optimization Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((s, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-orange-400">Table {s.tableNumber}</span>
              <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                {s.parallelSlot}
              </span>
            </div>

            <div className="font-bold text-white text-sm truncate">{s.dishName}</div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Prep: <strong>{s.estimatedMinutes}m</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{s.suggestedStartTime}</span>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-xl border border-slate-800/80 italic leading-relaxed">
              💡 {s.rationale}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
