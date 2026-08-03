import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '../../types';
import { Layers, Sparkles, Info } from 'lucide-react';

interface Food3DViewerProps {
  item: MenuItem;
}

// Custom Steam Particles Component
function SteamParticles() {
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
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// 1. Detailed Realistic Burger Model
function RealisticBurger({ exploded, highlightedIndex, onSelectLayer }: any) {
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
          <meshStandardMaterial color={highlightedIndex === 0 ? '#f97316' : '#d2b48c'} roughness={0.6} />
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
          <meshStandardMaterial color={highlightedIndex === 1 ? '#f97316' : '#3d1c0c'} roughness={0.8} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Cast Iron Wagyu Patty
            </div>
          </Html>
        )}
      </group>

      {/* Melted Aged Cheddar Cheese */}
      <group position={[0, getOffsetY(-0.08, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        <mesh castShadow receiveShadow rotation={[0, Math.PI / 6, 0]}>
          <boxGeometry args={[2.1, 0.05, 2.1]} />
          <meshStandardMaterial color={highlightedIndex === 2 ? '#f97316' : '#ffb300'} roughness={0.3} />
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
          <cylinderGeometry args={[1.4, 1.3, 0.06, 32]} />
          <meshStandardMaterial color={highlightedIndex === 3 ? '#f97316' : '#27ae60'} roughness={0.4} />
        </mesh>
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
          <meshStandardMaterial color={highlightedIndex === 4 ? '#f97316' : '#e74c3c'} roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.1, 24]} />
          <meshStandardMaterial color={highlightedIndex === 4 ? '#f97316' : '#c0392b'} roughness={0.3} />
        </mesh>
        {(exploded || highlightedIndex === 4) && (
          <Html position={[1.5, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              San Marzano Tomato
            </div>
          </Html>
        )}
      </group>

      {/* Top Brioche Bun with 3D White Sesame Seeds */}
      <group position={[0, getOffsetY(0.6, 5), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(5); }}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={highlightedIndex === 5 ? '#f97316' : '#c68b59'} roughness={0.5} />
        </mesh>
        {Array.from({ length: 24 }).map((_, i) => {
          const phi = (i / 24) * Math.PI * 2;
          const theta = 0.3 + (i % 3) * 0.3;
          const x = 1.15 * Math.sin(theta) * Math.cos(phi);
          const z = 1.15 * Math.sin(theta) * Math.sin(phi);
          const y = 1.15 * Math.cos(theta) - 0.1;
          return (
            <mesh key={i} position={[x, y, z]} rotation={[0.2, phi, 0]}>
              <boxGeometry args={[0.06, 0.03, 0.12]} />
              <meshStandardMaterial color="#fffbe6" roughness={0.3} />
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
function RealisticPizza({ exploded, highlightedIndex, onSelectLayer }: any) {
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
      {/* Outer Crust Ring */}
      <group position={[0, getOffsetY(-0.1, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.0, 0.22, 16, 32]} />
          <meshStandardMaterial color={highlightedIndex === 0 ? '#f97316' : '#b9770e'} roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
          <cylinderGeometry args={[2.0, 1.95, 0.12, 32]} />
          <meshStandardMaterial color="#d5b895" roughness={0.8} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[2.4, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Wood-Fired Crust
            </div>
          </Html>
        )}
      </group>

      {/* Sauce & Melted Burrata Base */}
      <group position={[0, getOffsetY(0.08, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.9, 1.85, 0.08, 32]} />
          <meshStandardMaterial color={highlightedIndex === 1 ? '#f97316' : '#fef9e7'} roughness={0.3} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[2.4, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Puglia Burrata Cream
            </div>
          </Html>
        )}
      </group>

      {/* Truffle Shavings & Basil */}
      <group position={[0, getOffsetY(0.25, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 0.6 + (i % 3) * 0.45;
          return (
            <mesh key={i} position={[r * Math.cos(angle), 0, r * Math.sin(angle)]} rotation={[0, angle, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
              <meshStandardMaterial color={highlightedIndex === 2 ? '#f97316' : '#1c2833'} roughness={0.5} />
            </mesh>
          );
        })}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2 + 0.3;
          return (
            <mesh key={`basil-${i}`} position={[1.1 * Math.cos(angle), 0.04, 1.1 * Math.sin(angle)]}>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 12]} />
              <meshStandardMaterial color="#27ae60" roughness={0.2} />
            </mesh>
          );
        })}
        {(exploded || highlightedIndex === 2) && (
          <Html position={[2.4, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Summer Black Truffle
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 3. Detailed Realistic Pasta Model
function RealisticPasta({ exploded, highlightedIndex, onSelectLayer }: any) {
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
          <meshStandardMaterial color={highlightedIndex === 0 ? '#f97316' : '#f4f6f7'} roughness={0.2} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Deep Ceramic Bowl
            </div>
          </Html>
        )}
      </group>

      {/* Swirling Fettuccine Strands Nest */}
      <group position={[0, getOffsetY(0.1, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.05, 0]} rotation={[0.1, i * 0.6, 0]}>
            <torusGeometry args={[0.9 - i * 0.08, 0.12, 16, 32]} />
            <meshStandardMaterial color={highlightedIndex === 1 ? '#f97316' : '#f4d03f'} roughness={0.4} />
          </mesh>
        ))}
        {(exploded || highlightedIndex === 1) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Fresh Fettuccine Nest
            </div>
          </Html>
        )}
      </group>

      {/* Porcini Mushrooms & Shaved Parmigiano */}
      <group position={[0, getOffsetY(0.4, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <group key={i} position={[0.55 * Math.cos(angle), 0, 0.55 * Math.sin(angle)]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.22, 0.15, 0.1, 16]} />
                <meshStandardMaterial color={highlightedIndex === 2 ? '#f97316' : '#4a2311'} roughness={0.7} />
              </mesh>
            </group>
          );
        })}
        {(exploded || highlightedIndex === 2) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Porcini & Parmigiano
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 4. Detailed Indian Royal Handi Curry Model
function RealisticCurry({ exploded, highlightedIndex, onSelectLayer }: any) {
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
      {/* Brass Handi Pot Vessel */}
      <group position={[0, getOffsetY(-0.4, 0), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(0); }}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, Math.PI / 3, Math.PI / 2]} />
          <meshStandardMaterial color={highlightedIndex === 0 ? '#f97316' : '#b7950b'} metalness={0.7} roughness={0.3} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Brass Handi Vessel
            </div>
          </Html>
        )}
      </group>

      {/* Rich Makhani Tomato Gravy */}
      <group position={[0, getOffsetY(0.1, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 1.35, 0.15, 32]} />
          <meshStandardMaterial color={highlightedIndex === 1 ? '#f97316' : '#d35400'} roughness={0.3} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Rich Makhani Gravy
            </div>
          </Html>
        )}
      </group>

      {/* Charred Chicken / Paneer Cubes & Cream Swirl */}
      <group position={[0, getOffsetY(0.32, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[0.6 * Math.cos(angle), 0, 0.6 * Math.sin(angle)]} rotation={[0.2, i, 0.1]}>
              <boxGeometry args={[0.35, 0.35, 0.35]} />
              <meshStandardMaterial color={highlightedIndex === 2 ? '#f97316' : '#7e5109'} roughness={0.8} />
            </mesh>
          );
        })}
        {/* White Cream Swirl Ring */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.7, 0.08, 16, 32]} />
          <meshStandardMaterial color="#fef9e7" roughness={0.2} />
        </mesh>
        {(exploded || highlightedIndex === 2) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Charred Tikka + Cream
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 5. Detailed Bamboo Steamer Dim Sum Model
function RealisticDimSum({ exploded, highlightedIndex, onSelectLayer }: any) {
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
          <cylinderGeometry args={[1.7, 1.65, 0.35, 32]} />
          <meshStandardMaterial color={highlightedIndex === 0 ? '#f97316' : '#d35400'} roughness={0.8} />
        </mesh>
        {(exploded || highlightedIndex === 0) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Bamboo Steamer
            </div>
          </Html>
        )}
      </group>

      {/* Assorted Handcrafted Dumplings */}
      <group position={[0, getOffsetY(0.15, 1), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(1); }}>
        {/* Crystal Truffle Dumpling */}
        <mesh position={[-0.6, 0, -0.4]} castShadow>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="#eaeded" transparent opacity={0.85} roughness={0.2} />
        </mesh>
        {/* Charcoal Dumpling */}
        <mesh position={[0.6, 0, -0.4]} castShadow>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="#1c2833" roughness={0.5} />
        </mesh>
        {/* Edamame Dumpling */}
        <mesh position={[0, 0, 0.6]} castShadow>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="#27ae60" roughness={0.4} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[2.0, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Truffle & Edamame Dumplings
            </div>
          </Html>
        )}
      </group>

      <SteamParticles />
    </group>
  );
}

// 6. Detailed Belgian Chocolate Dessert Model
function RealisticDessert({ exploded, highlightedIndex, onSelectLayer }: any) {
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
          <cylinderGeometry args={[1.4, 0.8, 0.35, 32]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} transmission={0.9} roughness={0.1} />
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
          <sphereGeometry args={[0.85, 32, 16]} />
          <meshStandardMaterial color={highlightedIndex === 1 ? '#f97316' : '#fef9e7'} roughness={0.6} />
        </mesh>
        {(exploded || highlightedIndex === 1) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Tahitian Vanilla Gelato
            </div>
          </Html>
        )}
      </group>

      {/* 70% Belgian Dark Chocolate Sphere */}
      <group position={[0, getOffsetY(0.4, 2), 0]} onClick={(e) => { e.stopPropagation(); onSelectLayer(2); }}>
        <mesh castShadow>
          <sphereGeometry args={[0.75, 32, 16]} />
          <meshStandardMaterial color={highlightedIndex === 2 ? '#f97316' : '#2c1609'} roughness={0.1} metalness={0.2} />
        </mesh>
        {(exploded || highlightedIndex === 2) && (
          <Html position={[1.8, 0, 0]} center distanceFactor={8}>
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-full text-xs font-bold border border-orange-500 shadow-xl backdrop-blur-md whitespace-nowrap">
              Belgian Lava Sphere
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// 7. Detailed Realistic Glass Drink Model
function RealisticDrink({ exploded, highlightedIndex, onSelectLayer }: any) {
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
        <cylinderGeometry args={[0.85, 0.7, 2.2, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          roughness={0.1} 
          transmission={0.9} 
          thickness={0.5} 
        />
      </mesh>

      {/* Liquid Interior */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.8, 0.66, 1.8, 32]} />
        <meshStandardMaterial color="#c0392b" roughness={0.2} />
      </mesh>

      {/* 3D Floating Ice Cubes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[(i % 2 === 0 ? 0.3 : -0.3), 0.5 + i * 0.15, (i > 1 ? 0.2 : -0.2)]}
          rotation={[0.4, i * 0.8, 0.2]}
        >
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshPhysicalMaterial color="#ebf5fb" transparent opacity={0.65} roughness={0.1} />
        </mesh>
      ))}

      {/* Dehydrated Lime Slice on Glass Rim */}
      <mesh position={[0.82, 0.95, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
        <meshStandardMaterial color="#27ae60" roughness={0.4} />
      </mesh>

      {/* Straw */}
      <mesh position={[-0.2, 0.4, 0.1]} rotation={[0.1, 0, -0.25]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
        <meshStandardMaterial color="#f39c12" roughness={0.3} />
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
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.9} color="#ffaa55" />

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

        <ContactShadows position={[0, -1.25, 0]} opacity={0.65} scale={6.5} blur={1.8} far={4.5} color="#000000" />
        <OrbitControls enableZoom={true} minDistance={2.2} maxDistance={6.5} maxPolarAngle={Math.PI / 2 + 0.1} />
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
              High-Fidelity Procedural Geometry & Thermal Steam Particles
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
