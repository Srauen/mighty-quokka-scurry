"use client";

import React from 'react';
import { LineChart } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <LineChart className="w-6 h-6 text-blue-500 dark:text-green-400" />
          <span className="text-xl font-bold">Stock OS</span>
        </div>
        <p className="mb-4">
          &copy; {new Date().getFullYear()} Stock OS. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link> {/* Assuming a privacy policy page will be added later */}
          <Link to="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
          <a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;