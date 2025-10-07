"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection"; // Import new ContactSection
import TestimonialsSection from "@/components/TestimonialsSection"; // Import new TestimonialsSection
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";
import OSDesktop from "@/components/os/OSDesktop"; // Keep for demo
import { LineChart, BarChart3, Brain, Smartphone, Shield, Zap, TrendingUp, LayoutGrid, GraduationCap, Lock, Newspaper, Briefcase } from 'lucide-react'; // Added new icons
import { useTheme } from '@/components/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import ScrollIndicator from "@/components/ui/scroll-indicator"; // Imported here

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [showOSSimulation, setShowOSSimulation] = useState(false); // Changed back to false

  const heroRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const pricingRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null); // New ref for ContactSection
  const testimonialsRef = useRef<HTMLElement | null>(null); // New ref for TestimonialsSection

  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (showOSSimulation) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = [heroRef, featuresRef, pricingRef, faqRef, contactRef, testimonialsRef]; // Include testimonialsRef
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [showOSSimulation]);

  const startOnboarding = () => {
    setOnboardingStep(1);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setOnboardingStep(0);
    }
  };

  const handleWatchDemo = () => {
    setShowOSSimulation(true);
  };

  const handleExitOSSimulation = () => {
    setShowOSSimulation(false);
  };

  const features = [
    {
      icon: <LineChart className="w-6 h-6 text-white" />,
      title: "Trading Tools & Charts",
      description: `
        **Real-time intraday charts** for stocks, crypto, and mutual funds.
        **Historical data & replay mode** for strategy testing.
        Diverse chart types: **Candlestick, line, bar, area**.
        **20+ Technical indicators** including RSI, MACD, Bollinger Bands, SMA, EMA, Volume, Ichimoku, Fibonacci, Stochastic, ADX, ATR, VWAP.
        **Customizable chart layouts & themes**.
        **Multi-ticker support** with side-by-side comparisons.
        **Drag-and-drop widgets** for a modular workspace.
        Advanced drawing tools, timeframe flexibility, and integrated news overlays.
      `
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Trading Terminal",
      description: `
        **One-click buy/sell orders** with live PnL tracking.
        **Advanced order types:** Stop-loss, take-profit, OCO, OTO, trailing stops, bracket orders.
        **Real-time risk assessment & alerts**.
        **Immutable audit history** for all trades.
        **API integration with 50+ brokers** for seamless live trading.
        **Simulation mode** with virtual capital for risk-free practice.
        Multi-currency, multi-asset support, algorithmic trading, and backtesting capabilities.
      `
    },
    {
      icon: <Briefcase className="w-6 h-6 text-white" />,
      title: "Portfolio Manager",
      description: `
        **Track holdings, balances, and profit/loss** (realized/unrealized).
        **Multi-portfolio support** for retail, institutional, and student accounts.
        **Real-time auto-updates** of portfolio value.
        **Custom alerts** for performance thresholds.
        **Exportable reports** (CSV, PDF) for compliance and education.
        Detailed asset allocation breakdown, performance benchmarking, and risk metrics (VaR, Beta, Sharpe Ratio).
      `
    },
    {
      icon: <Newspaper className="w-6 h-6 text-white" />,
      title: "News & Insights",
      description: `
        **Live financial news feed** integrated via APIs (NewsAPI, Alpha Vantage, CoinGecko, proprietary sources).
        **AI-curated headlines** based on your portfolio and watchlist.
        Highlights for **inflation, geopolitical, and market-moving news**.
        **Sentiment analysis** for stocks, crypto, sectors, and overall market.
        **Push notifications** for breaking news, economic calendar, and earnings reports.
      `
    },
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "AI & Notifications",
      description: `
        **AI-driven buy/sell suggestions** with probabilistic confidence scores.
        **Indicators based on RSI, volume, price trends, candlestick patterns, and fundamental data**.
        **Customizable notification thresholds** for price, volume, news, and sentiment.
        **AI-driven learning tips** for students with adaptive curriculum.
        **Simulation feedback** explaining trade outcomes and suggesting improvements.
        Predictive analytics, anomaly detection, and personalized market summaries.
      `
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-white" />,
      title: "Modular Dashboard & UI",
      description: `
        **Modular, draggable, and resizable windows** with snap-to-grid functionality.
        **Dark/light mode** with a sleek OS-style theme.
        **Taskbar** with app shortcuts, notifications, and system tray.
        **Multi-monitor support** for professional setups.
        **Custom themes & layouts** (save/load presets).
        **Quick access to all tools via Spotlight Search (Alt+Space)** and virtual desktops for different workflows.
      `
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      title: "Learning & Gamification",
      description: `
        **Robust simulation mode** for risk-free practice with virtual capital.
        **Badges, levels, and leaderboards** to track learning progress.
        **Scenario-based trading challenges** based on historical events.
        **Interactive tutorials** integrated directly into the OS workflow.
        **AI-driven adaptive learning paths** and a comprehensive educational content library.
      `
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: "Security & Compliance",
      description: `
        **OS-level sandboxing** to isolate your trading environment.
        **Advanced malware & phishing protection**.
        **Immutable audit logs** for all trades, logins, and actions.
        **Multi-user permissions & role-based access control** for institutions.
        **End-to-end encrypted communication** with broker APIs.
        **Auto-updates with verified patches** and secure boot processes.
        **Compliance dashboards** (MiFID II, FINRA, SEC reporting) and data privacy controls (GDPR, CCPA).
      `
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Integration & Customization",
      description: `
        **Seamless API integration** with 50+ brokers and exchanges.
        **Advanced analytics modules** for portfolio optimization and risk modeling.
        **Premium market data feeds** (Level 2, dark pools, alternative data) as add-ons.
        **External app integration** (Excel, Google Sheets, custom scripts).
        **Cloud sync & backup options** (encrypted) and a third-party plugin marketplace.
        **Custom builds** for fintech startups, educational labs, and prop trading firms.
      `
    },
  ];

  const pricingPlans = [
    {
      name: "Starter (Student)",
      price: "Free",
      period: "",
      features: [
        "Simulation Mode",
        "Limited AI tips",
        "Basic charting tools",
        "Community support",
        "Risk-free learning environment",
        "Access to educational content"
      ],
      popular: false,
    },
    {
      name: "Pro (Retail)",
      price: "$29.99",
      period: "/month",
      features: [
        "Full OS Access",
        "Live Trading Integration",
        "Advanced AI Insights",
        "Premium Charting Tools",
        "Portfolio Management",
        "Priority Support",
        "Flexible installment payments available",
        "Multi-monitor support",
        "Customizable layouts",
        "Real-time risk assessment"
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      features: [
        "Multi-user OS",
        "Compliance Tools",
        "API Integration",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "White-label Solutions",
        "Role-based access control",
        "Immutable audit logs",
        "On-premise deployment options"
      ],
      popular: false,
    },
    {
      name: "Add-Ons",
      price: "Varies",
      period: "",
      features: [
        "Premium Data Feeds (Level 2, Dark Pools)",
        "Advanced Analytics Modules (Quant, Risk Modeling)",
        "Gamification Features (Leaderboards, Challenges)",
        "Custom AI Model Training",
        "Dedicated Cloud Sync & Backup",
        "Third-Party Plugin Marketplace Access"
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {showOSSimulation ? (
        <OSDesktop onExit={handleExitOSSimulation} />
      ) : (
        <>
          <ScrollIndicator />
          <Navbar
            darkMode={theme === 'dark' || theme === 'os-style'}
            setDarkMode={(isDark) => setTheme(isDark ? 'dark' : 'light')}
            activeSection={activeSection}
            onSignIn={() => navigate('/login')}
          />
          <main className="flex-grow">
            <HeroSection sectionRef={heroRef} startOnboarding={startOnboarding} onWatchDemo={handleWatchDemo} />
            <FeaturesSection sectionRef={featuresRef} features={features} />
            <TestimonialsSection sectionRef={testimonialsRef} />
            <PricingSection sectionRef={pricingRef} pricingPlans={pricingPlans} />
            <FAQSection sectionRef={faqRef} />
            <ContactSection sectionRef={contactRef} />
          </main>
          <Footer />
          <OnboardingModal
            onboardingStep={onboardingStep}
            nextOnboardingStep={nextOnboardingStep}
          />
        </>
      )}
    </div>
  );
};

export default Index;