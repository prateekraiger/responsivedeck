import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layout, 
  RotateCw
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
}

export const Toolbar: React.FC<ToolbarProps> = ({
  state,
  onUrlChange,
  onLoadUrl,
  onToggleFrame,
  onToggleCategory,
  onScaleChange,
  onRotate,
  onReload
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
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4 fixed top-0 w-full z-50 shadow-lg">
      <div className="flex items-center gap-2 font-bold text-xl text-blue-400 mr-4">
        <Layout className="w-6 h-6" />
        <span className="hidden md:block">ResponsiveDeck</span>
      </div>

      {/* URL Input */}
      <div className="flex-1 max-w-2xl flex items-center gap-2">
        <input
          type="text"
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Enter URL (e.g., https://example.com)"
          className="flex-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={onLoadUrl}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Go
        </button>
      </div>

      <div className="w-px h-8 bg-gray-700 mx-2" />

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Category Toggles */}
        <div className="flex bg-gray-900 rounded-md p-1 gap-1">
          <button
            onClick={() => onToggleCategory('mobile')}
            className={`p-2 rounded ${state.visibleCategories.mobile ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            title="Toggle Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleCategory('tablet')}
            className={`p-2 rounded ${state.visibleCategories.tablet ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            title="Toggle Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleCategory('desktop')}
            className={`p-2 rounded ${state.visibleCategories.desktop ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            title="Toggle Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* Global Actions */}
        <button
          onClick={onReload}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Reload All Frames"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onRotate}
          className={`p-2 transition-colors ${state.rotated ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
          title="Rotate Devices"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleFrame}
          className={`p-2 transition-colors ${state.showFrames ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
          title="Toggle Device Frames"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Zoom Slider */}
        <div className="flex items-center gap-2 ml-2">
          <Minimize2 className="w-3 h-3 text-gray-500" />
          <input
            type="range"
            min="0.25"
            max="1.5"
            step="0.05"
            value={state.scale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs text-gray-400 w-8 text-right">{Math.round(state.scale * 100)}%</span>
        </div>
      </div>
    </div>
  );
};