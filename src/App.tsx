import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import NetworkStatusBar from "@/components/NetworkStatusBar";

import Index from "./pages/Index.tsx";
import InspectionPage from "./pages/InspectionPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import AdminGate from "./components/AdminGate";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <>
      <NetworkStatusBar />
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/inspecao/:id" element={<InspectionPage />} />
        <Route path="/admin" element={<AdminGate><Admin /></AdminGate>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
