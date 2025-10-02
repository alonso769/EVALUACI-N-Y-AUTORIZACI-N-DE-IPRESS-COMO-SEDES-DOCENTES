import React, { Suspense, useMemo, useState, useEffect } from "react";
import ImageSphere from "./ImageSphere";

// Interfaz para las propiedades (props) del componente
interface Hero3DProps {
  title: string;
  subtitle: string;
  className?: string;
  ctaLabel?: string; // Etiqueta para el botón (CTA = Call to Action)
  onClick?: () => void; // Función para manejar el clic del botón
}

// NUEVO: Componente para mostrar un mensaje de error si Three.js falla.
const ErrorFallback = () => (
    <div 
        className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-red-100/90 text-red-800 rounded-xl shadow-2xl z-10"
        style={{ backdropFilter: 'blur(3px)' }}
    >
        <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl" role="img" aria-label="Error">🛑</span>
            <h2 className="text-xl font-bold">Error de Carga 3D</h2>
        </div>
        <p className="text-center">
            No se pudo cargar la escena 3D. Esto suele ser causado por **archivos de imagen faltantes** o **rutas incorrectas** en la carpeta `public/images/`.
        </p>
        <p className="text-sm mt-3 text-red-600">
            Revisa la Consola (F12) para ver los errores de carga de textura.
        </p>
    </div>
);

// NUEVO: Límite de error (Error Boundary) para ImageSphere
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Actualiza el estado para que el próximo renderizado muestre la UI de fallback.
        console.error("Error en componente 3D (Boundary):", error);
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // También puedes registrar el error en un servicio de reporte de errores
        console.error("Detalles del Error (Boundary):", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Renderiza el componente de fallback personalizado
            return <ErrorFallback />;
        }

        return this.props.children;
    }
}


const Hero3D: React.FC<Hero3DProps> = ({ 
  title, 
  subtitle, 
  className = "", 
  ctaLabel, 
  onClick 
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* 1. Capa del Canvas de Three.js (fondo) */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
            {/* Suspense muestra un fallback si ImageSphere está esperando datos (e.g., loading) */}
            <Suspense fallback={null}> 
                <ImageSphere />
            </Suspense>
        </ErrorBoundary>
      </div>

      {/* 2. Capa del Contenido (superpuesta) */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] py-20 px-4">
        <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-2xl max-w-lg transition duration-500 ease-in-out hover:scale-[1.02]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {subtitle}
          </p>
          {ctaLabel && onClick && (
            <button
              onClick={onClick}
              className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-full shadow-lg hover:bg-teal-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero3D;