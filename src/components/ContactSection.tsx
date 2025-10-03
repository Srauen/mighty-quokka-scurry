"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactSectionProps {
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ sectionRef }) => {
  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Get in Touch
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Have questions or want to learn more? Send us a message!
        </p>
        <form className="space-y-6 text-left">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Name</Label>
            <Input id="name" type="text" placeholder="Your Name" className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
            <Input id="email" type="email" placeholder="Your Email" className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="message" className="text-gray-700 dark:text-gray-200">Message</Label>
            <Textarea id="message" placeholder="Your Message" rows={5} className="mt-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 text-lg">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;