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
import { LineChart, BarChart3, Brain, Smartphone, Shield, Zap, TrendingUp, LayoutGrid, GraduationCap, Lock } from 'lucide-react'; // Added new icons
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
      description: "Real-time charts, historical data, technical indicators, and customizable layouts for comprehensive analysis."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Trading Terminal",
      description: "Execute buy/sell orders, track PnL, set stop-loss/take-profit, and utilize simulation mode for risk-free practice."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Portfolio Manager",
      description: "Track holdings, balances, and profit/loss across multiple portfolios with real-time auto-updates."
    },
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "AI & Notifications",
      description: "Receive AI-driven buy/sell suggestions, trend indicators, customizable alerts, and personalized learning tips."
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-white" />,
      title: "Modular Dashboard & UI",
      description: "Enjoy a distraction-free desktop with modular, draggable, and resizable windows, dark/light modes, and multi-monitor support."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      title: "Learning & Gamification",
      description: "Engage with simulation mode, badges, leaderboards, scenario challenges, and AI-driven adaptive learning paths."
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: "Security & Compliance",
      description: "Benefit from OS-level sandboxing, malware protection, immutable audit logs, and encrypted broker API communication."
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Integration & Customization",
      description: "Seamless API integration with brokers, advanced analytics modules, external app support, and cloud sync options."
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
        "Community support"
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
        "Flexible installment payments available"
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
        "White-label Solutions"
      ],
      popular: false,
    },
    {
      name: "Add-Ons",
      price: "Varies",
      period: "",
      features: [
        "Premium Data Feeds",
        "Advanced Analytics Modules",
        "Gamification Features",
        "Custom AI Model Training"
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
          <ScrollIndicator /> {/* Moved here, only renders when OS simulation is off */}
          <Navbar
            darkMode={theme === 'dark' || theme === 'os-style'}
            setDarkMode={(isDark) => setTheme(isDark ? 'dark' : 'light')}
            activeSection={activeSection}
            onSignIn={() => navigate('/login')} // Pass onSignIn prop
          />
          <main className="flex-grow">
            <HeroSection sectionRef={heroRef} startOnboarding={startOnboarding} onWatchDemo={handleWatchDemo} />
            <FeaturesSection sectionRef={featuresRef} features={features} />
            <TestimonialsSection sectionRef={testimonialsRef} /> {/* New Testimonials Section */}
            <PricingSection sectionRef={pricingRef} pricingPlans={pricingPlans} />
            <FAQSection sectionRef={faqRef} />
            <ContactSection sectionRef={contactRef} /> {/* New Contact Section */}
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