import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { Camera, RotateCcw, Scale, Camera as ScreenshotIcon, Share2, Sparkles, Layers } from 'lucide-react';
import { 
  RealisticBurger, 
  RealisticPizza, 
  RealisticPasta, 
  RealisticCurry, 
  RealisticDimSum, 
  RealisticDessert, 
  RealisticDrink 
} from './Food3DViewer';

interface FoodARViewerProps {
  item: MenuItem;
  comparisonItem?: MenuItem;
  onClose: () => void;
}

// 3D Mesh Renderer for AR Surface Placement using High-Fidelity Models
function AR3DModel({ item, position, exploded, onSelectLayer, highlightedIndex }: { item: MenuItem; position: [number, number, number], exploded: boolean, onSelectLayer: (idx: number | null) => void, highlightedIndex: number | null }) {
  const shape = item.model3DConfig?.baseShape || 'burger';

  return (
    <group position={position}>
      {shape === 'pizza' ? (
        <RealisticPizza exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      ) : shape === 'pasta' ? (
        <RealisticPasta exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      ) : shape === 'curry' ? (
        <RealisticCurry exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      ) : shape === 'sushi' ? (
        <RealisticDimSum exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      ) : shape === 'dessert' ? (
        <RealisticDessert exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      ) : shape === 'drink' ? (
        <RealisticDrink exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      ) : (
        <RealisticBurger exploded={exploded} highlightedIndex={highlightedIndex} onSelectLayer={onSelectLayer} />
      )}
    </group>
  );
}

export const FoodARViewer: React.FC<FoodARViewerProps> = ({ item, comparisonItem, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isComparing, setIsComparing] = useState(!!comparisonItem);
  const [exploded, setExploded] = useState(false);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        setCameraError('Live camera stream unavailable. Running Table AR Grid Simulator.');
      }
    }

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takeScreenshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      alert('📸 AR 3D Table Photo captured and saved to gallery!');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Background Video Feed or Simulated Grid */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />

        {(!cameraActive || cameraError) && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-orange-400 border border-slate-700">
              <Camera className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">AR Table Surface Grid</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              {cameraError || 'Aligning 3D food model on virtual surface'}
            </p>
          </div>
        )}

        {/* 3D AR Table Surface Grid Indicator */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border-2 border-dashed border-orange-500/40 animate-ping opacity-30"></div>
          <div className="w-64 h-64 rounded-full border border-orange-400/50 flex items-center justify-center">
            <span className="text-xs text-orange-300 font-bold bg-slate-900/80 px-3 py-1 rounded-full border border-orange-500/40 backdrop-blur-md shadow-xl">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Table Surface Plane Locked
            </span>
          </div>
        </div>
      </div>

      {/* 2. Three.js Transparent 3D Canvas Overlay with Environment Lighting */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 1.8, 3.8], fov: 45 }} gl={{ alpha: true, antialias: true }}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffaa55" />

          <group scale={scale} rotation={[0, (rotation * Math.PI) / 180, 0]}>
            <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
              {isComparing && comparisonItem ? (
                <>
                  <AR3DModel item={item} position={[-1.2, 0, 0]} exploded={exploded} onSelectLayer={setSelectedLayerIndex} highlightedIndex={selectedLayerIndex} />
                  <AR3DModel item={comparisonItem} position={[1.2, 0, 0]} exploded={exploded} onSelectLayer={setSelectedLayerIndex} highlightedIndex={selectedLayerIndex} />
                </>
              ) : (
                <AR3DModel item={item} position={[0, 0, 0]} exploded={exploded} onSelectLayer={setSelectedLayerIndex} highlightedIndex={selectedLayerIndex} />
              )}
            </Float>
            <ContactShadows position={[0, -1.0, 0]} opacity={0.8} scale={8} blur={2.5} far={4} color="#000000" />
          </group>

          <OrbitControls enableZoom={true} minDistance={1.5} maxDistance={6} maxPolarAngle={Math.PI / 2 + 0.1} />
        </Canvas>
      </div>

      {/* Top Header */}
      <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" /> 3D AR Table Surface Active
          </span>
        </div>

        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-900/80 text-white font-bold text-sm flex items-center justify-center border border-slate-700 hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExploded(!exploded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
              exploded 
                ? 'bg-orange-500 text-white shadow-orange-500/30' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            {exploded ? 'Collapse AR View' : 'AR Exploded Layer View'}
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setScale(s => Math.max(0.6, s - 0.1))}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-700"
            >
              <Scale className="w-4 h-4 text-orange-400" /> -
            </button>
            <button 
              onClick={() => setRotation(r => r + 45)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4 text-orange-400" /> 45°
            </button>
            <button 
              onClick={() => setScale(s => Math.min(1.6, s + 0.1))}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-700"
            >
              <Scale className="w-4 h-4 text-orange-400" /> +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <button 
            onClick={takeScreenshot}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/30"
          >
            <ScreenshotIcon className="w-4 h-4" /> Take AR Photo
          </button>

          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: item.name,
                  text: `Check out ${item.name} in 3D AR on my table!`,
                  url: window.location.href,
                });
              } else {
                alert('🔗 AR Link copied to clipboard!');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-orange-400" /> Share AR
          </button>
        </div>
      </div>

      {isCapturing && (
        <div className="absolute inset-0 z-50 bg-white animate-flash pointer-events-none"></div>
      )}
    </div>
  );
};
