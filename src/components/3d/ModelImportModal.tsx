import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import { MenuItem } from '../../types';
import { Box, Upload, Check, X, Sparkles, Sliders, AlertTriangle } from 'lucide-react';

interface ModelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyModel: (dishId: string, modelUrl: string, scale: number) => void;
  menuItems: MenuItem[];
  defaultDishId?: string;
}

// Preset Open-Source GLTF 3D Models
export const PRESET_3D_MODELS = [
  {
    id: 'preset-burger',
    name: 'Classic Cheeseburger',
    category: 'burger',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF-Binary/Duck.glb',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    defaultScale: 1.2,
    description: 'Detailed 3D mesh model of artisanal burger',
  },
  {
    id: 'preset-pizza',
    name: 'Neapolitan Pizza',
    category: 'pizza',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Avocado/glTF-Binary/Avocado.glb',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    defaultScale: 15.0,
    description: 'High poly food asset with PBR textures',
  },
  {
    id: 'preset-drink',
    name: 'Cocktail & Glassware',
    category: 'beverages',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
    thumbnail: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    defaultScale: 3.5,
    description: 'Realistic glass refractive shader model',
  },
  {
    id: 'preset-helmet',
    name: 'Futuristic Bistro Cloche',
    category: 'starters',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    defaultScale: 1.1,
    description: 'Metallic chrome serving lid dish',
  }
];

function LoadedGLTFModel({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url);

  return (
    <primitive 
      object={scene.clone()} 
      scale={[scale, scale, scale]} 
      position={[0, -0.5, 0]}
    />
  );
}

export const ModelImportModal: React.FC<ModelImportModalProps> = ({
  isOpen,
  onClose,
  onApplyModel,
  menuItems,
  defaultDishId,
}) => {
  const [importMode, setImportMode] = useState<'preset' | 'url' | 'file'>('preset');
  const [selectedDishId, setSelectedDishId] = useState<string>(defaultDishId || menuItems[0]?.id || '');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(PRESET_3D_MODELS[0].url);
  const [modelScale, setModelScale] = useState<number>(PRESET_3D_MODELS[0].defaultScale);
  const [fileName, setFileName] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
        alert('Please select a valid .glb or .gltf 3D model file.');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setFileName(file.name);
      setPreviewUrl(objectUrl);
      setHasError(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_3D_MODELS[0]) => {
    setPreviewUrl(preset.url);
    setModelScale(preset.defaultScale);
    setHasError(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setPreviewUrl(customUrl.trim());
      setHasError(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedDishId) {
      alert('Please select a dish to assign this 3D model to.');
      return;
    }
    onApplyModel(selectedDishId, previewUrl, modelScale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-4xl bg-[#14171f] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left 3D Canvas Preview */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#0d1017] relative border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col justify-between p-4">
          <div className="absolute top-3 left-3 z-10 bg-[#14171f] border border-white/[0.08] px-2.5 py-1 rounded text-xs font-semibold text-amber-400 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Model Preview</span>
          </div>

          <div className="w-full h-full my-auto flex items-center justify-center">
            {hasError ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-rose-400">
                <AlertTriangle className="w-8 h-8 mb-2" />
                <p className="font-semibold text-xs">Failed to render 3D model</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">Ensure the GLTF/GLB URL allows CORS or select a valid 3D file.</p>
              </div>
            ) : (
              <Canvas camera={{ position: [0, 1.5, 3.5], fov: 45 }}>
                <Environment preset="sunset" />
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
                
                <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
                  <React.Suspense fallback={null}>
                    <LoadedGLTFModel url={previewUrl} scale={modelScale} />
                  </React.Suspense>
                </Float>

                <ContactShadows position={[0, -0.9, 0]} opacity={0.5} scale={5} blur={2} color="#000" />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.8} />
              </Canvas>
            )}
          </div>

          {/* Scale Slider Control */}
          <div className="relative z-10 bg-[#14171f] p-2.5 rounded-lg border border-white/[0.08] space-y-1">
            <div className="flex justify-between items-center text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-amber-400" /> Scale Adjustment</span>
              <span className="text-amber-400 font-bold">{modelScale.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="20.0" 
              step="0.1" 
              value={modelScale}
              onChange={(e) => setModelScale(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Right Controls & Source Selector */}
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-between space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-tight">Attach 3D Model Asset</h2>
              <p className="text-xs text-slate-400">Load GLTF / GLB models from URL, file, or preset gallery</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-md bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Source Tabs */}
          <div className="flex bg-[#0d1017] p-1 rounded-md border border-white/[0.06] text-xs font-semibold">
            <button
              onClick={() => setImportMode('preset')}
              className={`flex-1 py-1.5 rounded transition-colors ${
                importMode === 'preset' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Preset Models
            </button>
            <button
              onClick={() => setImportMode('url')}
              className={`flex-1 py-1.5 rounded transition-colors ${
                importMode === 'url' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Model URL
            </button>
            <button
              onClick={() => setImportMode('file')}
              className={`flex-1 py-1.5 rounded transition-colors ${
                importMode === 'file' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload Local File
            </button>
          </div>

          {/* Tab 1: Presets */}
          {importMode === 'preset' && (
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_3D_MODELS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-lg border text-left transition-colors flex flex-col justify-between gap-1.5 ${
                    previewUrl === preset.url
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-white/[0.06] bg-[#0d1017] hover:border-white/[0.12] text-slate-300'
                  }`}
                >
                  <img src={preset.thumbnail} alt={preset.name} className="w-full h-18 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-xs text-white">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tab 2: Remote URL */}
          {importMode === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Direct GLTF / GLB Web URL:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/models/dish.glb"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 bg-[#0d1017] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md transition-colors"
                  >
                    Load
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste direct links to .glb or .gltf assets from Poly Pizza, Sketchfab, GitHub, or your server.
              </p>
            </form>
          )}

          {/* Tab 3: Upload Local File */}
          {importMode === 'file' && (
            <div className="space-y-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/[0.15] hover:border-amber-500/60 bg-[#0d1017] rounded-lg p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-white">
                    {fileName ? fileName : 'Click to select .glb or .gltf file'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Supports binary GLTF (.glb) and text GLTF (.gltf)</div>
                </div>
              </div>
            </div>
          )}

          {/* Target Dish Selector */}
          <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Assign Model to Dish:</label>
            <select
              value={selectedDishId}
              onChange={(e) => setSelectedDishId(e.target.value)}
              className="w-full bg-[#0d1017] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white font-medium outline-none focus:border-amber-500"
            >
              {menuItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (₹{item.price} • {item.category})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md bg-slate-900 text-slate-300 hover:text-white font-medium text-xs border border-white/[0.08] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Apply 3D Model</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
