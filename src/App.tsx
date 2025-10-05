import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardSettings from "./pages/DashboardSettings";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WatchlistPage from "./pages/WatchlistPage"; // Import new page
import AIInsightsPage from "./pages/AIInsightsPage"; // Import new page
import AlertsPage from "./pages/AlertsPage"; // Import new page
import HeatmapPage from "./pages/HeatmapPage"; // Import new page
import OSConnectPage from "./pages/OSConnectPage"; // Import new page
import { ThemeProvider } from "./components/ThemeContext";
import { SessionContextProvider } from "./components/SessionContextProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              <Route path="/dashboard/watchlist" element={<WatchlistPage />} /> {/* New route */}
              <Route path="/dashboard/ai-insights" element={<AIInsightsPage />} /> {/* New route */}
              <Route path="/dashboard/alerts" element={<AlertsPage />} /> {/* New route */}
              <Route path="/dashboard/heatmap" element={<HeatmapPage />} /> {/* New route */}
              <Route path="/dashboard/os-connect" element={<OSConnectPage />} /> {/* New route */}
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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