import React, { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { DeviceCard } from './components/DeviceCard';
import { DEVICES } from './constants';
import { AppState } from './types';
import { AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans selection:bg-blue-500/30">
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

      <main className="flex-1 mt-16 p-8 overflow-auto scroll-smooth">
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
    </div>
  );
};

export default App;
