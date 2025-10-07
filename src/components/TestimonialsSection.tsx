"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

interface TestimonialsSectionProps {
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const testimonials: Testimonial[] = [
  {
    quote: "Stock OS has revolutionized my daily trading routine. The AI insights are incredibly accurate and the integrated platform saves me so much time.",
    author: "Jane Doe",
    title: "Experienced Trader"
  },
  {
    quote: "As a student, learning about the stock market can be overwhelming. Stock OS provides a risk-free, intuitive environment that makes complex concepts easy to grasp.",
    author: "John Smith",
    title: "Finance Student"
  },
  {
    quote: "Our fintech startup needed a robust, customizable trading solution. Stock OS delivered beyond expectations, offering seamless integration and powerful analytics.",
    author: "Sarah Chen",
    title: "Fintech Founder"
  },
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ sectionRef }) => {
  return (
    <section id="testimonials" ref={sectionRef} className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          What Our Users Say
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Hear from traders, students, and professionals who are transforming their experience with Stock OS.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Quote className="w-10 h-10 text-blue-600 dark:text-green-500 mb-4" />
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold text-gray-900 dark:text-white text-md">{testimonial.author}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;