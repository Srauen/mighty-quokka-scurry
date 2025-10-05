"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setSession(currentSession);
        if (currentSession && window.location.pathname === '/login') {
          navigate('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        if (window.location.pathname.startsWith('/dashboard')) {
          navigate('/'); // Redirect to landing page after logout
          toast.info("Signed Out", { description: "You have been logged out." });
        }
      }
      setIsLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
      if (initialSession && window.location.pathname === '/login') {
        navigate('/dashboard');
      } else if (!initialSession && window.location.pathname.startsWith('/dashboard')) {
        navigate('/'); // Redirect to landing page if not authenticated and trying to access dashboard
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};