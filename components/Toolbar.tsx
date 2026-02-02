import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layout, 
  RotateCw,
  Plus,
  Accessibility,
  Eye
} from 'lucide-react';
import { AppState } from '../types';

interface ToolbarProps {
  state: AppState;
  onUrlChange: (url: string) => void;
  onLoadUrl: () => void;
  onToggleFrame: () => void;
  onToggleCategory: (cat: 'mobile' | 'tablet' | 'desktop') => void;
  onScaleChange: (scale: number) => void;
  onRotate: () => void;
  onReload: () => void;
  onToggleContrast: () => void;
  onAddDevice: () => void;
  onToggleAccessibility: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  state,
  onUrlChange,
  onLoadUrl,
  onToggleFrame,
  onToggleCategory,
  onScaleChange,
  onRotate,
  onReload,
  onToggleContrast,
  onAddDevice,
  onToggleAccessibility
}) => {
  const [localUrl, setLocalUrl] = useState(state.url);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUrlChange(localUrl);
      onLoadUrl();
    }
  };

  const handleBlur = () => {
    onUrlChange(localUrl);
  };

  return (
    <header className={`h-20 backdrop-blur-xl border-b fixed top-0 w-full z-50 shadow-2xl transition-all duration-300 ${
      state.highContrast 
        ? 'bg-black border-white/20' 
        : 'bg-gray-900/80 border-gray-700/50'
    }`}>
      <div className="h-full flex items-center px-6 gap-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 font-bold text-xl mr-4 group cursor-pointer">
          <div className="relative">
            <Layout className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:rotate-180" />
            <div className="absolute inset-0 bg-blue-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <span className="hidden md:block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-emerald-300 transition-all duration-300">
            ResponsiveDeck
          </span>
        </div>

        {/* URL Input Section */}
        <div className="flex-1 max-w-3xl flex items-center gap-3">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder="Enter URL (e.g., https://example.com)"
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                state.highContrast
                  ? 'bg-black border-2 border-white/30 text-white focus:ring-white focus:border-white'
                  : 'bg-gray-800/50 border border-gray-600/50 text-white focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500'
              }`}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity duration-300"></div>
          </div>
          <button
            onClick={onLoadUrl}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
              state.highContrast
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
          >
            Load
          </button>
        </div>

        {/* Divider */}
        <div className={`w-px h-10 ${state.highContrast ? 'bg-white/20' : 'bg-gray-700/50'}`} />

        {/* Device Category Toggles */}
        <div className={`flex rounded-xl p-1 gap-1 ${
          state.highContrast ? 'bg-white/10' : 'bg-gray-800/50'
        }`}>
          <button
            onClick={() => onToggleCategory('mobile')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              state.visibleCategories.mobile 
                ? state.highContrast
                  ? 'bg-white text-black'
                  : 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : state.highContrast
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Toggle Mobile Devices (Phones)"
          >
            <Smartphone className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleCategory('tablet')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              state.visibleCategories.tablet 
                ? state.highContrast
                  ? 'bg-white text-black'
                  : 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : state.highContrast
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Toggle Tablet Devices (iPads, etc.)"
          >
            <Tablet className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleCategory('desktop')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              state.visibleCategories.desktop 
                ? state.highContrast
                  ? 'bg-white text-black'
                  : 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : state.highContrast
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Toggle Desktop Devices (Laptops, Monitors)"
          >
            <Monitor className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className={`w-px h-10 ${state.highContrast ? 'bg-white/20' : 'bg-gray-700/50'}`} />

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReload}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              state.highContrast
                ? 'text-white hover:bg-white/10'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Reload All Frames (Ctrl/Cmd + R)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={onRotate}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              state.rotated 
                ? state.highContrast
                  ? 'text-white bg-white/20'
                  : 'text-blue-400 bg-blue-500/10'
                : state.highContrast
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Rotate All Devices 90°"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleFrame}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              state.showFrames 
                ? state.highContrast
                  ? 'text-white bg-white/20'
                  : 'text-blue-400 bg-blue-500/10'
                : state.highContrast
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Toggle Device Frames (Ctrl/Cmd + K)"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          <button
            onClick={onAddDevice}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              state.highContrast
                ? 'text-white hover:bg-white/10'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
            title="Add Custom Device"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Zoom Slider */}
          <div className="flex items-center gap-2 ml-2 px-3 py-1 rounded-lg bg-gray-800/30">
            <Minimize2 className="w-3.5 h-3.5 text-gray-500" />
            <input
              type="range"
              min="0.25"
              max="1.5"
              step="0.05"
              value={state.scale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className={`w-24 h-1.5 rounded-lg appearance-none cursor-pointer ${
                state.highContrast ? 'bg-white/20' : 'bg-gray-600'
              }`}
              style={{
                accentColor: state.highContrast ? '#ffffff' : '#3b82f6'
              }}
            />
            <span className={`text-xs font-medium w-10 text-right ${
              state.highContrast ? 'text-white' : 'text-gray-300'
            }`}>
              {Math.round(state.scale * 100)}%
            </span>
          </div>

          {/* Divider */}
          <div className={`w-px h-8 ${state.highContrast ? 'bg-white/20' : 'bg-gray-700/50'} mx-1`} />

          {/* Accessibility Controls */}
          <button
            onClick={onToggleContrast}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              state.highContrast 
                ? 'text-black bg-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleAccessibility}
            className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
              state.highContrast
                ? 'text-white hover:bg-white/10'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Accessibility Help (Ctrl/Cmd + Shift + A)"
          >
            <Accessibility className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
