"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { toast } from 'sonner'; // Import toast for notifications

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

interface PricingSectionProps {
  pricingPlans: PricingPlan[];
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricingPlans, sectionRef }) => {
  const handleInstallmentPayment = (planName: string) => {
    toast.info("Installment Payment Initiated", {
      description: `You've selected to pay for the ${planName} plan in installments. This would typically redirect you to a secure payment portal.`,
      duration: 5000,
    });
    // In a real application, this would trigger a backend call to initiate the payment process
    // e.g., call a Supabase Edge Function that interacts with Stripe or another payment gateway.
  };

  return (
    <section id="pricing" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Flexible Plans for Every Investor
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Choose the plan that best fits your trading style and investment goals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col justify-between p-6 shadow-lg transition-all duration-300
                ${plan.popular ? 'border-2 border-blue-600 dark:border-green-500 scale-105' : 'border border-gray-200 dark:border-gray-700'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow py-4">
                <ul className="space-y-3 text-left text-gray-700 dark:text-gray-300">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-blue-600 dark:text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6 flex flex-col gap-2">
                <Button
                  className={`w-full text-lg py-3
                    ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
                >
                  Choose Plan
                </Button>
                {plan.popular && (
                  <Button
                    variant="outline"
                    onClick={() => handleInstallmentPayment(plan.name)}
                    className="w-full text-lg py-3 border-blue-600 dark:border-green-500 text-blue-600 dark:text-green-500 hover:bg-blue-50 dark:hover:bg-gray-800"
                  >
                    Pay in Installments
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;