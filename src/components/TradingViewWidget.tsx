"use client";

import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  containerId: string;
  widgetOptions: any; // TradingView widget options
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ containerId, widgetOptions }) => {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 500; // ms

    const createWidget = () => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Container element for ID ${containerId} not found in DOM.`);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(createWidget, retryDelay);
        } else {
          console.error(`Failed to find container for TradingView widget ${containerId} after ${maxRetries} retries.`);
          const fallbackDiv = document.createElement('div');
          fallbackDiv.className = 'flex items-center justify-center h-full text-gray-400';
          fallbackDiv.textContent = 'Failed to load chart. Please refresh.';
          container?.appendChild(fallbackDiv);
        }
        return;
      }

      container.innerHTML = '';

      if (!(window as any).TradingView) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`TradingView script not ready for ${containerId}. Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(createWidget, retryDelay);
        } else {
          console.error(`Failed to load TradingView widget for ${containerId} after ${maxRetries} retries.`);
          container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Failed to load chart. Please refresh.</div>';
        }
        return;
      }

      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.error(`Error removing old TradingView widget for ${containerId}:`, e);
        }
        widgetRef.current = null;
      }

      widgetRef.current = new (window as any).TradingView.widget({
        ...widgetOptions,
        container_id: containerId,
        width: "100%", // Explicitly set width to 100%
        height: "100%", // Explicitly set height to 100%
      });
    };

    createWidget();

    return () => {
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.error(`Error removing TradingView widget for ${containerId} during cleanup:`, e);
        }
        widgetRef.current = null;
      }
    };
  }, [containerId, widgetOptions]);

  // The container div itself should still fill its parent
  return <div id={containerId} className="w-full h-full" />;
};

export default TradingViewWidget;