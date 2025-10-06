"use client";

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  containerId: string;
  widgetOptions: any;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(({ containerId, widgetOptions }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.TradingView) {
      console.warn('TradingView script not loaded yet.');
      return;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear previous widget if any
    }

    // Ensure TradingView.widget is called with 'new'
    const widget = new window.TradingView.widget({
      container_id: containerId,
      ...widgetOptions,
    });

    return () => {
      // TradingView widgets don't have a direct destroy method in the public API.
      // Clearing the container is the common workaround.
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [containerId, widgetOptions]);

  return <div ref={containerRef} id={containerId} className="w-full h-full" />;
});

export default TradingViewWidget;