import React from 'react';
import { X, Keyboard, Eye, ZoomIn, RotateCcw, Plus } from 'lucide-react';

interface AccessibilityPanelProps {
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ onClose }) => {
  const shortcuts = [
    { keys: ['Ctrl/Cmd', 'R'], description: 'Reload all device frames', icon: RotateCcw },
    { keys: ['Ctrl/Cmd', 'K'], description: 'Toggle device frames on/off', icon: Eye },
    { keys: ['Ctrl/Cmd', 'Shift', 'A'], description: 'Open this accessibility panel', icon: Keyboard },
    { keys: ['Enter'], description: 'Load URL from input field', icon: Plus },
  ];

  const features = [
    {
      title: 'High Contrast Mode',
      description: 'Toggle high contrast mode using the eye icon in the toolbar for better visibility',
      icon: Eye,
    },
    {
      title: 'Zoom Control',
      description: 'Use the slider in the toolbar to scale all devices from 25% to 150%',
      icon: ZoomIn,
    },
    {
      title: 'Keyboard Navigation',
      description: 'Navigate through all controls using Tab key, activate with Enter/Space',
      icon: Keyboard,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 flex items-center justify-between p-6 border-b border-gray-700 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Keyboard className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Accessibility & Shortcuts</h2>
              <p className="text-sm text-gray-400">Keyboard shortcuts and accessibility features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-blue-400" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{shortcut.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-md text-xs font-mono border border-gray-600 shadow-sm min-w-[3rem] text-center">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-gray-500 text-sm">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Accessibility Features */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              Accessibility Features
            </h3>
            <div className="grid gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Screen Reader Info */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Screen Reader Support</h3>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm leading-relaxed">
                All controls have proper ARIA labels and are keyboard accessible. Device frames include 
                descriptive titles for screen readers. Use Tab to navigate between controls and Enter/Space 
                to activate them.
              </p>
            </div>
          </section>

          {/* Testing Tips */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Testing Tips</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2 text-sm">📱 Mobile-First Testing</h4>
                <p className="text-gray-400 text-sm">
                  Start with the smallest mobile viewport and work your way up to ensure responsive design works at all breakpoints.
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2 text-sm">🔄 Test Orientation Changes</h4>
                <p className="text-gray-400 text-sm">
                  Use the rotate button to test landscape orientation, especially important for mobile and tablet views.
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2 text-sm">➕ Add Custom Devices</h4>
                <p className="text-gray-400 text-sm">
                  Create custom viewports to test specific device sizes or breakpoints unique to your project.
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2 text-sm">🎨 High Contrast Testing</h4>
                <p className="text-gray-400 text-sm">
                  Enable high contrast mode to test visibility and ensure your site works for users with visual impairments.
                </p>
              </div>
            </div>
          </section>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
