import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard"; // Import Dashboard
import Login from "./pages/Login"; // Import Login
import DashboardSettings from "./pages/DashboardSettings"; // Import DashboardSettings
import { SessionContextProvider } from "./components/SessionContextProvider"; // Import SessionContextProvider
import { ThemeProvider } from "./components/ThemeContext"; // Import ThemeProvider
import ScrollIndicator from "./components/ui/scroll-indicator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollIndicator />
        <BrowserRouter>
          <SessionContextProvider> {/* Wrap routes with SessionContextProvider */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/login" element={<Login />} /> {/* New login route */}
              <Route path="/dashboard" element={<Dashboard />} /> {/* New dashboard route */}
              <Route path="/dashboard/settings" element={<DashboardSettings />} /> {/* New dashboard settings route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionContextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;