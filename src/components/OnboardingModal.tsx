"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Lightbulb, TrendingUp, Wallet } from 'lucide-react';

interface OnboardingModalProps {
  onboardingStep: number;
  nextOnboardingStep: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onboardingStep, nextOnboardingStep }) => {
  const steps = [
    {
      title: "Welcome to Stock OS!",
      description: "Get ready to revolutionize your trading experience with AI-powered insights and advanced tools.",
      icon: <Lightbulb className="w-12 h-12 text-blue-600 dark:text-green-400" />,
      buttonText: "Let's Start",
    },
    {
      title: "Real-time Market Data",
      description: "Access live stock prices, charts, and indicators to stay ahead of the market.",
      icon: <TrendingUp className="w-12 h-12 text-blue-600 dark:text-green-400" />,
      buttonText: "Next",
    },
    {
      title: "AI-Powered Predictions",
      description: "Leverage our cutting-edge AI to identify potential opportunities and risks.",
      icon: <Wallet className="w-12 h-12 text-blue-600 dark:text-green-400" />,
      buttonText: "Next",
    },
    {
      title: "Manage Your Portfolio",
      description: "Track your investments, analyze performance, and make informed decisions.",
      icon: <CheckCircle className="w-12 h-12 text-blue-600 dark:text-green-400" />,
      buttonText: "Finish Onboarding",
    },
  ];

  const currentStep = steps[onboardingStep - 1];

  return (
    <Dialog open={onboardingStep > 0} onOpenChange={(open) => !open && nextOnboardingStep()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {currentStep && (
          <>
            <DialogHeader className="flex flex-col items-center text-center">
              <div className="mb-4">{currentStep.icon}</div>
              <DialogTitle className="text-3xl font-bold mb-2">{currentStep.title}</DialogTitle>
              <DialogDescription className="text-lg text-gray-600 dark:text-gray-300">
                {currentStep.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center pt-6">
              <Button
                onClick={nextOnboardingStep}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-lg px-6 py-3"
              >
                {currentStep.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;