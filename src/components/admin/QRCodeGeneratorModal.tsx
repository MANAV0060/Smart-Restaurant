import React, { useState } from 'react';
import { useStore } from '../../services/store';
import { QrCode, Download, Printer, X, Sparkles, Plus, Trash2, Table } from 'lucide-react';

interface QRCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeGeneratorModal: React.FC<QRCodeGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { totalTables, setTotalTables } = useStore();
  const [selectedTable, setSelectedTable] = useState<number>(1);

  if (!isOpen) return null;

  const currentUrl = `${window.location.origin}?table=${selectedTable}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&color=f97316&bgcolor=0f172a`;

  const handleAddTable = () => {
    const next = totalTables + 1;
    setTotalTables(next);
    setSelectedTable(next);
  };

  const handleRemoveTable = () => {
    if (totalTables > 1) {
      const next = totalTables - 1;
      setTotalTables(next);
      if (selectedTable > next) {
        setSelectedTable(next);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Dynamic Table QR Generator</h3>
              <span className="text-xs text-slate-400">Configure your restaurant table layout</span>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center">
          {/* Dynamic Table Count Configuration Bar */}
          <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-orange-400" /> Total Restaurant Tables: <strong className="text-orange-400">{totalTables}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveTable}
                  disabled={totalTables <= 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                  title="Remove Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleAddTable}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Table
                </button>
              </div>
            </div>

            {/* Select Table Dropdown */}
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">Select Table to View / Print QR Badge:</label>
              <select 
                value={selectedTable}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
              >
                {Array.from({ length: totalTables }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} className="bg-slate-900 text-white">
                    Table {num} (Dining Area)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Printable QR Card Badge */}
          <div className="w-72 bg-gradient-to-b from-slate-950 to-slate-900 p-6 rounded-3xl border-2 border-orange-500/40 shadow-2xl flex flex-col items-center text-center space-y-4 relative">
            <div className="text-xs font-black uppercase text-orange-400 tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> GourmetVerse AI
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-inner">
              <img src={qrSvgUrl} alt={`QR Code Table ${selectedTable}`} className="w-44 h-44 rounded-xl" />
            </div>

            <div>
              <div className="text-2xl font-black text-white">TABLE {selectedTable}</div>
              <div className="text-[11px] text-slate-400 mt-1">Scan to View 3D Menu & Order</div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex items-center gap-3">
            <a 
              href={qrSvgUrl} 
              download={`Table_${selectedTable}_QR.png`}
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
            >
              <Download className="w-4 h-4" /> Download QR Badge
            </a>

            <button 
              onClick={() => window.print()}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4" /> Print Badge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
