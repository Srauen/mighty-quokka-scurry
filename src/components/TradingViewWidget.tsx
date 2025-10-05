"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface TradingViewWidgetProps {
  containerId: string;
  widgetOptions: any; // TradingView widget options
}

// Define the ref type for the component
export interface TradingViewWidgetRef {
  resizeWidget: () => void;
}

const TradingViewWidget = forwardRef<TradingViewWidgetRef, TradingViewWidgetProps>(
  ({ containerId, widgetOptions }, ref) => {
    const widgetInstanceRef = useRef<any>(null); // To hold the actual TradingView.widget instance
    const containerDivRef = useRef<HTMLDivElement>(null); // Ref for the div that TradingView attaches to

    // Expose a resize method via the ref
    useImperativeHandle(ref, () => ({
      resizeWidget: () => {
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.resize === 'function') {
          widgetInstanceRef.current.resize();
        }
      },
    }));

    useEffect(() => {
      let retryCount = 0;
      const maxRetries = 10;
      const retryDelay = 500; // ms

      const createWidget = () => {
        const container = containerDivRef.current; // Use the ref for the container
        if (!container) {
          console.warn(`Container element for ID ${containerId} not found in DOM.`);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(createWidget, retryDelay);
          } else {
            console.error(`Failed to find container for TradingView widget ${containerId} after ${maxRetries} retries.`);
            // Fallback UI
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = 'flex items-center justify-center h-full text-gray-400';
            fallbackDiv.textContent = 'Failed to load chart. Please refresh.';
            container?.appendChild(fallbackDiv);
          }
          return;
        }

        container.innerHTML = ''; // Clear previous content

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

      // Remove existing widget if any
      if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
        try {
          widgetInstanceRef.current.remove();
        } catch (e) {
          console.error(`Error removing old TradingView widget for ${containerId}:`, e);
        }
        widgetInstanceRef.current = null;
      }

        widgetInstanceRef.current = new (window as any).TradingView.widget({
          ...widgetOptions,
          container_id: containerId, // Use the ID for the widget
          width: "100%",
          height: "100%",
        });
      };

      createWidget();

      return () => {
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
          try {
            widgetInstanceRef.current.remove();
          } catch (e) {
            console.error(`Error removing TradingView widget for ${containerId} during cleanup:`, e);
          }
          widgetInstanceRef.current = null;
        }
      };
    }, [containerId, widgetOptions]);

    // The container div itself should still fill its parent
    return <div id={containerId} ref={containerDivRef} className="w-full h-full" />;
  }
);

TradingViewWidget.displayName = 'TradingViewWidget';

export default TradingViewWidget;