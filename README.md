# 🍽️ GourmetVerse AI - 3D & AR Smart Restaurant Platform

A responsive, state-of-the-art AI-powered smart restaurant ordering platform where customers scan table-specific QR codes, preview hyper-realistic 3D food models, place food items directly on their table surface using Augmented Reality (AR), receive AI recommendations based on budget and allergy preferences, and dispatch live orders directly to the Kitchen Display System (KDS).

---

## ✨ Key Features

### 1. 🍔 Interactive 3D & AR Food Experience
- **Interactive 3D Food Viewer**: Powered by Three.js & `@react-three/fiber`, featuring 360° rotation, smooth zoom, realistic lighting, and an **Exploded Layer View** with ingredient callout annotations.
- **Realistic 3D Mesh Models**: Custom procedural geometries for burgers (3D sesame seeds, wavy lettuce, cheddar square with drooping corners), pizzas (crust ring, burrata cream, pepperoni, basil), pastas, Indian handi curries, bamboo dim sum steamers, Belgian chocolate desserts, and glass elixirs.
- **Real-World AR Placement**: Augmented Reality mode using camera feed overlay (`navigator.mediaDevices.getUserMedia`) to position 3D food models onto table surfaces, rotate, scale, compare two dishes side-by-side, and capture AR photos.

### 2. 🤖 AI Chef Assistant & Voice Ordering
- **GourmetAI Chef Assistant**: Conversational ChatGPT-style assistant drawer capable of analyzing natural language requests (*"Spicy food under ₹500"*, *"I have diabetes"*, *"High protein"*, *"No onion"*) and suggesting complete meal combos, drink pairings, and 1-click cart addition.
- **Multi-Lingual Voice Assistant**: Web Speech API integration with text-to-speech feedback supporting **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- **Phonetic & Fuzzy Matching Engine**: Custom Levenshtein distance parser mapping mispronounced voice terms (*"burgir"*, *"pisa"*, *"pneer"*) to accurate menu items.

### 3. 🛡️ Allergy Protection Guard & Smart Search
- **10 Common Allergens**: Checkboxes for Peanut, Milk, Egg, Fish, Gluten, Soy, Shellfish, Sesame, Tree Nuts, and Mustard.
- **Per-Item & Guest Tagging**: Allows table members to tag allergies on individual dishes without blocking the entire table's menu.

### 4. 📺 Kitchen Display System (KDS TV) & AI Scheduler
- **Large Screen TV Mode**: Dark-themed high-contrast display with color-coded status badges (*Green = Cooking, Yellow = Preparing, Blue = Ready, Red = Urgent/Allergy Alert, Purple = VIP*).
- **AI Kitchen Parallel Scheduler**: Automatically staggers long prep items (e.g. 15m pizza) with quick preps (e.g. 3m elixir drink) so all dishes finish cooking simultaneously.
- **Executive Chef Touch Station**: Minimalist, touch-optimized station for kitchen staff.

### 5. 📊 Admin Console & Dynamic Table QR Generator
- **Dynamic Table Count QR Generator**: Configurable table layout manager where admins can set exact restaurant table capacity (e.g., 4, 12, or 50 tables), add/remove tables, and generate downloadable/printable QR badges.
- **AI Weather & Seasonal Demand Engine**: Real-time contextual menu promotions based on climate (Monsoon comfort foods vs Summer chilled elixirs).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **3D / AR Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Icons & UI**: Lucide-React, Glassmorphic Design Token System
- **State Management & Live Sync**: Reactive Store Engine with `BroadcastChannel` & `localStorage` multi-tab sync
- **Audio & Speech**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Animation & Effects**: Canvas-Confetti, Custom Shader & Thermal Steam Particles

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/suryawanshisanskar4599-boop/Smart-Restaurant-.git
   cd Smart-Restaurant-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000/](http://localhost:3000/) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Application Flow & Modes

- **Landing Page**: Entry point for *"The Royal Gourmet Bistro"*, table selection (Table 1 to 30), and QR scanner simulation.
- **Customer Menu**: Browse 13+ food categories, view 3D/AR models, ask AI Chef, tag allergies, and dispatch orders.
- **Staff Portal**: Accessible via top-right Staff button to switch between Kitchen KDS TV Display, Executive Chef Station, and Admin Console.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
