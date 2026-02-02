import React, { useRef, useState, useEffect } from 'react';
import { DeviceConfig } from '../types';

interface DeviceCardProps {
  device: DeviceConfig;
  url: string;
  scale: number;
  showFrame: boolean;
  rotated: boolean;
  reloadTrigger: number;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  url,
  scale,
  showFrame,
  rotated,
  reloadTrigger
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Reload iframe when global reload is triggered
  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [reloadTrigger]);

  const width = rotated ? device.height : device.width;
  const height = rotated ? device.width : device.height;

  // Frame styles based on device category
  const getFrameStyles = () => {
    if (!showFrame) return 'border border-gray-700 shadow-sm hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300';
    
    // Base styles with transition and shadow
    const base = "bg-gray-800 shadow-2xl relative transition-all duration-500 ease-in-out hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)]";
    
    if (device.category === 'mobile') {
      // Mobile: Rounded corners, thick bezel
      return `${base} rounded-[2.5rem] border-[8px] border-gray-800 p-2 ring-1 ring-gray-700 hover:border-gray-700 hover:bg-gray-700 hover:ring-gray-500`;
    }
    if (device.category === 'tablet') {
      // Tablet: Slightly less rounded, thicker bezel
      return `${base} rounded-[1.5rem] border-[12px] border-gray-800 p-2 ring-1 ring-gray-700 hover:border-gray-700 hover:bg-gray-700 hover:ring-gray-500`;
    }
    // Desktop: Top bar bezel, thin side borders
    return `${base} rounded-lg border-t-[24px] border-x-[1px] border-b-[1px] border-gray-700 pt-0 hover:border-gray-600`;
  };

  return (
    <div 
      className="flex flex-col items-center justify-start m-4 transition-all duration-300 group"
      style={{
        // We scale the container to occupy less space visually if zoomed out
        width: showFrame ? (width * scale) + 40 : width * scale,
        height: showFrame ? (height * scale) + 80 : (height * scale) + 40,
      }}
    >
      <div className="mb-2 flex items-center gap-2 text-gray-400 text-sm font-medium transition-colors group-hover:text-blue-400">
        <span>{device.name}</span>
        <span className="text-gray-600 text-xs group-hover:text-blue-400/70">
          {width}x{height}
        </span>
      </div>

      <div 
        className={getFrameStyles()}
        style={{
          // The visual container scaling
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: showFrame ? width + (device.category === 'mobile' ? 24 : 16) : width,
          height: showFrame ? height + (device.category === 'mobile' ? 24 : 16) : height,
        }}
      >
        {/* Camera notch simulation for mobile/tablet if frames on */}
        {showFrame && device.category !== 'desktop' && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-1/3 bg-gray-900 rounded-b-xl z-10 pointer-events-none transition-colors duration-500 group-hover:bg-black" />
        )}
        
        {/* Desktop Controls decoration */}
        {showFrame && device.category === 'desktop' && (
          <div className="absolute top-[-18px] left-2 flex gap-1.5 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
          </div>
        )}

        <div 
          className="bg-white overflow-hidden relative transition-shadow duration-300 group-hover:shadow-inner"
          style={{
             width: width,
             height: height,
             borderRadius: showFrame ? (device.category === 'mobile' ? '2rem' : '0.5rem') : '0',
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
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
              <span className="text-sm">Enter URL to preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};