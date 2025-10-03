"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LineChart, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from 'react-router-dom';
import { useTheme } from '@/components/ThemeContext'; // Import useTheme

interface NavbarProps {
  // darkMode and setDarkMode are now handled by ThemeContext, so they are removed from props
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const { theme, setTheme } = useTheme(); // Use theme from context

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Team", href: "#team" },
    { name: "FAQ", href: "#faq" },
  ];

  const isDarkMode = theme === 'dark' || theme === 'os-style';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#hero" className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
          <LineChart className="w-7 h-7 text-blue-600 dark:text-green-400" />
          <span>Stock OS</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-green-400 transition-colors duration-200
                ${activeSection === item.href.substring(1) ? 'font-semibold text-blue-600 dark:text-green-400' : ''}`}
            >
              {item.name}
            </a>
          ))}
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode-toggle"
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <Label htmlFor="dark-mode-toggle" className="text-gray-600 dark:text-gray-300">
              {isDarkMode ? "Dark" : "Light"}
            </Label>
          </div>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode-toggle-mobile"
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <Label htmlFor="dark-mode-toggle-mobile" className="text-gray-600 dark:text-gray-300">
              {isDarkMode ? "Dark" : "Light"}
            </Label>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white dark:bg-gray-900">
              <nav className="flex flex-col gap-4 pt-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-green-400 transition-colors duration-200
                      ${activeSection === item.href.substring(1) ? 'font-semibold text-blue-600 dark:text-green-400' : ''}`}
                  >
                    {item.name}
                  </a>
                ))}
                <Link to="/login">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;