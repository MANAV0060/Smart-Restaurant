import React, { useState } from 'react';
import { QrCode, Sparkles, Utensils, Table, ShieldCheck, ChevronRight, Lock, Link as LinkIcon } from 'lucide-react';

interface LandingPageProps {
  onSelectTableAndEnter: (tableNum: number) => void;
  onOpenStaffPortal: () => void;
  restaurantName?: string;
  totalTables?: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTableAndEnter,
  onOpenStaffPortal,
  restaurantName = "The Royal Gourmet Bistro",
  totalTables = 4,
}) => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [isLinkScanOpen, setIsLinkScanOpen] = useState(false);
  const [scannedUrl, setScannedUrl] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);

  const handleSimulateScan = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      onSelectTableAndEnter(selectedTable);
    }, 900);
  };

  const handleParseAndJoinLink = (urlToParse: string) => {
    try {
      setScanError(null);
      let tableNum: number | null = null;

      if (urlToParse.includes('table=')) {
        const paramStr = urlToParse.includes('?') ? urlToParse.split('?')[1] : urlToParse;
        const params = new URLSearchParams(paramStr);
        const t = params.get('table');
        if (t && !isNaN(Number(t))) {
          tableNum = Number(t);
        }
      } else if (!isNaN(Number(urlToParse.trim()))) {
        tableNum = Number(urlToParse.trim());
      }

      if (tableNum && tableNum > 0) {
        onSelectTableAndEnter(tableNum);
      } else {
        setScanError('Invalid Table QR Link. Ensure the link contains "?table=1", "?table=2", etc.');
      }
    } catch {
      setScanError('Failed to parse URL link. Please enter a valid table QR link.');
    }
  };

  return (
    <div className="h-[100dvh] bg-[#070a0f] text-white flex flex-col justify-between p-3 sm:p-6 relative overflow-hidden font-sans select-none">
      {/* Background Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-2 sm:py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-serif font-black text-lg sm:text-2xl shadow-lg shadow-amber-500/20">
            R
          </div>
          <div>
            <h1 className="font-serif font-black text-white text-base sm:text-lg tracking-tight gold-gradient-text leading-tight">{restaurantName}</h1>
            <span className="text-[10px] sm:text-xs text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 3D & AR Menu
            </span>
          </div>
        </div>

        {/* Staff Portal Link */}
        <button
          onClick={onOpenStaffPortal}
          className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors backdrop-blur-md"
        >
          <Lock className="w-3 h-3 text-amber-400" /> Staff
        </button>
      </header>

      {/* Main Dining Welcome Card - Single Page No Scroll */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-1 sm:py-6">
        <div className="bistro-card rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-3.5 sm:space-y-5 text-center border-amber-500/20">
          {/* Welcome Icon */}
          <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10 animate-float">
            <Utensils className="w-7 h-7 sm:w-9 sm:h-9 stroke-[1.75]" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">Welcome to Your Table</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-normal font-sans">
              Select your table or scan your QR link to view 3D food models and order live to the kitchen.
            </p>
          </div>

          {/* Table Selection Dropdown */}
          <div className="space-y-1.5 text-left bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800/80 font-sans">
            <label className="text-[11px] sm:text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-amber-400" /> Select Dining Table:
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(Number(e.target.value))}
              className="w-full bg-[#0c1017] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white font-extrabold focus:outline-none focus:border-amber-500 transition-colors"
            >
              {Array.from({ length: totalTables }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num} className="bg-slate-900 text-white font-bold">
                  Table {num}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Direct Table QR Links Bar */}
          <div className="space-y-1 text-left font-sans">
            <label className="text-[10px] font-bold text-slate-400 block">Quick Scan Direct Links:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: totalTables }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => onSelectTableAndEnter(num)}
                  className="py-1.5 px-1.5 rounded-xl bg-slate-950 hover:bg-amber-500/20 hover:border-amber-500/50 border border-slate-800 text-[10px] font-bold text-amber-400 transition-all flex items-center justify-center gap-1 active:scale-95"
                >
                  <LinkIcon className="w-3 h-3 text-amber-400" /> Table {num}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 font-sans pt-1">
            <button
              onClick={() => onSelectTableAndEnter(selectedTable)}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>Enter Menu for Table {selectedTable}</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateScan}
                disabled={isScanningQR}
                className="py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-800 transition-colors active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                {isScanningQR ? 'Scanning...' : 'Scan QR Code'}
              </button>

              <button
                onClick={() => setIsLinkScanOpen(true)}
                className="py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-800 transition-colors active:scale-95"
              >
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                Paste Link
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Link Scan Modal */}
      {isLinkScanOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-black text-white text-base">Direct Table Link Scanner</h3>
              </div>
              <button onClick={() => setIsLinkScanOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Paste any table QR link or URL (for example: <code className="text-amber-300 font-mono">http://localhost:3000/?table=2</code> or simply <code className="text-amber-300 font-mono">?table=3</code>):
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleParseAndJoinLink(scannedUrl); }} className="space-y-3 font-sans">
              <input
                type="text"
                placeholder="Paste table QR link e.g. http://localhost:3000/?table=2"
                value={scannedUrl}
                onChange={(e) => setScannedUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
              />

              {scanError && (
                <p className="text-xs text-rose-400 font-bold">{scanError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLinkScanOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  Join Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <header className="relative z-10 max-w-5xl mx-auto w-full text-center py-2 border-t border-slate-900 text-[10px] sm:text-[11px] text-slate-500 flex items-center justify-between font-sans">
        <span>© 2026 {restaurantName}</span>
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> Table Session Active
        </span>
      </header>
    </div>
  );
};
