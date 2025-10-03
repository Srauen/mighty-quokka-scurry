"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider'; // Assuming this will be created next

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      navigate('/dashboard'); // Redirect to dashboard if already logged in
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Sign In to Stock OS</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(222.2 47.4% 11.2%)', // Primary color from your theme
                  brandAccent: 'hsl(217.2 91.2% 59.8%)', // Accent color
                  inputBackground: 'hsl(214.3 31.8% 91.4%)',
                  inputBorder: 'hsl(214.3 31.8% 91.4%)',
                  inputBorderHover: 'hsl(217.2 91.2% 59.8%)',
                  inputBorderFocus: 'hsl(217.2 91.2% 59.8%)',
                  inputText: 'hsl(222.2 47.4% 11.2%)',
                },
              },
              dark: {
                colors: {
                  brand: 'hsl(210 40% 98%)',
                  brandAccent: 'hsl(217.2 91.2% 59.8%)',
                  inputBackground: 'hsl(217.2 32.6% 17.5%)',
                  inputBorder: 'hsl(217.2 32.6% 17.5%)',
                  inputBorderHover: 'hsl(217.2 91.2% 59.8%)',
                  inputBorderFocus: 'hsl(217.2 91.2% 59.8%)',
                  inputText: 'hsl(210 40% 98%)',
                },
              },
            },
          }}
          theme="dark" // Using dark theme by default, can be adjusted
          providers={[]} // No third-party providers for now
          redirectTo={window.location.origin + '/dashboard'}
        />
      </div>
    </div>
  );
};

export default Login;