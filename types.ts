export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  category: DeviceCategory;
  pixelRatio: number;
  userAgent?: string;
}

export interface AppState {
  url: string;
  activeUrl: string; // The actual URL being rendered (after user hits enter/go)
  scale: number;
  showFrames: boolean;
  visibleCategories: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  rotated: boolean; // Global rotation state
  highContrast: boolean; // Accessibility: high contrast mode
}