import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { ModelImportModal } from '../3d/ModelImportModal';
import { Plus, Edit2, Trash2, Check, X, Box, Flame, Sparkles, RefreshCw, Upload, Link as LinkIcon } from 'lucide-react';

interface MenuManagerProps {
  menuItems: MenuItem[];
  onSaveMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onResetMenu?: () => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  menuItems,
  onSaveMenuItem,
  onDeleteMenuItem,
  onResetMenu,
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [targetDishIdForImport, setTargetDishIdForImport] = useState<string | undefined>(undefined);

  const handleAddNew = () => {
    const newItem: MenuItem = {
      id: `dish-${Date.now()}`,
      name: 'New Chef Creation',
      category: 'starters',
      price: 299,
      vegType: 'veg',
      spiceLevel: 2,
      calories: 400,
      cookingTimeMinutes: 10,
      rating: 5.0,
      reviewCount: 1,
      isAvailable: true,
      description: 'Gourmet appetizer made with fresh artisanal ingredients.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ['Fresh Vegetables', 'Special Herbs'],
      cookingStyle: 'Chef Special Grill',
      origin: 'Bistro Original',
      macros: { protein: 15, carbs: 35, fat: 12, sugar: 3 },
      portionSize: '1 Plate',
      allergens: [],
      freshnessScore: 99,
      model3DConfig: {
        baseShape: 'burger',
        primaryColor: '#f59e0b',
        secondaryColor: '#ea580c',
        layers: [
          { name: 'Base Layer', color: '#f59e0b', heightOffset: -0.2, radius: 1.0 },
          { name: 'Garnish Top', color: '#ea580c', heightOffset: 0.2, radius: 0.9 },
        ]
      }
    };

    setEditingItem(newItem);
  };

  const handleApply3DModel = (dishId: string, modelUrl: string, scale: number) => {
    const targetItem = menuItems.find(m => m.id === dishId);
    if (targetItem) {
      const updated: MenuItem = {
        ...targetItem,
        externalModelUrl: modelUrl,
        externalModelScale: scale,
      };
      onSaveMenuItem(updated);
      alert(`✅ 3D Model successfully attached to "${targetItem.name}"!`);
    }
  };

  return (
    <div className="bg-[#0c1017] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 font-sans select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-serif font-black text-white gold-gradient-text tracking-tight">Menu Product Catalog ({menuItems.length} Dishes)</h2>
          <p className="text-xs text-slate-400">Add, edit, manage external 3D GLTF models, or restore default products</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Import 3D Model Button */}
          <button 
            onClick={() => {
              setTargetDishIdForImport(menuItems[0]?.id);
              setIsImportModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-2 border border-amber-500/30 transition-all shadow-md"
          >
            <Box className="w-4 h-4 text-amber-400" /> Import External 3D Model
          </button>

          {onResetMenu && (
            <button 
              onClick={() => {
                if (confirm('Reset menu items to full default product catalog?')) {
                  onResetMenu();
                }
              }}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" /> Restore Defaults
            </button>
          )}

          <button 
            onClick={handleAddNew}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Menu Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="p-3">Dish</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Dietary</th>
              <th className="p-3">Cook Time</th>
              <th className="p-3">3D Asset Type</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {menuItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm font-serif">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.portionSize}</div>
                  </div>
                </td>

                <td className="p-3 font-semibold uppercase text-amber-400">{item.category}</td>
                <td className="p-3 font-extrabold text-white">₹{item.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.vegType === 'veg' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.vegType}
                  </span>
                </td>
                <td className="p-3 font-bold">{item.cookingTimeMinutes}m</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                    item.externalModelUrl 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Box className="w-3 h-3" />
                    {item.externalModelUrl ? 'Imported GLTF' : 'Procedural 3D'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        setTargetDishIdForImport(item.id);
                        setIsImportModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700"
                      title="Attach 3D Model"
                    >
                      <Box className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => onDeleteMenuItem(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Drawer Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-black text-white text-base">Edit Dish: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold">Dish Name:</label>
                <input 
                  type="text" 
                  value={editingItem.name} 
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold">Price (₹):</label>
                  <input 
                    type="number" 
                    value={editingItem.price} 
                    onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold">Cooking Time (Mins):</label>
                  <input 
                    type="number" 
                    value={editingItem.cookingTimeMinutes} 
                    onChange={e => setEditingItem({...editingItem, cookingTimeMinutes: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold">External 3D GLTF/GLB Model URL (Optional):</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/model.glb"
                  value={editingItem.externalModelUrl || ''} 
                  onChange={e => setEditingItem({...editingItem, externalModelUrl: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono mt-1 text-[11px]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">Cancel</button>
              <button 
                onClick={() => {
                  onSaveMenuItem(editingItem);
                  setEditingItem(null);
                }} 
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Importer Modal */}
      <ModelImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApplyModel={handleApply3DModel}
        menuItems={menuItems}
        defaultDishId={targetDishIdForImport}
      />
    </div>
  );
};
