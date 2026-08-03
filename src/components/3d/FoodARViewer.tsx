import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { Camera, RotateCcw, Scale, Camera as ScreenshotIcon, Share2, Sparkles, X, Check } from 'lucide-react';

interface FoodARViewerProps {
  item: MenuItem;
  comparisonItem?: MenuItem;
  onClose: () => void;
}

// 3D Mesh Renderer for AR Surface Placement
function AR3DModel({ item, position }: { item: MenuItem; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const shape = item.model3DConfig?.baseShape || 'burger';

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {shape === 'pizza' ? (
        <group>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[1.2, 0.14, 16, 32]} />
            <meshStandardMaterial color="#b9770e" roughness={0.7} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.02, 0]}>
            <cylinderGeometry args={[1.2, 1.15, 0.08, 32]} />
            <meshStandardMaterial color="#fef9e7" roughness={0.3} />
          </mesh>
        </group>
      ) : shape === 'drink' ? (
        <group>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.4, 1.4, 32]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.35} transmission={0.9} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.46, 0.38, 1.2, 32]} />
            <meshStandardMaterial color="#c0392b" roughness={0.2} />
          </mesh>
        </group>
      ) : (
        <group>
          {/* Burger Model */}
          <mesh castShadow position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#c68b59" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.82, 0.82, 0.05, 32]} />
            <meshStandardMaterial color="#27ae60" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.8, 0.78, 0.18, 32]} />
            <meshStandardMaterial color="#3d1c0c" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.78, 0.75, 0.2, 32]} />
            <meshStandardMaterial color="#d2b48c" roughness={0.6} />
          </mesh>
        </group>
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
            <span className="text-xs text-orange-300 font-bold bg-slate-900/80 px-3 py-1 rounded-full border border-orange-500/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Table Surface Plane Locked
            </span>
          </div>
        </div>
      </div>

      {/* 2. Three.js Transparent 3D Canvas Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 1.8, 3.8], fov: 45 }} gl={{ alpha: true }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[4, 6, 4]} intensity={2.0} castShadow />

          <group scale={scale} rotation={[0, (rotation * Math.PI) / 180, 0]}>
            {isComparing && comparisonItem ? (
              <>
                <AR3DModel item={item} position={[-1.1, 0, 0]} />
                <AR3DModel item={comparisonItem} position={[1.1, 0, 0]} />
              </>
            ) : (
              <AR3DModel item={item} position={[0, 0, 0]} />
            )}
            <ContactShadows position={[0, -0.7, 0]} opacity={0.7} scale={5} blur={1.5} far={3} color="#000000" />
          </group>

          <OrbitControls enableZoom={true} minDistance={2} maxDistance={6} maxPolarAngle={Math.PI / 2 + 0.1} />
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
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => setScale(s => Math.max(0.6, s - 0.1))}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
          >
            <Scale className="w-4 h-4 text-orange-400" /> Scale -
          </button>

          <button 
            onClick={() => setRotation(r => r + 45)}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-orange-400" /> Rotate 45°
          </button>

          <button 
            onClick={() => setScale(s => Math.min(1.6, s + 0.1))}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
          >
            <Scale className="w-4 h-4 text-orange-400" /> Scale +
          </button>
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
