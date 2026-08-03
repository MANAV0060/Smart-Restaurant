import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { Plus, Edit2, Trash2, Check, X, Box, Flame, Sparkles } from 'lucide-react';

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
        primaryColor: '#f97316',
        secondaryColor: '#f59e0b',
        layers: [
          { name: 'Base Layer', color: '#f97316', heightOffset: -0.2, radius: 1.0 },
          { name: 'Garnish Top', color: '#f59e0b', heightOffset: 0.2, radius: 0.9 },
        ]
      }
    };

    setEditingItem(newItem);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Menu Item Management</h2>
          <p className="text-xs text-slate-400">Add, edit, or toggle availability of dishes & 3D models</p>
        </div>

        <button 
          onClick={handleAddNew}
          className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-4 h-4" /> Add New Dish
        </button>
      </div>

      {/* Menu Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="p-3">Dish</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Type</th>
              <th className="p-3">Cook Time</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {menuItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.portionSize}</div>
                  </div>
                </td>

                <td className="p-3 font-semibold uppercase text-orange-400">{item.category}</td>
                <td className="p-3 font-bold text-white">₹{item.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.vegType === 'veg' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.vegType}
                  </span>
                </td>
                <td className="p-3 font-bold">{item.cookingTimeMinutes}m</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => onDeleteMenuItem(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
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
              <h3 className="font-extrabold text-white text-base">Edit Dish: {editingItem.name}</h3>
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
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">Cancel</button>
              <button 
                onClick={() => {
                  onSaveMenuItem(editingItem);
                  setEditingItem(null);
                }} 
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
