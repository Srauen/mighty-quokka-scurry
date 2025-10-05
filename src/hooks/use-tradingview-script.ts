"use client";

import { useState, useEffect } from 'react';

export const useTradingViewScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // If window is not defined (SSR) or script is already loaded, set state and return
    if (typeof window === 'undefined' || (window as any).TradingView) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load TradingView script.');
      setScriptLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up the script if the component unmounts before it loads
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return scriptLoaded;
};