
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Theme provider
import { ThemeProvider } from "./lib/themes/ThemeContext";

// Pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import Templates from "./pages/Templates";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a client inside the component function
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton theme="system" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
