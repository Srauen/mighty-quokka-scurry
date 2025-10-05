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
      let intervalId: ReturnType<typeof setInterval> | null = null;
      let retryCount = 0;
      const maxRetries = 20; // Increased retries
      const retryDelay = 100; // ms

      const initializeWidget = () => {
        const container = containerDivRef.current;

        // 1. Check if TradingView script is loaded
        if (!(window as any).TradingView) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.warn(`TradingView script not ready for ${containerId}. Retrying (${retryCount}/${maxRetries})...`);
            return; // Keep retrying
          } else {
            console.error(`Failed to load TradingView widget for ${containerId} after ${maxRetries} retries: Script not available.`);
            if (container) container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Failed to load chart. Please refresh.</div>';
            clearInterval(intervalId!);
            return;
          }
        }

        // 2. Check if container element exists and has computed dimensions
        if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.warn(`Container for ${containerId} not ready or has zero dimensions. Retrying (${retryCount}/${maxRetries})...`);
            return; // Keep retrying
          } else {
            console.error(`Failed to load TradingView widget for ${containerId} after ${maxRetries} retries: Container not ready.`);
            if (container) container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Failed to load chart. Please refresh.</div>';
            clearInterval(intervalId!);
            return;
          }
        }

        // If we reach here, script is loaded and container is ready
        clearInterval(intervalId!); // Stop retrying

        // Remove existing widget instance if it exists before creating a new one
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
          try {
            widgetInstanceRef.current.remove();
          } catch (e) {
            console.error(`Error removing old TradingView widget for ${containerId}:`, e);
          }
          widgetInstanceRef.current = null;
        }

        // Clear previous content to prevent multiple widgets in the same container
        container.innerHTML = '';

        widgetInstanceRef.current = new (window as any).TradingView.widget({
          ...widgetOptions,
          container_id: containerId, // This should match the ID of the div below
          width: "100%", // Ensure these are set to 100%
          height: "100%",
        });
      };

      // Start polling for widget initialization conditions
      intervalId = setInterval(initializeWidget, retryDelay);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
          try {
            widgetInstanceRef.current.remove();
          } catch (e) {
            console.error(`Error removing TradingView widget for ${containerId} during cleanup:`, e);
          }
          widgetInstanceRef.current = null;
        }
      };
    }, [containerId, widgetOptions]); // Re-run effect if containerId or widgetOptions change

    // The container div itself should still fill its parent
    return <div id={containerId} ref={containerDivRef} className="w-full h-full" />;
  }
);

TradingViewWidget.displayName = 'TradingViewWidget';

export default TradingViewWidget;