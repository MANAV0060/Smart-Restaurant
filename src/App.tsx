import React, { useState, useEffect } from 'react';
import { useStore } from './services/store';
import { MenuItem, CategoryId, CartItem, AllergyType, Order } from './types';
import { matchVoiceSearch } from './services/voiceMatching';
import { LandingPage } from './components/customer/LandingPage';
import { CustomerHeader } from './components/customer/CustomerHeader';
import { CategoryBar } from './components/customer/CategoryBar';
import { FoodCard } from './components/customer/FoodCard';
import { Food3DViewer } from './components/3d/Food3DViewer';
import { FoodARViewer } from './components/3d/FoodARViewer';
import { DishDetailModal } from './components/customer/DishDetailModal';
import { AIChefAssistant } from './components/customer/AIChefAssistant';
import { AllergyFilterModal } from './components/customer/AllergyFilterModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { CustomerProfileModal } from './components/customer/CustomerProfileModal';
import { MobileBottomNav } from './components/customer/MobileBottomNav';
import { StaffPortalModal } from './components/staff/StaffPortalModal';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { ChefScreenView } from './components/kitchen/ChefScreenView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles, Utensils, Search, ChevronRight, X, AlertCircle } from 'lucide-react';

const RESTAURANT_NAME = "The Royal Gourmet Bistro";

export function App() {
  const { menuItems, orders, queueMode, totalTables, setMenuItems, setQueueMode, updateOrderStatus, placeOrder, resetMenu } = useStore();

  // Navigation State ('landing' | 'menu' | 'kitchen' | 'chef' | 'admin')
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'menu' | 'kitchen' | 'chef' | 'admin'>('landing');

  // Customer Table Session (parsed from URL e.g. ?table=1 or selected from Landing)
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  // Customer State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAllergies, setActiveAllergies] = useState<AllergyType[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['dish-1', 'dish-3']);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modals
  const [active3DItem, setActive3DItem] = useState<MenuItem | null>(null);
  const [activeARItem, setActiveARItem] = useState<MenuItem | null>(null);
  const [activeDetailItem, setActiveDetailItem] = useState<MenuItem | null>(null);
  const [isAIChefOpen, setIsAIChefOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // Load and Restore Session & Cart on Page Reload / Refresh
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');

    if (tableParam && !isNaN(Number(tableParam))) {
      const tbl = Number(tableParam);
      setTableNumber(tbl);
      setCurrentScreen('menu');
      localStorage.setItem('gourmetverse_active_table_v1', tbl.toString());
      localStorage.setItem('gourmetverse_active_screen_v1', 'menu');
    } else {
      const savedTable = localStorage.getItem('gourmetverse_active_table_v1');
      const savedScreen = localStorage.getItem('gourmetverse_active_screen_v1');
      if (savedTable && !isNaN(Number(savedTable))) {
        const tbl = Number(savedTable);
        setTableNumber(tbl);
        window.history.replaceState(null, '', `?table=${tbl}`);
        if (savedScreen && ['menu', 'kitchen', 'chef', 'admin'].includes(savedScreen)) {
          setCurrentScreen(savedScreen as any);
        } else {
          setCurrentScreen('menu');
        }
      }
    }

    try {
      const savedCart = localStorage.getItem('gourmetverse_active_cart_v1');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse saved cart', e);
    }
  }, []);

  // Save Cart to LocalStorage on Update
  useEffect(() => {
    localStorage.setItem('gourmetverse_active_cart_v1', JSON.stringify(cart));
  }, [cart]);

  // Save Current Screen to LocalStorage on Update
  useEffect(() => {
    if (currentScreen !== 'landing') {
      localStorage.setItem('gourmetverse_active_screen_v1', currentScreen);
    }
  }, [currentScreen]);

  const handleSelectTableAndEnter = (tbl: number) => {
    setTableNumber(tbl);
    setCurrentScreen('menu');
    localStorage.setItem('gourmetverse_active_table_v1', tbl.toString());
    localStorage.setItem('gourmetverse_active_screen_v1', 'menu');
    window.history.replaceState(null, '', `?table=${tbl}`);
  };

  // Voice Search Handler with Phonetic Fuzzy Matching
  const handleVoiceSearch = (rawText: string) => {
    const { normalizedKeyword, categoryHint } = matchVoiceSearch(rawText);
    setSearchQuery(normalizedKeyword);
    if (categoryHint && categoryHint !== 'all') {
      setSelectedCategory(categoryHint as CategoryId);
    }
  };

  // Filter Menu Logic
  const filteredMenuItems = menuItems.filter(item => {
    // Category Filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'chef-specials' && !item.isChefSpecial) return false;
      if (selectedCategory === 'seasonal' && !item.isSeasonal) return false;
      if (selectedCategory === 'vegan' && item.vegType !== 'vegan') return false;
      if (selectedCategory !== 'chef-specials' && selectedCategory !== 'seasonal' && selectedCategory !== 'vegan' && item.category !== selectedCategory) {
        return false;
      }
    }

    // Search Query (Supports fuzzy matching & price filters)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (query.includes('under ₹') || query.includes('under ')) {
        const num = parseInt(query.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num) && item.price > num) return false;
      }
      if (query.includes('spicy') && item.spiceLevel < 3) return false;
      if (query.includes('healthy') && item.category !== 'healthy') return false;

      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const ingMatch = item.ingredients.some(i => i.toLowerCase().includes(query));
      const catMatch = item.category.toLowerCase().includes(query);

      return nameMatch || descMatch || ingMatch || catMatch;
    }

    return true;
  });

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(c => c.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleAddComboToCart = (comboItems: MenuItem[]) => {
    comboItems.forEach(item => handleAddToCart(item));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.menuItem.id === dishId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleUpdateInstructions = (dishId: string, notes: string) => {
    setCart(prev => prev.map(item => item.menuItem.id === dishId ? { ...item, specialInstructions: notes } : item));
  };

  const handleRemoveItem = (dishId: string) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== dishId));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleToggleAllergy = (allergy: AllergyType) => {
    setActiveAllergies(prev => prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]);
  };

  const handlePlaceOrderSubmit = (tNum: number, items: CartItem[], notes: string, payMethod: string) => {
    const createdOrder = placeOrder(tNum, items, notes, activeAllergies);
    setCart([]);
    setTrackedOrder(createdOrder);
  };

  // Screen Router
  if (currentScreen === 'landing') {
    return (
      <div>
        <LandingPage 
          restaurantName={RESTAURANT_NAME}
          totalTables={totalTables}
          onSelectTableAndEnter={handleSelectTableAndEnter}
          onOpenStaffPortal={() => setIsStaffModalOpen(true)}
        />

        <StaffPortalModal 
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
          onSelectStaffView={(view) => setCurrentScreen(view)}
        />
      </div>
    );
  }

  if (currentScreen === 'kitchen') {
    return (
      <div>
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-orange-400 font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> KITCHEN KDS TV MODE ACTIVE
          </span>
          <button onClick={() => setCurrentScreen('landing')} className="bg-orange-500 text-white font-bold px-3 py-1 rounded-xl">
            ← Exit Staff Mode
          </button>
        </div>
        <KitchenDashboard orders={orders} onUpdateStatus={updateOrderStatus} queueMode={queueMode} onSetQueueMode={setQueueMode} />
      </div>
    );
  }

  if (currentScreen === 'chef') {
    return (
      <div>
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-amber-400 font-extrabold">CHEF TOUCH SCREEN MODE ACTIVE</span>
          <button onClick={() => setCurrentScreen('landing')} className="bg-orange-500 text-white font-bold px-3 py-1 rounded-xl">
            ← Exit Staff Mode
          </button>
        </div>
        <ChefScreenView orders={orders} onUpdateStatus={updateOrderStatus} />
      </div>
    );
  }

  if (currentScreen === 'admin') {
    return (
      <div>
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-indigo-400 font-extrabold">ADMIN CONSOLE MODE ACTIVE</span>
          <button onClick={() => setCurrentScreen('landing')} className="bg-orange-500 text-white font-bold px-3 py-1 rounded-xl">
            ← Exit Staff Mode
          </button>
        </div>
        <AdminDashboard 
          orders={orders} 
          menuItems={menuItems} 
          onSaveMenuItem={(item) => {
            const index = menuItems.findIndex(m => m.id === item.id);
            if (index > -1) {
              const updated = [...menuItems];
              updated[index] = item;
              setMenuItems(updated);
            } else {
              setMenuItems([item, ...menuItems]);
            }
          }}
          onDeleteMenuItem={(id) => setMenuItems(menuItems.filter(m => m.id !== id))}
          onResetMenu={resetMenu}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 font-sans pb-28 md:pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Customer Header */}
      <CustomerHeader 
        tableNumber={tableNumber}
        restaurantName={RESTAURANT_NAME}
        estimatedWaitMinutes={12}
        cartItemCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAIChef={() => setIsAIChefOpen(true)}
        onOpenAllergyModal={() => setIsAllergyModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenStaffPortal={() => setIsStaffModalOpen(true)}
        activeAllergiesCount={activeAllergies.length}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        onSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onReturnToLanding={() => setCurrentScreen('landing')}
      />

      {/* Hero Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 select-none">
        <div className="relative rounded-3xl overflow-hidden bistro-card border-amber-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Michelin Recommended • {RESTAURANT_NAME}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight tracking-tight">
              Interactive 3D & AR <span className="gold-gradient-text">Culinary Showcase</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              Explore 360° GLTF 3D food models, place dishes on your dining table in live AR, analyze macro distributions, and order seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <CategoryBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Main Food Card Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredMenuItems.length === 0 ? (
          <div className="h-64 bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-slate-500 text-center p-6">
            <AlertCircle className="w-12 h-12 stroke-[1.5] text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-200">No dishes found matching search parameters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try clearing search parameters, adjusting active category filters, or restoring the full menu catalog.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setActiveAllergies([]);
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/30"
              >
                Reset Search Filters
              </button>

              <button 
                onClick={() => {
                  resetMenu();
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setActiveAllergies([]);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 shadow-md"
              >
                Restore Default 3D Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenuItems.map(item => (
              <FoodCard 
                key={item.id}
                item={item}
                onOpen3D={(dish) => setActive3DItem(dish)}
                onOpenAR={(dish) => setActiveARItem(dish)}
                onOpenDetail={(dish) => setActiveDetailItem(dish)}
                onAddToCart={handleAddToCart}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                activeAllergies={activeAllergies}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Active Order Tracker Bar (ONLY shown when current table has placed an order) */}
      {(() => {
        const activeTableOrder = orders.find(o => o.tableNumber === tableNumber && o.status !== 'delivered' && o.status !== 'cancelled');
        if (!activeTableOrder) return null;

        return (
          <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
            <button 
              onClick={() => setTrackedOrder(activeTableOrder)}
              className="w-full bg-[#0c1017]/95 border border-amber-500/50 p-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between text-xs hover:border-amber-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-lg shadow-amber-500/20">
                  #{activeTableOrder.queuePosition}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    Live Order {activeTableOrder.orderNumber}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Status: <strong className="text-amber-400 uppercase">{activeTableOrder.status}</strong>
                  </div>
                </div>
              </div>

              <span className="text-amber-400 font-bold flex items-center gap-1 text-xs">
                Track Order <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        );
      })()}

      {/* Modals & Drawers */}
      {active3DItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setActive3DItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              3D Model: {active3DItem.name}
            </h3>
            <Food3DViewer item={active3DItem} />
          </div>
        </div>
      )}

      {activeARItem && (
        <FoodARViewer item={activeARItem} onClose={() => setActiveARItem(null)} />
      )}

      <DishDetailModal 
        item={activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
        onAddToCart={handleAddToCart}
        isFavorite={activeDetailItem ? favorites.includes(activeDetailItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <AIChefAssistant 
        isOpen={isAIChefOpen}
        onClose={() => setIsAIChefOpen(false)}
        menuItems={menuItems}
        onAddComboToCart={handleAddComboToCart}
        savedAllergies={activeAllergies}
      />

      <AllergyFilterModal 
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
        selectedAllergies={activeAllergies}
        onToggleAllergy={handleToggleAllergy}
        onClearAll={() => setActiveAllergies([])}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateInstructions={handleUpdateInstructions}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrderSubmit}
        tableNumber={tableNumber}
        activeAllergies={activeAllergies}
      />

      <OrderTrackerModal 
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
      />

      <CustomerProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={orders}
        favorites={menuItems.filter(m => favorites.includes(m.id))}
        savedAllergies={activeAllergies}
      />

      <StaffPortalModal 
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSelectStaffView={(view) => setCurrentScreen(view)}
      />

      {/* Mobile Sticky Thumb Navigation Bar */}
      <MobileBottomNav
        activeScreen="menu"
        cartItemCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        activeAllergiesCount={activeAllergies.length}
        onOpenMenu={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAIChef={() => setIsAIChefOpen(true)}
        onOpenAllergies={() => setIsAllergyModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
    </div>
  );
}
