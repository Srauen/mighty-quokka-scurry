"use client";

import React, { useState, useEffect, useCallback } from 'react';
import BootScreen from './BootScreen';
import OSWindow from './OSWindow';
import OSTaskbar from './OSTaskbar';
import CalculatorApp from './apps/CalculatorApp';
// import StockChartApp from './apps/StockChartApp'; // Will add later

interface WindowState {
  id: string;
  title: string;
  component: React.ReactNode;
  zIndex: number;
  minimized: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string; height: string };
}

const OSDesktop: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100); // Starting z-index for windows

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  const openApp = useCallback((appId: string) => {
    setOpenWindows((prevWindows) => {
      const existingWindow = prevWindows.find((win) => win.id === appId);

      if (existingWindow) {
        // If minimized, restore it
        if (existingWindow.minimized) {
          const updatedWindows = prevWindows.map((win) =>
            win.id === appId ? { ...win, minimized: false } : win
          );
          setActiveWindowId(appId);
          return updatedWindows;
        }
        // If already open, just bring to front
        setActiveWindowId(appId);
        return prevWindows;
      }

      // Open new app
      setNextZIndex((prev) => prev + 1);
      const newWindow: WindowState = {
        id: appId,
        title: '',
        component: null,
        zIndex: nextZIndex,
        minimized: false,
      };

      switch (appId) {
        case 'calculator':
          newWindow.title = 'Calculator';
          newWindow.component = <CalculatorApp />;
          newWindow.initialSize = { width: '300px', height: '400px' };
          newWindow.initialPosition = { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 200 };
          break;
        case 'stock-chart':
          newWindow.title = 'Stock Chart';
          // newWindow.component = <StockChartApp />; // Placeholder
          newWindow.component = <div className="text-center p-4">Stock Chart App (Coming Soon!)</div>;
          newWindow.initialSize = { width: '70vw', height: '70vh' };
          newWindow.initialPosition = { x: window.innerWidth / 2 - (window.innerWidth * 0.35), y: window.innerHeight / 2 - (window.innerHeight * 0.35) };
          break;
        default:
          return prevWindows; // Don't open if app not found
      }

      setActiveWindowId(appId);
      return [...prevWindows, newWindow];
    });
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((prevWindows) => prevWindows.filter((win) => win.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows((prevWindows) =>
      prevWindows.map((win) => (win.id === id ? { ...win, minimized: true } : win))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    setOpenWindows((prevWindows) => {
      const windowToFocus = prevWindows.find((win) => win.id === id);
      if (windowToFocus && windowToFocus.zIndex !== nextZIndex - 1) {
        setNextZIndex((prev) => prev + 1);
        return prevWindows
          .map((win) => (win.id === id ? { ...win, zIndex: nextZIndex } : win))
          .sort((a, b) => a.zIndex - b.zIndex); // Re-sort to maintain order
      }
      return prevWindows;
    });
    setActiveWindowId(id);
  }, [nextZIndex]);

  const activeAppIds = openWindows.filter(win => !win.minimized).map(win => win.id);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d0f17] bg-[radial-gradient(circle_at_center,_#1a2033_0%,_#0d0f17_100%)] text-white">
      {!booted && <BootScreen onBootComplete={handleBootComplete} />}

      {booted && (
        <>
          <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-6xl font-extrabold text-white text-shadow-lg animate-pulse-slow opacity-0 transition-opacity duration-1000">
            Stock OS
          </h1>
          <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-75 backdrop-blur-lg px-4 py-2 rounded-lg text-sm font-medium">
            Cash Balance: <span id="cash-balance" className="text-green-400">$10,000.00</span>
          </div>

          {openWindows.map((win) => (
            !win.minimized && (
              <OSWindow
                key={win.id}
                id={win.id}
                title={win.title}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onFocus={focusWindow}
                initialPosition={win.initialPosition}
                initialSize={win.initialSize}
                zIndex={win.zIndex}
                isActive={activeWindowId === win.id}
              >
                {win.component}
              </OSWindow>
            )
          ))}

          <OSTaskbar openApp={openApp} activeApps={activeAppIds} />
        </>
      )}
    </div>
  );
};

export default OSDesktop;