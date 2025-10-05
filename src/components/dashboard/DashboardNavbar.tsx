"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Settings, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface DashboardNavbarProps {
  userName: string;
  userAvatarUrl?: string;
}

const AnimatedTitle: React.FC = () => {
  const fullText = "Stock OS Pro";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 150); // Typing speed

      return () => clearTimeout(timeoutId);
    }
  }, [index, fullText]);

  return (
    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
      {displayedText}
      <span className="animate-pulse inline-block w-2 h-6 bg-blue-400 ml-1"></span> {/* Cursor effect */}
    </h1>
  );
};

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userName, userAvatarUrl }) => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign Out Failed", { description: error.message });
    } else {
      toast.success("Signed Out", { description: "You have been successfully signed out." });
      navigate('/');
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 text-white shadow-lg z-30">
      <div className="flex items-center space-x-4">
        <LineChart className="w-8 h-8 text-blue-400" />
        <AnimatedTitle />
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400 hidden md:block">
          {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatarUrl || "/placeholder.svg"} alt={userName} />
                <AvatarFallback>
                  <User className="h-5 w-5 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border border-gray-700 text-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-gray-400">
                  {/* User email could go here */}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings" className="flex items-center cursor-pointer hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer text-red-400 hover:bg-gray-700 hover:text-red-300">
              <User className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardNavbar;