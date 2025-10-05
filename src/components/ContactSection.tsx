"use client";

import React from 'react';
import ContactForm from './ContactForm';

interface ContactSectionProps {
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ sectionRef }) => {
  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Get in Touch
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Have questions, feedback, or need support? Send us a message!
        </p>
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactSection;