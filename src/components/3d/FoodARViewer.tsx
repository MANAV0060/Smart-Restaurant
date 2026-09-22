import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { 
  getItemPhysicalDimensions, 
  checkWebXRARSupport,
  extractSurfaceFeatures,
  MobileSensorFusion,
  SensorTelemetry,
  SurfaceFeaturePoint
} from '../../services/arTrackingEngine';
import { 
  Camera, X, Sparkles, CheckCircle2, RotateCw, 
  Layers, ShieldCheck, AlertCircle, Ruler, RefreshCw, 
  Zap, Lock, Unlock, QrCode, ExternalLink, Play, Check
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

// 3D GLTF Model Component normalized to real-world meters
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
    const factor = (metricScale / (maxDim || 1));
    clone.scale.set(factor, factor, factor);

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

// Physical Surface Reticle indicator
function SurfaceReticleMesh() {
  return (
    <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[0.10, 0.12, 36]} />
        <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.06, 0.08, 36]} />
        <meshBasicMaterial color="#8BDFDD" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.018, 24]} />
        <meshBasicMaterial color="#F48F68" side={THREE.DoubleSide} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh key={idx} rotation={[0, 0, angle]} position={[Math.cos(angle) * 0.09, Math.sin(angle) * 0.09, 0]}>
          <planeGeometry args={[0.006, 0.025]} />
          <meshBasicMaterial color="#FFE394" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Internal Three.js WebXR Hit-Testing Loop Component
function WebXRHitTestManager({
  item,
  placed,
  anchorTransform,
  onPlace,
  rotationY,
  scaleMultiplier,
}: {
  item: MenuItem;
  placed: boolean;
  anchorTransform: AnchorTransform | null;
  onPlace: (transform: AnchorTransform) => void;
  rotationY: number;
  scaleMultiplier: number;
}) {
  const { gl } = useThree();
  const reticleRef = useRef<THREE.Group>(null);
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const hitTestSourceRequestedRef = useRef(false);
  const consecutiveHitsRef = useRef(0);

  const physicalDimensions = useMemo(() => getItemPhysicalDimensions(item), [item]);
  const targetDiameterMeters = (physicalDimensions.diameterCm / 100) * scaleMultiplier;

  // Listen for WebXR 'select' event (tap anywhere on screen in WebXR session)
  useEffect(() => {
    const session = gl.xr.getSession();
    if (!session) return;

    const handleSelect = () => {
      if (reticleRef.current && reticleRef.current.visible && !placed) {
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        reticleRef.current.matrix.decompose(position, quaternion, scale);

        onPlace({
          position: position.clone(),
          quaternion: quaternion.clone(),
        });
      }
    };

    session.addEventListener('select', handleSelect);
    return () => {
      session.removeEventListener('select', handleSelect);
    };
  }, [gl.xr, placed, onPlace]);

  // Frame-by-frame WebXR Hit-Testing Loop
  useFrame((_, __, xrFrame) => {
    if (!xrFrame || !reticleRef.current) return;

    const session = gl.xr.getSession();
    if (!session) return;

    // 1. Initialize Hit Test Source dynamically on first available frame
    if (!hitTestSourceRequestedRef.current) {
      hitTestSourceRequestedRef.current = true;
      session.requestReferenceSpace('viewer').then((viewerSpace) => {
        if ('requestHitTestSource' in session) {
          (session as unknown as { 
            requestHitTestSource: (options: { space: XRReferenceSpace }) => Promise<XRHitTestSource> 
          }).requestHitTestSource({ space: viewerSpace })
            .then((source) => {
              hitTestSourceRef.current = source;
            })
            .catch((err) => {
              console.warn('Error requesting hit test source:', err);
            });
        }
      }).catch((err) => console.warn('Viewer space error:', err));

      session.addEventListener('end', () => {
        hitTestSourceRef.current = null;
        hitTestSourceRequestedRef.current = false;
        consecutiveHitsRef.current = 0;
      });
    }

    // 2. Perform Hit-Testing against the physical environment
    const hitTestSource = hitTestSourceRef.current;
    const referenceSpace = gl.xr.getReferenceSpace();

    if (hitTestSource && referenceSpace && !placed) {
      const hitTestResults = xrFrame.getHitTestResults(hitTestSource);

      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);

        if (pose) {
          reticleRef.current.visible = true;
          reticleRef.current.matrix.fromArray(pose.transform.matrix);

          consecutiveHitsRef.current++;

          // AUTOMATIC PLACEMENT: Automatically lock once table surface is detected stably for 3 frames
          if (consecutiveHitsRef.current >= 3) {
            const pos = new THREE.Vector3();
            const quat = new THREE.Quaternion();
            const scl = new THREE.Vector3();
            reticleRef.current.matrix.decompose(pos, quat, scl);

            onPlace({
              position: pos.clone(),
              quaternion: quat.clone(),
            });
            consecutiveHitsRef.current = 0;
          }
        }
      } else {
        reticleRef.current.visible = false;
        consecutiveHitsRef.current = Math.max(0, consecutiveHitsRef.current - 1);
      }
    } else if (placed) {
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

      {/* Surface Reticle tracking physical table plane */}
      <group ref={reticleRef} matrixAutoUpdate={false} visible={false}>
        <SurfaceReticleMesh />
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

          {/* Contact Shadow cast directly on the physical table plane */}
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
  const [showQRModal, setShowQRModal] = useState(false);

  // Fallback Camera Stream State
  const [cameraActive, setCameraActive] = useState(false);
  const [featurePoints, setFeaturePoints] = useState<SurfaceFeaturePoint[]>([]);
  const [telemetry, setTelemetry] = useState<SensorTelemetry>({
    pitch: 45,
    roll: 0,
    heading: 0,
    isStable: false,
    stabilityScore: 90,
    estimatedDistanceCm: 50,
    gravityZ: 0.7,
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const physicalDimensions = useMemo(() => getItemPhysicalDimensions(item), [item]);

  // Check WebXR support
  useEffect(() => {
    checkWebXRARSupport().then((supported) => {
      setIsWebXRSupported(supported);
    });
  }, []);

  // Initialize Sensors for Fallback Camera mode
  useEffect(() => {
    const fusion = new MobileSensorFusion();
    fusion.start();
    const unsub = fusion.subscribe(setTelemetry);
    return () => {
      unsub();
      fusion.stop();
    };
  }, []);

  // Initialize Camera Feed for non-WebXR preview
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCam() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setCameraActive(true);
          };
        }
      } catch {
        setCameraActive(false);
      }
    }

    if (!isSessionActive) {
      startCam();
    }

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSessionActive]);

  // Optical feature scanning for camera fallback
  useEffect(() => {
    if (isSessionActive) return;

    function loop() {
      if (canvasRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = 320;
          canvasRef.current.height = 240;
          ctx.drawImage(videoRef.current, 0, 0, 320, 240);
          setFeaturePoints(extractSurfaceFeatures(ctx, 320, 240));
        }
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    }
    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isSessionActive]);

  // Launch Native WebXR Session
  const handleStartWebXRSession = async () => {
    setWebXRError(null);

    if (typeof navigator === 'undefined' || !('xr' in navigator)) {
      setWebXRError('WebXR is not supported on this browser. Use Chrome on Android with ARCore.');
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
      console.error('WebXR session error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setWebXRError(`Could not start WebXR AR: ${msg}. Tap Google Scene Viewer below as fallback.`);
    }
  };

  const handlePlace = (transform: AnchorTransform) => {
    setAnchorTransform(transform);
    setPlaced(true);
    setAutoPlacedNotice(true);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch {
        // ignore
      }
    }

    setTimeout(() => setAutoPlacedNotice(false), 3000);
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

  // Google Scene Viewer HTTPS URL with title and resizable flag
  const sceneViewerUrl = item.externalModelUrl
    ? `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        window.location.origin + item.externalModelUrl
      )}&mode=ar_preferred&title=${encodeURIComponent(item.name)}&resizable=true#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans select-none text-[#1C1917] overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Video for Non-WebXR Preview Mode */}
      {!isSessionActive && (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {!cameraActive && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-stone-900 via-stone-800 to-amber-950/40 flex flex-col justify-end">
              <div className="w-full h-2/3 bg-gradient-to-t from-stone-900/90 via-amber-950/30 to-transparent relative">
                <div 
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: `radial-gradient(#EADBBA 1.5px, transparent 1.5px)`,
                    backgroundSize: '24px 24px',
                    transform: 'perspective(500px) rotateX(60deg)',
                    transformOrigin: 'bottom center'
                  }}
                />
              </div>
            </div>
          )}

          {/* Perspective Plane Grid during preview */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 flex items-center justify-center overflow-hidden pointer-events-none">
            <div 
              className="w-[180%] h-[180%] border-t border-[#8BDFDD]/40 relative"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(139, 223, 221, 0.16) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(139, 223, 221, 0.16) 1px, transparent 1px)`,
                backgroundSize: '36px 36px',
                transform: 'perspective(450px) rotateX(65deg) translateY(-20%)',
                transformOrigin: 'bottom center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#8BDFDD]/25 via-transparent to-transparent animate-pulse" />
            </div>
          </div>

          {/* Feature Points */}
          <div className="absolute inset-0 pointer-events-none">
            {featurePoints.map((pt, idx) => (
              <div
                key={idx}
                className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#8BDFDD] shadow-[0_0_8px_#8BDFDD]"
                style={{
                  left: `${pt.x * 100}%`,
                  top: `${pt.y * 100}%`,
                  opacity: pt.confidence,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3D WebXR Canvas (Active during WebXR Session) */}
      <div className={`absolute inset-0 z-0 ${isSessionActive ? 'block' : 'hidden'}`}>
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            glRef.current = gl;
            gl.xr.enabled = true;
          }}
        >
          <WebXRHitTestManager 
            item={item}
            placed={placed}
            anchorTransform={anchorTransform}
            onPlace={handlePlace}
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
                      ? 'Locked to Table (World Space 6DoF)' 
                      : isSessionActive 
                      ? 'Scanning physical table plane...' 
                      : 'Live AR Table Calibration'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowQRModal(true)}
                className="p-2 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] transition-colors"
                title="Share QR"
              >
                <QrCode className="w-4 h-4 text-[#F48F68]" />
              </button>

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
                Tap anywhere on screen or hold steady to <strong>place dish on table</strong>.
              </p>
            </div>
          )}

          {autoPlacedNotice && (
            <div className="bg-[#309694]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl inline-flex items-center gap-2 text-xs font-bold animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-[#FFE394]" />
              <span>Anchored to Physical Table! Walk around to inspect.</span>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="max-w-lg mx-auto w-full space-y-2 pb-[calc(env(safe-area-inset-bottom,10px)+4px)] pointer-events-auto">
          {!isSessionActive ? (
            <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EADBBA] rounded-2xl p-4 shadow-xl text-center space-y-3">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  True World-Space WebXR Tracking
                </h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Uses physical plane hit-testing so the 3D model stays anchored to your table as you walk around.
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
                    className="py-3 px-4 rounded-xl bg-[#8BDFDD] hover:bg-[#74d2d0] text-[#1C1917] font-bold text-xs border border-[#8BDFDD] transition-colors shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4 text-[#1C1917]" />
                    <span>Google Scene Viewer</span>
                  </a>
                )}
              </div>

              <div className="pt-2 border-t border-[#EADBBA] flex items-center justify-between text-[11px] text-[#78716C]">
                <span>1:1 Scale: <strong>Ø {currentDiameterCm} cm</strong></span>
                <span>Supported on Chrome Android with ARCore</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EADBBA] rounded-2xl p-3 shadow-xl space-y-2.5">
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
                    <span>Scanning table (Tap screen to place)</span>
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

      {/* QR Code Handoff Modal */}
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
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">Scan with your Phone</h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Scan with your phone camera to open in Chrome on Android with native ARCore.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(mobileUrl);
                alert('Link copied!');
              }}
              className="w-full py-2 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs"
            >
              Copy Mobile Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
