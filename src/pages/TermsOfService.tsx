"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">Terms and Conditions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">Last Updated: October 3, 2025</p>

        <p className="mb-6 text-lg leading-relaxed">
          Welcome to Stock-OS. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
        <p className="mb-6 leading-relaxed">
          By using Stock-OS, you confirm that you have read, understood, and agree to comply with these Terms and Conditions.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. Use of Services</h2>
        <ul className="list-disc list-inside space-y-2 mb-6 leading-relaxed">
          <li>You must be at least 18 years old to use this service.</li>
          <li>You agree not to use the service for unlawful or unauthorized purposes.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. Financial Disclaimer</h2>
        <ul className="list-disc list-inside space-y-2 mb-6 leading-relaxed">
          <li>All trading data shown on Stock-OS is for educational and informational purposes only.</li>
          <li>Stock-OS does not provide financial advice. Any actions you take based on the information provided are at your own risk.</li>
          <li>Past performance does not guarantee future results.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. Intellectual Property</h2>
        <ul className="list-disc list-inside space-y-2 mb-6 leading-relaxed">
          <li>All content, trademarks, logos, and code are the property of Stock-OS or its licensors.</li>
          <li>You may not copy, modify, or distribute any part of the service without prior written permission.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Limitation of Liability</h2>
        <p className="mb-6 leading-relaxed">
          Stock-OS is not liable for any losses, damages, or claims arising from:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 leading-relaxed">
          <li>Use or inability to use the platform</li>
          <li>Errors or inaccuracies in displayed data</li>
          <li>Third-party links, services, or content</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Termination</h2>
        <p className="mb-6 leading-relaxed">
          We reserve the right to suspend or terminate your account at any time if you violate these Terms and Conditions.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Privacy</h2>
        <p className="mb-6 leading-relaxed">
          Your use of Stock-OS is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">8. Changes to Terms</h2>
        <p className="mb-6 leading-relaxed">
          We may update these Terms from time to time. Continued use of Stock-OS after updates means you accept the revised Terms.
        </p>

        <div className="mt-10 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-700 dark:text-green-400 dark:hover:text-green-500 underline text-lg">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;