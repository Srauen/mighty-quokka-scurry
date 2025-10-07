"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, sectionRef }) => {
  return (
    <section id="features" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Powerful Features for Smart Investors
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Unlock your full trading potential with our comprehensive suite of tools and intelligent insights, designed to streamline your workflow and enhance decision-making.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
              <CardHeader className="flex flex-col items-center justify-center p-6">
                <div className="bg-blue-600 dark:bg-green-500 p-3 rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;