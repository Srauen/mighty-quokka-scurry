"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";
import { LineChart, BarChart3, Brain, Smartphone, Shield, Zap } from 'lucide-react';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  const heroRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const pricingRef = useRef<HTMLElement | null>(null);
  const teamRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Adjust as needed
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = [heroRef, featuresRef, pricingRef, teamRef, contactRef];
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
  }, []);

  const startOnboarding = () => {
    setOnboardingStep(1);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setOnboardingStep(0); // Close modal
    }
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
      price: "$29",
      period: "/month",
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
      price: "$79",
      period: "/month",
      features: [
        "Advanced AI predictions",
        "Premium charting tools",
        "Portfolio optimization",
        "Priority email & chat support",
        "Multi-device sync"
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

  const teamMembers = [
    {
      name: "Alice Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg",
    },
    {
      name: "Bob Williams",
      role: "Lead AI Engineer",
      image: "/placeholder.svg",
    },
    {
      name: "Charlie Brown",
      role: "Head of Product",
      image: "/placeholder.svg",
    },
    {
      name: "Diana Miller",
      role: "Chief Market Strategist",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        startOnboarding={startOnboarding}
      />
      <main className="flex-grow">
        <HeroSection sectionRef={heroRef} startOnboarding={startOnboarding} />
        <FeaturesSection sectionRef={featuresRef} features={features} />
        <PricingSection sectionRef={pricingRef} pricingPlans={pricingPlans} />
        <TeamSection sectionRef={teamRef} teamMembers={teamMembers} />
        <ContactSection sectionRef={contactRef} />
      </main>
      <Footer />
      <OnboardingModal
        onboardingStep={onboardingStep}
        nextOnboardingStep={nextOnboardingStep}
      />
    </div>
  );
};

export default Index;