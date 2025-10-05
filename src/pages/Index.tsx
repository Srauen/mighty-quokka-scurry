"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection"; // Import new ContactSection
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";
import OSDesktop from "@/components/os/OSDesktop"; // Keep for demo
import { LineChart, BarChart3, Brain, Smartphone, Shield, Zap } from 'lucide-react';
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

    const sections = [heroRef, featuresRef, pricingRef, faqRef, contactRef]; // Include contactRef
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
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "AI-Powered Insights",
      description: "Leverage advanced AI algorithms to predict market trends and identify profitable opportunities."
    },
    {
      icon: <LineChart className="w-6 h-6 text-white" />,
      title: "Real-time Analytics",
      description: "Access professional-grade charts, indicators, and live market data for informed decisions."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Portfolio Management",
      description: "Track, analyze, and optimize your investments with intuitive tools and performance reports."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-white" />,
      title: "Multi-Platform Access",
      description: "Seamlessly trade and monitor your portfolio across desktop, tablet, and mobile devices."
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Secure Trading",
      description: "Your data and assets are protected with industry-leading security protocols and encryption."
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Blazing Fast Execution",
      description: "Execute trades with minimal latency, ensuring you never miss a critical market move."
    },
  ];

  const pricingPlans = [
    {
      name: "Basic Trader",
      price: "Free",
      period: "",
      features: [
        "Real-time market data",
        "Basic AI insights",
        "Standard charting tools",
        "Email support"
      ],
      popular: false,
    },
    {
      name: "Pro Investor",
      price: "$25",
      period: "/month",
      features: [
        "Advanced AI predictions",
        "Premium charting tools",
        "Portfolio optimization",
        "Priority email & chat support",
        "Multi-device sync",
        "Flexible installment payments available"
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      features: [
        "Custom AI models",
        "Dedicated account manager",
        "API access",
        "24/7 phone support",
        "White-label solutions"
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