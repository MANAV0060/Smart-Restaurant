import React, { useState } from 'react';
import { QrCode, ChevronRight, Lock, Link as LinkIcon, Utensils } from 'lucide-react';

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
  totalTables = 5,
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
    }, 500);
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
        setScanError('Please enter a valid table number (e.g. ?table=2)');
      }
    } catch {
      setScanError('Invalid link format.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6DE] text-[#1C1917] flex flex-col justify-between p-6 sm:p-10 font-sans select-none">
      {/* Top Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F48F68] text-white font-serif font-black text-xl flex items-center justify-center shadow-xs">
            R
          </div>
          <div>
            <h1 className="font-serif font-bold text-[#1C1917] text-lg tracking-tight leading-none">{restaurantName}</h1>
            <span className="text-xs text-[#78716C] font-semibold mt-0.5 block">Digital Dining Experience</span>
          </div>
        </div>

        <button
          onClick={onOpenStaffPortal}
          className="p-2.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FFFFFF] border border-[#EADBBA] transition-colors shadow-2xs"
          title="Staff Portal"
        >
          <Lock className="w-4 h-4" />
        </button>
      </header>

      {/* Main Table Selection Card in Warm White on Cream */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-[#FFFFFF] border border-[#EADBBA] text-[#1C1917] rounded-2xl p-7 sm:p-8 space-y-6 text-center shadow-md">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#FFF6DE] border border-[#EADBBA] flex items-center justify-center text-[#F48F68] shadow-2xs">
            <Utensils className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1C1917] tracking-tight">Select Your Table</h2>
            <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">
              Choose your table number to view the interactive 3D menu.
            </p>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: totalTables }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setSelectedTable(num)}
                className={`py-3.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                  selectedTable === num
                    ? 'bg-[#F48F68] text-white border-[#F48F68] font-extrabold shadow-sm scale-102'
                    : 'bg-[#FFFDF7] border-[#EADBBA] hover:border-[#F48F68] text-[#1C1917] hover:bg-[#FFF6DE]'
                }`}
              >
                Table {num}
              </button>
            ))}
          </div>

          {/* Enter Menu Button */}
          <button
            onClick={() => onSelectTableAndEnter(selectedTable)}
            className="w-full py-3.5 rounded-xl bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            <span>View Menu for Table {selectedTable}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Quick QR Scan Link */}
          <div className="flex items-center justify-center gap-4 pt-1 text-xs">
            <button
              onClick={handleSimulateScan}
              disabled={isScanningQR}
              className="text-[#78716C] hover:text-[#F48F68] flex items-center gap-1.5 transition-colors font-medium"
            >
              <QrCode className="w-4 h-4 text-[#309694]" />
              <span>{isScanningQR ? 'Connecting...' : 'Scan Table QR'}</span>
            </button>

            <span className="text-[#EADBBA]">•</span>

            <button
              onClick={() => setIsLinkScanOpen(true)}
              className="text-[#78716C] hover:text-[#F48F68] flex items-center gap-1.5 transition-colors font-medium"
            >
              <LinkIcon className="w-4 h-4 text-[#309694]" />
              <span>Paste URL</span>
            </button>
          </div>
        </div>
      </main>

      {/* Direct Link Modal */}
      {isLinkScanOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FFFFFF] border border-[#EADBBA] rounded-2xl p-6 space-y-4 shadow-2xl text-[#1C1917]">
            <div className="flex items-center justify-between border-b border-[#EADBBA] pb-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">Paste Table Link</h3>
              <button onClick={() => setIsLinkScanOpen(false)} className="text-[#78716C] hover:text-[#1C1917] font-bold">✕</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleParseAndJoinLink(scannedUrl); }} className="space-y-3.5">
              <input
                type="text"
                placeholder="e.g. ?table=2"
                value={scannedUrl}
                onChange={(e) => setScannedUrl(e.target.value)}
                className="w-full bg-[#FFFDF7] border border-[#EADBBA] rounded-lg px-3.5 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:border-[#F48F68] focus:ring-1 focus:ring-[#F48F68] focus:outline-none"
              />

              {scanError && (
                <p className="text-xs text-rose-600 font-semibold">{scanError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLinkScanOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-[#FFF6DE] text-[#78716C] hover:text-[#1C1917] font-semibold text-xs border border-[#EADBBA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs shadow-xs"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full text-center text-xs text-[#78716C] font-semibold">
        © 2026 {restaurantName}
      </footer>
    </div>
  );
};
