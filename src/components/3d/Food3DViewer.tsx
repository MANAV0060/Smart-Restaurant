import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { Layers, Sparkles, Info } from 'lucide-react';

interface Food3DViewerProps {
  item: MenuItem;
}

// Custom Steam Particles Component
export function SteamParticles() {
  const count = 15;
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.children.forEach((child, i) => {
      const y = ((t * 0.9 + i * 0.35) % 2.6) + 0.6;
      child.position.y = y;
      const opacity = Math.sin((y / 3.2) * Math.PI) * 0.4;
      (child as THREE.Mesh).scale.setScalar(0.18 + (y / 3) * 0.35);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, opacity);
    });
  });

  return (
    <group ref={meshRef} position={[0, 0.6, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.9, i * 0.15, (Math.random() - 0.5) * 0.9]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// 1. Detailed Realistic Burger Model
export function RealisticBurger({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 2.5) * 0.65 : 0);
  };

  return (
    <group ref={groupRef}>
      {/* Bottom Bun */}
      <group position={[0, getOffsetY(-0.6, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.15, 0.3, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#d2b48c'} roughness={0.6} clearcoat={0.1} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Toasted Bottom Bun
            </div>
          </Html>
        )}
      </group>

      {/* Grilled Wagyu Patty 1 */}
      <group position={[0, getOffsetY(-0.3, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.22, 0.25, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#2b1408'} roughness={0.7} metalness={0.1} clearcoat={0.3} clearcoatRoughness={0.4} />
        </mesh>
        {/* Grill marks/char texture representation */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={`char-${i}`} position={[(Math.random() - 0.5) * 1.8, 0.13, (Math.random() - 0.5) * 1.8]} rotation={[0, Math.random() * Math.PI, 0]}>
            <boxGeometry args={[0.3, 0.02, 0.1]} />
            <meshBasicMaterial color="#1a0a03" />
          </mesh>
        ))}
        {(exploded || highlightedIndex === 1) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Seared Wagyu Patty
            </div>
          </Html>
        )}
      </group>

      {/* Melted Aged Cheddar Cheese with Drips */}
      <group position={[0, getOffsetY(-0.08, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        <mesh castShadow receiveShadow rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[2.1, 0.05, 2.1]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffaa00'} roughness={0.2} metalness={0.1} clearcoat={0.5} clearcoatRoughness={0.2} />
        </mesh>
        {/* Cheese drips */}
        <mesh castShadow receiveShadow position={[0.9, -0.15, 0.5]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.02, 0.3, 16]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffaa00'} roughness={0.2} clearcoat={0.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.8, -0.15, 0.7]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.01, 0.25, 16]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffaa00'} roughness={0.2} clearcoat={0.5} />
        </mesh>
        {(exploded || highlightedIndex === 2) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Melted Aged Cheddar
            </div>
          </Html>
        )}
      </group>

      {/* Wavy Fresh Lettuce */}
      <group position={[0, getOffsetY(0.12, 3), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(3); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 1.3, 0.06, 32, 1, false, 0, Math.PI * 2]} />
          <meshPhysicalMaterial color={highlightedIndex === 3 ? '#f97316' : '#27ae60'} roughness={0.4} transmission={0.2} thickness={0.1} />
        </mesh>
        {/* Lettuce ruffled edges */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={`lettuce-${i}`} position={[1.3 * Math.cos((i / 16) * Math.PI * 2), 0, 1.3 * Math.sin((i / 16) * Math.PI * 2)]} rotation={[Math.random() * 0.4, (i / 16) * Math.PI * 2, 0]}>
            <sphereGeometry args={[0.2, 16, 8]} />
            <meshPhysicalMaterial color={highlightedIndex === 3 ? '#f97316' : '#27ae60'} roughness={0.3} transmission={0.3} thickness={0.05} />
          </mesh>
        ))}
        {(exploded || highlightedIndex === 3) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Crisp Wild Lettuce
            </div>
          </Html>
        )}
      </group>

      {/* Sliced Tomato */}
      <group position={[0, getOffsetY(0.28, 4), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(4); }}>
        <mesh castShadow receiveShadow position={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.1, 24]} />
          <meshPhysicalMaterial color={highlightedIndex === 4 ? '#f97316' : '#e74c3c'} roughness={0.2} transmission={0.4} thickness={0.2} clearcoat={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.1, 24]} />
          <meshPhysicalMaterial color={highlightedIndex === 4 ? '#f97316' : '#c0392b'} roughness={0.2} transmission={0.4} thickness={0.2} clearcoat={0.6} />
        </mesh>
        {(exploded || highlightedIndex === 4) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              San Marzano Tomato
            </div>
          </Html>
        )}
      </group>

      {/* Top Brioche Bun with 3D White/Brown Sesame Seeds */}
      <group position={[0, getOffsetY(0.6, 5), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(5); }}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color={highlightedIndex === 5 ? '#f97316' : '#c68b59'} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.2} />
        </mesh>
        {Array.from({ length: 30 }).map((_, i) => {
          const phi = (i / 30) * Math.PI * 2;
          const theta = 0.2 + (i % 4) * 0.25;
          const x = 1.25 * Math.sin(theta) * Math.cos(phi);
          const z = 1.25 * Math.sin(theta) * Math.sin(phi);
          const y = 1.25 * Math.cos(theta) - 0.05;
          const isBrown = i % 5 === 0;
          return (
            <mesh key={i} position={[x, y, z]} rotation={[Math.random(), phi, Math.random()]}>
              <boxGeometry args={[0.06, 0.03, 0.1]} />
              <meshPhysicalMaterial color={isBrown ? "#8b4513" : "#fffbe6"} roughness={0.3} clearcoat={0.2} />
            </mesh>
          );
        })}
        {(exploded || highlightedIndex === 5) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Butter Brioche + Sesame
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 2. Detailed Realistic Pizza Model
export function RealisticPizza({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1.5) * 0.5 : 0);
  };

  return (
    <group ref={groupRef}>
      {/* Outer Crust Ring with Char Spots */}
      <group position={[0, getOffsetY(-0.1, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.0, 0.22, 32, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#d49a4a'} roughness={0.8} bumpScale={0.02} clearcoat={0.1} />
        </mesh>
        {/* Charred crust spots */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + Math.random();
          return (
            <mesh key={`char-${i}`} position={[2.0 * Math.cos(angle), 0.1, 2.0 * Math.sin(angle)]} rotation={[0, angle, Math.PI / 4]}>
              <boxGeometry args={[0.4, 0.1, 0.2]} />
              <meshBasicMaterial color="#1a0a03" />
            </mesh>
          );
        })}
        <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[2.0, 1.95, 0.12, 32]} />
          <meshPhysicalMaterial color="#d5b895" roughness={0.8} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[2.4, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Wood-Fired Charred Crust
            </div>
          </Html>
        )}
      </group>

      {/* Sauce & Melted Burrata Base (Glossy) */}
      <group position={[0, getOffsetY(0.08, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.9, 1.85, 0.08, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#fef9e7'} roughness={0.15} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.1} />
        </mesh>
        {/* Red sauce peeking through */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={`sauce-${i}`} position={[1.2 * Math.cos(angle), 0.045, 1.2 * Math.sin(angle)]}>
              <cylinderGeometry args={[0.4, 0.4, 0.01, 16]} />
              <meshPhysicalMaterial color="#c0392b" roughness={0.2} clearcoat={0.6} />
            </mesh>
          );
        })}
        {(exploded || highlightedIndex === 1) && (
          <Html position={[2.4, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Melted Burrata & San Marzano
            </div>
          </Html>
        )}
      </group>

      {/* Curling Pepperoni & Fresh Basil */}
      <group position={[0, getOffsetY(0.25, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {/* Pepperoni with curled edges */}
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = (i / 9) * Math.PI * 2;
          const r = 0.5 + (i % 4) * 0.4;
          return (
            <mesh key={`pep-${i}`} position={[r * Math.cos(angle), 0, r * Math.sin(angle)]} rotation={[0.05, angle, 0.05]}>
              <cylinderGeometry args={[0.25, 0.22, 0.03, 16]} />
              <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#b03a2e'} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.3} />
            </mesh>
          );
        })}
        {/* Fresh Basil Leaves */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + 0.3;
          return (
            <mesh key={`basil-${i}`} position={[1.3 * Math.cos(angle), 0.02, 1.3 * Math.sin(angle)]} rotation={[0.1, angle + Math.PI/2, 0.1]}>
              <cylinderGeometry args={[0.2, 0.05, 0.01, 16]} />
              <meshPhysicalMaterial color="#27ae60" roughness={0.3} clearcoat={0.4} transmission={0.2} />
            </mesh>
          );
        })}
        {(exploded || highlightedIndex === 2) && (
          <Html position={[2.4, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Spicy Pepperoni & Basil
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 3. Detailed Realistic Pasta Model
export function RealisticPasta({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.5 : 0);
  };

  return (
    <group ref={groupRef}>
      {/* Deep Ceramic Bowl */}
      <group position={[0, getOffsetY(-0.4, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 1.1, 0.45, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#ffffff'} roughness={0.1} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.05} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Glazed Ceramic Bowl
            </div>
          </Html>
        )}
      </group>

      {/* Swirling Fettuccine Strands Nest (Al Dente) */}
      <group position={[0, getOffsetY(0.1, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.05, 0]} rotation={[0.1, i * 0.6, 0]}>
            <torusGeometry args={[0.9 - i * 0.06, 0.12, 32, 64]} />
            <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#f5c85d'} roughness={0.3} clearcoat={0.4} clearcoatRoughness={0.3} transmission={0.1} />
          </mesh>
        ))}
        {(exploded || highlightedIndex === 1) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Al Dente Fettuccine
            </div>
          </Html>
        )}
      </group>

      {/* Porcini Mushrooms & Shaved Parmigiano */}
      <group position={[0, getOffsetY(0.4, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={`mushroom-${i}`} position={[0.6 * Math.cos(angle), 0, 0.6 * Math.sin(angle)]} rotation={[0.2, angle, Math.random()]}>
              <mesh castShadow>
                <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#5c3a21'} roughness={0.6} clearcoat={0.1} />
              </mesh>
            </group>
          );
        })}
        {/* Shaved Parmesan Curls */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          return (
            <mesh key={`parm-${i}`} position={[0.4 * Math.cos(angle), 0.1, 0.4 * Math.sin(angle)]} rotation={[Math.random(), angle, Math.random()]}>
              <boxGeometry args={[0.2, 0.02, 0.1]} />
              <meshPhysicalMaterial color="#fffdd0" roughness={0.3} transmission={0.4} thickness={0.05} />
            </mesh>
          );
        })}
        {(exploded || highlightedIndex === 2) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Porcini & Parmesan Curls
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 4. Detailed Indian Royal Handi Curry Model
export function RealisticCurry({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.55 : 0);
  };

  return (
    <group ref={groupRef}>
      {/* Copper Handi Pot Vessel */}
      <group position={[0, getOffsetY(-0.4, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, Math.PI / 3, Math.PI / 2]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#b87333'} metalness={0.9} roughness={0.2} clearcoat={0.5} />
        </mesh>
        {/* Handi Rim */}
        <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
          <torusGeometry args={[1.3, 0.06, 16, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#b87333'} metalness={0.9} roughness={0.2} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Hammered Copper Handi
            </div>
          </Html>
        )}
      </group>

      {/* Rich Makhani Tomato Gravy (Glossy Sheen) */}
      <group position={[0, getOffsetY(0.1, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 1.35, 0.15, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#cc4400'} roughness={0.1} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.1} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Glossy Makhani Gravy
            </div>
          </Html>
        )}
      </group>

      {/* Charred Chicken / Paneer Cubes & Saffron Cream Swirl */}
      <group position={[0, getOffsetY(0.32, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[0.6 * Math.cos(angle), 0, 0.6 * Math.sin(angle)]} rotation={[0.2, i, 0.1]}>
              <boxGeometry args={[0.35, 0.35, 0.35]} />
              <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#8a4b16'} roughness={0.8} clearcoat={0.2} />
            </mesh>
          );
        })}
        {/* Saffron Cream Swirl */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.7, 0.08, 32, 64]} />
          <meshPhysicalMaterial color="#fff3e0" roughness={0.2} clearcoat={0.6} />
        </mesh>
        {(exploded || highlightedIndex === 2) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Tandoori Tikka & Cream
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 5. Detailed Bamboo Steamer Dim Sum Model
export function RealisticDimSum({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.55 : 0);
  };

  return (
    <group ref={groupRef}>
      {/* Bamboo Steamer Basket */}
      <group position={[0, getOffsetY(-0.35, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 1.65, 0.35, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 0 ? '#f97316' : '#d2a679'} roughness={0.9} bumpScale={0.05} />
        </mesh>
        {/* Bamboo slats inside */}
        <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.05, 32]} />
          <meshPhysicalMaterial color="#c29562" roughness={0.9} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Woven Bamboo Steamer
            </div>
          </Html>
        )}
      </group>

      {/* Assorted Handcrafted Dumplings */}
      <group position={[0, getOffsetY(0.15, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        {/* Crystal Truffle Dumpling (Translucent) */}
        <mesh position={[-0.6, 0, -0.4]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshPhysicalMaterial color="#f0f3f4" transmission={0.8} thickness={0.5} roughness={0.1} clearcoat={0.5} />
        </mesh>
        {/* Charcoal Dumpling */}
        <mesh position={[0.6, 0, -0.4]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshPhysicalMaterial color="#1c2833" roughness={0.4} clearcoat={0.3} />
        </mesh>
        {/* Edamame Dumpling */}
        <mesh position={[0, 0, 0.6]} castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshPhysicalMaterial color="#27ae60" transmission={0.4} thickness={0.2} roughness={0.2} clearcoat={0.4} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Translucent Dumplings
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 6. Detailed Belgian Chocolate Dessert Model with Gold Leaf
export function RealisticDessert({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const getOffsetY = (baseY: number, idx: number) => {
    return baseY + (exploded ? (idx - 1) * 0.55 : 0);
  };

  return (
    <group ref={groupRef}>
      {/* Glass Dessert Dish */}
      <group position={[0, getOffsetY(-0.45, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 0.8, 0.35, 64]} />
          <meshPhysicalMaterial color="#ffffff" transmission={1.0} thickness={0.5} roughness={0.05} ior={1.5} clearcoat={1.0} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Crystal Glass Dish
            </div>
          </Html>
        )}
      </group>

      {/* Tahitian Vanilla Gelato Scoop */}
      <group position={[0, getOffsetY(-0.05, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshPhysicalMaterial color={highlightedIndex === 1 ? '#f97316' : '#fffdd0'} roughness={0.5} clearcoat={0.1} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Tahitian Vanilla Gelato
            </div>
          </Html>
        )}
      </group>

      {/* 70% Belgian Dark Chocolate Sphere with Gold Leaf */}
      <group position={[0, getOffsetY(0.4, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        <mesh castShadow>
          <sphereGeometry args={[0.75, 64, 64]} />
          <meshPhysicalMaterial color={highlightedIndex === 2 ? '#f97316' : '#231106'} roughness={0.05} metalness={0.1} clearcoat={1.0} clearcoatRoughness={0.05} />
        </mesh>
        {/* 24k Gold Leaf Flakes */}
        {Array.from({ length: 15 }).map((_, i) => {
          const phi = (i / 15) * Math.PI * 2;
          const theta = 0.1 + (i % 3) * 0.2;
          const x = 0.76 * Math.sin(theta) * Math.cos(phi);
          const z = 0.76 * Math.sin(theta) * Math.sin(phi);
          const y = 0.76 * Math.cos(theta);
          return (
            <mesh key={`gold-${i}`} position={[x, y, z]} rotation={[Math.random(), phi, Math.random()]}>
              <planeGeometry args={[0.08, 0.08]} />
              <meshPhysicalMaterial color="#ffd700" metalness={1.0} roughness={0.2} />
            </mesh>
          );
        })}
        {(exploded || highlightedIndex === 2) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Chocolate Lava & 24k Gold
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// 7. Detailed Realistic Glass Drink Model
export function RealisticDrink({ exploded, highlightedIndex, onSelectLayer }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += 0.006;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Translucent Crystal Glass */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.7, 2.2, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={1.0} 
          roughness={0.05} 
          ior={1.5} 
          thickness={0.5} 
          clearcoat={1.0}
        />
      </mesh>

      {/* Liquid Interior (Gradient effect via two cylinders) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.8, 0.66, 1.8, 32]} />
        <meshPhysicalMaterial color="#c0392b" transmission={0.9} thickness={2} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.78, 0.68, 0.4, 32]} />
        <meshPhysicalMaterial color="#f39c12" transmission={0.8} thickness={2} roughness={0.1} />
      </mesh>

      {/* 3D Floating Ice Cubes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[(i % 2 === 0 ? 0.3 : -0.3), 0.5 + i * 0.15, (i > 1 ? 0.2 : -0.2)]}
          rotation={[0.4, i * 0.8, 0.2]}
        >
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.95} ior={1.33} roughness={0.05} thickness={0.5} />
        </mesh>
      ))}

      {/* Dehydrated Lime Slice on Glass Rim */}
      <mesh position={[0.82, 0.95, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
        <meshPhysicalMaterial color="#27ae60" roughness={0.4} transmission={0.3} thickness={0.1} />
      </mesh>

      {/* Straw */}
      <mesh position={[-0.2, 0.4, 0.1]} rotation={[0.1, 0, -0.25]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 32]} />
        <meshPhysicalMaterial color="#f39c12" roughness={0.2} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

export const Food3DViewer: React.FC<Food3DViewerProps> = ({ item }) => {
  const [exploded, setExploded] = useState(false);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);

  const shape = item.model3DConfig?.baseShape || 'burger';

  return (
    <div className="relative w-full h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-slate-200">
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          <span className="font-extrabold">Ultra-Realistic 3D Food Model</span>
        </div>

        <button
          onClick={() => setExploded(!exploded)}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
            exploded 
              ? 'bg-orange-500 text-white shadow-orange-500/30' 
              : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          {exploded ? 'Collapse View' : 'Exploded Layer View'}
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2.2, 4.2], fov: 45 }}>
        {/* Environment map for photorealistic lighting and reflections */}
        <Environment preset="sunset" />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffaa55" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          {shape === 'pizza' ? (
            <RealisticPizza exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          ) : shape === 'pasta' ? (
            <RealisticPasta exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          ) : shape === 'curry' ? (
            <RealisticCurry exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          ) : shape === 'sushi' ? (
            <RealisticDimSum exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          ) : shape === 'dessert' ? (
            <RealisticDessert exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          ) : shape === 'drink' ? (
            <RealisticDrink exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          ) : (
            <RealisticBurger exploded={exploded} highlightedIndex={selectedLayerIndex} onSelectLayer={setSelectedLayerIndex} />
          )}
        </Float>

        <ContactShadows position={[0, -1.25, 0]} opacity={0.7} scale={6.5} blur={2.0} far={4.5} color="#000000" />
        <OrbitControls enableZoom={true} minDistance={2.2} maxDistance={6.5} maxPolarAngle={Math.PI / 2 + 0.1} autoRotate={!exploded} autoRotateSpeed={0.5} />
      </Canvas>

      {/* Bottom Info HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              Drag to rotate 360° • Pinch / Scroll to zoom
            </div>
            <div className="text-[11px] text-slate-400">
              Hyper-Fidelity Physical Shaders & Environment Maps
            </div>
          </div>
        </div>

        <button 
          onClick={() => setSelectedLayerIndex(null)}
          className="text-xs text-orange-400 hover:underline font-semibold"
        >
          Reset Selection
        </button>
      </div>
    </div>
  );
};
