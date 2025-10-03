"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';

interface OnboardingModalProps {
  onboardingStep: number;
  nextOnboardingStep: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onboardingStep, nextOnboardingStep }) => {
  const stepsContent = [
    {
      title: "Welcome to Stock-OS!",
      description: "Let us guide you through the powerful features that will transform your trading experience."
    },
    {
      title: "AI-Powered Insights",
      description: "Our advanced algorithms analyze market patterns to provide you with actionable trading signals."
    },
    {
      title: "Real-time Analytics",
      description: "Access professional-grade charts and technical indicators with live market data."
    },
    {
      title: "Multi-Platform Access",
      description: "Trade seamlessly across desktop, mobile, and tablet with full synchronization."
    }
  ];

  if (onboardingStep === 0) return null;

  const currentStep = stepsContent[onboardingStep - 1];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4">{currentStep.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {currentStep.description}
          </p>

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
  );
};

export default OnboardingModal;