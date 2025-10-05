"use client";

import { useState, useEffect } from 'react';

export const useTradingViewScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    console.log('useTradingViewScript: Effect triggered.');
    // If window is not defined (SSR) or script is already loaded, set state and return
    if (typeof window === 'undefined') {
      console.log('useTradingViewScript: Running in SSR, script not loaded.');
      return;
    }
    if ((window as any).TradingView) {
      console.log('useTradingViewScript: TradingView script already loaded.');
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      console.log('useTradingViewScript: TradingView script loaded successfully.');
      setScriptLoaded(true);
    };
    script.onerror = (e) => {
      console.error('useTradingViewScript: Failed to load TradingView script.', e);
      setScriptLoaded(false);
    };

    document.head.appendChild(script);
    console.log('useTradingViewScript: Appending TradingView script to head.');

    return () => {
      // Clean up the script if the component unmounts before it loads
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        console.log('useTradingViewScript: Cleaning up TradingView script.');
      }
    };
  }, []);

  return scriptLoaded;
};