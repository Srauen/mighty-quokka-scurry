"use client";

import React, { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OSNotificationProps {
  id: string;
  title: string;
  message: string;
  icon?: React.ReactNode;
  onDismiss: (id: string) => void;
  duration?: number; // in milliseconds, default 5000
}

const OSNotification: React.FC<OSNotificationProps> = ({
  id,
  title,
  message,
  icon,
  onDismiss,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Allow time for fade-out animation before removing from DOM
      setTimeout(() => onDismiss(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 flex items-start space-x-3 transition-all duration-300 ease-out z-[1000]",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex-shrink-0 mt-0.5">
        {icon || <Bell className="h-5 w-5 text-electric-blue" />}
      </div>
      <div className="flex-grow">
        <h4 className="text-sm font-semibold text-soft-white">{title}</h4>
        <p className="text-xs text-gray-300 mt-1">{message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-white"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OSNotification;