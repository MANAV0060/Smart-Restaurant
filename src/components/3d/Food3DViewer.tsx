import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { Layers, Sparkles, Info, Camera, Sun, Sunset, Eye, Flame, Compass } from 'lucide-react';

interface Food3DViewerProps {
  item: MenuItem;
}

export type LightingPreset = 'bistro' | 'sunset' | 'daylight';
export type CameraAngle = 'isometric' | 'topdown' | 'closeup';

// Custom Steam Particles Component with dynamic physics
export function SteamParticles({ speed = 0.9, opacityMultiplier = 0.4 }: { speed?: number; opacityMultiplier?: number }) {
  const count = 20;
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.children.forEach((child, i) => {
      const y = ((t * speed + i * 0.3) % 2.8) + 0.5;
      child.position.y = y;
      const opacity = Math.sin((y / 3.4) * Math.PI) * opacityMultiplier;
      (child as THREE.Mesh).scale.setScalar(0.15 + (y / 3) * 0.4);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, opacity);
    });
  });

  return (
    <group ref={meshRef} position={[0, 0.6, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.95, i * 0.14, (Math.random() - 0.5) * 0.95]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// Serving Board / Base Plate Mesh Component
function PlateBase({ type }: { type: 'wood' | 'ceramic' | 'slate' | 'copper' | 'bamboo' | 'glass' }) {
  if (type === 'wood') {
    return (
      <group position={[0, -0.9, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.5, 2.45, 0.15, 64]} />
          <meshPhysicalMaterial color="#5c3818" roughness={0.7} metalness={0.05} clearcoat={0.2} />
        </mesh>
        {/* Handle */}
        <mesh castShadow receiveShadow position={[2.7, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.12, 0.4]} />
          <meshPhysicalMaterial color="#4a2c11" roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (type === 'slate') {
    return (
      <group position={[0, -0.9, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.1, 3.2]} />
          <meshPhysicalMaterial color="#1a202c" roughness={0.9} metalness={0.2} clearcoat={0.1} />
        </mesh>
      </group>
    );
  }

  if (type === 'ceramic') {
    return (
      <group position={[0, -0.9, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.6, 2.0, 0.2, 64]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.1} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.05} />
        </mesh>
        {/* Gold Rim */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[2.55, 0.03, 16, 64]} />
          <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, -0.9, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.3, 0.1, 64]} />
        <meshPhysicalMaterial color="#1e293b" roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  );
}

// 1. Photorealistic Gourmet Wagyu Burger Model
export function RealisticBurger({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 2.5) * 0.7 : 0);
  };

  const layersInfo = [
    { name: "Toasted Brioche Bottom Bun", calories: "140 kcal", protein: "4g" },
    { name: "Char-Seared Wagyu Beef Patty", calories: "320 kcal", protein: "28g" },
    { name: "Melted Aged Cheddar + Drips", calories: "110 kcal", protein: "7g" },
    { name: "Ruffled Crispy Wild Lettuce", calories: "15 kcal", protein: "1g" },
    { name: "Sliced San Marzano Tomatoes", calories: "22 kcal", protein: "1g" },
    { name: "Artisanal Glazed Sesame Top Bun", calories: "160 kcal", protein: "5g" },
  ];

  return (
    <group ref={groupRef}>
      <PlateBase type="wood" />

      {/* Layer 0: Bottom Bun */}
      <group position={[0, getOffsetY(-0.6, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.18, 0.32, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#d2b48c'} roughness={0.5} clearcoat={0.2} />
        </mesh>
      </group>

      {/* Layer 1: Grilled Wagyu Patty */}
      <group position={[0, getOffsetY(-0.28, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.26, 0.28, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#2b1408'} roughness={0.7} metalness={0.1} clearcoat={0.3} clearcoatRoughness={0.4} />
        </mesh>
        {/* Sear/grill textures */}
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={`char-${i}`} position={[(Math.random() - 0.5) * 1.9, 0.15, (Math.random() - 0.5) * 1.9]} rotation={[0, Math.random() * Math.PI, 0]}>
            <boxGeometry args={[0.32, 0.02, 0.08]} />
            <meshBasicMaterial color="#140702" />
          </mesh>
        ))}
      </group>

      {/* Layer 2: Melted Aged Cheddar Cheese */}
      <group position={[0, getOffsetY(-0.05, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        <mesh castShadow receiveShadow rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[2.2, 0.06, 2.2]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffaa00'} roughness={0.2} metalness={0.1} clearcoat={0.6} clearcoatRoughness={0.15} />
        </mesh>
        {/* Cheese drips */}
        <mesh castShadow receiveShadow position={[0.95, -0.16, 0.5]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.02, 0.32, 16]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffaa00'} roughness={0.2} clearcoat={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.85, -0.14, 0.75]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.01, 0.28, 16]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffaa00'} roughness={0.2} clearcoat={0.6} />
        </mesh>
      </group>

      {/* Layer 3: Crisp Wild Lettuce */}
      <group position={[0, getOffsetY(0.15, 3), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(3); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.45, 1.35, 0.07, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 3 ? '#f97316' : '#27ae60'} roughness={0.4} transmission={0.25} thickness={0.12} />
        </mesh>
        {/* Lettuce ruffled edges */}
        {Array.from({ length: 18 }).map((_, i) => (
          <mesh key={`lettuce-${i}`} position={[1.35 * Math.cos((i / 18) * Math.PI * 2), 0, 1.35 * Math.sin((i / 18) * Math.PI * 2)]} rotation={[Math.random() * 0.4, (i / 18) * Math.PI * 2, 0]}>
            <sphereGeometry args={[0.22, 16, 8]} />
            <meshPhysicalMaterial color={highlightedIndex === 3 ? '#f97316' : '#27ae60'} roughness={0.3} transmission={0.3} thickness={0.06} />
          </mesh>
        ))}
      </group>

      {/* Layer 4: Sliced San Marzano Tomato */}
      <group position={[0, getOffsetY(0.32, 4), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(4); }}>
        <mesh castShadow receiveShadow position={[-0.22, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.11, 24]} />
          <meshPhysicalMaterial color={highlightedIndex === 4 ? '#f97316' : '#e74c3c'} roughness={0.2} transmission={0.45} thickness={0.25} clearcoat={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.42, 0, 0]}>
          <cylinderGeometry args={[0.88, 0.88, 0.11, 24]} />
          <meshPhysicalMaterial color={highlightedIndex === 4 ? '#f97316' : '#c0392b'} roughness={0.2} transmission={0.45} thickness={0.25} clearcoat={0.7} />
        </mesh>
      </group>

      {/* Layer 5: Top Brioche Bun */}
      <group position={[0, getOffsetY(0.65, 5), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(5); }}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color={highlightedIndex === 5 ? '#f97316' : '#c68b59'} roughness={0.35} clearcoat={0.4} clearcoatRoughness={0.15} />
        </mesh>
        {/* White & Brown Sesame Seeds */}
        {Array.from({ length: 35 }).map((_, i) => {
          const phi = (i / 35) * Math.PI * 2;
          const theta = 0.2 + (i % 4) * 0.24;
          const x = 1.3 * Math.sin(theta) * Math.cos(phi);
          const z = 1.3 * Math.sin(theta) * Math.sin(phi);
          const y = 1.3 * Math.cos(theta) - 0.05;
          const isBrown = i % 5 === 0;
          return (
            <mesh key={i} position={[x, y, z]} rotation={[Math.random(), phi, Math.random()]}>
              <boxGeometry args={[0.07, 0.035, 0.11]} />
              <meshPhysicalMaterial color={isBrown ? "#8b4513" : "#fffbe6"} roughness={0.3} clearcoat={0.2} />
            </mesh>
          );
        })}
      </group>

      <SteamParticles />
    </group>
  );
}

// 2. Photorealistic Wood-Fired Pizza Model
export function RealisticPizza({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1.5) * 0.55 : 0);
  };

  const layersInfo = [
    { name: "Wood-Fired Neapolitan Crust", calories: "420 kcal", protein: "12g" },
    { name: "Melted Burrata & San Marzano Sauce", calories: "240 kcal", protein: "14g" },
    { name: "Spicy Pepperoni & Fresh Basil Sprigs", calories: "180 kcal", protein: "10g" },
  ];

  return (
    <group ref={groupRef}>
      <PlateBase type="slate" />

      {/* Layer 0: Crust Base */}
      <group position={[0, getOffsetY(-0.1, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.05, 0.24, 32, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#d49a4a'} roughness={0.8} bumpScale={0.03} clearcoat={0.1} />
        </mesh>
        {/* Charred spots */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.2;
          return (
            <mesh key={`char-${i}`} position={[2.05 * Math.cos(angle), 0.12, 2.05 * Math.sin(angle)]} rotation={[0, angle, Math.PI / 4]}>
              <boxGeometry args={[0.42, 0.11, 0.22]} />
              <meshBasicMaterial color="#140702" />
            </mesh>
          );
        })}
        <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[2.05, 2.0, 0.13, 32]} />
          <meshPhysicalMaterial color="#d5b895" roughness={0.8} />
        </mesh>
      </group>

      {/* Layer 1: Sauce & Melted Burrata */}
      <group position={[0, getOffsetY(0.09, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.95, 1.9, 0.09, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#fef9e7'} roughness={0.15} metalness={0.05} clearcoat={0.85} clearcoatRoughness={0.1} />
        </mesh>
        {/* Red sauce peeking through */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={`sauce-${i}`} position={[1.25 * Math.cos(angle), 0.05, 1.25 * Math.sin(angle)]}>
              <cylinderGeometry args={[0.42, 0.42, 0.015, 16]} />
              <meshPhysicalMaterial color="#c0392b" roughness={0.2} clearcoat={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* Layer 2: Pepperoni & Basil */}
      <group position={[0, getOffsetY(0.28, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 11 }).map((_, i) => {
          const angle = (i / 11) * Math.PI * 2;
          const r = 0.5 + (i % 4) * 0.42;
          return (
            <mesh key={`pep-${i}`} position={[r * Math.cos(angle), 0, r * Math.sin(angle)]} rotation={[0.06, angle, 0.06]}>
              <cylinderGeometry args={[0.27, 0.24, 0.035, 16]} />
              <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#b03a2e'} roughness={0.4} clearcoat={0.6} clearcoatRoughness={0.3} />
            </mesh>
          );
        })}
        {/* Fresh Basil Leaves */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + 0.35;
          return (
            <mesh key={`basil-${i}`} position={[1.35 * Math.cos(angle), 0.025, 1.35 * Math.sin(angle)]} rotation={[0.12, angle + Math.PI/2, 0.12]}>
              <cylinderGeometry args={[0.22, 0.06, 0.012, 16]} />
              <meshPhysicalMaterial color="#27ae60" roughness={0.3} clearcoat={0.5} transmission={0.25} />
            </mesh>
          );
        })}
      </group>

      <SteamParticles />
    </group>
  );
}

// 3. Photorealistic Creamy Fettuccine Pasta Model
export function RealisticPasta({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.55 : 0);
  };

  const layersInfo = [
    { name: "Hand-Crafted Ceramic Pasta Bowl", calories: "0 kcal", protein: "0g" },
    { name: "Al Dente Fettuccine & Truffle Sauce", calories: "480 kcal", protein: "16g" },
    { name: "Sauteed Porcini & Parmigiano Shavings", calories: "140 kcal", protein: "8g" },
  ];

  return (
    <group ref={groupRef}>
      {/* Bowl */}
      <group position={[0, getOffsetY(-0.4, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.75, 1.15, 0.48, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#ffffff'} roughness={0.1} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.05} />
        </mesh>
      </group>

      {/* Fettuccine Strands */}
      <group position={[0, getOffsetY(0.12, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.055, 0]} rotation={[0.1, i * 0.65, 0]}>
            <torusGeometry args={[0.92 - i * 0.06, 0.13, 32, 64]} />
            <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#f5c85d'} roughness={0.3} clearcoat={0.45} clearcoatRoughness={0.25} transmission={0.12} />
          </mesh>
        ))}
      </group>

      {/* Porcini & Shaved Parmesan */}
      <group position={[0, getOffsetY(0.42, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * Math.PI * 2;
          return (
            <group key={`mushroom-${i}`} position={[0.65 * Math.cos(angle), 0, 0.65 * Math.sin(angle)]} rotation={[0.2, angle, Math.random()]}>
              <mesh castShadow>
                <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#5c3a21'} roughness={0.6} clearcoat={0.1} />
              </mesh>
            </group>
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={`parm-${i}`} position={[0.45 * Math.cos(angle), 0.12, 0.45 * Math.sin(angle)]} rotation={[Math.random(), angle, Math.random()]}>
              <boxGeometry args={[0.22, 0.02, 0.11]} />
              <meshPhysicalMaterial color="#fffdd0" roughness={0.3} transmission={0.4} thickness={0.05} />
            </mesh>
          );
        })}
      </group>

      <SteamParticles />
    </group>
  );
}

// 4. Photorealistic Indian Royal Handi Curry Model
export function RealisticCurry({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.6 : 0);
  };

  const layersInfo = [
    { name: "Hammered Artisanal Copper Handi", calories: "0 kcal", protein: "0g" },
    { name: "Slow-Simmered Makhani Tomato Gravy", calories: "360 kcal", protein: "6g" },
    { name: "Tandoori Chicken/Paneer & Malai Swirl", calories: "320 kcal", protein: "24g" },
  ];

  return (
    <group ref={groupRef}>
      {/* Handi Vessel */}
      <group position={[0, getOffsetY(-0.4, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.55, 64, 32, 0, Math.PI * 2, Math.PI / 3, Math.PI / 2]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#b87333'} metalness={0.92} roughness={0.2} clearcoat={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
          <torusGeometry args={[1.35, 0.07, 16, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#b87333'} metalness={0.92} roughness={0.2} />
        </mesh>
      </group>

      {/* Gravy */}
      <group position={[0, getOffsetY(0.12, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.45, 1.4, 0.16, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#cc4400'} roughness={0.1} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.08} />
        </mesh>
      </group>

      {/* Tikka Cubes & Cream */}
      <group position={[0, getOffsetY(0.35, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * Math.PI * 2;
          return (
            <mesh key={i} position={[0.65 * Math.cos(angle), 0, 0.65 * Math.sin(angle)]} rotation={[0.2, i, 0.1]}>
              <boxGeometry args={[0.38, 0.38, 0.38]} />
              <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#8a4b16'} roughness={0.8} clearcoat={0.2} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[0.75, 0.09, 32, 64]} />
          <meshPhysicalMaterial color="#fff3e0" roughness={0.2} clearcoat={0.6} />
        </mesh>
      </group>

      <SteamParticles />
    </group>
  );
}

// 5. Photorealistic Dim Sum Steamer Model
export function RealisticDimSum({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.6 : 0);
  };

  const layersInfo = [
    { name: "Woven Bamboo Steamer Basket", calories: "0 kcal", protein: "0g" },
    { name: "Translucent Truffle & Edamame Dumplings", calories: "280 kcal", protein: "14g" },
  ];

  return (
    <group ref={groupRef}>
      {/* Bamboo Basket */}
      <group position={[0, getOffsetY(-0.35, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.75, 1.7, 0.38, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#d2a679'} roughness={0.9} bumpScale={0.05} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[1.65, 1.65, 0.05, 32]} />
          <meshPhysicalMaterial color="#c29562" roughness={0.9} />
        </mesh>
      </group>

      {/* Dumplings */}
      <group position={[0, getOffsetY(0.16, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh position={[-0.65, 0, -0.45]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial color="#f0f3f4" transmission={0.8} thickness={0.5} roughness={0.1} clearcoat={0.5} />
        </mesh>
        <mesh position={[0.65, 0, -0.45]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial color="#1c2833" roughness={0.4} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.65]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial color="#27ae60" transmission={0.45} thickness={0.25} roughness={0.2} clearcoat={0.4} />
        </mesh>
      </group>

      <SteamParticles />
    </group>
  );
}

// 6. Photorealistic Belgian Chocolate Lava Dessert Model
export function RealisticDessert({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.6 : 0);
  };

  const layersInfo = [
    { name: "Crystal Cut Dessert Dish", calories: "0 kcal", protein: "0g" },
    { name: "Tahitian Vanilla Gelato Scoop", calories: "180 kcal", protein: "3g" },
    { name: "70% Dark Belgian Lava Sphere + 24k Gold", calories: "340 kcal", protein: "5g" },
  ];

  return (
    <group ref={groupRef}>
      {/* Dish */}
      <group position={[0, getOffsetY(-0.45, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.45, 0.85, 0.38, 64]} />
          <meshPhysicalMaterial color="#ffffff" transmission={1.0} thickness={0.5} roughness={0.05} ior={1.5} clearcoat={1.0} />
        </mesh>
      </group>

      {/* Gelato */}
      <group position={[0, getOffsetY(-0.05, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow>
          <sphereGeometry args={[0.88, 32, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#fffdd0'} roughness={0.5} clearcoat={0.1} />
        </mesh>
      </group>

      {/* Chocolate Sphere with Gold Flakes */}
      <group position={[0, getOffsetY(0.42, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        <mesh castShadow>
          <sphereGeometry args={[0.78, 64, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#231106'} roughness={0.05} metalness={0.1} clearcoat={1.0} clearcoatRoughness={0.05} />
        </mesh>
        {Array.from({ length: 18 }).map((_, i) => {
          const phi = (i / 18) * Math.PI * 2;
          const theta = 0.1 + (i % 3) * 0.2;
          const x = 0.79 * Math.sin(theta) * Math.cos(phi);
          const z = 0.79 * Math.sin(theta) * Math.sin(phi);
          const y = 0.79 * Math.cos(theta);
          return (
            <mesh key={`gold-${i}`} position={[x, y, z]} rotation={[Math.random(), phi, Math.random()]}>
              <planeGeometry args={[0.09, 0.09]} />
              <meshPhysicalMaterial color="#ffd700" metalness={1.0} roughness={0.2} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// 7. Photorealistic Crystal Glass Beverage Model
export function RealisticDrink({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Crystal Glass */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.72, 2.3, 64]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1.0} roughness={0.04} ior={1.5} thickness={0.5} clearcoat={1.0} />
      </mesh>

      {/* Liquid interior */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.82, 0.68, 1.85, 32]} />
        <meshPhysicalMaterial color="#c0392b" transmission={0.92} thickness={2} roughness={0.08} />
      </mesh>

      {/* Floating Ice Cubes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[(i % 2 === 0 ? 0.32 : -0.32), 0.45 + i * 0.16, (i > 1 ? 0.22 : -0.22)]} rotation={[0.4, i * 0.8, 0.2]}>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.96} ior={1.33} roughness={0.04} thickness={0.5} />
        </mesh>
      ))}

      {/* Lime Slice */}
      <mesh position={[0.85, 0.98, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.36, 0.36, 0.05, 32]} />
        <meshPhysicalMaterial color="#27ae60" roughness={0.4} transmission={0.3} thickness={0.1} />
      </mesh>

      {/* Straw */}
      <mesh position={[-0.22, 0.42, 0.12]} rotation={[0.1, 0, -0.25]}>
        <cylinderGeometry args={[0.045, 0.045, 2.5, 32]} />
        <meshPhysicalMaterial color="#f39c12" roughness={0.2} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

// Camera Angle Presets Handler Component
function CameraPresets({ angle }: { angle: CameraAngle }) {
  const { camera } = useThree();

  useFrame(() => {
    if (angle === 'topdown') {
      camera.position.lerp(new THREE.Vector3(0, 4.5, 0.1), 0.08);
      camera.lookAt(0, 0, 0);
    } else if (angle === 'closeup') {
      camera.position.lerp(new THREE.Vector3(0, 1.2, 2.6), 0.08);
      camera.lookAt(0, 0.2, 0);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 2.2, 4.2), 0.08);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export function ExternalGLTFModelRenderer({ url, scale = 1.0, rotation = [0, 0, 0] }: { url: string; scale?: number; rotation?: [number, number, number] }) {
  const { scene } = useGLTF(url);

  const { cloned, autoScale } = React.useMemo(() => {
    const clonedObj = scene.clone(true);

    clonedObj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach(m => {
            if ((m as any).map) {
              (m as any).map.colorSpace = THREE.SRGBColorSpace;
              (m as any).needsUpdate = true;
            }
          });
        }
      }
    });

    // Compute bounding box to auto-center and scale the model
    const box = new THREE.Box3().setFromObject(clonedObj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Center model at local origin
    clonedObj.position.x = -center.x;
    clonedObj.position.y = -center.y;
    clonedObj.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetDim = 2.8; // Fill frame nicely
    const computedScale = maxDim > 0 ? (targetDim / maxDim) * scale : scale;

    return { cloned: clonedObj, autoScale: computedScale };
  }, [scene, scale]);

  return (
    <group position={[0, -0.2, 0]} rotation={rotation}>
      <primitive object={cloned} scale={[autoScale, autoScale, autoScale]} />
    </group>
  );
}

export const Food3DViewer: React.FC<Food3DViewerProps> = ({ item }) => {
  const shape = item.model3DConfig?.baseShape || 'burger';
  const isExternal = Boolean(item.externalModelUrl);

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] bg-gradient-to-b from-[#070a0f] via-slate-900 to-[#070a0f] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl select-none">
      {/* Clean Top Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-full text-xs font-bold text-amber-400 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isExternal ? '3D GLTF Model' : 'Interactive 3D View'}</span>
        </div>
      </div>

      {/* Clean Bottom Rotation Hint */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <span className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 shadow-lg">
          Drag to rotate 360°
        </span>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2.2, 4.2], fov: 45 }}>
        <Environment preset="sunset" />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffaa55" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
          {isExternal && item.externalModelUrl ? (
            <Suspense fallback={
              <mesh>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial color="#f59e0b" wireframe />
              </mesh>
            }>
              <ExternalGLTFModelRenderer 
                url={item.externalModelUrl} 
                scale={item.externalModelScale || 1.0} 
                rotation={item.externalModelRotation || [0, 0, 0]} 
              />
            </Suspense>
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

        <ContactShadows position={[0, -1.25, 0]} opacity={0.6} scale={6.5} blur={2.0} far={4.5} color="#000000" />
        <OrbitControls enableZoom={true} minDistance={2.0} maxDistance={6.5} maxPolarAngle={Math.PI / 2 + 0.1} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
};
