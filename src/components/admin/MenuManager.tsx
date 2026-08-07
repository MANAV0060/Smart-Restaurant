import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Plus, Edit2, Trash2, Box, Sparkles, Check, X } from 'lucide-react';

interface MenuManagerProps {
  menuItems: MenuItem[];
  onSaveMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  menuItems,
  onSaveMenuItem,
  onDeleteMenuItem,
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  const handleStartCreate = () => {
    setFormData({
      id: `dish-${Date.now()}`,
      name: '',
      category: 'burgers',
      price: 399,
      description: '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      isAvailable: true,
      vegType: 'veg',
      spiceLevel: 2,
      allergens: [],
      cookingTimeMinutes: 15,
      calories: 450,
      freshnessScore: 98,
      rating: 4.8,
      reviewCount: 120,
      portionSize: 'Standard Platter',
      cookingStyle: 'Gourmet Artisanal',
      origin: 'Bistro Creation',
      macros: { protein: 22, carbs: 48, fat: 18, sugar: 4 },
      ingredients: ['Organic Seasoning', 'Fresh Herbs'],
      model3DConfig: {
        baseShape: 'burger',
        primaryColor: '#F48F68',
        secondaryColor: '#FFE394',
        layers: []
      }
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleStartEdit = (item: MenuItem) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    onSaveMenuItem(formData as MenuItem);
    setEditingItem(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5 font-sans select-none text-[#1C1917]">
      {/* Top Action Bar */}
      <div className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#1C1917]">Menu Catalog & 3D Assets</h2>
          <p className="text-xs text-[#78716C]">{menuItems.length} Culinary Dishes in Database</p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Add New Dish
        </button>
      </div>

      {/* Edit / Create Form Modal */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#EADBBA] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EADBBA] pb-3">
              <h3 className="font-serif font-bold text-[#1C1917] text-base">
                {isCreating ? 'Create Gourmet Dish' : `Edit ${editingItem?.name}`}
              </h3>
              <button onClick={() => { setIsCreating(false); setEditingItem(null); }} className="text-[#78716C] hover:text-[#1C1917]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716C] font-semibold mb-1">Dish Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#FFFDF7] border border-[#EADBBA] rounded-md px-3 py-1.5 text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716C] font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="w-full bg-[#FFFDF7] border border-[#EADBBA] rounded-md px-3 py-1.5 text-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716C] font-semibold mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#FFFDF7] border border-[#EADBBA] rounded-md px-3 py-1.5 text-[#1C1917]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716C] font-semibold mb-1">Category</label>
                  <select
                    value={formData.category || 'burgers'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#FFFDF7] border border-[#EADBBA] rounded-md px-3 py-1.5 text-[#1C1917]"
                  >
                    <option value="starters">Starters</option>
                    <option value="pizza">Artisan Pizza</option>
                    <option value="burgers">Gourmet Burgers</option>
                    <option value="pasta">Fresh Pasta</option>
                    <option value="indian">Royal Indian</option>
                    <option value="asian">Asian Wok</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Cocktails & Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#78716C] font-semibold mb-1">External 3D Model URL (GLB/GLTF)</label>
                  <input
                    type="text"
                    value={formData.externalModelUrl || ''}
                    onChange={(e) => setFormData({ ...formData, externalModelUrl: e.target.value })}
                    placeholder="https://.../model.glb"
                    className="w-full bg-[#FFFDF7] border border-[#EADBBA] rounded-md px-3 py-1.5 text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EADBBA]">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingItem(null); }}
                  className="px-4 py-1.5 rounded-md bg-[#FFF6DE] text-[#78716C] hover:text-[#1C1917] border border-[#EADBBA] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Cards Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-[#1C1917] truncate">{item.name}</h4>
                <div className="text-[11px] font-bold text-[#F48F68] mt-0.5">₹{item.price}</div>
                <div className="text-[10px] text-[#78716C] capitalize">{item.category}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-1.5 rounded-md bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] border border-[#EADBBA] shadow-2xs"
                title="Edit item"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteMenuItem(item.id)}
                className="p-1.5 rounded-md bg-[#FFF6DE] hover:bg-rose-50 text-rose-600 border border-[#EADBBA] shadow-2xs"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
