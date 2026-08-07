import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, useGLTF, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { RotateCw, Sparkles } from 'lucide-react';

interface Food3DViewerProps {
  item: MenuItem;
}

// 1. External GLTF / GLB Renderer with Auto-Center and Generous Scale
export function ExternalGLTFModelRenderer({ 
  url, 
  scale = 1.0, 
  rotation = [0, 0, 0] 
}: { 
  url: string; 
  scale?: number; 
  rotation?: [number, number, number]; 
}) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef}>
      <Center top>
        <primitive 
          object={scene.clone()} 
          scale={[scale * 2.8, scale * 2.8, scale * 2.8]} 
          rotation={rotation}
        />
      </Center>
    </group>
  );
}

// 2. Large Procedural 3D Burger
export function RealisticBurger() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={[2.0, 2.0, 2.0]} position={[0, -0.2, 0]}>
      {/* Top Brioche Bun */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.92, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#F48F68" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Golden Sesame Seeds */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const angle = (i * Math.PI * 2) / 9;
        const radius = i % 2 === 0 ? 0.55 : 0.35;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0.74, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#FFF6DE" roughness={0.2} />
          </mesh>
        );
      })}

      {/* Melted Cheddar Layer */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.08, 32]} />
        <meshStandardMaterial color="#FFE394" roughness={0.25} />
      </mesh>

      {/* Smashed Wagyu Patty */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.92, 0.92, 0.26, 32]} />
        <meshStandardMaterial color="#4a2418" roughness={0.75} />
      </mesh>

      {/* Crisp Emerald Lettuce Layer */}
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.07, 24]} />
        <meshStandardMaterial color="#8BDFDD" roughness={0.4} />
      </mesh>

      {/* Bottom Toasted Bun */}
      <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.84, 0.26, 32]} />
        <meshStandardMaterial color="#F48F68" roughness={0.45} />
      </mesh>
    </group>
  );
}

// 3. Large Neapolitan Pizza
export function RealisticPizza() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} scale={[2.0, 2.0, 2.0]} position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.3, 0.12, 32]} />
        <meshStandardMaterial color="#F48F68" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
        <meshStandardMaterial color="#FFE394" roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[Math.cos(i * 1.3) * 0.6, 0.11, Math.sin(i * 1.3) * 0.6]}>
          <boxGeometry args={[0.15, 0.02, 0.1]} />
          <meshStandardMaterial color="#8BDFDD" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// 4. Large Artisanal Pasta Bowl
export function RealisticPasta() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={[2.1, 2.1, 2.1]} position={[0, -0.25, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 0.85, 0.35, 32]} />
        <meshStandardMaterial color="#FFF6DE" roughness={0.15} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <torusGeometry args={[0.55, 0.22, 16, 32]} />
        <meshStandardMaterial color="#FFE394" roughness={0.35} />
      </mesh>
    </group>
  );
}

// 5. Large Curry Handi
export function RealisticCurry() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} scale={[2.0, 2.0, 2.0]} position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.95, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#2d1e18" roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.1, 32]} />
        <meshStandardMaterial color="#F48F68" roughness={0.3} />
      </mesh>
    </group>
  );
}

// 6. Dim Sum Steamer
export function RealisticDimSum() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={[2.0, 2.0, 2.0]} position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.55, 32]} />
        <meshStandardMaterial color="#F48F68" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#FFF6DE" roughness={0.25} />
      </mesh>
    </group>
  );
}

// 7. Belgian Chocolate Dessert
export function RealisticDessert() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={[2.0, 2.0, 2.0]} position={[0, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 0.75, 0.16, 32]} />
        <meshStandardMaterial color="#FFF6DE" roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#3b1d11" roughness={0.15} metalness={0.15} />
      </mesh>
    </group>
  );
}

// 8. Artisan Drink Glass
export function RealisticDrink() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={[2.2, 2.2, 2.2]} position={[0, -0.4, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.38, 1.3, 32, 1, true]} />
        <meshPhysicalMaterial 
          color="#8BDFDD" 
          transparent={true} 
          opacity={0.85} 
          roughness={0.08} 
          transmission={0.92} 
          thickness={0.6} 
        />
      </mesh>
    </group>
  );
}

export const Food3DViewer: React.FC<Food3DViewerProps> = ({ item }) => {
  const isExternal = Boolean(item.externalModelUrl);
  const shape = item.model3DConfig?.baseShape || 'burger';

  return (
    <div className="relative w-full h-80 sm:h-[420px] rounded-xl overflow-hidden bg-[#FFFDF7] select-none font-sans border border-[#EADBBA] shadow-inner">
      <Canvas 
        camera={{ position: [0, 0.8, 2.0], fov: 35 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <Environment preset="sunset" />
        <ambientLight intensity={0.95} />
        <directionalLight position={[4, 7, 4]} intensity={2.2} castShadow />
        <pointLight position={[-4, 4, -4]} intensity={0.9} color="#FFE394" />
        <pointLight position={[3, -2, 2]} intensity={0.6} color="#F48F68" />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.15}>
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
        </Float>

        <ContactShadows position={[0, -0.75, 0]} opacity={0.35} scale={8.0} blur={2.2} far={4} color="#3d2a1c" />
        <OrbitControls 
          enableZoom={true} 
          minDistance={1.0} 
          maxDistance={4.0} 
          enablePan={false} 
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Rotation Control Pill with Warm Palette Styling */}
      <div className="absolute bottom-3 left-3 bg-[#FFFFFF]/95 border border-[#EADBBA] px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-[#1C1917] shadow-sm backdrop-blur-xs font-medium">
        <RotateCw className="w-3.5 h-3.5 text-[#F48F68]" />
        <span>360° Drag & Zoom to Inspect</span>
      </div>

      {/* Scale Badge with Warm Palette */}
      <div className="absolute top-3 right-3 bg-[#FFE394] border border-[#EADBBA] px-2.5 py-1 rounded-md text-[11px] text-[#1C1917] font-bold flex items-center gap-1 shadow-xs">
        <Sparkles className="w-3 h-3 text-[#F48F68]" />
        <span>Full 3D Scale</span>
      </div>
    </div>
  );
};
