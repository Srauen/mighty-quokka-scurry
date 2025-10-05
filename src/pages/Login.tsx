"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';
import { toast } from 'sonner'; // Import toast for notifications

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/dashboard');
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-mono">
        <p>Loading authentication...</p>
      </div>
    );
  }

  const handleAuthEvent = (event: string) => {
    if (event === 'SIGNED_IN') {
      toast.success("Signed In", { description: "Welcome back to Stock OS!" });
    } else if (event === 'SIGNED_UP') {
      toast.info("Verification Email Sent", { description: "Please check your email to verify your account." });
    } else if (event === 'PASSWORD_RECOVERY') {
      toast.info("Password Reset Email Sent", { description: "Check your email for instructions to reset your password." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4 font-mono">
      <Card className="w-full max-w-md bg-gray-900 border border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <LineChart className="w-8 h-8 text-green-400" />
            <CardTitle className="text-3xl font-bold text-green-400">Stock OS</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Sign in to your account to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(142.1 76.2% 36.3%)', // Green-ish for brand
                    brandAccent: 'hsl(142.1 76.2% 46.3%)', // Lighter green
                    inputBackground: 'hsl(222.2 84% 4.9%)', // Dark background
                    inputBorder: 'hsl(217.2 32.6% 17.5%)', // Darker border
                    inputLabelText: 'hsl(210 40% 98%)', // Light text
                    inputText: 'hsl(210 40% 98%)', // Light text
                    defaultButtonBackground: 'hsl(217.2 32.6% 17.5%)', // Dark button
                    defaultButtonBackgroundHover: 'hsl(217.2 32.6% 25%)', // Darker button hover
                    defaultButtonBorder: 'hsl(217.2 32.6% 17.5%)',
                    defaultButtonText: 'hsl(210 40% 98%)',
                    dividerBackground: 'hsl(217.2 32.6% 17.5%)',
                    anchorTextColor: 'hsl(142.1 76.2% 36.3%)',
                    anchorTextHoverColor: 'hsl(142.1 76.2% 46.3%)',
                  },
                },
              },
            }}
            theme="dark"
            providers={[]} // No third-party providers for now
            redirectTo={window.location.origin + '/dashboard'}
            onAuthStateChange={(event) => handleAuthEvent(event)} // Add this handler
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;