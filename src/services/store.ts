import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, KDSQueueMode, AllergyType, UserProfile, AISchedulerSuggestion } from '../types';
import { MOCK_MENU_ITEMS } from '../data/mockMenu';

const BROADCAST_CHANNEL_NAME = 'gourmetverse_live_sync';
const LOCAL_STORAGE_KEY_ORDERS = 'gourmetverse_orders_v1';
const LOCAL_STORAGE_KEY_MENU = 'gourmetverse_menu_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'gourmetverse_profile_v1';
const LOCAL_STORAGE_KEY_TABLES = 'gourmetverse_tables_count_v1';

// Initial Mock Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#101',
    tableNumber: 1,
    items: [
      { menuItem: MOCK_MENU_ITEMS[0], quantity: 2, specialInstructions: 'Extra Truffle Aioli, No Onion' },
      { menuItem: MOCK_MENU_ITEMS[7], quantity: 2 }
    ],
    totalAmount: 1496,
    status: 'cooking',
    priority: 'red',
    allergyAlerts: [],
    specialNotes: ['No Onion', 'Extra Truffle Aioli'],
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    startedCookingTimestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedPrepMinutes: 15,
    queuePosition: 1,
    customerName: 'Alex Mercer',
    isVIP: true
  },
  {
    id: 'ord-102',
    orderNumber: '#102',
    tableNumber: 2,
    items: [
      { menuItem: MOCK_MENU_ITEMS[1], quantity: 1, specialInstructions: 'Gluten sensitivity warning!' },
      { menuItem: MOCK_MENU_ITEMS[3], quantity: 1 }
    ],
    totalAmount: 1128,
    status: 'received',
    priority: 'yellow',
    allergyAlerts: ['Gluten', 'Milk'],
    specialNotes: ['Gluten sensitivity alert'],
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    estimatedPrepMinutes: 18,
    queuePosition: 2,
    customerName: 'Priya Sharma'
  },
  {
    id: 'ord-103',
    orderNumber: '#103',
    tableNumber: 3,
    items: [
      { menuItem: MOCK_MENU_ITEMS[2], quantity: 1, specialInstructions: 'Less Spicy' },
      { menuItem: MOCK_MENU_ITEMS[5], quantity: 1 }
    ],
    totalAmount: 948,
    status: 'plating',
    priority: 'blue',
    allergyAlerts: ['Mustard'],
    specialNotes: ['Less Spicy'],
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    startedCookingTimestamp: new Date(Date.now() - 14 * 60000).toISOString(),
    estimatedPrepMinutes: 18,
    queuePosition: 3,
    customerName: 'David Kim'
  }
];

// Helper to get initial menu
const getStoredMenu = (): MenuItem[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_MENU);
    if (data) {
      const parsed: MenuItem[] = JSON.parse(data);
      return parsed.map(item => {
        const match = MOCK_MENU_ITEMS.find(m => m.id === item.id);
        if (match?.externalModelUrl && !item.externalModelUrl) {
          return {
            ...item,
            externalModelUrl: match.externalModelUrl,
            externalModelScale: match.externalModelScale || 1.0,
          };
        }
        return item;
      });
    }
    return MOCK_MENU_ITEMS;
  } catch {
    return MOCK_MENU_ITEMS;
  }
};

// Helper to get initial orders
const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
};

// Helper to get initial tables count
const getStoredTablesCount = (): number => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_TABLES);
    return data && !isNaN(Number(data)) ? Number(data) : 4;
  } catch {
    return 4;
  }
};

// Global memory state for simple pub-sub subscriber listener pattern
let globalMenuItems: MenuItem[] = getStoredMenu();
let globalOrders: Order[] = getStoredOrders();
let globalQueueMode: KDSQueueMode = 'ai_parallel';
let globalTotalTables: number = getStoredTablesCount();
const listeners = new Set<() => void>();

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel(BROADCAST_CHANNEL_NAME) 
  : null;

if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (event.data?.type === 'UPDATE_ORDERS') {
      globalOrders = event.data.orders;
      notifyListeners();
    } else if (event.data?.type === 'UPDATE_MENU') {
      globalMenuItems = event.data.menu;
      notifyListeners();
    } else if (event.data?.type === 'UPDATE_QUEUE_MODE') {
      globalQueueMode = event.data.mode;
      notifyListeners();
    } else if (event.data?.type === 'UPDATE_TABLES_COUNT') {
      globalTotalTables = event.data.count;
      notifyListeners();
    }
  };
}

function notifyListeners() {
  listeners.forEach(cb => cb());
}

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  // Update orders
  const setOrders = (newOrders: Order[]) => {
    globalOrders = newOrders;
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(newOrders));
    broadcastChannel?.postMessage({ type: 'UPDATE_ORDERS', orders: newOrders });
    notifyListeners();
  };

  // Update menu
  const setMenuItems = (newMenu: MenuItem[]) => {
    globalMenuItems = newMenu;
    localStorage.setItem(LOCAL_STORAGE_KEY_MENU, JSON.stringify(newMenu));
    broadcastChannel?.postMessage({ type: 'UPDATE_MENU', menu: newMenu });
    notifyListeners();
  };

  // Set Queue Mode
  const setQueueMode = (mode: KDSQueueMode) => {
    globalQueueMode = mode;
    broadcastChannel?.postMessage({ type: 'UPDATE_QUEUE_MODE', mode });
    notifyListeners();
  };

  // Update single order status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = globalOrders.map(ord => {
      if (ord.id === orderId) {
        const isNowCooking = status === 'cooking' && ord.status !== 'cooking';
        return {
          ...ord,
          status,
          startedCookingTimestamp: isNowCooking ? new Date().toISOString() : ord.startedCookingTimestamp,
        };
      }
      return ord;
    });
    setOrders(updated);
  };

  // Add new order
  const placeOrder = (
    tableNumber: number,
    cartItems: CartItem[],
    customerNotes: string,
    appliedAllergies: AllergyType[]
  ): Order => {
    const total = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    const orderNum = `#${Math.floor(100 + Math.random() * 900)}`;
    const maxEstCookTime = Math.max(...cartItems.map(i => i.menuItem.cookingTimeMinutes));

    // Consolidate allergies
    const itemAllergies = cartItems.flatMap(i => i.menuItem.allergens);
    const combinedAllergens = Array.from(new Set([...itemAllergies, ...appliedAllergies]));

    // Determine priority
    let priority: Order['priority'] = 'green';
    if (combinedAllergens.length > 0) priority = 'red';
    if (cartItems.some(i => i.menuItem.isChefSpecial)) priority = 'purple';

    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      tableNumber,
      items: cartItems,
      totalAmount: total,
      status: 'received',
      priority,
      allergyAlerts: combinedAllergens,
      specialNotes: customerNotes ? [customerNotes] : [],
      timestamp: new Date().toISOString(),
      estimatedPrepMinutes: maxEstCookTime,
      queuePosition: globalOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length + 1,
    };

    const updated = [newOrd, ...globalOrders];
    setOrders(updated);
    return newOrd;
  };

  // Reset menu and orders to initial mock state
  const resetMenu = () => {
    globalMenuItems = [...MOCK_MENU_ITEMS];
    globalOrders = [...INITIAL_ORDERS];
    localStorage.setItem(LOCAL_STORAGE_KEY_MENU, JSON.stringify(globalMenuItems));
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(globalOrders));
    broadcastChannel?.postMessage({ type: 'UPDATE_MENU', menu: globalMenuItems });
    broadcastChannel?.postMessage({ type: 'UPDATE_ORDERS', orders: globalOrders });
    notifyListeners();
  };

  const setTotalTables = (count: number) => {
    const safeCount = Math.max(1, count);
    globalTotalTables = safeCount;
    localStorage.setItem(LOCAL_STORAGE_KEY_TABLES, safeCount.toString());
    broadcastChannel?.postMessage({ type: 'UPDATE_TABLES_COUNT', count: safeCount });
    notifyListeners();
  };

  return {
    menuItems: globalMenuItems,
    orders: globalOrders,
    queueMode: globalQueueMode,
    totalTables: globalTotalTables,
    setOrders,
    setMenuItems,
    setQueueMode,
    setTotalTables,
    updateOrderStatus,
    placeOrder,
    resetMenu,
  };
}

// AI Kitchen Scheduling Algorithm implementation
export function calculateAISchedule(orders: Order[]): AISchedulerSuggestion[] {
  const activeOrders = orders.filter(o => o.status === 'received' || o.status === 'cooking' || o.status === 'plating');
  
  const suggestions: AISchedulerSuggestion[] = [];
  
  activeOrders.forEach(ord => {
    ord.items.forEach((cartItem, idx) => {
      const prep = cartItem.menuItem.cookingTimeMinutes;
      let slot = 'Primary Wok / Oven';
      if (cartItem.menuItem.category === 'beverages' || cartItem.menuItem.category === 'desserts') {
        slot = 'Bar & Pastry Station';
      } else if (cartItem.menuItem.category === 'burger' || cartItem.menuItem.category === 'starters') {
        slot = 'Grill Station';
      }

      let rationale = `Start long prep items first (${prep} mins).`;
      if (prep <= 5) {
        rationale = `Short prep (${prep} mins). Stagger 10 mins after main course starts so everything finishes hot together.`;
      } else if (ord.allergyAlerts.length > 0) {
        rationale = `URGENT ALLERGY PREPARATION (${ord.allergyAlerts.join(', ')}): Sanitize station before cooking.`;
      }

      suggestions.push({
        orderId: ord.id,
        tableNumber: ord.tableNumber,
        dishName: `${cartItem.quantity}x ${cartItem.menuItem.name}`,
        estimatedMinutes: prep,
        suggestedStartTime: ord.status === 'cooking' ? 'IN PROGRESS NOW' : `+${idx * 3} mins`,
        parallelSlot: slot,
        rationale,
      });
    });
  });

  return suggestions;
}
