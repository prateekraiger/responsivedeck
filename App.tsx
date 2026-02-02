import React, { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { DeviceCard } from './components/DeviceCard';
import { DEVICES } from './constants';
import { AppState, DeviceConfig } from './types';
import { AlertTriangle } from 'lucide-react';
import { AddDeviceModal } from './components/AddDeviceModal';
import { AccessibilityPanel } from './components/AccessibilityPanel';

const INITIAL_STATE: AppState = {
  url: 'http://localhost:5173',
  activeUrl: '',
  scale: 0.75, // Default scale to fit most screens
  showFrames: true,
  visibleCategories: {
    mobile: true,
    tablet: true,
    desktop: true,
  },
  rotated: false,
  highContrast: false,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [customDevices, setCustomDevices] = useState<DeviceConfig[]>([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  // Initialize state from LocalStorage AND Query Params
  useEffect(() => {
    let newState = { ...INITIAL_STATE };

    // 1. Try to load from local storage
    try {
      const saved = localStorage.getItem('responsive-deck-state');
      if (saved) {
        newState = { ...newState, ...JSON.parse(saved), activeUrl: '' };
      }
      
      const savedDevices = localStorage.getItem('custom-devices');
      if (savedDevices) {
        setCustomDevices(JSON.parse(savedDevices));
      }
    } catch (e) {
      console.warn("Failed to load state", e);
    }

    // 2. Check for URL query parameter (Passed from background.js when extension icon is clicked)
    const params = new URLSearchParams(window.location.search);
    const initialUrl = params.get('initialUrl');

    if (initialUrl) {
      // If we have an incoming URL, it takes precedence
      newState.url = initialUrl;
      newState.activeUrl = initialUrl;
    }

    setState(newState);
  }, []);

  // Save state to local storage on change
  useEffect(() => {
    localStorage.setItem('responsive-deck-state', JSON.stringify({
      url: state.url,
      scale: state.scale,
      showFrames: state.showFrames,
      visibleCategories: state.visibleCategories,
      rotated: state.rotated,
      highContrast: state.highContrast
    }));
  }, [state.url, state.scale, state.showFrames, state.visibleCategories, state.rotated, state.highContrast]);

  // Save custom devices
  useEffect(() => {
    localStorage.setItem('custom-devices', JSON.stringify(customDevices));
  }, [customDevices]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + R: Reload all frames
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleReload();
      }
      // Ctrl/Cmd + K: Toggle frames
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleToggleFrame();
      }
      // Ctrl/Cmd + Shift + A: Toggle accessibility panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAccessibility(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleUrlChange = (inputUrl: string) => {
    let formattedUrl = inputUrl;

    // Smart Protocol Handling
    if (inputUrl && !inputUrl.match(/^[a-zA-Z]+:\/\//)) {
      // If it looks like localhost or an IP, default to http
      if (inputUrl.startsWith('localhost') || inputUrl.startsWith('127.0.0.1') || inputUrl.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
        formattedUrl = `http://${inputUrl}`;
      } else {
        // Otherwise default to https
        formattedUrl = `https://${inputUrl}`;
      }
    }

    setState(prev => ({ ...prev, url: formattedUrl }));
  };

  const handleLoadUrl = () => {
    if (!state.url) return;
    // Apply protocol fix before loading if the user typed it manually
    handleUrlChange(state.url);

    // We use a timeout to ensure state update for URL normalization happens before setting activeUrl
    // Or simpler: calculate standard URL here
    let finalUrl = state.url;
    if (state.url && !state.url.match(/^[a-zA-Z]+:\/\//)) {
       if (state.url.startsWith('localhost') || state.url.startsWith('127.0.0.1') || state.url.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
        finalUrl = `http://${state.url}`;
       } else {
        finalUrl = `https://${state.url}`;
       }
    }

    setState(prev => ({ ...prev, url: finalUrl, activeUrl: finalUrl }));
    setReloadTrigger(prev => prev + 1);
  };

  const handleToggleFrame = () => setState(prev => ({ ...prev, showFrames: !prev.showFrames }));

  const handleToggleCategory = (cat: 'mobile' | 'tablet' | 'desktop') => {
    setState(prev => ({
      ...prev,
      visibleCategories: {
        ...prev.visibleCategories,
        [cat]: !prev.visibleCategories[cat]
      }
    }));
  };

  const handleScaleChange = (scale: number) => setState(prev => ({ ...prev, scale }));
  const handleRotate = () => setState(prev => ({ ...prev, rotated: !prev.rotated }));
  const handleReload = () => setReloadTrigger(prev => prev + 1);
  const handleToggleContrast = () => setState(prev => ({ ...prev, highContrast: !prev.highContrast }));

  const handleAddDevice = (device: DeviceConfig) => {
    setCustomDevices(prev => [...prev, device]);
    setShowAddDevice(false);
  };

  const handleRemoveDevice = (deviceId: string) => {
    setCustomDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  // Filter devices - combine default and custom
  const allDevices = [...DEVICES, ...customDevices];
  const visibleDevices = allDevices.filter(d => state.visibleCategories[d.category]);

  return (
    <div className={`relative min-h-screen text-white flex flex-col font-sans selection:bg-blue-500/30 transition-colors duration-300 ${
      state.highContrast ? 'bg-black' : ''
    }`}>
      {/* New Modern Background */}
      {!state.highContrast && (
        <>
          <div className="fixed inset-0 bg-black"></div>
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="fixed left-0 right-0 top-[-10%] h-[1000px] w-[1000px] mx-auto rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)] pointer-events-none"></div>
        </>
      )}
      <Toolbar
        state={state}
        onUrlChange={handleUrlChange}
        onLoadUrl={handleLoadUrl}
        onToggleFrame={handleToggleFrame}
        onToggleCategory={handleToggleCategory}
        onScaleChange={handleScaleChange}
        onRotate={handleRotate}
        onReload={handleReload}
        onToggleContrast={handleToggleContrast}
        onAddDevice={() => setShowAddDevice(true)}
        onToggleAccessibility={() => setShowAccessibility(!showAccessibility)}
      />

      <main className="relative flex-1 mt-20 p-8 w-full z-10">
        <div className="flex flex-wrap items-start justify-center gap-12 pb-20">
          {state.activeUrl ? (
            visibleDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                url={state.activeUrl}
                scale={state.scale}
                showFrame={state.showFrames}
                rotated={state.rotated}
                reloadTrigger={reloadTrigger}
                highContrast={state.highContrast}
                isCustom={customDevices.some(d => d.id === device.id)}
                onRemove={() => handleRemoveDevice(device.id)}
              />
            ))
          ) : (
            <div className="mt-20 text-center max-w-2xl mx-auto animate-fade-in-up">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 tracking-tight">
                Design for Every Device
              </h1>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                Enter a URL above to instantly preview your website across multiple mobile, tablet, and desktop viewports simultaneously.
              </p>

              <div className="mt-8 p-6 bg-yellow-500/5 rounded-xl border border-yellow-500/10 text-left max-w-xl mx-auto backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-yellow-500 font-semibold mb-1">Developer Note</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Extension mode strips <code className="text-yellow-500 bg-yellow-500/10 px-1 py-0.5 rounded text-xs">X-Frame-Options</code> headers to allow embedding.
                      However, some sites (like GitHub) use advanced frame-busting scripts that may still prevent loading.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Device Modal */}
      {showAddDevice && (
        <AddDeviceModal
          onClose={() => setShowAddDevice(false)}
          onAdd={handleAddDevice}
        />
      )}

      {/* Accessibility Panel */}
      {showAccessibility && (
        <AccessibilityPanel
          onClose={() => setShowAccessibility(false)}
        />
      )}
    </div>
  );
};

export default App;
