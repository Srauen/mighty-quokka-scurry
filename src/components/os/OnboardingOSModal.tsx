"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Brain, Award } from 'lucide-react';

interface OnboardingOSModalProps {
  isOpen: boolean;
  onSelectExperience: (level: 'beginner' | 'advanced' | 'pro') => void;
}

const OnboardingOSModal: React.FC<OnboardingOSModalProps> = ({ isOpen, onSelectExperience }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader className="flex flex-col items-center text-center">
          <Rocket className="w-16 h-16 text-indigo-400 mb-4" />
          <DialogTitle className="text-3xl font-bold mb-2">Welcome to Stock OS!</DialogTitle>
          <DialogDescription className="text-lg text-gray-300">
            To tailor your experience, please select your trading level:
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-6">
          <Button
            onClick={() => onSelectExperience('beginner')}
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
          >
            <Brain className="h-5 w-5" /> <span>Beginner ($10,000)</span>
          </Button>
          <Button
            onClick={() => onSelectExperience('advanced')}
            className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
          >
            <TrendingUp className="h-5 w-5" /> <span>Advanced ($50,000)</span>
          </Button>
          <Button
            onClick={() => onSelectExperience('pro')}
            className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2"
          >
            <Award className="h-5 w-5" /> <span>Pro ($100,000)</span>
          </Button>
        </div>
        <DialogFooter className="text-center text-sm text-gray-400">
          Your selection will determine your starting cash balance.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingOSModal;