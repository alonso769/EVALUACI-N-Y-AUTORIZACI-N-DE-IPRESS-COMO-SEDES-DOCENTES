import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Hospital from "./pages/Hospital";

const queryClient = new QueryClient();

const Header = () => (
  <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-bold">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">＋</span>
        <span>Hospital 3D</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground">Inicio</Link>
        <Link to="/hospital" className="text-muted-foreground hover:text-foreground">Hospital</Link>
      </nav>
    </div>
  </header>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hospital" element={<Hospital />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
