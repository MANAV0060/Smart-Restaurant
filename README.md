# GourmetVerse AI | 3D & AR Smart Menu Platform

🔗 **Live Vercel Production URL**: [https://smart-restaurant-2za8.vercel.app/](https://smart-restaurant-2za8.vercel.app/)

A responsive, AI-powered restaurant ordering platform designed to revolutionize the dining experience. Customers can scan a QR code placed on their table to view hyper-realistic 3D food models, place them in their real-world environment using Augmented Reality (AR), and receive personalized AI recommendations based on preferences and allergies.

Orders are sent directly to the kitchen's smart display system for efficient tracking, prioritization, and delivery.

## 🚀 Features

- **No-App QR Code Ordering**: Customers scan a dynamically generated table QR code to access the platform instantly.
- **Ultra-Realistic 3D Food Viewer**: High-fidelity procedural 3D models with physical materials, environment reflections, and steam particles.
- **Augmented Reality (AR) Preview**: Customers can project food onto their physical table using AR, complete with real-time shadow casting and an AR Exploded Layer View.
- **AI Chef Recommendations**: Intelligent algorithms suggest dishes based on user-selected preferences, dietary restrictions, and allergies.
- **Kitchen Display System (KDS)**: A highly optimized, large-screen dashboard for the kitchen staff to manage active orders with three-state status tracking (Cooking, Ready, Served).
- **Admin & Analytics Dashboard**: Manage table QR codes dynamically, view trending orders, track revenue, and monitor AI-driven seasonal demand.
- **Smart Voice Ordering**: Integrated voice-to-text functionality for hands-free menu navigation and searching.
- **Seamless Staff Portal**: Secure PIN-based login for waiters, kitchen staff, and admins.

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **3D & AR Engine**: Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
- **State Management**: React Hooks Context

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MANAV0060/Smart-Restaurant.git
   cd Smart-Restaurant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📱 User Flow

1. **Enter Restaurant**: Customer scans a QR code (e.g., Table 15) using their default camera app.
2. **Browse Menu**: Customer explores categories, views realistic 3D models, and tests AR placement.
3. **Customize & Order**: Customer customizes items (e.g., "No onions") and places the order directly to the kitchen.
4. **Kitchen Preparation**: Executive Chef views the order on the KDS, taps "Start Cooking", then "Mark Ready".
5. **Delivery**: Staff sees the ready status, serves the food to Table 15, and clears the order.

## 🎨 3D & AR Capabilities
The platform features an advanced 3D engine that renders complex food items natively in the browser without requiring external assets. 
- **MeshPhysicalMaterials**: Utilizes clearcoat, transmission, and roughness for realistic glass, liquids, and glossy sauces.
- **Exploded View**: Breaks down complex dishes into their individual layers (e.g., Bun, Lettuce, Patty, Cheese) for interactive exploration in both 3D and AR modes.

## 📄 License
This project is proprietary and confidential.
