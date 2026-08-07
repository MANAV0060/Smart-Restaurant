import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { Pin, Unlock, CheckCircle2, Camera as CameraIcon, Camera, Sparkles, RefreshCw } from 'lucide-react';
import { 
  RealisticBurger, 
  RealisticPizza, 
  RealisticPasta, 
  RealisticCurry, 
  RealisticDimSum, 
  RealisticDessert, 
  RealisticDrink,
  ExternalGLTFModelRenderer,
} from './Food3DViewer';
import { spatialAnchorEngine } from '../../services/spatialAnchorEngine';

interface FoodARViewerProps {
  item: MenuItem;
  comparisonItem?: MenuItem;
  onClose: () => void;
}

// 3D Mesh Renderer for AR Surface Placement
function AR3DModel({ item, position }: { item: MenuItem; position: [number, number, number] }) {
  const shape = item.model3DConfig?.baseShape || 'burger';
  const isExternal = Boolean(item.externalModelUrl);

  return (
    <group position={position}>
      {isExternal && item.externalModelUrl ? (
        <React.Suspense fallback={null}>
          <ExternalGLTFModelRenderer 
            url={item.externalModelUrl} 
            scale={item.externalModelScale || 1.0} 
            rotation={[0, 0, 0]} 
          />
        </React.Suspense>
      ) : shape === 'pizza' ? (
        <RealisticPizza />
      ) : shape === 'pasta' ? (
        <RealisticPasta />
      ) : shape === 'curry' ? (
        <RealisticCurry />
      ) : shape === 'sushi' ? (
        <RealisticDimSum />
      ) : shape === 'dessert' ? (
        <RealisticDessert />
      ) : shape === 'drink' ? (
        <RealisticDrink />
      ) : (
        <RealisticBurger />
      )}
    </group>
  );
}

export const FoodARViewer: React.FC<FoodARViewerProps> = ({ item, comparisonItem, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFixedOnTable, setIsFixedOnTable] = useState(false);
  const [showLockToast, setShowLockToast] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Request & Start Camera Stream with Fallback Pipeline
  const requestCameraStream = async () => {
    try {
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser context.');
        return;
      }

      let stream: MediaStream | null = null;
      try {
        // 1. Rear camera for phones
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
      } catch {
        try {
          // 2. Front camera / webcam
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          });
        } catch {
          // 3. Generic video input
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera permission blocked. Please grant camera permission in browser settings.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    requestCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle 'FIX ON TABLE' action
  const handleToggleFixOnTable = () => {
    const nextState = spatialAnchorEngine.toggleLock([0, -0.4, 0]);
    setIsFixedOnTable(nextState.isFixed);

    if (nextState.isFixed) {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 1800);
    }
  };

  const takeScreenshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      alert(`📸 Photo of ${item.name} captured on table!`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Background Feed (Live Camera Stream or Virtual Dining Table Surface) */}
      <div className="absolute inset-0 z-0 bg-[#070a0f] overflow-hidden flex items-center justify-center">
        {/* Video Element (ALWAYS mounted in DOM so ref and stream work) */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            cameraActive ? 'opacity-100' : 'opacity-0 hidden'
          }`}
        />

        {/* Fallback Virtual Table Surface */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1017] via-slate-900 to-[#070a0f] flex flex-col items-center justify-center p-6 text-center">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 70%), linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 40px 40px'
              }}
            ></div>

            {/* Camera Request Banner if camera permission needed */}
            <div className="relative z-10 max-w-xs bg-slate-900/90 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-2xl flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Live AR Camera Feed</h3>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                {cameraError || 'Point your camera at a flat table surface to view food in 3D AR.'}
              </p>
              <button
                onClick={requestCameraStream}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-transform"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Enable Phone Camera
              </button>
            </div>
          </div>
        )}

        {/* Surface Detection Plane Indicator Ring */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-72 h-72 rounded-full border border-dashed border-amber-500/40 opacity-40 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-[10px] font-black text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-md shadow-xl flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Table Surface Plane Locked
            </span>
          </div>
        </div>
      </div>

      {/* 2. Three.js Transparent 3D AR Canvas Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas 
          dpr={[1, 2]} 
          performance={{ min: 0.5 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} 
          camera={{ position: [0, 1.8, 3.8], fov: 45 }}
        >
          <Environment preset="sunset" />
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffaa55" />

          {/* 3D Food Model Anchored on Table Surface */}
          <group position={[0, -0.4, 0]}>
            <Float speed={isFixedOnTable ? 0 : 0.8} rotationIntensity={isFixedOnTable ? 0 : 0.03} floatIntensity={isFixedOnTable ? 0 : 0.05}>
              {comparisonItem ? (
                <>
                  <AR3DModel item={item} position={[-1.3, 0, 0]} />
                  <AR3DModel item={comparisonItem} position={[1.3, 0, 0]} />
                </>
              ) : (
                <AR3DModel item={item} position={[0, 0, 0]} />
              )}
            </Float>
            <ContactShadows position={[0, -0.1, 0]} opacity={0.85} scale={7.5} blur={2.2} far={4} color="#000000" />
          </group>

          {/* Orbit Controls (Allows Diners to Orbit/Rotate Camera around Anchored Food) */}
          <OrbitControls 
            enableZoom={true} 
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={1.2} 
            maxDistance={6} 
            maxPolarAngle={Math.PI / 2 + 0.05} 
            enablePan={!isFixedOnTable}
          />
        </Canvas>
      </div>

      {/* Top Header - Status Badge & Close Button */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          {cameraActive ? (
            <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Phone Camera Feed
            </span>
          ) : (
            <button 
              onClick={requestCameraStream}
              className="bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" /> Enable Camera
            </button>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-950/80 backdrop-blur-xl text-white font-bold text-sm flex items-center justify-center border border-slate-700/80 hover:bg-slate-800 active:scale-95 shadow-2xl transition-transform"
        >
          ✕
        </button>
      </div>

      {/* Lock Feedback Toast Notice */}
      {showLockToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-full font-black text-xs shadow-2xl flex items-center gap-1.5 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4" /> Position Fixed on Table!
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="relative z-20 p-4 pb-safe flex items-center justify-between max-w-md mx-auto w-full gap-3 pointer-events-auto">
        <button 
          onClick={takeScreenshot}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 shadow-xl backdrop-blur-xl"
        >
          <CameraIcon className="w-4 h-4 text-amber-400" />
        </button>

        <button 
          onClick={handleToggleFixOnTable}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 backdrop-blur-xl border ${
            isFixedOnTable 
              ? 'bg-slate-900/95 text-amber-400 border-amber-500/80 shadow-amber-500/20' 
              : 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400 shadow-amber-500/40'
          }`}
        >
          {isFixedOnTable ? (
            <>
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>UNFIX / REPOSITION</span>
            </>
          ) : (
            <>
              <Pin className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>FIX ON TABLE</span>
            </>
          )}
        </button>
      </div>

      {isCapturing && (
        <div className="absolute inset-0 z-50 bg-white animate-flash pointer-events-none"></div>
      )}
    </div>
  );
};
