import React, { useState, useEffect } from 'react';
import { useStore } from './services/store';
import { MenuItem, CategoryId, CartItem, Order, AllergyType } from './types';
import { LandingPage } from './components/customer/LandingPage';
import { CustomerHeader } from './components/customer/CustomerHeader';
import { CategoryBar } from './components/customer/CategoryBar';
import { FoodCard } from './components/customer/FoodCard';
import { DishDetailModal } from './components/customer/DishDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { AIChefAssistant } from './components/customer/AIChefAssistant';
import { AllergyFilterModal } from './components/customer/AllergyFilterModal';
import { Food3DViewer } from './components/3d/Food3DViewer';
import { FoodARViewer } from './components/3d/FoodARViewer';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { CustomerProfileModal } from './components/customer/CustomerProfileModal';
import { MobileBottomNav } from './components/customer/MobileBottomNav';
import { StaffPortalModal } from './components/staff/StaffPortalModal';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { ChefScreenView } from './components/kitchen/ChefScreenView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { preloadAll3DModels } from './services/modelPreloader';
import { ChevronRight, AlertCircle } from 'lucide-react';

const RESTAURANT_NAME = "The Royal Gourmet Bistro";

export function App() {
  const { menuItems, orders, queueMode, totalTables, setMenuItems, setQueueMode, setTotalTables, updateOrderStatus, placeOrder, resetMenu } = useStore();

  // Navigation State ('landing' | 'menu' | 'kitchen' | 'chef' | 'admin')
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'menu' | 'kitchen' | 'chef' | 'admin'>('landing');

  // Customer Table Session
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

  useEffect(() => {
    preloadAll3DModels();

    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    const arItemParam = params.get('arItem');

    if (tableParam && !isNaN(Number(tableParam))) {
      const parsedNum = Number(tableParam);
      setTableNumber(parsedNum);
      setCurrentScreen('menu');
    }

    if (arItemParam) {
      const targetItem = menuItems.find(item => item.id === arItemParam);
      if (targetItem) {
        setActiveARItem(targetItem);
        setCurrentScreen('menu');
      }
    }
  }, [menuItems]);

  const handleSelectTableAndEnter = (tNum: number) => {
    setTableNumber(tNum);
    setCurrentScreen('menu');
  };

  const handleStaffSelect = (role: string) => {
    if (role === 'kds' || role === 'kitchen') {
      setCurrentScreen('kitchen');
    } else if (role === 'chef') {
      setCurrentScreen('chef');
    } else if (role === 'admin') {
      setCurrentScreen('admin');
    }
    setIsStaffModalOpen(false);
  };

  const handleAddToCart = (dish: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menuItem: dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.menuItem.id === dishId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleUpdateInstructions = (dishId: string, notes: string) => {
    setCart(prev =>
      prev.map(item => (item.menuItem.id === dishId ? { ...item, specialInstructions: notes } : item))
    );
  };

  const handleRemoveFromCart = (dishId: string) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== dishId));
  };

  const handleToggleFavorite = (dishId: string) => {
    setFavorites(prev =>
      prev.includes(dishId) ? prev.filter(id => id !== dishId) : [...prev, dishId]
    );
  };

  const handleToggleAllergy = (allergy: AllergyType) => {
    setActiveAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handlePlaceOrderSubmit = (tNum: number, items: CartItem[], notes: string, payMethod: string) => {
    const createdOrder = placeOrder(tNum, items, notes, activeAllergies);
    setCart([]);
    setTrackedOrder(createdOrder);
  };

  // 1. Landing Screen
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
          onSelectRole={handleStaffSelect}
          onSelectStaffView={handleStaffSelect}
        />
      </div>
    );
  }

  // 2. Kitchen Display System (KDS) Screen
  if (currentScreen === 'kitchen') {
    return (
      <div className="bg-[#FFF6DE] min-h-screen">
        <div className="bg-[#FFFFFF] border-b border-[#EADBBA] px-4 py-2.5 flex items-center justify-between text-xs font-sans shadow-2xs">
          <span className="text-[#1C1917] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#309694]"></span> Kitchen Display System Active
          </span>
          <button 
            onClick={() => setCurrentScreen('landing')} 
            className="bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold px-3 py-1.5 rounded-md text-xs transition-colors shadow-2xs"
          >
            ← Exit Staff Mode
          </button>
        </div>
        <KitchenDashboard orders={orders} onUpdateStatus={updateOrderStatus} queueMode={queueMode} onSetQueueMode={setQueueMode} />
      </div>
    );
  }

  // 3. Chef Touch Screen
  if (currentScreen === 'chef') {
    return (
      <div className="bg-[#FFF6DE] min-h-screen">
        <div className="bg-[#FFFFFF] border-b border-[#EADBBA] px-4 py-2.5 flex items-center justify-between text-xs font-sans shadow-2xs">
          <span className="text-[#1C1917] font-bold">Chef Touch Station Mode</span>
          <button 
            onClick={() => setCurrentScreen('landing')} 
            className="bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold px-3 py-1.5 rounded-md text-xs transition-colors shadow-2xs"
          >
            ← Exit Staff Mode
          </button>
        </div>
        <ChefScreenView orders={orders} onUpdateStatus={updateOrderStatus} />
      </div>
    );
  }

  // 4. Admin Management Console
  if (currentScreen === 'admin') {
    return (
      <div className="bg-[#FFF6DE] min-h-screen">
        <div className="bg-[#FFFFFF] border-b border-[#EADBBA] px-4 py-2.5 flex items-center justify-between text-xs font-sans shadow-2xs">
          <span className="text-[#1C1917] font-bold">Admin & Operations Console</span>
          <button 
            onClick={() => setCurrentScreen('landing')} 
            className="bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold px-3 py-1.5 rounded-md text-xs transition-colors shadow-2xs"
          >
            ← Exit Staff Mode
          </button>
        </div>
        <AdminDashboard 
          orders={orders} 
          menuItems={menuItems} 
          restaurantName={RESTAURANT_NAME}
          totalTables={totalTables}
          onAddTable={() => setTotalTables(totalTables + 1)}
          onRemoveTable={() => setTotalTables(Math.max(1, totalTables - 1))}
          onExit={() => setCurrentScreen('landing')}
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

  // 5. Main Customer Menu Screen
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const cartItemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFF6DE] text-[#1C1917] font-sans pb-24 md:pb-12 selection:bg-[#F48F68] selection:text-white">
      {/* Customer Header */}
      <CustomerHeader 
        tableNumber={tableNumber}
        restaurantName={RESTAURANT_NAME}
        estimatedWaitMinutes={18}
        cartItemCount={cartItemCount}
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

      {/* Category Navigation Bar */}
      <CategoryBar 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Menu Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {filteredMenuItems.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#EADBBA] p-8 max-w-md mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 text-[#F48F68] mx-auto mb-2" />
            <h3 className="text-base font-serif font-bold text-[#1C1917]">No Dishes Found</h3>
            <p className="text-xs text-[#78716C] mt-1">
              Try adjusting your search query or selecting a different category.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3.5 px-3.5 py-1.5 rounded-md bg-[#F48F68] hover:bg-[#f27c50] text-white font-bold text-xs transition-colors shadow-2xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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

      {/* Floating Active Order Tracker Bar */}
      {(() => {
        const activeTableOrder = orders.find(o => o.tableNumber === tableNumber && o.status !== 'delivered' && o.status !== 'cancelled');
        if (!activeTableOrder) return null;

        return (
          <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
            <button
              onClick={() => setTrackedOrder(activeTableOrder)}
              className="w-full bg-[#FFFFFF] border border-[#EADBBA] rounded-xl p-3.5 flex items-center justify-between shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#F48F68] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                  #{activeTableOrder.queuePosition}
                </div>
                <div className="text-left">
                  <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
                    Order {activeTableOrder.orderNumber}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#309694]"></span>
                  </div>
                  <div className="text-[#78716C] text-[11px]">
                    Status: <strong className="text-[#F48F68] uppercase font-bold">{activeTableOrder.status}</strong>
                  </div>
                </div>
              </div>

              <span className="text-[#F48F68] font-bold flex items-center gap-1 text-xs">
                Track <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        );
      })()}

      {/* Modals & Drawers */}
      {active3DItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-3xl bg-[#FFFFFF] text-[#1C1917] border border-[#EADBBA] rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setActive3DItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg bg-[#FFF6DE] hover:bg-[#FFFDF7] text-[#1C1917] hover:text-[#F48F68] font-bold flex items-center justify-center text-sm transition-colors border border-[#EADBBA] shadow-2xs"
            >
              ✕
            </button>
            <h3 className="text-lg font-serif font-bold text-[#1C1917] mb-3">
              {active3DItem.name} — Interactive 3D Model
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
        onOpenAR={(dish) => {
          setActiveDetailItem(null);
          setActiveARItem(dish);
        }}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateInstructions={handleUpdateInstructions}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrderSubmit}
        tableNumber={tableNumber}
        activeAllergies={activeAllergies}
      />

      <AIChefAssistant 
        isOpen={isAIChefOpen}
        onClose={() => setIsAIChefOpen(false)}
        menuItems={menuItems}
        onAddComboToCart={(items) => {
          items.forEach(i => handleAddToCart(i));
          setIsAIChefOpen(false);
          setIsCartOpen(true);
        }}
        savedAllergies={activeAllergies}
      />

      <AllergyFilterModal 
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
        selectedAllergies={activeAllergies}
        onToggleAllergy={handleToggleAllergy}
        onClearAll={() => setActiveAllergies([])}
      />

      <OrderTrackerModal 
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
      />

      <CustomerProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={orders.filter(o => o.tableNumber === tableNumber)}
        favorites={menuItems.filter(m => favorites.includes(m.id))}
        savedAllergies={activeAllergies}
      />

      <StaffPortalModal 
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSelectRole={handleStaffSelect}
        onSelectStaffView={handleStaffSelect}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav 
        activeScreen="menu"
        cartItemCount={cartItemCount}
        activeAllergiesCount={activeAllergies.length}
        onOpenMenu={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAIChef={() => setIsAIChefOpen(true)}
        onOpenAllergies={() => setIsAllergyModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
    </div>
  );
}
