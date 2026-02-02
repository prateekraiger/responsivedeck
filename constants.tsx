import { DeviceConfig } from './types';

export const DEVICES: DeviceConfig[] = [
  // Mobile
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    width: 375,
    height: 667,
    category: 'mobile',
    pixelRatio: 2,
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    width: 390,
    height: 844,
    category: 'mobile',
    pixelRatio: 3,
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    category: 'mobile',
    pixelRatio: 3,
  },
  {
    id: 'pixel-7',
    name: 'Pixel 7',
    width: 412,
    height: 915,
    category: 'mobile',
    pixelRatio: 2.6,
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    width: 448,
    height: 998,
    category: 'mobile',
    pixelRatio: 2.6,
  },
  {
    id: 'galaxy-s22',
    name: 'Galaxy S22',
    width: 360,
    height: 780,
    category: 'mobile',
    pixelRatio: 3,
  },
  
  // Tablet
  {
    id: 'ipad-mini',
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    category: 'tablet',
    pixelRatio: 2,
  },
  {
    id: 'ipad-pro-11',
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    category: 'tablet',
    pixelRatio: 2,
  },
  {
    id: 'surface-pro-9',
    name: 'Surface Pro 9',
    width: 912,
    height: 1368,
    category: 'tablet',
    pixelRatio: 2,
  },
  {
    id: 'galaxy-tab-s8',
    name: 'Galaxy Tab S8',
    width: 800,
    height: 1280,
    category: 'tablet',
    pixelRatio: 1.5,
  },

  // Desktop/Laptop
  {
    id: 'macbook-air',
    name: 'MacBook Air',
    width: 1280,
    height: 832,
    category: 'desktop',
    pixelRatio: 2,
  },
  {
    id: 'desktop-hd',
    name: 'Desktop HD',
    width: 1920,
    height: 1080,
    category: 'desktop',
    pixelRatio: 1,
  },
  {
    id: 'desktop-4k',
    name: '4K Monitor',
    width: 2560, // Scaled down 4k usually used in web dev context (1440p logic often applies or 2x scaling)
    height: 1440,
    category: 'desktop',
    pixelRatio: 1,
  },
];