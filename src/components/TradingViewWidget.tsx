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
      let animationFrameId: number | null = null;

      const initWidget = () => {
        const container = containerDivRef.current;

        // 1. Check if TradingView script is loaded
        if (!(window as any).TradingView) {
          animationFrameId = requestAnimationFrame(initWidget); // Retry on next frame
          return;
        }

        // 2. Check if container element exists and has computed dimensions
        if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
          animationFrameId = requestAnimationFrame(initWidget); // Retry on next frame
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
            widgetInstanceRef.current.remove();
          } catch (e) {
            console.error(`Error removing old TradingView widget for ${containerId}:`, e);
          }
          widgetInstanceRef.current = null;
        }

        // Clear previous content to prevent multiple widgets in the same container
        container.innerHTML = '';

        // Initialize the widget with actual pixel dimensions
        widgetInstanceRef.current = new (window as any).TradingView.widget({
          ...widgetOptions,
          container_id: containerId, // This should match the ID of the div below
          width: container.offsetWidth, // Use actual width
          height: container.offsetHeight, // Use actual height
        });
      };

      animationFrameId = requestAnimationFrame(initWidget);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
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