import * as THREE from 'three';

export interface SpatialAnchorState {
  isFixed: boolean;
  position: [number, number, number];
  rotation: number;
  scale: number;
  planeNormal: [number, number, number];
}

class SpatialAnchorEngine {
  private state: SpatialAnchorState = {
    isFixed: false,
    position: [0, -0.4, 0],
    rotation: 0,
    scale: 1.0,
    planeNormal: [0, 1, 0]
  };

  private listeners: Set<(state: SpatialAnchorState) => void> = new Set();

  getState(): SpatialAnchorState {
    return { ...this.state };
  }

  toggleLock(currentPosition: [number, number, number] = [0, -0.4, 0]): SpatialAnchorState {
    this.state.isFixed = !this.state.isFixed;
    if (this.state.isFixed) {
      this.state.position = currentPosition;
    }
    this.notify();
    return this.getState();
  }

  setFixed(fixed: boolean, position?: [number, number, number]) {
    this.state.isFixed = fixed;
    if (position) {
      this.state.position = position;
    }
    this.notify();
  }

  setPosition(position: [number, number, number]) {
    if (!this.state.isFixed) {
      this.state.position = position;
      this.notify();
    }
  }

  setRotation(rotation: number) {
    this.state.rotation = rotation;
    this.notify();
  }

  setScale(scale: number) {
    this.state.scale = scale;
    this.notify();
  }

  subscribe(listener: (state: SpatialAnchorState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.getState()));
  }
}

export const spatialAnchorEngine = new SpatialAnchorEngine();
