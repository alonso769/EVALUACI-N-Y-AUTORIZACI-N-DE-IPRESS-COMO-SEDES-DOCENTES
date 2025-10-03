import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Importamos HashRouter para la compatibilidad con GitHub Pages
import { HashRouter, Routes, Route, Link, useNavigate } from "react-router-dom"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Hospital from "./pages/Hospital";

const queryClient = new QueryClient();

// Componente Header (Barra de navegación)
const Header = () => {
    const navigate = useNavigate();

    // Función que navega a la página principal y luego hace scroll al ID 'recursos'
    const handleScrollToRecursos = (e: React.MouseEvent) => {
        // Evitar que el Link navegue por sí mismo, ya que lo haremos con navigate()
        e.preventDefault(); 
        
        // 1. Navegar a la página principal
        navigate('/');

        // 2. Esperar un poco para que la página principal (Index) se cargue completamente
        // y luego hacer scroll al elemento.
        setTimeout(() => {
            const recursosElement = document.getElementById('recursos');
            if (recursosElement) {
                // Hacemos scroll suave a la parte superior del elemento
                recursosElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.error("No se encontró el elemento con id='recursos' en la página.");
            }
        }, 100); // 100ms es suficiente para que React renderice la página
    };

    return (
  <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-bold">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">＋</span>
        <span>AUTOEVALUACION COMO SEDE DOCENTE - CONAPRES</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {/* Enlace de Inicio: Mantiene el Link de React Router y añade scroll al top al hacer click */}
        <Link to="/"  className="text-muted-foreground hover:text-foreground">Elaborado por Alonso Sixto Silva Vidal - Contacto: siroonatech@gmail.com.</Link>
        
        
      </nav>
    </div>
  </header>
    );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Usamos HashRouter para asegurar que el enrutamiento funcione sin servidor dedicado */}
      <HashRouter>
        <Header />
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