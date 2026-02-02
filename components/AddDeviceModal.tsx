import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { DeviceConfig, DeviceCategory } from '../types';

interface AddDeviceModalProps {
  onClose: () => void;
  onAdd: (device: DeviceConfig) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [width, setWidth] = useState('390');
  const [height, setHeight] = useState('844');
  const [category, setCategory] = useState<DeviceCategory>('mobile');
  const [pixelRatio, setPixelRatio] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !width || !height) {
      alert('Please fill all required fields');
      return;
    }

    const newDevice: DeviceConfig = {
      id: `custom-${Date.now()}`,
      name,
      width: parseInt(width),
      height: parseInt(height),
      category,
      pixelRatio: parseFloat(pixelRatio),
    };

    onAdd(newDevice);
  };

  const presets = {
    mobile: { width: '390', height: '844', pixelRatio: '3' },
    tablet: { width: '834', height: '1194', pixelRatio: '2' },
    desktop: { width: '1920', height: '1080', pixelRatio: '1' },
  };

  const applyPreset = (cat: DeviceCategory) => {
    setCategory(cat);
    setWidth(presets[cat].width);
    setHeight(presets[cat].height);
    setPixelRatio(presets[cat].pixelRatio);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-700 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Smartphone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Custom Device</h2>
              <p className="text-sm text-gray-400">Create a custom viewport for testing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Device Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Device Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Custom Mobile, Galaxy Fold"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Device Category *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => applyPreset('mobile')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  category === 'mobile'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('tablet')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  category === 'tablet'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <Tablet className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('desktop')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  category === 'desktop'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <Monitor className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Desktop</span>
              </button>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Width (px) *
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="390"
                min="100"
                max="7680"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height (px) *
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="844"
                min="100"
                max="4320"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Pixel Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pixel Ratio (DPR)
            </label>
            <select
              value={pixelRatio}
              onChange={(e) => setPixelRatio(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="1">1x (Standard)</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x (Retina)</option>
              <option value="2.6">2.6x (Pixel)</option>
              <option value="3">3x (High-end Mobile)</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Tip:</strong> Common mobile sizes: 375×667 (iPhone SE), 390×844 (iPhone 14), 412×915 (Pixel 7).
              Custom devices are saved locally and persist across sessions.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
