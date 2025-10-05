"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

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
    const [widgetInitialized, setWidgetInitialized] = useState(false); // State to track if widget has been initialized

    // Expose a resize method via the ref
    useImperativeHandle(ref, () => ({
      resizeWidget: () => {
        console.log(`TradingViewWidget (${containerId}): resizeWidget called.`);
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.resize === 'function') {
          widgetInstanceRef.current.resize();
        }
      },
    }));

    useEffect(() => {
      let intervalId: NodeJS.Timeout | null = null;

      const tryInitWidget = () => {
        const container = containerDivRef.current;

        // If container is gone or widget is already initialized, stop trying
        if (!container || widgetInitialized) {
          if (intervalId) clearInterval(intervalId);
          return;
        }

        const { offsetWidth, offsetHeight } = container;

        // Check if TradingView script is loaded and container has non-zero dimensions
        if (offsetWidth > 0 && offsetHeight > 0 && (window as any).TradingView) {
          // Script loaded and container has dimensions
          if (intervalId) clearInterval(intervalId); // Stop polling

          // Remove existing widget instance if it exists before creating a new one
          if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
            try {
              console.log(`TradingViewWidget (${containerId}): Removing old widget instance.`);
              widgetInstanceRef.current.remove();
            } catch (e) {
              console.error(`TradingViewWidget (${containerId}): Error removing old widget instance:`, e);
            }
            widgetInstanceRef.current = null;
          }

          container.innerHTML = ''; // Clear previous content to prevent multiple widgets in the same container
          console.log(`TradingViewWidget (${containerId}): Initializing new widget with W:${offsetWidth}, H:${offsetHeight}.`);

          try {
            const newWidgetInstance = new (window as any).TradingView.widget({
              ...widgetOptions,
              container_id: containerId, // This should match the ID of the div below
              width: offsetWidth, // Use actual width
              height: offsetHeight, // Use actual height
            });
            widgetInstanceRef.current = newWidgetInstance; // Update ref for imperative handle
            setWidgetInitialized(true); // Mark as initialized
            console.log(`TradingViewWidget (${containerId}): Widget initialized successfully.`);
          } catch (e) {
            console.error(`TradingViewWidget (${containerId}): Error during widget instantiation:`, e);
            container.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400">Error loading chart: ${e instanceof Error ? e.message : String(e)}.</div>`;
          }
        } else {
          // Script not loaded or container not ready, keep trying
          console.log(`TradingViewWidget (${containerId}): Not ready. Script loaded: ${!!(window as any).TradingView}, Container dimensions: ${offsetWidth}x${offsetHeight}. Retrying...`);
        }
      };

      // Start polling every 50ms
      intervalId = setInterval(tryInitWidget, 50);

      // Setup ResizeObserver
      const resizeObserver = new ResizeObserver(() => {
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.resize === 'function') {
          console.log(`TradingViewWidget (${containerId}): ResizeObserver detected size change, resizing widget.`);
          widgetInstanceRef.current.resize();
        }
      });

      if (containerDivRef.current) {
        resizeObserver.observe(containerDivRef.current);
      }

      // Cleanup function
      return () => {
        if (intervalId) clearInterval(intervalId); // Stop polling
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
          try {
            console.log(`TradingViewWidget (${containerId}): Cleaning up widget on unmount.`);
            widgetInstanceRef.current.remove();
          } catch (e) {
            console.error(`TradingViewWidget (${containerId}): Error removing widget during cleanup:`, e);
          }
          widgetInstanceRef.current = null;
        }
        resizeObserver.disconnect(); // Disconnect observer
      };
    }, [containerId, widgetOptions, widgetInitialized]); // Dependencies: re-run if these change

    // The container div itself should still fill its parent
    return <div id={containerId} ref={containerDivRef} className="w-full h-full" />;
  }
);

TradingViewWidget.displayName = 'TradingViewWidget';

export default TradingViewWidget;