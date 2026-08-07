import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import { MenuItem } from '../../types';
import { Box, Upload, Link as LinkIcon, Check, X, Sparkles, RefreshCw, Layers, Sliders, AlertTriangle } from 'lucide-react';

interface ModelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyModel: (dishId: string, modelUrl: string, scale: number) => void;
  menuItems: MenuItem[];
  defaultDishId?: string;
}

// Preset Open-Source GLTF 3D Models (Reliable Public CDNs)
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Interactive 3D Canvas Preview */}
        <div className="w-full md:w-1/2 h-72 md:h-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between p-4">
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>3D Model Studio & Live Importer</span>
          </div>

          <div className="w-full h-full my-auto flex items-center justify-center">
            {hasError ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-rose-400">
                <AlertTriangle className="w-10 h-10 mb-2" />
                <p className="font-bold text-sm">Failed to render 3D model</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Ensure the GLTF/GLB URL allows CORS or select a valid 3D file.</p>
              </div>
            ) : (
              <Canvas camera={{ position: [0, 1.5, 3.5], fov: 45 }}>
                <Environment preset="sunset" />
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
                
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                  <React.Suspense fallback={null}>
                    <LoadedGLTFModel url={previewUrl} scale={modelScale} />
                  </React.Suspense>
                </Float>

                <ContactShadows position={[0, -0.9, 0]} opacity={0.6} scale={5} blur={2} color="#000" />
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1.0} />
              </Canvas>
            )}
          </div>

          {/* Scale Slider Control */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-amber-400" /> Model Scale Adjuster</span>
              <span className="text-amber-400">{modelScale.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="20.0" 
              step="0.1" 
              value={modelScale}
              onChange={(e) => setModelScale(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Controls & Source Selector */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white font-serif tracking-tight">Import 3D Dish Asset</h2>
              <p className="text-xs text-slate-400">Load GLTF / GLB models from URL, local file, or preset gallery</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Source Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setImportMode('preset')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                importMode === 'preset' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Preset Models
            </button>
            <button
              onClick={() => setImportMode('url')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                importMode === 'url' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Model URL
            </button>
            <button
              onClick={() => setImportMode('file')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                importMode === 'file' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload Local File
            </button>
          </div>

          {/* Tab 1: Presets */}
          {importMode === 'preset' && (
            <div className="grid grid-cols-2 gap-3">
              {PRESET_3D_MODELS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    previewUrl === preset.url
                      ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <img src={preset.thumbnail} alt={preset.name} className="w-full h-20 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-xs text-white">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tab 2: Remote URL */}
          {importMode === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Direct GLTF / GLB Web Link:</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/models/dish.glb"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all"
                  >
                    Load
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste direct links to <span className="text-amber-400 font-semibold">.glb</span> or <span className="text-amber-400 font-semibold">.gltf</span> models from Sketchfab, Poly Pizza, ambientCG, GitHub, or any CORS-enabled web server.
              </p>
            </form>
          )}

          {/* Tab 3: Upload Local File */}
          {importMode === 'file' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 bg-slate-950/60 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">
                    {fileName ? fileName : 'Click to select .glb or .gltf file from your PC'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Supports binary GLTF (.glb) and text GLTF (.gltf)</div>
                </div>
              </div>
            </div>
          )}

          {/* Target Dish Selector */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Assign Model to Dish:</label>
            <select
              value={selectedDishId}
              onChange={(e) => setSelectedDishId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-amber-500"
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
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Check className="w-4 h-4" /> Apply 3D Model to Dish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
