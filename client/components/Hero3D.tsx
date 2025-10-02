import React, { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Define la interfaz de las propiedades del componente
interface Hero3DProps {
  title: string;
  subtitle: string;
  className?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

// ----------------------------------------------------------------------
// --- CÓDIGO CRUCIAL DE LA RUTA ---
// ----------------------------------------------------------------------

// 1. Obtener la ruta base de Vite.
const VITE_BASE_URL = import.meta.env.BASE_URL;

// 2. Nombre del repositorio para fallbacks (GitHub Pages)
// ESTO ES CLAVE: DEBE COINCIDIR EXACTAMENTE CON EL NOMBRE DE TU REPOSITORIO
const REPO_NAME = 'EVALUACI-N-Y-AUTORIZACI-N-DE-IPRESS-COMO-SEDES-DOCENTES';

// 3. Función para limpiar y construir la ruta correctamente
const cleanPath = (path: string) => path.replace(/\/\//g, '/').replace(/^\/|\/$/g, '');

const createImageUrl = (fileName: string) => {
  let base = cleanPath(VITE_BASE_URL);

  // Si la ruta base está vacía ('') o es solo '/', usamos el nombre del repositorio.
  if (base === '' || base === '/') {
      base = REPO_NAME;
  }
  
  // Construimos la ruta: /nombre-repo/images/foto.jpeg
  const finalPath = `/${base}/images/${fileName}`;

  console.log(`Intentando cargar: ${finalPath}`);
  
  return finalPath;
};

// Rutas de las imágenes (usando .jpeg y creando la ruta con el repositorio)
const IMAGE_URLS = [
  'foto1.jpeg',
  'foto2.jpeg',
  'foto3.jpeg',
  'foto4.jpeg',
  'foto5.jpeg',
  'foto6.jpeg',
  'foto7.jpeg',
].map(createImageUrl);


// ----------------------------------------------------------------------
// --- ErrorBoundary para capturar fallos dentro del Canvas ---
// ----------------------------------------------------------------------

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error("Error en componente 3D:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Detalles del Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center p-8 bg-red-100/80 backdrop-blur-sm z-50 rounded-2xl shadow-2xl border-4 border-red-500">
          <div className="text-center text-red-700">
            <h1 className="text-2xl font-bold mb-2">🚨 Error de Carga 3D 🚨</h1>
            <p className="mb-4 font-semibold">No se pudo cargar la escena 3D.</p>
            <p className="text-sm">Esto es el 404. La ruta buscada por el navegador NO existe. Revisa la Consola (F12) para ver **qué ruta** está buscando.</p>
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
  const groupRef = useRef<THREE.Group>(null!);
  const [rotationSpeed] = useState(0.005);
  
  // useLoader es donde ocurre el intento de fetch y el error 404
  const textures = useLoader(THREE.TextureLoader, urls);

  // Mueve los planos a sus posiciones iniciales en la esfera
  const positions = useMemo(() => {
    const totalImages = urls.length;
    return textures.map((_, index) => {
      // Distribución esférica usando espiral de Fibonacci
      const phi = Math.acos(-1 + (2 * index) / totalImages);
      const theta = Math.sqrt(totalImages * Math.PI) * phi;

      const position = new THREE.Vector3().setFromSphericalCoords(
        radius, 
        phi, 
        theta
      );
      return position;
    });
  }, [urls, radius, textures]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  const planeSize = [1.5, 1.0]; 

  return (
    <group ref={groupRef}>
      {textures.map((texture, index) => (
        <mesh 
          key={index} 
          position={positions[index]}
        >
          <ambientLight position={positions[index]} intensity={1} />
          
          <planeGeometry args={planeSize as [number, number]} />
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
// --- Componente Principal Hero3D ---
// ----------------------------------------------------------------------

const Hero3D: React.FC<Hero3DProps> = ({ 
  title, 
  subtitle, 
  className = "", 
  ctaLabel = "Explorar recursos", 
  onCtaClick 
}) => {
  return (
    <div className={`relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900 ${className}`}>
      {/* Canvas 3D que ocupa todo el contenedor */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            
            {/* Suspense: Muestra un fallback mientras se cargan las texturas */}
            <Suspense fallback={<Html center className='text-white'>Cargando imágenes 3D...</Html>}> 
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
              saturation={0.5} 
              fade 
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Contenido centrado (HTML) superpuesto al Canvas */}
      <div className="relative z-10 text-center p-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md border border-gray-100">
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