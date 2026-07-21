import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Importamos HashRouter para la compatibilidad con GitHub Pages
import { HashRouter, Routes, Route } from "react-router-dom"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Hospital from "./pages/Hospital";

const queryClient = new QueryClient();

// HE ELIMINADO EL COMPONENTE HEADER AQUÍ PARA QUE NO OCUPE ESPACIO

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Usamos HashRouter para asegurar que el enrutamiento funcione sin servidor dedicado */}
      <HashRouter>
        
        {/* AQUÍ ANTES ESTABA <Header />. LO QUITAMOS PARA QUE DESAPAREZCA LA BARRA BLANCA */}
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hospital" element={<Hospital />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);