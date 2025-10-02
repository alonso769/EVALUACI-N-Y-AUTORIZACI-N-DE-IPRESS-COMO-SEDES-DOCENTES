import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Importante: Asegúrate de que este componente esté en tu carpeta client/components/ui/

interface Hero3DProps {
  title: string;
  subtitle: string;
  className?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

// *** IMPORTANTE: Usa la variable de entorno BASE_URL de Vite ***
// Esto es CRUCIAL para que las rutas funcionen en el subdirectorio de GitHub Pages (/EVALUACI-N-Y-AUTORIZACI-N-DE-IPRESS-COMO-SEDES-DOCENTES/)
const BASE_URL = import.meta.env.BASE_URL;

// Rutas de las imágenes. Asegúrate de que están en la carpeta 'public/images/'
// SOLUCIÓN FINAL: Usamos la extensión .jpeg (¡cuatro letras!) y el BASE_URL de Vite.
// Nota: Las mayúsculas o minúsculas del nombre del archivo deben ser EXACTAS.
const IMAGE_URLS = [
  `${BASE_URL}images/foto1.jpeg`,
  `${BASE_URL}images/foto2.jpeg`,
  `${BASE_URL}images/foto3.jpeg`,
  `${BASE_URL}images/foto4.jpeg`,
  `${BASE_URL}images/foto5.jpeg`,
  `${BASE_URL}images/foto6.jpeg`,
  `${BASE_URL}images/foto7.jpeg`,
];

// ----------------------------------------------------------------------
// --- NUEVO: ErrorBoundary para capturar fallos dentro del Canvas ---
// ----------------------------------------------------------------------

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Actualiza el estado para que el próximo renderizado muestre la UI de fallback.
    console.error("Error en componente 3D:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Detalles del Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI de fallback personalizada
      return (
        <div className="absolute inset-0 flex items-center justify-center p-8 bg-red-100/80 backdrop-blur-sm z-50 rounded-lg shadow-xl border-4 border-red-500">
          <div className="text-center text-red-700">
            <h1 className="text-2xl font-bold mb-2">🚨 Error de Carga 3D 🚨</h1>
            <p className="mb-4">No se pudo cargar la escena 3D. Esto suele ser causado por **archivos de imagen faltantes o rutas incorrectas** en la carpeta **`public/images/`**.</p>
            <p className="text-sm">Revisa la Consola (F12) para ver los errores: **ERROR DE CARGA DE TEXTURA**.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ----------------------------------------------------------------------
// --- Componente de Esfera 3D ---
// ----------------------------------------------------------------------

interface ImageSphereProps {
  urls: string[];
  radius: number;
}

const ImageSphere: React.FC<ImageSphereProps> = ({ urls, radius }) => {
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const [rotationSpeed] = useState(0.005);
  const textures = useLoader(THREE.TextureLoader, urls);

  // Mueve los planos a sus posiciones iniciales en la esfera
  const positions = useMemo(() => {
    const totalImages = urls.length;
    return textures.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / totalImages);
      const theta = Math.sqrt(totalImages * Math.PI) * phi;

      return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
    });
  }, [urls, radius, textures]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // Estilo base para los planos de imagen
  const planeSize = [1.5, 1.0]; // Ancho, Alto

  return (
    <group ref={meshRef}>
      {textures.map((texture, index) => (
        <mesh 
          key={index} 
          position={positions[index]}
          rotation={[
            positions[index].x / radius, 
            positions[index].y / radius, 
            positions[index].z / radius
          ]}
        >
          {/* PlaneGeometry crea un plano 2D */}
          <planeGeometry args={planeSize as [number, number]} />
          {/* MeshBasicMaterial usa la textura cargada */}
          <meshBasicMaterial 
            attach="material" 
            map={texture} 
            transparent={true}
            side={THREE.DoubleSide} 
          />
        </mesh>
      ))}
    </group>
  );
};


// ----------------------------------------------------------------------
// --- Componente Principal ---
// ----------------------------------------------------------------------

const Hero3D: React.FC<Hero3DProps> = ({ 
  title, 
  subtitle, 
  className = "", 
  ctaLabel = "Explorar recursos", 
  onCtaClick 
}) => {
  return (
    <div className={`relative h-screen w-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* Canvas 3D que ocupa todo el contenedor */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            {/* Suspense: Muestra un fallback mientras se cargan las texturas */}
            <Suspense fallback={null}> 
              <ImageSphere urls={IMAGE_URLS} radius={4} />
            </Suspense>

            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
            <Stars 
              radius={100} 
              depth={50} 
              count={5000} 
              factor={4} 
              saturation={0} 
              fade 
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Contenido centrado (HTML) superpuesto al Canvas */}
      <div className="relative z-10 text-center p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl max-w-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          {subtitle}
        </p>
        <button
          onClick={onCtaClick}
          className="px-8 py-3 bg-cyan-500 text-white font-semibold rounded-full shadow-lg hover:bg-cyan-600 transition duration-300 transform hover:scale-105"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default Hero3D;
