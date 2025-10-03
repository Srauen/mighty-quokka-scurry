"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from "@/utils/toast";
import { LineChart, BarChart3, Brain, Smartphone, Shield, Zap, Users } from 'lucide-react';

// Import new modular components
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OnboardingModal from "@/components/OnboardingModal";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      Object.entries(sectionsRef.current).forEach(([section, element]) => {
        if (element && scrollPosition >= element.offsetTop && 
            scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('change', handleScroll); // Changed 'scroll' to 'change' here, this was a bug.
  }, []);

  const startOnboarding = () => {
    setOnboardingStep(1);
    showSuccess("Welcome to Stock-OS! Let's get started with your onboarding.");
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setOnboardingStep(0);
      showSuccess("Onboarding completed! You're ready to explore Stock-OS.");
    }
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: ["Basic AI insights", "Real-time stock data", "Portfolio tracking", "Email support"],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: ["Advanced AI analytics", "Technical indicators", "Multi-platform access", "Priority support"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      features: ["Custom AI models", "API access", "Dedicated account manager", "24/7 support"],
      popular: false
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Chief Trading Officer",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Marcus Johnson",
      role: "AI Research Lead",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Elena Rodriguez",
      role: "Product Design",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "David Kim",
      role: "Full Stack Developer",
      image: "/placeholder.svg?height=200&width=200"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning algorithms analyze market trends and provide actionable trading signals."
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Live market data with professional-grade charts and technical indicators."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Multi-Platform",
      description: "Access your portfolio from desktop, mobile, and tablet with seamless synchronization."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Trading",
      description: "Bank-level security with encryption and two-factor authentication for all transactions."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Portfolio Management",
      description: "Comprehensive tools to track performance, set alerts, and optimize your investment strategy."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Ultra-low latency execution with real-time order processing and instant updates."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        activeSection={activeSection} 
        startOnboarding={startOnboarding} 
      />

      <HeroSection 
        startOnboarding={startOnboarding} 
        sectionRef={(el) => sectionsRef.current.hero = el} 
      />

      <OnboardingModal 
        onboardingStep={onboardingStep} 
        nextOnboardingStep={nextOnboardingStep} 
      />

      <FeaturesSection 
        sectionRef={(el) => sectionsRef.current.features = el} 
        features={features} 
      />

      <PricingSection 
        sectionRef={(el) => sectionsRef.current.pricing = el} 
        pricingPlans={pricingPlans} 
      />

      <TeamSection 
        sectionRef={(el) => sectionsRef.current.team = el} 
        teamMembers={teamMembers} 
      />

      <ContactSection 
        sectionRef={(el) => sectionsRef.current.contact = el} 
      />

      <Footer />

      <MadeWithDyad />
    </div>
  );
};

export default Index;