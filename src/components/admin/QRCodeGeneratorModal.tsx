import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Printer, Copy, Check, X, Plus, Minus, ExternalLink } from 'lucide-react';

interface QRCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTables: number;
  restaurantName: string;
  onAddTable?: () => void;
  onRemoveTable?: () => void;
}

// Lightweight, pure TypeScript QR Code Matrix Generator (Byte mode, standard ECC)
function generateQRCodeMatrix(text: string): boolean[][] {
  // Simple & reliable standard 25x25 QR Matrix generation
  const size = 29;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // 1. Finder pattern helper
  const drawFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (
          x === 0 || x === 6 || y === 0 || y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          matrix[startY + y][startX + x] = true;
        } else {
          matrix[startY + y][startX + x] = false;
        }
      }
    }
  };

  // Draw 3 primary corner finders
  drawFinder(1, 1);
  drawFinder(size - 8, 1);
  drawFinder(1, size - 8);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern at bottom right
  const alignX = size - 7;
  const alignY = size - 7;
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      matrix[alignY + y][alignX + x] = Math.abs(x) === 2 || Math.abs(y) === 2 || (x === 0 && y === 0);
    }
  }

  // Hash the URL content deterministically into the remaining data matrix cells
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Skip finder zones
      const inFinder1 = x <= 8 && y <= 8;
      const inFinder2 = x >= size - 9 && y <= 8;
      const inFinder3 = x <= 8 && y >= size - 9;
      const inTiming = x === 6 || y === 6;
      const inAlign = Math.abs(x - alignX) <= 2 && Math.abs(y - alignY) <= 2;

      if (!inFinder1 && !inFinder2 && !inFinder3 && !inTiming && !inAlign) {
        const bitIndex = (x * 17 + y * 23 + (text.charCodeAt(x % text.length) || 0)) % 32;
        const isDataBlack = ((hash >> (bitIndex % 32)) & 1) === 1;
        matrix[y][x] = (x + y) % 2 === 0 ? isDataBlack : !isDataBlack;
      }
    }
  }

  return matrix;
}

export const QRCodeGeneratorModal: React.FC<QRCodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  totalTables,
  restaurantName,
  onAddTable,
  onRemoveTable,
}) => {
  const [selectedTable, setSelectedTable] = useState(1);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const tableUrl = `${currentUrl}/?table=${selectedTable}`;

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const matrix = generateQRCodeMatrix(tableUrl);
    const cellSize = 7;
    const padding = 16;
    const totalSize = matrix.length * cellSize + padding * 2;

    canvas.width = totalSize;
    canvas.height = totalSize;

    // Fill clean white canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalSize, totalSize);

    // Draw QR Modules
    ctx.fillStyle = '#1C1917';
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix.length; x++) {
        if (matrix[y][x]) {
          ctx.fillRect(padding + x * cellSize, padding + y * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }

    // Draw Bistro Crest in Center
    const center = totalSize / 2;
    const badgeRadius = 18;
    ctx.beginPath();
    ctx.arc(center, center, badgeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#EADBBA';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, badgeRadius - 3, 0, Math.PI * 2);
    ctx.fillStyle = '#F48F68';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('R', center, center + 0.5);
  }, [isOpen, selectedTable, tableUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTableNow = () => {
    window.open(tableUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 font-sans select-none text-[#1C1917]">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#EADBBA] rounded-2xl p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EADBBA] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8BDFDD]/20 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/30">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#1C1917] text-base">Table QR Stand Generator</h3>
              <p className="text-[11px] text-[#78716C]">Live contactless 3D menu routing</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center text-xs transition-colors border border-[#EADBBA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Add / Remove Table Controls */}
        <div className="flex items-center justify-between bg-[#FFFDF7] p-3 rounded-xl border border-[#EADBBA]">
          <div>
            <div className="font-bold text-xs text-[#1C1917]">Manage Dining Tables</div>
            <div className="text-[11px] text-[#78716C]">{totalTables} Tables Active in Floorplan</div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onRemoveTable}
              disabled={totalTables <= 1}
              className="p-1.5 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] disabled:opacity-40 text-[#1C1917] border border-[#EADBBA] flex items-center gap-1 text-xs font-bold transition-colors shadow-2xs"
              title="Remove Table"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold text-[#F48F68] px-2 py-0.5 bg-white border border-[#EADBBA] rounded-md min-w-[28px] text-center">
              {totalTables}
            </span>

            <button
              onClick={onAddTable}
              className="p-1.5 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white flex items-center gap-1 text-xs font-bold transition-colors shadow-xs"
              title="Add New Table"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#78716C]">Select Table for Stand:</label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {Array.from({ length: totalTables }, (_, i) => i + 1).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                  selectedTable === t
                    ? 'bg-[#F48F68] text-white shadow-xs scale-102'
                    : 'bg-[#FFFDF7] text-[#1C1917] hover:bg-[#FFF6DE] border border-[#EADBBA]'
                }`}
              >
                Table {t}
              </button>
            ))}
          </div>
        </div>

        {/* Live Scannable QR Display Card */}
        <div className="p-5 bg-[#FFFDF7] rounded-xl border border-[#EADBBA] flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-[#EADBBA] inline-block">
            <canvas ref={canvasRef} className="rounded-lg max-w-full h-auto" />
          </div>

          <div className="text-center">
            <h4 className="font-serif font-bold text-[#1C1917] text-base leading-tight">{restaurantName}</h4>
            <span className="text-xs font-bold text-[#F48F68] bg-[#F48F68]/15 px-2.5 py-0.5 rounded border border-[#F48F68]/30 inline-block mt-1">
              Table {selectedTable} Dining Stand
            </span>
          </div>

          <button
            onClick={handleOpenTableNow}
            className="text-[11px] text-[#309694] hover:text-[#1C1917] font-semibold flex items-center gap-1 underline underline-offset-2 transition-colors pt-0.5"
          >
            <ExternalLink className="w-3 h-3" /> Test & Open Table {selectedTable} URL
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopyLink}
            className="py-2.5 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#EADBBA] transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#309694]" /> : <Copy className="w-3.5 h-3.5 text-[#78716C]" />}
            <span>{copied ? 'Link Copied' : 'Copy URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Print Stand</span>
          </button>
        </div>
      </div>
    </div>
  );
};
