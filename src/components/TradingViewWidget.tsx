"use client";

import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  containerId: string;
  widgetOptions: any; // TradingView widget options
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ containerId, widgetOptions }) => {
  const widgetRef = useRef<any>(null);
  const containerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 500; // ms

    const createWidget = () => {
      if (!containerElementRef.current) {
        console.warn(`Container element for ID ${containerId} not found.`);
        return;
      }

      // Clear any existing content in the container
      containerElementRef.current.innerHTML = '';

      if (!(window as any).TradingView) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`TradingView script not ready for ${containerId}. Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(createWidget, retryDelay);
        } else {
          console.error(`Failed to load TradingView widget for ${containerId} after ${maxRetries} retries.`);
          // Optionally display a fallback message in the container
          containerElementRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Failed to load chart. Please refresh.</div>';
        }
        return;
      }

      // Destroy existing widget instance if it exists
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
        widgetRef.current = null;
      }

      widgetRef.current = new (window as any).TradingView.widget({
        ...widgetOptions,
        container_id: containerId,
      });
    };

    createWidget();

    return () => {
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [containerId, widgetOptions]); // Re-create widget if containerId or options change

  return <div id={containerId} ref={containerElementRef} className="w-full h-full" />;
};

export default TradingViewWidget;