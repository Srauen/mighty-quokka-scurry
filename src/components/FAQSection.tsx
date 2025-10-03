"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const faqs = [
  {
    question: "What is Stock OS?",
    answer: "Stock OS is an AI-powered platform designed to help you make smarter investment decisions with real-time market data, advanced analytics, and portfolio management tools."
  },
  {
    question: "How does the AI predict market trends?",
    answer: "Our AI uses a combination of machine learning algorithms, historical data analysis, and real-time news sentiment to identify potential market movements and opportunities."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we prioritize your security. All data is encrypted and protected with industry-leading security protocols to ensure your information and assets are safe."
  },
  {
    question: "Can I use Stock OS on multiple devices?",
    answer: "Absolutely! Stock OS is designed for multi-platform access, allowing you to seamlessly manage your portfolio and trade from your desktop, tablet, or mobile device."
  },
  {
    question: "What is the difference between the plans?",
    answer: "Our plans offer varying levels of features, from basic real-time data in the Free plan to custom AI models and dedicated support in the Enterprise plan. You can find a detailed comparison on our Pricing section."
  },
];

const FAQSection: React.FC<FAQSectionProps> = ({ sectionRef }) => {
  return (
    <section id="faq" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Find answers to the most common questions about Stock OS.
        </p>
        <Accordion type="single" collapsible className="w-full text-left">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-white hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;