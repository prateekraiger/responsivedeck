import React, { useRef, useState, useEffect } from 'react';
import { DeviceConfig } from '../types';
import { X } from 'lucide-react';

interface DeviceCardProps {
  device: DeviceConfig;
  url: string;
  scale: number;
  showFrame: boolean;
  rotated: boolean;
  reloadTrigger: number;
  highContrast: boolean;
  isCustom?: boolean;
  onRemove?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  url,
  scale,
  showFrame,
  rotated,
  reloadTrigger,
  highContrast,
  isCustom = false,
  onRemove
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Reload iframe when global reload is triggered
  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [reloadTrigger]);

  const width = rotated ? device.height : device.width;
  const height = rotated ? device.width : device.height;

  // Frame styles based on device category with high contrast support
  const getFrameStyles = () => {
    if (!showFrame) {
      return `border ${
        highContrast ? 'border-white/40' : 'border-gray-700'
      } shadow-sm hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300`;
    }
    
    // Base styles with transition and shadow
    const base = `relative transition-all duration-500 ease-in-out ${
      highContrast 
        ? 'bg-black shadow-[0_20px_50px_rgba(255,255,255,0.1)]' 
        : 'bg-gray-900 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]'
    }`;
    
    if (device.category === 'mobile') {
      // Mobile: Rounded corners, thick bezel with notch
      return `${base} rounded-[2.5rem] p-3 ring-2 ${
        highContrast 
          ? 'border-[10px] border-white/20 ring-white/30 hover:border-white/40 hover:ring-white/50' 
          : 'border-[10px] border-gray-800 ring-gray-700/50 hover:border-gray-700 hover:bg-gray-800 hover:ring-blue-500/30'
      }`;
    }
    if (device.category === 'tablet') {
      // Tablet: Slightly less rounded, medium bezel
      return `${base} rounded-[2rem] p-3 ring-2 ${
        highContrast 
          ? 'border-[14px] border-white/20 ring-white/30 hover:border-white/40 hover:ring-white/50' 
          : 'border-[14px] border-gray-800 ring-gray-700/50 hover:border-gray-700 hover:bg-gray-800 hover:ring-blue-500/30'
      }`;
    }
    // Desktop: Top bar bezel with control dots
    return `${base} rounded-xl pt-0 ${
      highContrast 
        ? 'border-t-[28px] border-x-[2px] border-b-[2px] border-white/30 hover:border-white/50' 
        : 'border-t-[28px] border-x-[2px] border-b-[2px] border-gray-700 hover:border-gray-600'
    }`;
  };

  return (
    <div 
      className="flex flex-col items-center justify-start m-4 transition-all duration-300 group relative"
      style={{
        width: showFrame ? (width * scale) + 60 : width * scale,
        height: showFrame ? (height * scale) + 100 : (height * scale) + 50,
      }}
    >
      {/* Device Name Label */}
      <div className={`mb-3 flex items-center gap-3 text-sm font-semibold transition-colors ${
        highContrast 
          ? 'text-white group-hover:text-white' 
          : 'text-gray-400 group-hover:text-blue-400'
      }`}>
        <span>{device.name}</span>
        <span className={`text-xs font-normal ${
          highContrast 
            ? 'text-white/60 group-hover:text-white/80' 
            : 'text-gray-600 group-hover:text-blue-400/70'
        }`}>
          {width}×{height}
        </span>
        {isCustom && onRemove && (
          <button
            onClick={onRemove}
            className={`p-1 rounded-full transition-all hover:scale-110 ${
              highContrast
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            }`}
            title="Remove Custom Device"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div 
        className={getFrameStyles()}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: showFrame ? width + (device.category === 'tablet' ? 28 : device.category === 'mobile' ? 26 : 4) : width,
          height: showFrame ? height + (device.category === 'tablet' ? 28 : device.category === 'mobile' ? 26 : 4) : height,
        }}
      >
        {/* Dynamic Island / Notch for mobile/tablet */}
        {showFrame && device.category !== 'desktop' && (
          <div className={`absolute left-1/2 transform -translate-x-1/2 z-20 pointer-events-none transition-colors duration-500 ${
            device.category === 'mobile' 
              ? 'top-1 h-6 w-32 rounded-full' 
              : 'top-2 h-5 w-28 rounded-full'
          } ${
            highContrast 
              ? 'bg-white/80 group-hover:bg-white' 
              : 'bg-black/90 group-hover:bg-black'
          }`}>
            {/* Camera dot */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
              highContrast ? 'bg-black/50' : 'bg-gray-700'
            }`}></div>
          </div>
        )}
        
        {/* Desktop window controls */}
        {showFrame && device.category === 'desktop' && (
          <div className="absolute top-[-20px] left-4 flex gap-2 z-10 opacity-80 group-hover:opacity-100 transition-all duration-300">
            <div className={`w-3 h-3 rounded-full shadow-lg transition-transform hover:scale-125 ${
              highContrast ? 'bg-white/70' : 'bg-red-500'
            }`}></div>
            <div className={`w-3 h-3 rounded-full shadow-lg transition-transform hover:scale-125 ${
              highContrast ? 'bg-white/70' : 'bg-yellow-500'
            }`}></div>
            <div className={`w-3 h-3 rounded-full shadow-lg transition-transform hover:scale-125 ${
              highContrast ? 'bg-white/70' : 'bg-green-500'
            }`}></div>
          </div>
        )}

        {/* Home button for mobile (some devices) */}
        {showFrame && device.category === 'mobile' && device.id.includes('iphone-se') && (
          <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 z-10 ${
            highContrast 
              ? 'border-white/30 group-hover:border-white/50' 
              : 'border-gray-700 group-hover:border-gray-600'
          }`}></div>
        )}

        <div 
          className={`overflow-hidden relative transition-shadow duration-300 ${
            highContrast 
              ? 'bg-white shadow-inner' 
              : 'bg-white group-hover:shadow-inner'
          }`}
          style={{
             width: width,
             height: height,
             borderRadius: showFrame ? (
               device.category === 'mobile' ? '1.75rem' : 
               device.category === 'tablet' ? '1rem' : 
               '0.5rem'
             ) : '0',
          }}
        >
           {url ? (
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={url}
              width={width}
              height={height}
              className="border-0 w-full h-full bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              title={`${device.name} Preview`}
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-sm ${
              highContrast 
                ? 'bg-black text-white' 
                : 'bg-gray-50 text-gray-400'
            }`}>
              <span>Enter URL to preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
