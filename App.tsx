import React, { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { DeviceCard } from './components/DeviceCard';
import { DEVICES } from './constants';
import { AppState } from './types';

const INITIAL_STATE: AppState = {
  url: 'https://www.google.com',
  activeUrl: '',
  scale: 0.75, // Default scale to fit most screens
  showFrames: true,
  visibleCategories: {
    mobile: true,
    tablet: true,
    desktop: true,
  },
  rotated: false,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Initialize state from LocalStorage AND Query Params
  useEffect(() => {
    let newState = { ...INITIAL_STATE };

    // 1. Try to load from local storage
    try {
      const saved = localStorage.getItem('responsive-deck-state');
      if (saved) {
        newState = { ...newState, ...JSON.parse(saved), activeUrl: '' };
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
      rotated: state.rotated
    }));
  }, [state.url, state.scale, state.showFrames, state.visibleCategories, state.rotated]);

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

  // Filter devices
  const visibleDevices = DEVICES.filter(d => state.visibleCategories[d.category]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Toolbar
        state={state}
        onUrlChange={handleUrlChange}
        onLoadUrl={handleLoadUrl}
        onToggleFrame={handleToggleFrame}
        onToggleCategory={handleToggleCategory}
        onScaleChange={handleScaleChange}
        onRotate={handleRotate}
        onReload={handleReload}
      />

      <main className="flex-1 mt-16 p-6 overflow-auto">
        <div className="flex flex-wrap items-start justify-center gap-8">
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
              />
            ))
          ) : (
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-bold text-gray-300 mb-4">Ready to test</h2>
              <p className="text-gray-500">Enter a URL above and click Go to start the preview.</p>
              <div className="mt-8 p-4 bg-gray-800 rounded-lg max-w-md mx-auto border border-gray-700">
                <p className="text-yellow-500 text-sm font-semibold mb-2">Important Note:</p>
                <p className="text-gray-400 text-xs">
                  This extension modifies request headers to bypass <code className="text-gray-300">X-Frame-Options</code> restrictions. 
                  However, some sophisticated websites (like GitHub or Google) may still block embedding via JavaScript checks 
                  (frame-busting scripts) or strict CSP settings that cannot be easily overridden without breaking the site.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;