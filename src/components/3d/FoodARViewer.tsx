import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MenuItem } from '../../types';
import { getItemPhysicalDimensions } from '../../services/arTrackingEngine';
import { 
  Camera, X, Sparkles, CheckCircle2, RotateCw, 
  Layers, ShieldCheck, Ruler, QrCode, ExternalLink, Play, Info
} from 'lucide-react';

// Type declaration for <model-viewer> custom element in React JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          exposure?: string | number;
          loading?: string;
          reveal?: string;
          poster?: string;
          'quick-look-browsers'?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface FoodARViewerProps {
  item: MenuItem;
  onClose: () => void;
}

export const FoodARViewer: React.FC<FoodARViewerProps> = ({ item, onClose }) => {
  const [modelProgress, setModelProgress] = useState<number>(0);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [arStatus, setArStatus] = useState<string>('Ready for Table AR');

  const modelViewerRef = useRef<HTMLElement>(null);
  const physicalDimensions = useMemo(() => getItemPhysicalDimensions(item), [item]);

  // Model URL (Vite serves from /models/...)
  const modelUrl = item.externalModelUrl || '/models/burger.glb';

  // Listen to model-viewer loading progress and AR session events
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    const onProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{ totalProgress: number }>;
      const progress = Math.round((customEvent.detail?.totalProgress || 0) * 100);
      setModelProgress(progress);
      if (progress >= 100) {
        setIsModelLoaded(true);
      }
    };

    const onLoad = () => {
      setIsModelLoaded(true);
      setModelProgress(100);
    };

    const onArStatus = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: string }>;
      const status = customEvent.detail?.status;
      if (status === 'session-started') {
        setArStatus('WebXR AR Active • Aim at table');
      } else if (status === 'object-placed') {
        setArStatus('Anchored to Physical Table');
      } else if (status === 'not-presenting') {
        setArStatus('Ready for Table AR');
      }
    };

    mv.addEventListener('progress', onProgress);
    mv.addEventListener('load', onLoad);
    mv.addEventListener('ar-status', onArStatus);

    return () => {
      mv.removeEventListener('progress', onProgress);
      mv.removeEventListener('load', onLoad);
      mv.removeEventListener('ar-status', onArStatus);
    };
  }, []);

  // Programmatically trigger native WebXR / ARCore session
  const handleLaunchAR = () => {
    const mv = modelViewerRef.current as unknown as { activateAR?: () => Promise<void> } | null;
    if (mv && typeof mv.activateAR === 'function') {
      mv.activateAR().catch((err: unknown) => {
        console.warn('Native WebXR prompt notice:', err);
      });
    }
  };

  // Google Scene Viewer fallback intent URL (for Android)
  const fullOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    fullOrigin + modelUrl
  )}&mode=ar_preferred&title=${encodeURIComponent(item.name)}&resizable=true#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;

  const mobileUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/?arItem=${item.id}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917] flex flex-col font-sans select-none text-[#1C1917] overflow-hidden">
      {/* 3D & WebXR Model-Viewer Viewport (Full Screen) */}
      <div className="absolute inset-0 z-0 bg-radial from-stone-800 to-stone-950 flex items-center justify-center">
        <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          alt={item.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="fixed"
          ar-placement="floor"
          camera-controls
          auto-rotate
          shadow-intensity="1.6"
          shadow-softness="0.8"
          exposure="1.05"
          loading="eager"
          reveal="auto"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            outline: 'none',
          }}
        >
          {/* Custom AR Button slot inside model-viewer */}
          <button
            slot="ar-button"
            id="default-ar-button"
            className="hidden"
          >
            Launch AR
          </button>
        </model-viewer>

        {/* Loading Overlay if downloading GLB */}
        {!isModelLoaded && modelProgress < 100 && (
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF6DE] border border-[#EADBBA] flex items-center justify-center shadow-xl animate-pulse">
              <Sparkles className="w-6 h-6 text-[#F48F68]" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-serif font-bold text-white text-sm">Preparing 3D Food Model</h4>
              <p className="text-xs text-white/70">Optimized for fast mobile AR streaming ({modelProgress}%)</p>
            </div>
            <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8BDFDD] transition-all duration-300"
                style={{ width: `${modelProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Top Floating AR HUD */}
      <div className="relative z-20 p-3 sm:p-4 max-w-lg mx-auto w-full pt-[calc(env(safe-area-inset-top,10px)+4px)]">
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EADBBA] rounded-2xl p-3 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8BDFDD]/25 text-[#309694] flex items-center justify-center border border-[#8BDFDD]/40 shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-[#1C1917] text-xs sm:text-sm">{item.name}</h3>
                <span className="text-[10px] font-bold text-[#F48F68] bg-[#FFF6DE] px-1.5 py-0.5 rounded border border-[#EADBBA]">
                  ₹{item.price}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#78716C] mt-0.5">
                <span className="flex items-center gap-1 text-[#309694] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  {arStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowQRModal(true)}
              className="p-2 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] transition-colors"
              title="Open on phone"
            >
              <QrCode className="w-4 h-4 text-[#F48F68]" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] transition-colors"
              title="Close AR"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Panel */}
      <div className="relative z-20 p-3 sm:p-4 max-w-lg mx-auto w-full space-y-2.5 pb-[calc(env(safe-area-inset-bottom,10px)+4px)] mt-auto">
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EADBBA] rounded-2xl p-4 shadow-2xl space-y-3">
          {/* Physical Dimensions Gauge */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-[#F48F68]" />
              <span className="font-bold text-[#1C1917]">True Dining Scale:</span>
              <span className="font-semibold text-[#309694]">
                Ø {physicalDimensions.diameterCm} cm × {physicalDimensions.heightCm} cm
              </span>
            </div>

            <span className="bg-[#FFF6DE] text-[#309694] font-bold text-[10px] px-2 py-0.5 rounded border border-[#EADBBA]">
              1:1 Fixed Real-World Size
            </span>
          </div>

          {/* AR Launch Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Primary WebXR Launch Button */}
            <button
              onClick={handleLaunchAR}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-[#F48F68] hover:bg-[#f27c50] text-white shadow-lg transition-all active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Place on Real Table in AR</span>
            </button>

            {/* Google Scene Viewer Direct Link (Android Fallback) */}
            <a
              href={sceneViewerUrl}
              className="py-3 px-4 rounded-xl bg-[#8BDFDD] hover:bg-[#74d2d0] text-[#1C1917] font-bold text-xs border border-[#8BDFDD] transition-colors shadow-lg flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-[#1C1917]" />
              <span>Google Scene Viewer</span>
            </a>
          </div>

          {/* Quick Tip Footer */}
          <div className="pt-2 border-t border-[#EADBBA]/60 flex items-center justify-between text-[11px] text-[#78716C]">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-[#F48F68]" /> Drag to spin 360° • Pinch to zoom
            </span>
            <span className="font-semibold text-[#309694]">Auto-anchors to table</span>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Mobile Testing */}
      {showQRModal && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-[#FFFFFF] border border-[#EADBBA] rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#309694] font-bold text-xs">
                <Camera className="w-4 h-4 text-[#F48F68]" />
                <span>Open on Smartphone</span>
              </div>
              <button 
                onClick={() => setShowQRModal(false)}
                className="w-6 h-6 rounded-md bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#78716C] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-white border border-[#EADBBA] rounded-xl shadow-inner inline-block mx-auto">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}`}
                alt="Scan to open AR on Phone"
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">Scan with your Phone Camera</h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Opens directly in Chrome on Android or Safari on iOS for instant table AR.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(mobileUrl);
                alert('Link copied to clipboard!');
              }}
              className="w-full py-2 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs transition-colors"
            >
              Copy Mobile Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
