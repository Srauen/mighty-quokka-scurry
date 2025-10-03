"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/utils/toast";
import { LineChart, BarChart3, Brain, Smartphone, Shield, Zap, Users, Mail, MapPin, Phone } from 'lucide-react';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const { showSuccess } = useToast();

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
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Stock-OS
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['features', 'pricing', 'team', 'contact'].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={`font-medium transition-all duration-300 ${
                    activeSection === section
                      ? 'text-blue-600 dark:text-blue-400 scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>
              <Button onClick={startOnboarding} className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={(el) => sectionsRef.current.hero = el}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
              AI-Powered Stock Trading
              <span className="block text-3xl md:text-5xl text-gray-600 dark:text-gray-300 mt-2">
                Smarter Investing Starts Here
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the future of stock trading with real-time AI insights, professional-grade analytics, 
              and seamless portfolio management across all your devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={startOnboarding}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-2"
              >
                Watch Demo
              </Button>
            </div>

            {/* Animated Chart Preview */}
            <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <span className="font-semibold">AAPL</span>
                </div>
                <div className="text-green-500 font-semibold">+2.3%</div>
              </div>
              <div className="h-40 bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-lg relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wLDIwIEM1MCw0MCAxMDAsMTAgMTUwLDMwIiBzdHJva2U9IiMwMGI0NjYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgLz48L3N2Zz4=')] bg-center bg-no-repeat bg-contain opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      {onboardingStep > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              
              {onboardingStep === 1 && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Welcome to Stock-OS!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Let us guide you through the powerful features that will transform your trading experience.
                  </p>
                </>
              )}
              
              {onboardingStep === 2 && (
                <>
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Insights</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Our advanced algorithms analyze market patterns to provide you with actionable trading signals.
                  </p>
                </>
              )}
              
              {onboardingStep === 3 && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Real-time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Access professional-grade charts and technical indicators with live market data.
                  </p>
                </>
              )}
              
              {onboardingStep === 4 && (
                <>
                  <h3 className="text-2xl font-bold mb-4">Multi-Platform Access</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Trade seamlessly across desktop, mobile, and tablet with full synchronization.
                  </p>
                </>
              )}

              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all ${
                      step === onboardingStep
                        ? 'bg-blue-600 scale-110'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextOnboardingStep}
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                {onboardingStep === 4 ? 'Get Started' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section 
        id="features" 
        ref={(el) => sectionsRef.current.features = el}
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need for successful trading, powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-500/20"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        id="pricing" 
        ref={(el) => sectionsRef.current.pricing = el}
        className="py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your trading needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {plan.price}
                    <span className="text-sm text-gray-600 dark:text-gray-300">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <div className="w-2 h-2 bg-white rounded"></div>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section 
        id="team" 
        ref={(el) => sectionsRef.current.team = el}
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the experts behind Stock-OS who are revolutionizing stock trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                      <span className="text-sm">📘</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                      <span className="text-sm">🐦</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                      <span className="text-sm">💼</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={(el) => sectionsRef.current.contact = el}
        className="py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600 dark:text-gray-300">hello@stock-os.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-600 dark:text-gray-300">123 Trading Street, Financial District, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>We'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder="First Name" required />
                    <Input placeholder="Last Name" required />
                  </div>
                  <Input type="email" placeholder="Email Address" required />
                  <Input placeholder="Subject" required />
                  <Textarea placeholder="Your Message" rows={5} required />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Stock-OS</span>
              </div>
              <p className="text-gray-400">
                AI-powered stock trading platform for modern investors.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Stock-OS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      <MadeWithDyad />
    </div>
  );
};

export default Index;