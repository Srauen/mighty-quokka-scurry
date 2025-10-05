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
        console.log(`TradingViewWidget (${containerId}): resizeWidget called.`);
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.resize === 'function') {
          widgetInstanceRef.current.resize();
        }
      },
    }));

    useEffect(() => {
      let animationFrameId: number | null = null;
      let attemptCount = 0;
      const maxAttempts = 60; // Increased max attempts for robustness (approx 1 second at 60fps)

      const initWidget = () => {
        const container = containerDivRef.current;
        attemptCount++;

        // 1. Check if TradingView script is loaded
        if (!(window as any).TradingView) {
          if (attemptCount < maxAttempts) {
            console.log(`TradingViewWidget (${containerId}): Script not ready. Retrying... (Attempt ${attemptCount})`);
            animationFrameId = requestAnimationFrame(initWidget);
          } else {
            console.error(`TradingViewWidget (${containerId}): Failed to load after ${maxAttempts} attempts: Script not available.`);
            if (container) container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Failed to load chart: Script not available.</div>';
          }
          return;
        }

        // 2. Check if container element exists and has computed dimensions
        if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
          if (attemptCount < maxAttempts) {
            console.log(`TradingViewWidget (${containerId}): Container not ready or zero dimensions (W:${container?.offsetWidth}, H:${container?.offsetHeight}). Retrying... (Attempt ${attemptCount})`);
            animationFrameId = requestAnimationFrame(initWidget);
          } else {
            console.error(`TradingViewWidget (${containerId}): Failed to load after ${maxAttempts} attempts: Container not ready or zero dimensions.`);
            if (container) container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Failed to load chart: Container not ready.</div>';
          }
          return;
        }

        // If we reach here, script is loaded and container is ready with dimensions
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }

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

        // Clear previous content to prevent multiple widgets in the same container
        container.innerHTML = '';
        console.log(`TradingViewWidget (${containerId}): Initializing new widget with W:${container.offsetWidth}, H:${container.offsetHeight}.`);

        try {
          widgetInstanceRef.current = new (window as any).TradingView.widget({
            ...widgetOptions,
            container_id: containerId, // This should match the ID of the div below
            width: container.offsetWidth, // Use actual width
            height: container.offsetHeight, // Use actual height
          });
          console.log(`TradingViewWidget (${containerId}): Widget initialized successfully.`);
        } catch (e) {
          console.error(`TradingViewWidget (${containerId}): Error during widget instantiation:`, e);
          if (container) container.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400">Error loading chart: ${e instanceof Error ? e.message : String(e)}.</div>`;
        }
      };

      animationFrameId = requestAnimationFrame(initWidget);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (widgetInstanceRef.current && typeof widgetInstanceRef.current.remove === 'function') {
          try {
            console.log(`TradingViewWidget (${containerId}): Cleaning up widget on unmount.`);
            widgetInstanceRef.current.remove();
          } catch (e) {
            console.error(`TradingViewWidget (${containerId}): Error removing widget during cleanup:`, e);
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