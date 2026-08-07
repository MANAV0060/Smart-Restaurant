import { useGLTF } from '@react-three/drei';

export const PRELOAD_MODEL_URLS = [
  '/models/burger.glb',
  '/models/pizza.glb',
  '/models/butter_chicken_set.glb',
  '/models/pasta.glb',
  '/models/momos.glb',
];

export function preloadAll3DModels() {
  if (typeof window === 'undefined') return;

  // Preload all 5 3D GLB models in worker background thread
  PRELOAD_MODEL_URLS.forEach((url) => {
    try {
      useGLTF.preload(url);
    } catch (err) {
      console.warn(`Background preload notice for ${url}:`, err);
    }
  });
}
