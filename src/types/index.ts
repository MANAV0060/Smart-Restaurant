export type VegType = 'veg' | 'non-veg' | 'vegan';

export type AllergyType = 
  | 'Peanut'
  | 'Milk'
  | 'Egg'
  | 'Fish'
  | 'Gluten'
  | 'Soy'
  | 'Shellfish'
  | 'Sesame'
  | 'Tree Nuts'
  | 'Mustard';

export interface Macros {
  protein: number; // in grams
  carbs: number;
  fat: number;
  sugar: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  vegType: VegType;
  spiceLevel: number; // 1 (Mild) to 5 (Extremely Spicy)
  calories: number;
  cookingTimeMinutes: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isSeasonal?: boolean;
  description: string;
  image: string;
  ingredients: string[];
  cookingStyle: string;
  origin: string;
  macros: Macros;
  portionSize: string;
  allergens: AllergyType[];
  freshnessScore: number; // 1-100
  externalModelUrl?: string; // Direct URL or Blob URL for imported GLTF/GLB 3D model
  externalModelScale?: number; // Custom scale factor (e.g. 1.0)
  externalModelRotation?: [number, number, number]; // Custom rotation tuple [x, y, z] in radians
  model3DConfig: {
    baseShape: 'burger' | 'pizza' | 'pasta' | 'drink' | 'sushi' | 'dessert' | 'curry' | 'steak';
    primaryColor: string;
    secondaryColor: string;
    layers: { name: string; color: string; heightOffset: number; radius: number }[];
  };
}

export type CategoryId = 
  | 'all'
  | 'starters'
  | 'pizza'
  | 'burger'
  | 'pasta'
  | 'indian'
  | 'chinese'
  | 'desserts'
  | 'beverages'
  | 'chef-specials'
  | 'seasonal'
  | 'healthy'
  | 'vegan'
  | 'kids';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string; // e.g., "No Onion", "Less Spicy"
}

export type OrderStatus = 'received' | 'cooking' | 'plating' | 'ready' | 'serving' | 'delivered' | 'cancelled';

export type OrderPriority = 'green' | 'yellow' | 'blue' | 'red' | 'purple'; // Green=Normal, Yellow=Preparing, Blue=Ready, Red=Urgent, Purple=VIP

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  priority: OrderPriority;
  allergyAlerts: AllergyType[];
  specialNotes: string[];
  timestamp: string; // ISO string
  startedCookingTimestamp?: string;
  estimatedPrepMinutes: number;
  queuePosition: number;
  customerName?: string;
  isVIP?: boolean;
}

export type KDSQueueMode = 'fifo' | 'priority' | 'sjf' | 'ai_parallel';

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  dishId: string;
  dishName: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  savedAllergies: AllergyType[];
  preferences: string[];
  loyaltyPoints: number;
  unlockedBadges: { id: string; name: string; icon: string; description: string; dateUnlocked: string }[];
  orderHistory: Order[];
}

export interface AISchedulerSuggestion {
  orderId: string;
  tableNumber: number;
  dishName: string;
  estimatedMinutes: number;
  suggestedStartTime: string;
  parallelSlot: string;
  rationale: string;
}
