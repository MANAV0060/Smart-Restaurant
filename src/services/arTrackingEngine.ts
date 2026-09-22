import { MenuItem } from '../types';

export interface SurfaceFeaturePoint {
  x: number;
  y: number;
  confidence: number;
}

export interface PhysicalDimensions {
  diameterCm: number;
  heightCm: number;
  diameterInches: number;
  portionLabel: string;
}

export interface SensorTelemetry {
  pitch: number; // in degrees (-90 to 90)
  roll: number;  // in degrees (-180 to 180)
  heading: number; // in degrees (0 to 360)
  isStable: boolean;
  stabilityScore: number; // 0 to 100
  estimatedDistanceCm: number;
  gravityZ: number;
}

/**
 * Calibrated real-world physical dimensions for menu items
 */
export function getItemPhysicalDimensions(item: MenuItem): PhysicalDimensions {
  const shape = item.model3DConfig?.baseShape || 'burger';
  
  switch (shape) {
    case 'pizza':
      return {
        diameterCm: 30.5, // 12-inch standard artisan pizza
        heightCm: 2.8,
        diameterInches: 12.0,
        portionLabel: '12" Full Artisan Table Serving',
      };
    case 'burger':
      return {
        diameterCm: 14.2, // ~5.6 inches gourmet brioche bun
        heightCm: 11.5,
        diameterInches: 5.6,
        portionLabel: 'Single Gourmet Serving (~350g)',
      };
    case 'pasta':
      return {
        diameterCm: 24.0, // Standard restaurant pasta bowl
        heightCm: 7.5,
        diameterInches: 9.5,
        portionLabel: 'Signature Pasta Bowl (320g)',
      };
    case 'curry':
      return {
        diameterCm: 21.0, // Handi copper bowl
        heightCm: 12.0,
        diameterInches: 8.3,
        portionLabel: 'Copper Handi Serving (450ml)',
      };
    case 'sushi':
      return {
        diameterCm: 22.5, // Traditional bamboo steamer
        heightCm: 10.0,
        diameterInches: 8.8,
        portionLabel: '8-Piece Bamboo Steamer Set',
      };
    case 'dessert':
      return {
        diameterCm: 16.0,
        heightCm: 8.0,
        diameterInches: 6.3,
        portionLabel: 'Artisan Dessert Plate',
      };
    case 'drink':
      return {
        diameterCm: 8.5,
        heightCm: 18.0,
        diameterInches: 3.3,
        portionLabel: 'Cocktail Glass (380ml)',
      };
    default:
      return {
        diameterCm: 18.0,
        heightCm: 9.0,
        diameterInches: 7.1,
        portionLabel: 'Standard Plate Serving',
      };
  }
}

/**
 * Check if WebXR immersive-ar mode is supported on this browser/device
 */
export async function checkWebXRARSupport(): Promise<boolean> {
  if (typeof window === 'undefined' || !('xr' in navigator)) {
    return false;
  }
  try {
    const xr = (navigator as unknown as { xr?: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr;
    if (xr && typeof xr.isSessionSupported === 'function') {
      return await xr.isSessionSupported('immersive-ar');
    }
  } catch (e) {
    console.warn('WebXR feature check encountered error:', e);
  }
  return false;
}

/**
 * Request iOS 13+ DeviceOrientation permission if required
 */
export async function requestDeviceOrientationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
  };

  if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
    try {
      const response = await DeviceOrientationEventAny.requestPermission();
      return response === 'granted';
    } catch (err) {
      console.warn('iOS motion permission request error:', err);
      return false;
    }
  }
  // On non-iOS devices, permission is granted automatically
  return true;
}

/**
 * Mobile Device Sensor Fusion Controller
 * Tracks accelerometer, gyroscope, gravity vector, and device stability
 */
export class MobileSensorFusion {
  private pitch = 45; // Default downward phone tilt for table scanning
  private roll = 0;
  private heading = 0;
  private isStable = false;
  private stabilityScore = 90;
  private estimatedDistanceCm = 50;
  private gravityZ = 0.7;

  private lastBeta = 45;
  private lastGamma = 0;
  private lastTimestamp = Date.now();
  private stableFrameCount = 0;

  private orientationListener: ((e: DeviceOrientationEvent) => void) | null = null;
  private motionListener: ((e: DeviceMotionEvent) => void) | null = null;
  private subscribers: Set<(data: SensorTelemetry) => void> = new Set();

  start() {
    if (typeof window === 'undefined') return;

    this.orientationListener = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 45;   // Front-back tilt: ~30° to 70° when looking down at a table
      const gamma = event.gamma ?? 0;  // Left-right roll
      const alpha = event.alpha ?? 0;  // Compass heading

      const now = Date.now();
      const dt = Math.max(16, now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      // Calculate angular velocity (deg/s)
      const deltaBeta = Math.abs(beta - this.lastBeta) / dt;
      const deltaGamma = Math.abs(gamma - this.lastGamma) / dt;
      this.lastBeta = beta;
      this.lastGamma = gamma;

      // Downward angle suitable for scanning a table (between 20° and 80°)
      const isDownwardAngle = beta >= 20 && beta <= 80;
      const angularJitter = deltaBeta + deltaGamma;

      // Stability: low jitter and downward angle
      const currentStability = Math.max(0, Math.min(100, Math.floor(100 - angularJitter * 1.5)));
      this.stabilityScore = Math.floor(this.stabilityScore * 0.7 + currentStability * 0.3);

      if (isDownwardAngle && angularJitter < 30) {
        this.stableFrameCount++;
      } else {
        this.stableFrameCount = Math.max(0, this.stableFrameCount - 2);
      }

      this.isStable = this.stableFrameCount >= 5;
      this.pitch = Math.round(beta);
      this.roll = Math.round(gamma);
      this.heading = Math.round(alpha);

      // Distance estimation using trigonometric sightline
      // D = H / sin(pitch) with baseline H = 45cm
      const rad = (Math.max(25, Math.min(80, this.pitch)) * Math.PI) / 180;
      const dist = Math.round(45 / Math.sin(rad));
      this.estimatedDistanceCm = Math.max(30, Math.min(120, dist));

      this.notify();
    };

    this.motionListener = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const { z } = event.accelerationIncludingGravity;
        if (z !== null && z !== undefined) {
          this.gravityZ = parseFloat((z / 9.8).toFixed(2));
        }
      }
    };

    window.addEventListener('deviceorientation', this.orientationListener, true);
    window.addEventListener('devicemotion', this.motionListener, true);
  }

  stop() {
    if (typeof window === 'undefined') return;
    if (this.orientationListener) {
      window.removeEventListener('deviceorientation', this.orientationListener, true);
      this.orientationListener = null;
    }
    if (this.motionListener) {
      window.removeEventListener('devicemotion', this.motionListener, true);
      this.motionListener = null;
    }
    this.subscribers.clear();
  }

  getTelemetry(): SensorTelemetry {
    return {
      pitch: this.pitch,
      roll: this.roll,
      heading: this.heading,
      isStable: this.isStable,
      stabilityScore: this.stabilityScore,
      estimatedDistanceCm: this.estimatedDistanceCm,
      gravityZ: this.gravityZ,
    };
  }

  subscribe(listener: (data: SensorTelemetry) => void) {
    this.subscribers.add(listener);
    listener(this.getTelemetry());
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notify() {
    const data = this.getTelemetry();
    this.subscribers.forEach(l => l(data));
  }
}

/**
 * Real-time fast surface feature point extractor for table plane estimation
 * Analyzes video frame for high-contrast corner and edge points in the lower 60% of viewport (table area)
 */
export function extractSurfaceFeatures(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): SurfaceFeaturePoint[] {
  const points: SurfaceFeaturePoint[] = [];
  if (width <= 0 || height <= 0) return points;

  try {
    const startY = Math.floor(height * 0.38);
    const sampleHeight = height - startY;
    const imageData = ctx.getImageData(0, startY, width, sampleHeight);
    const data = imageData.data;

    const step = Math.max(14, Math.floor(width / 24));

    for (let y = 14; y < sampleHeight - 14; y += step) {
      for (let x = 14; x < width - 14; x += step) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        const rightIndex = (y * width + (x + 4)) * 4;
        const downIndex = ((y + 4) * width + x) * 4;

        const rightLum = 0.299 * data[rightIndex] + 0.587 * data[rightIndex + 1] + 0.114 * data[rightIndex + 2];
        const downLum = 0.299 * data[downIndex] + 0.587 * data[downIndex + 1] + 0.114 * data[downIndex + 2];

        const grad = Math.abs(lum - rightLum) + Math.abs(lum - downLum);

        if (grad > 32 && grad < 195) {
          points.push({
            x: x / width,
            y: (startY + y) / height,
            confidence: Math.min(1.0, grad / 120),
          });
        }
      }
    }
  } catch (e) {
    // Canvas readback fallback
  }

  return points.slice(0, 36);
}
