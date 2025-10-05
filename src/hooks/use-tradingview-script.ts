"use client";

import { useEffect, useState } from 'react';

const TRADINGVIEW_SCRIPT_URL = 'https://s3.tradingview.com/tv.js';

export const useTradingViewScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existingScript = document.getElementById('tradingview-widget-script');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = TRADINGVIEW_SCRIPT_URL;
    script.async = true;
    script.id = 'tradingview-widget-script';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load TradingView widget script.');
      setScriptLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up the script if the component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return scriptLoaded;
};