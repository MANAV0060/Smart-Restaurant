import React, { useState } from 'react';
import { QrCode, Sparkles, Utensils, Table, ShieldCheck, ChevronRight, Lock, Tv, LayoutDashboard } from 'lucide-react';

interface LandingPageProps {
  onSelectTableAndEnter: (tableNum: number) => void;
  onOpenStaffPortal: () => void;
  restaurantName?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTableAndEnter,
  onOpenStaffPortal,
  restaurantName = "The Royal Gourmet Bistro"
}) => {
  const [selectedTable, setSelectedTable] = useState(15);
  const [isScanningQR, setIsScanningQR] = useState(false);

  const handleSimulateScan = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      onSelectTableAndEnter(selectedTable);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30">
            R
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight">{restaurantName}</h1>
            <span className="text-xs text-orange-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 3D & AR Smart Menu Experience
            </span>
          </div>
        </div>

        {/* Discrete Staff Access Button */}
        <button
          onClick={onOpenStaffPortal}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors backdrop-blur-md"
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" /> Staff Portal
        </button>
      </header>

      {/* Main Center Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 text-center">
          {/* Welcome Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-xl shadow-orange-500/10 animate-float">
            <Utensils className="w-10 h-10 stroke-[1.75]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome to Your Table</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Select your dining table or scan the QR code located on your table to view realistic 3D food models and order live to the kitchen.
            </p>
          </div>

          {/* Table Selection Dropdown */}
          <div className="space-y-2 text-left bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-orange-400" /> Select Dining Table #:
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-extrabold focus:outline-none focus:border-orange-500 transition-colors"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num} className="bg-slate-900 text-white font-bold">
                  Table {num} (Main Dining Hall)
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onSelectTableAndEnter(selectedTable)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02]"
            >
              <span>Explore 3D Menu for Table {selectedTable}</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-500 font-bold uppercase">or</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={isScanningQR}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 transition-colors"
            >
              <QrCode className="w-4 h-4 text-orange-400" />
              {isScanningQR ? 'Scanning Table QR Code...' : 'Simulate Scanning Table QR Code'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center py-4 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
        <span>© 2026 {restaurantName} • Powered by GourmetVerse AI</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Table Session Verified
        </span>
      </footer>
    </div>
  );
};
