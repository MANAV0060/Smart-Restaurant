import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { 
  getItemPhysicalDimensions, 
  checkWebXRARSupport 
} from '../../services/arTrackingEngine';
import { 
  Camera, X, Sparkles, CheckCircle2, RotateCw, 
  Layers, ShieldCheck, AlertCircle, Ruler, RefreshCw, 
  Zap, Lock, Unlock, QrCode, ExternalLink, Play
} from 'lucide-react';
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
  onClose: () => void;
}

interface AnchorTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

// 3D GLTF Model Component scaled to exact real-world meters
function WebXRGLTFModel({ 
  url, 
  metricScale = 0.15, 
  rotationY = 0 
}: { 
  url: string; 
  metricScale?: number; 
  rotationY?: number; 
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.z);
    // Normalize to exact target metric diameter (in meters)
    const factor = (metricScale / (maxDim || 1));
    clone.scale.set(factor, factor, factor);

    // Adjust bottom to lie flush on the table surface (y = 0)
    const updatedBox = new THREE.Box3().setFromObject(clone);
    clone.position.y = -updatedBox.min.y;
    return clone;
  }, [scene, metricScale]);

  return (
    <group rotation={[0, rotationY, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// 3D Surface Reticle hovering on the physical table plane
function WorldSpaceReticle() {
  return (
    <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Targeting Ring */}
      <mesh>
        <ringGeometry args={[0.12, 0.13, 36]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
      {/* Inner Pulsing Radar Ring */}
      <mesh>
        <ringGeometry args={[0.08, 0.09, 36]} />
        <meshBasicMaterial color="#8BDFDD" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      {/* Center Target Dot */}
      <mesh>
        <circleGeometry args={[0.015, 24]} />
        <meshBasicMaterial color="#F48F68" side={THREE.DoubleSide} />
      </mesh>
      {/* 4 Alignment Ticks */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={idx} rotation={[0, 0, angle]} position={[Math.cos(angle) * 0.105, Math.sin(angle) * 0.105, 0]}>
          <planeGeometry args={[0.008, 0.03]} />
          <meshBasicMaterial color="#FFE394" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Internal WebXR Session & Hit-Testing Controller
function WebXRHitTestController({
  item,
  placed,
  anchorTransform,
  onAutoPlace,
  rotationY,
  scaleMultiplier,
}: {
  item: MenuItem;
  placed: boolean;
  anchorTransform: AnchorTransform | null;
  onAutoPlace: (transform: AnchorTransform) => void;
  rotationY: number;
  scaleMultiplier: number;
}) {
  const { gl } = useThree();
  const reticleRef = useRef<THREE.Group>(null);
  const [hitTestSource, setHitTestSource] = useState<XRHitTestSource | null>(null);
  const [localSpace, setLocalSpace] = useState<XRReferenceSpace | null>(null);
  const consecutiveHitsRef = useRef(0);

  const physicalDimensions = useMemo(() => getItemPhysicalDimensions(item), [item]);
  // Metric diameter in meters (e.g. 14.2 cm = 0.142 m)
  const targetDiameterMeters = (physicalDimensions.diameterCm / 100) * scaleMultiplier;

  // Initialize WebXR hit-test source when session starts
  useEffect(() => {
    const session = gl.xr.getSession();
    if (!session) return;

    let active = true;

    async function setupHitTest() {
      try {
        const viewerSpace = await session!.requestReferenceSpace('viewer');
        // Request hit test source relative to viewer camera
        if ('requestHitTestSource' in session!) {
          const source = await (session as unknown as { 
            requestHitTestSource: (options: { space: XRReferenceSpace }) => Promise<XRHitTestSource> 
          }).requestHitTestSource({ space: viewerSpace });
          
          const refSpace = await session!.requestReferenceSpace('local');

          if (active) {
            setHitTestSource(source);
            setLocalSpace(refSpace);
          }
        }
      } catch (err) {
        console.warn('Hit test source setup notice:', err);
      }
    }

    setupHitTest();

    const onSessionEnd = () => {
      active = false;
      setHitTestSource(null);
      setLocalSpace(null);
      consecutiveHitsRef.current = 0;
    };

    session.addEventListener('end', onSessionEnd);
    return () => {
      active = false;
      session.removeEventListener('end', onSessionEnd);
    };
  }, [gl.xr]);

  // Frame-by-frame WebXR Hit-Testing Loop
  useFrame((_, __, xrFrame) => {
    if (!xrFrame || !hitTestSource || !localSpace || !reticleRef.current) return;

    if (!placed) {
      const hitTestResults = xrFrame.getHitTestResults(hitTestSource);

      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(localSpace);

        if (pose) {
          reticleRef.current.visible = true;
          const matrix = new THREE.Matrix4().fromArray(pose.transform.matrix);
          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          matrix.decompose(position, quaternion, scale);

          reticleRef.current.position.copy(position);
          reticleRef.current.quaternion.copy(quaternion);

          consecutiveHitsRef.current++;

          // AUTOMATIC PLACEMENT: As soon as table plane is stably tracked for 4 consecutive frames
          if (consecutiveHitsRef.current >= 4) {
            onAutoPlace({
              position: position.clone(),
              quaternion: quaternion.clone(),
            });
            consecutiveHitsRef.current = 0;
          }
        }
      } else {
        reticleRef.current.visible = false;
        consecutiveHitsRef.current = Math.max(0, consecutiveHitsRef.current - 1);
      }
    } else {
      reticleRef.current.visible = false;
    }
  });

  const isExternal = Boolean(item.externalModelUrl);
  const shape = item.model3DConfig?.baseShape || 'burger';

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 4, 3]} intensity={2.5} castShadow />
      <directionalLight position={[-2, 3, -1]} intensity={0.9} color="#FFE394" />
      <Environment preset="sunset" />

      {/* Surface Reticle tracking the real physical table plane */}
      <group ref={reticleRef} visible={false}>
        <WorldSpaceReticle />
      </group>

      {/* 3D Model Anchored to Exact Physical Coordinates in World Space */}
      {placed && anchorTransform && (
        <group position={anchorTransform.position} quaternion={anchorTransform.quaternion}>
          {isExternal && item.externalModelUrl ? (
            <Suspense fallback={null}>
              <WebXRGLTFModel 
                url={item.externalModelUrl} 
                metricScale={targetDiameterMeters} 
                rotationY={rotationY} 
              />
            </Suspense>
          ) : (
            <group rotation={[0, rotationY, 0]} scale={[targetDiameterMeters * 2, targetDiameterMeters * 2, targetDiameterMeters * 2]}>
              {shape === 'pizza' ? (
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
          )}

          {/* Real-World Contact Shadow cast directly on the physical table plane */}
          <ContactShadows 
            position={[0, 0.001, 0]} 
            opacity={0.75} 
            scale={targetDiameterMeters * 2.5} 
            blur={1.5} 
            far={1.0} 
            color="#1c1917" 
          />
        </group>
      )}
    </>
  );
}

export const FoodARViewer: React.FC<FoodARViewerProps> = ({ item, onClose }) => {
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [anchorTransform, setAnchorTransform] = useState<AnchorTransform | null>(null);
  const [rotationY, setRotationY] = useState(0);
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);
  const [autoPlacedNotice, setAutoPlacedNotice] = useState(false);
  const [webXRError, setWebXRError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const physicalDimensions = useMemo(() => getItemPhysicalDimensions(item), [item]);

  // Check if device supports native WebXR immersive-ar
  useEffect(() => {
    checkWebXRARSupport().then((supported) => {
      setIsWebXRSupported(supported);
    });
  }, []);

  // Launch Native WebXR Session with hit-test & dom-overlay
  const handleStartWebXRSession = async () => {
    setWebXRError(null);

    if (typeof navigator === 'undefined' || !('xr' in navigator)) {
      setWebXRError('WebXR is not supported on this browser.');
      return;
    }

    try {
      const xr = (navigator as unknown as { 
        xr: { 
          requestSession: (mode: string, options: unknown) => Promise<XRSession> 
        } 
      }).xr;

      const sessionInit = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor', 'light-estimation'],
        domOverlay: overlayRef.current ? { root: overlayRef.current } : undefined,
      };

      const session = await xr.requestSession('immersive-ar', sessionInit);

      if (glRef.current) {
        await glRef.current.xr.setSession(session);
      }

      setIsSessionActive(true);

      session.addEventListener('end', () => {
        setIsSessionActive(false);
        setPlaced(false);
        setAnchorTransform(null);
      });
    } catch (err: unknown) {
      console.error('WebXR session request error:', err);
      const message = err instanceof Error ? err.message : String(err);
      setWebXRError(`Could not start WebXR AR session: ${message}`);
    }
  };

  const handleAutoPlace = (transform: AnchorTransform) => {
    if (!placed) {
      setAnchorTransform(transform);
      setPlaced(true);
      setAutoPlacedNotice(true);

      // Trigger haptic feedback if available
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 30, 40]);
        } catch {
          // ignore
        }
      }

      setTimeout(() => setAutoPlacedNotice(false), 3000);
    }
  };

  const handleUnlockAndRescan = () => {
    setPlaced(false);
    setAnchorTransform(null);
    setRotationY(0);
    setScaleMultiplier(1.0);
  };

  const currentDiameterCm = (physicalDimensions.diameterCm * scaleMultiplier).toFixed(1);
  const currentHeightCm = (physicalDimensions.heightCm * scaleMultiplier).toFixed(1);

  // Network URL for testing
  const mobileUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/?arItem=${item.id}`
    : '';

  // Google Scene Viewer fallback for Android devices
  const sceneViewerUrl = item.externalModelUrl
    ? `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        window.location.origin + item.externalModelUrl
      )}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans select-none text-[#1C1917] overflow-hidden">
      {/* 3D WebXR Canvas (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            glRef.current = gl;
            gl.xr.enabled = true;
          }}
        >
          <WebXRHitTestController 
            item={item}
            placed={placed}
            anchorTransform={anchorTransform}
            onAutoPlace={handleAutoPlace}
            rotationY={rotationY}
            scaleMultiplier={scaleMultiplier}
          />
        </Canvas>
      </div>

      {/* WebXR DOM Overlay UI Layer */}
      <div 
        ref={overlayRef} 
        className="relative z-10 w-full h-full flex flex-col justify-between p-3 sm:p-4 pointer-events-none"
      >
        {/* Top Header Bar */}
        <div className="max-w-lg mx-auto w-full pt-[calc(env(safe-area-inset-top,10px)+4px)] pointer-events-auto">
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
                    {placed 
                      ? 'Locked to Table (World-Space 6DoF)' 
                      : isSessionActive 
                      ? 'Aim camera at table to auto-place' 
                      : 'WebXR Table Tracking'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isSessionActive && glRef.current) {
                  const s = glRef.current.xr.getSession();
                  s?.end();
                }
                onClose();
              }}
              className="p-2 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] transition-colors"
              title="Close AR"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* WebXR Error Banner if unsupported */}
          {webXRError && (
            <div className="mt-2 bg-amber-500/90 text-slate-950 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{webXRError}</span>
            </div>
          )}
        </div>

        {/* Center Guidance Notification */}
        <div className="max-w-sm mx-auto my-auto text-center px-4 pointer-events-none">
          {isSessionActive && !placed && (
            <div className="bg-black/80 backdrop-blur-md text-white border border-[#8BDFDD] px-5 py-3 rounded-2xl shadow-2xl inline-flex flex-col items-center gap-1 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8BDFDD]">
                <Layers className="w-4 h-4" />
                <span>Move phone slowly over dining table</span>
              </div>
              <p className="text-[11px] text-white/80">
                WebXR hit-testing will <strong>automatically anchor</strong> the dish to the table.
              </p>
            </div>
          )}

          {autoPlacedNotice && (
            <div className="bg-[#309694]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl inline-flex items-center gap-2 text-xs font-bold animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-[#FFE394]" />
              <span>Anchored to Table! Walk around to view.</span>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="max-w-lg mx-auto w-full space-y-2 pb-[calc(env(safe-area-inset-bottom,10px)+4px)] pointer-events-auto">
          {/* Non-Active Session Prompt: Launch WebXR Button */}
          {!isSessionActive ? (
            <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EADBBA] rounded-2xl p-4 shadow-xl text-center space-y-3">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  True World-Space WebXR Tracking
                </h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Uses physical plane hit-testing so the 3D model stays pinned to your table as you walk around.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleStartWebXRSession}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-[#F48F68] hover:bg-[#f27c50] text-white shadow-lg transition-all active:scale-98"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start WebXR AR Session</span>
                </button>

                {sceneViewerUrl && (
                  <a
                    href={sceneViewerUrl}
                    className="py-3 px-4 rounded-xl bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] font-bold text-xs border border-[#EADBBA] transition-colors shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4 text-[#309694]" />
                    <span>Google Scene Viewer</span>
                  </a>
                )}
              </div>

              {isWebXRSupported === false && (
                <div className="pt-2 border-t border-[#EADBBA] text-[11px] text-[#78716C]">
                  WebXR is supported on Chrome for Android with Google Play Services for AR.
                </div>
              )}
            </div>
          ) : (
            /* Active WebXR Session Controls */
            <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EADBBA] rounded-2xl p-3 shadow-xl space-y-2.5">
              {/* Physical Dimension Meter */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#F48F68]" />
                  <span className="font-bold text-[#1C1917]">1:1 Metric Scale:</span>
                  <span className="font-semibold text-[#309694]">
                    Ø {currentDiameterCm} cm × {currentHeightCm} cm
                  </span>
                </div>

                <button
                  onClick={() => setScaleMultiplier(1.0)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                    Math.abs(scaleMultiplier - 1.0) < 0.05
                      ? 'bg-[#8BDFDD] text-[#1C1917] border-[#8BDFDD]' 
                      : 'bg-[#FFF6DE] text-[#78716C] border-[#EADBBA]'
                  }`}
                >
                  1:1 Real Scale
                </button>
              </div>

              {/* Rotation & Scale Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#EADBBA]/60">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#78716C] font-semibold">
                    <span>Portion Scale</span>
                    <span>{(scaleMultiplier * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.5" 
                    step="0.05"
                    value={scaleMultiplier}
                    onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-[#F48F68] h-1.5 bg-[#FFF6DE] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#78716C] font-semibold">
                    <span>Rotate on Table</span>
                    <span>{Math.round((rotationY * 180) / Math.PI) % 360}°</span>
                  </div>
                  <input 
                    type="range" 
                    min={-Math.PI} 
                    max={Math.PI} 
                    step="0.05"
                    value={rotationY}
                    onChange={(e) => setRotationY(parseFloat(e.target.value))}
                    className="w-full accent-[#309694] h-1.5 bg-[#FFF6DE] rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {placed ? (
                  <button
                    onClick={handleUnlockAndRescan}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#8BDFDD] hover:bg-[#74d2d0] text-[#1C1917] transition-all"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Reposition / Move Dish</span>
                  </button>
                ) : (
                  <div className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#FFF6DE] text-[#78716C] border border-[#EADBBA]">
                    <Layers className="w-3.5 h-3.5 animate-pulse text-[#F48F68]" />
                    <span>Detecting table surface...</span>
                  </div>
                )}

                <button
                  onClick={handleUnlockAndRescan}
                  className="p-2.5 rounded-xl bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA]"
                  title="Reset table position"
                >
                  <RefreshCw className="w-4 h-4 text-[#F48F68]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
