"use client";

import React, { useState, useEffect, useCallback } from 'react';
import BootScreen from './BootScreen';
import OSWindow from './OSWindow';
import OSTaskbar from './OSTaskbar';
import CalculatorApp from './apps/CalculatorApp';
import StockChartApp from './apps/StockChartApp';
import TradingTerminalApp from './apps/TradingTerminalApp';
import PortfolioApp from './apps/PortfolioApp';
import NewsFeedApp from './apps/NewsFeedApp';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner'; // Import toast for notifications

interface WindowState {
  id: string;
  title: string;
  component: React.ReactNode;
  zIndex: number;
  minimized: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string; height: string };
}

interface OSDesktopProps {
  onExit: () => void;
}

const stocksList = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'FB', 'NFLX', 'BABA', 'SBUX', 'KO', 'PEP', 'MCD', 'DIS', 'NKE', 'ADDYY', 'V', 'JPM', 'XOM', 'WMT', 'PG', 'MA', 'INTC', 'CSCO', 'CMCSA', 'PFE', 'T', 'VZ', 'CVX', 'HD', 'BA', 'MCO', 'BNS', 'RY', 'TD'];
const initialNewsHeadlines = [
  "Market volatility expected after global events.",
  "Tech stocks surge on strong Q3 reports.",
  "Energy sector sees gains as oil prices stabilize.",
  "Inflation concerns lead to interest rate hike speculation.",
  "Analyst predicts strong year for renewable energy.",
  "Major companies announce stock buyback programs.",
  "New trade agreements could impact commodities.",
  "Retail sector reports mixed holiday sales.",
  "Cryptocurrency market shows signs of recovery.",
  "Pharmaceutical stock rallies on new drug approval."
];

// Helper functions to load/save from localStorage
const getInitialCashBalance = () => {
  if (typeof window !== 'undefined') {
    const savedCash = localStorage.getItem('os_cashBalance');
    return savedCash ? parseFloat(savedCash) : 10000;
  }
  return 10000;
};

const getInitialPortfolio = () => {
  if (typeof window !== 'undefined') {
    const savedPortfolio = localStorage.getItem('os_portfolio');
    try {
      return savedPortfolio ? JSON.parse(savedPortfolio) : {};
    } catch (e) {
      console.error("Error parsing portfolio from localStorage", e);
      return {};
    }
  }
  return {};
};

const getInitialTradingLog = () => {
  if (typeof window !== 'undefined') {
    const savedLog = localStorage.getItem('os_tradingLog');
    try {
      return savedLog ? JSON.parse(savedLog) : [];
    } catch (e) {
      console.error("Error parsing trading log from localStorage", e);
      return [];
    }
  }
  return [];
};

const OSDesktop: React.FC<OSDesktopProps> = ({ onExit }) => {
  const [booted, setBooted] = useState(false);
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  // OS Global State with localStorage persistence
  const initialCash = getInitialCashBalance();
  const initialPortfolio = getInitialPortfolio();
  const initialTradingLog = getInitialTradingLog();

  const [cashBalance, setCashBalance] = useState<number>(initialCash);
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>(initialPortfolio);
  const [stockData, setStockData] = useState<{
    [key: string]: { prices: number[]; labels: string[] };
  }>({});
  const [newsFeed, setNewsFeed] = useState<string[]>([]);
  const [tradingLog, setTradingLog] = useState<string[]>(initialTradingLog);

  // Show toast if data was loaded from local storage
  useEffect(() => {
    if (typeof window !== 'undefined' && (initialCash !== 10000 || Object.keys(initialPortfolio).length > 0 || initialTradingLog.length > 0)) {
      toast.info("Loaded saved trading data from previous session.", {
        description: `Cash: $${initialCash.toFixed(2)}, Portfolio items: ${Object.keys(initialPortfolio).length}`,
        duration: 3000,
      });
    }
  }, []); // Run once on mount

  // Save cashBalance to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('os_cashBalance', cashBalance.toString());
    }
  }, [cashBalance]);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('os_portfolio', JSON.stringify(portfolio));
    }
  }, [portfolio]);

  // Save tradingLog to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('os_tradingLog', JSON.stringify(tradingLog));
    }
  }, [tradingLog]);

  // Initialize stock data and news feed
  useEffect(() => {
    const initialStockData: { [key: string]: { prices: number[]; labels: string[] } } = {};
    stocksList.forEach(stock => {
      initialStockData[stock] = {
        prices: [Math.floor(Math.random() * 200) + 100],
        labels: [new Date().toLocaleTimeString()]
      };
    });
    setStockData(initialStockData);
    // Initialize news feed with a few items, then let interval update
    setNewsFeed(initialNewsHeadlines.slice(0, 5).map(headline => `[${new Date().toLocaleTimeString()}] ${headline}`));
  }, []);

  // Simulate price updates and news feed
  useEffect(() => {
    if (!booted) return;

    const priceUpdateInterval = setInterval(() => {
      setStockData(prevStockData => {
        const newStockData = { ...prevStockData };
        stocksList.forEach(stock => {
          if (!newStockData[stock]) {
            newStockData[stock] = {
              prices: [Math.floor(Math.random() * 200) + 100],
              labels: [new Date().toLocaleTimeString()]
            };
          }
          const lastPrice = newStockData[stock].prices[newStockData[stock].prices.length - 1];
          const change = (Math.random() - 0.5) * 5;
          const newPrice = Math.max(0, lastPrice + change);
          newStockData[stock].prices.push(newPrice);
          newStockData[stock].labels.push(new Date().toLocaleTimeString());
          if (newStockData[stock].prices.length > 50) {
            newStockData[stock].prices.shift();
            newStockData[stock].labels.shift();
          }
        });
        return newStockData;
      });
    }, 3000);

    const newsUpdateInterval = setInterval(() => {
      setNewsFeed(prevNews => {
        const headline = initialNewsHeadlines[Math.floor(Math.random() * initialNewsHeadlines.length)];
        const time = new Date().toLocaleTimeString();
        const newNewsItem = `[${time}] ${headline}`;
        const updatedNews = [newNewsItem, ...prevNews];
        return updatedNews.slice(0, 20);
      });
    }, 5000);

    return () => {
      clearInterval(priceUpdateInterval);
      clearInterval(newsUpdateInterval);
    };
  }, [booted]);

  const openApp = useCallback((appId: string) => {
    setOpenWindows((prevWindows) => {
      const existingWindow = prevWindows.find((win) => win.id === appId);

      if (existingWindow) {
        if (existingWindow.minimized) {
          const updatedWindows = prevWindows.map((win) =>
            win.id === appId ? { ...win, minimized: false } : win
          );
          setActiveWindowId(appId);
          return updatedWindows;
        }
        setActiveWindowId(appId);
        return prevWindows;
      }

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
          newWindow.component = <StockChartApp stocksList={stocksList} stockData={stockData} />;
          newWindow.initialSize = { width: '70vw', height: '70vh' };
          newWindow.initialPosition = { x: window.innerWidth / 2 - (window.innerWidth * 0.35), y: window.innerHeight / 2 - (window.innerHeight * 0.35) };
          break;
        case 'trading-terminal':
          newWindow.title = 'Trading Terminal';
          newWindow.component = (
            <TradingTerminalApp
              stocksList={stocksList}
              stockData={stockData}
              cashBalance={cashBalance}
              portfolio={portfolio}
              setCashBalance={setCashBalance}
              setPortfolio={setPortfolio}
              tradingLog={tradingLog}
              setTradingLog={setTradingLog}
            />
          );
          newWindow.initialSize = { width: '50vw', height: '60vh' };
          newWindow.initialPosition = { x: window.innerWidth / 2 - (window.innerWidth * 0.25), y: window.innerHeight / 2 - (window.innerHeight * 0.3) };
          break;
        case 'portfolio-manager':
          newWindow.title = 'Portfolio Manager';
          newWindow.component = (
            <PortfolioApp
              portfolio={portfolio}
              stockData={stockData}
              cashBalance={cashBalance}
              setPortfolio={setPortfolio}
            />
          );
          newWindow.initialSize = { width: '70vw', height: '70vh' };
          newWindow.initialPosition = { x: window.innerWidth / 2 - (window.innerWidth * 0.35), y: window.innerHeight / 2 - (window.innerHeight * 0.35) };
          break;
        case 'news-feed':
          newWindow.title = 'Live News Feed';
          newWindow.component = <NewsFeedApp newsFeed={newsFeed} />;
          newWindow.initialSize = { width: '400px', height: '60vh' };
          newWindow.initialPosition = { x: window.innerWidth - 420, y: window.innerHeight / 2 - (window.innerHeight * 0.3) };
          break;
        default:
          return prevWindows;
      }

      setActiveWindowId(appId);
      return [...prevWindows, newWindow];
    });
  }, [nextZIndex, stockData, cashBalance, portfolio, tradingLog, newsFeed]);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    // Automatically open the Stock Chart app
    openApp('stock-chart');
  }, [openApp]);

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
          .sort((a, b) => a.zIndex - b.zIndex);
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
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-gray-900 bg-opacity-75 backdrop-blur-lg px-4 py-2 rounded-lg text-sm font-medium">
            <span>Cash Balance: <span className="text-green-400">${cashBalance.toFixed(2)}</span></span>
            <Button variant="ghost" size="icon" onClick={onExit} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
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