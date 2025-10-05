"use client";

import React, { useState, useEffect, useCallback } from 'react';
import BootScreen from './BootScreen';
import OSWindow from './OSWindow';
import OSTaskbar from './OSTaskbar';
import CalculatorApp from './apps/CalculatorApp';
import TradingTerminalApp from './apps/TradingTerminalApp';
import PortfolioApp from './apps/PortfolioApp';
import NewsFeedApp from './apps/NewsFeedApp';
import OnboardingOSModal from './OnboardingOSModal';
import OnboardingModal from '@/components/OnboardingModal';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Bell, Brain, TrendingUp, AlertTriangle, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { useStockData } from '@/hooks/use-stock-data';
import OSStockChartWindowContent from './components/OSStockChartWindowContent';
import FullChartModal from './components/FullChartModal';
import OSNotification from './OSNotification'; // Import new OSNotification
import OSSpotlight from './OSSpotlight'; // Import new OSSpotlight

interface WindowState {
  id: string;
  title: string;
  component: React.ReactNode;
  zIndex: number;
  minimized: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string; height: string };
  // Add a prop to store the initial stock symbol for the chart app
  initialStockSymbol?: string;
}

interface OSDesktopProps {
  onExit: () => void;
}

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

const aiNotificationMessages = [
  { title: "AI Alert: High Momentum", message: "NVDA shows strong upward momentum. Consider a buy.", icon: <TrendingUp className="h-5 w-5 text-teal" /> },
  { title: "AI Insight: Oversold", message: "MSFT is entering oversold territory. Potential rebound ahead.", icon: <TrendingDown className="h-5 w-5 text-red-500" /> },
  { title: "Market News: AAPL", message: "Apple announces new product line. Stock expected to react.", icon: <Bell className="h-5 w-5 text-electric-blue" /> },
  { title: "AI Prediction: Volatility", message: "Increased volatility expected for AMZN. Trade with caution.", icon: <AlertTriangle className="h-5 w-5 text-yellow-500" /> },
  { title: "AI Recommendation", message: "GOOGL: Strong buy signal based on recent earnings.", icon: <Brain className="h-5 w-5 text-purple-400" /> },
];

// Helper functions to load/save from localStorage
const getInitialCashBalance = (experienceLevel: string | null) => {
  if (typeof window !== 'undefined') {
    const savedCash = localStorage.getItem('os_cashBalance');
    if (savedCash) return parseFloat(savedCash);
  }
  switch (experienceLevel) {
    case 'advanced': return 50000;
    case 'pro': return 100000;
    case 'beginner': default: return 10000;
  }
};

const getInitialPortfolio = () => {
  if (typeof window !== 'undefined') {
    const savedPortfolio = localStorage.getItem('os_portfolio');
    try { return savedPortfolio ? JSON.parse(savedPortfolio) : {}; } catch (e) { console.error("Error parsing portfolio from localStorage", e); return {}; }
  }
  return {};
};

const getInitialTradingLog = () => {
  if (typeof window !== 'undefined') {
    const savedLog = localStorage.getItem('os_tradingLog');
    try { return savedLog ? JSON.parse(savedLog) : []; } catch (e) { console.error("Error parsing trading log from localStorage", e); return {}; }
  }
  return [];
};

const getInitialExperienceLevel = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('os_experienceLevel') || null;
  }
  return null;
};

const OSDesktop: React.FC<OSDesktopProps> = ({ onExit }) => {
  const [booted, setBooted] = useState(false);
  const [showOnboardingOS, setShowOnboardingOS] = useState(false);
  const [osOnboardingStep, setOsOnboardingStep] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(getInitialExperienceLevel());
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [fullSymbol, setFullSymbol] = useState<string | null>(null);

  // OS Global State with localStorage persistence
  const { stockData, stocksList, initializeStockData } = useStockData();
  const [cashBalance, setCashBalance] = useState<number>(getInitialCashBalance(experienceLevel));
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>(getInitialPortfolio());
  const [newsFeed, setNewsFeed] = useState<string[]>([]);
  const [tradingLog, setTradingLog] = useState<string[]>(getInitialTradingLog());
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; icon?: React.ReactNode }>>([]);
  const [showSpotlight, setShowSpotlight] = useState(false);

  // Show toast if data was loaded from local storage
  useEffect(() => {
    if (typeof window !== 'undefined' && (getInitialCashBalance(experienceLevel) !== 10000 || Object.keys(getInitialPortfolio()).length > 0 || getInitialTradingLog().length > 0)) {
      toast.info("Loaded saved trading data from previous session.", {
        description: `Cash: $${getInitialCashBalance(experienceLevel).toFixed(2)}, Portfolio items: ${Object.keys(getInitialPortfolio()).length}`,
        duration: 3000,
      });
    }
  }, []);

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

  // Save experienceLevel to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && experienceLevel) {
      localStorage.setItem('os_experienceLevel', experienceLevel);
    }
  }, [experienceLevel]);

  // Initialize news feed
  useEffect(() => {
    setNewsFeed(initialNewsHeadlines.slice(0, 5).map(headline => `[${new Date().toLocaleTimeString()}] ${headline}`));
  }, []);

  // Simulate news feed updates
  useEffect(() => {
    if (!booted) return;
    const newsUpdateInterval = setInterval(() => {
      setNewsFeed(prevNews => {
        const headline = initialNewsHeadlines[Math.floor(Math.random() * initialNewsHeadlines.length)];
        const time = new Date().toLocaleTimeString();
        const newNewsItem = `[${time}] ${headline}`;
        const updatedNews = [newNewsItem, ...prevNews];
        return updatedNews.slice(0, 20);
      });
    }, 5000);
    return () => clearInterval(newsUpdateInterval);
  }, [booted]);

  // Simulate AI notifications
  useEffect(() => {
    if (!booted) return;
    const notificationInterval = setInterval(() => {
      const randomNotification = aiNotificationMessages[Math.floor(Math.random() * aiNotificationMessages.length)];
      setNotifications(prev => [...prev, { ...randomNotification, id: Date.now().toString() }]);
    }, 15000); // New notification every 15 seconds
    return () => clearInterval(notificationInterval);
  }, [booted]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const openFullChart = useCallback((sym: string) => {
    setFullSymbol(sym);
  }, []);

  const closeFullChart = useCallback(() => {
    setFullSymbol(null);
  }, []);

  const openApp = useCallback((appId: string, initialStockSymbol?: string) => {
    setOpenWindows((prevWindows) => {
      const existingWindow = prevWindows.find((win) => win.id === appId);

      if (existingWindow) {
        // If the app is already open and minimized, restore it
        if (existingWindow.minimized) {
          const updatedWindows = prevWindows.map((win) =>
            win.id === appId ? { ...win, minimized: false } : win
          );
          setActiveWindowId(appId);
          return updatedWindows;
        }
        // If the app is already open and active, just focus it
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
        initialStockSymbol: initialStockSymbol, // Pass initial stock symbol
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
          newWindow.component = (
            <OSStockChartWindowContent
              stocksList={stocksList}
              openFullChart={openFullChart}
              fullSymbol={fullSymbol}
              closeFullChart={closeFullChart}
              initialSelectedStock={initialStockSymbol || stocksList[0]} // Use initialStockSymbol if provided
            />
          );
          newWindow.initialSize = { width: '70vw', height: '80vh' };
          newWindow.initialPosition = { x: window.innerWidth / 2 - (window.innerWidth * 0.35), y: window.innerHeight / 2 - (window.innerHeight * 0.4) };
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
  }, [nextZIndex, stockData, cashBalance, portfolio, tradingLog, newsFeed, stocksList, openFullChart, fullSymbol, closeFullChart]);

  const nextOSOnboardingStep = useCallback(() => {
    if (osOnboardingStep < 4) {
      setOsOnboardingStep(prev => prev + 1);
    } else {
      setOsOnboardingStep(0);
      setShowOnboardingOS(true);
    }
  }, [osOnboardingStep]);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    if (!experienceLevel) {
      setOsOnboardingStep(1);
    } else {
      openApp('stock-chart');
    }
  }, [experienceLevel, openApp]);

  const handleSelectExperience = useCallback((level: 'beginner' | 'advanced' | 'pro') => {
    setExperienceLevel(level);
    let newCash = 10000;
    switch (level) {
      case 'advanced': newCash = 50000; break;
      case 'pro': newCash = 100000; break;
      default: newCash = 10000; break;
    }
    setCashBalance(newCash);
    localStorage.setItem('os_cashBalance', newCash.toString());
    localStorage.setItem('os_experienceLevel', level);
    setShowOnboardingOS(false);
    openApp('stock-chart');
    toast.success("Experience Set!", { description: `Starting with $${newCash.toFixed(2)} as a ${level} trader.` });
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

  const resetOSData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('os_cashBalance');
      localStorage.removeItem('os_portfolio');
      localStorage.removeItem('os_tradingLog');
      localStorage.removeItem('os_experienceLevel');
      toast.info("OS Data Reset", { description: "Your trading data has been cleared. The OS will restart." });
      window.location.reload();
    }
  }, []);

  const activeAppIds = openWindows.filter(win => !win.minimized).map(win => win.id);

  // Keyboard shortcut for Spotlight (Alt + Space)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.code === 'Space') { // Changed to Alt + Space
        event.preventDefault();
        setShowSpotlight(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d0f17] bg-[radial-gradient(circle_at_center,_#1a2033_0%,_#0d0f17_100%)] text-white">
      {!booted && <BootScreen onBootComplete={handleBootComplete} />}

      {booted && osOnboardingStep > 0 && (
        <OnboardingModal
          onboardingStep={osOnboardingStep}
          nextOnboardingStep={nextOSOnboardingStep}
        />
      )}

      {booted && showOnboardingOS && (
        <OnboardingOSModal isOpen={showOnboardingOS} onSelectExperience={handleSelectExperience} />
      )}

      {booted && !showOnboardingOS && osOnboardingStep === 0 && (
        <>
          <div className="absolute top-4 right-4 flex items-center space-x-4 bg-gray-900 bg-opacity-75 backdrop-blur-lg px-4 py-2 rounded-lg text-sm font-medium">
            <span>Cash Balance: <span className="text-green-400">${cashBalance.toFixed(2)}</span></span>
            <Button variant="ghost" size="icon" onClick={resetOSData} className="text-gray-400 hover:text-white" aria-label="Reset OS Data">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onExit} className="text-gray-400 hover:text-white" aria-label="Exit OS">
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

          {notifications.map((notification) => (
            <OSNotification
              key={notification.id}
              id={notification.id}
              title={notification.title}
              message={notification.message}
              icon={notification.icon}
              onDismiss={dismissNotification}
            />
          ))}

          <OSSpotlight
            isOpen={showSpotlight}
            onClose={() => setShowSpotlight(false)}
            stocksList={stocksList}
            openApp={openApp}
          />
        </>
      )}
    </div>
  );
};

export default OSDesktop;