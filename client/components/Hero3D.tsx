import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei"; 
import * as THREE from "three"; 

export interface Hero3DProps {
  title: string;
  subtitle: string;
  className?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

// =========================================================================
// 📌 SOLUCIÓN FINAL DE RUTA DE ASSETS PARA VITE/GITHUB PAGES: 
// Utilizamos import.meta.env.BASE_URL para construir la ruta base.
// Esto garantiza que Three.js apunte correctamente al subdirectorio del repositorio.
// =========================================================================
const IMAGE_FILES = [
    'foto1.jpeg', 
    'foto2.jpeg', 
    'foto3.jpeg', 
    'foto4.jpeg', 
    'foto5.jpeg', 
    'foto6.jpeg', 
    'foto7.jpeg', 
];

// Mapeamos los nombres de archivo a URLs completas, usando la variable de entorno BASE_URL 
// que Vite establece según la configuración 'base' (que en tu caso es '').
// Esto resulta en rutas como: "images/foto1.jpeg" (cuando 'base' es '').
const IMAGE_URLS = IMAGE_FILES.map(
    file => `${import.meta.env.BASE_URL}images/${file}`
);

// --- NUEVO: Error Boundary simple para capturar fallos dentro del Canvas ---
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
            // UI de fallback en caso de error de carga
            return (
                <Html center>
                    <div className="text-white text-lg font-semibold bg-red-700/80 p-6 rounded-lg shadow-xl max-w-sm">
                        🚨 Error de Carga 3D 🚨
                        <p className="mt-2 text-sm font-normal">No se pudo cargar la escena 3D. Esto suele ser causado por **archivos de imagen faltantes o rutas incorrectas** en la carpeta `public/images/`.</p>
                        <p className="mt-2 text-sm font-normal">Revisa la Consola (F12) para ver los errores `❌ ERROR DE CARGA DE TEXTURA`.</p>
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}
// --- FIN Error Boundary ---


// Componente de la Esfera de Imágenes
function ImageSphereCampus() {
    const groupRef = useRef<THREE.Group>(null!);
    
    // Manejamos el error de carga configurando el 'manager' del loader.
    const textures = useLoader(THREE.TextureLoader, IMAGE_URLS, (loader) => {
        if (loader.manager) {
            loader.manager.onError = (url) => console.error("❌ ERROR DE CARGA DE TEXTURA:", url);
        }
    });

    // Crea los meshes de la esfera
    const meshes = useMemo(() => {
        const tempMeshes = [];
        
        const numTextures = textures.length;
        if (numTextures === 0) return [];

        const numMeshes = 150; 
        const radius = 25; 
        // AUMENTAMOS EL TAMAÑO DE LOS PLANOS: de (3, 2) a (5, 3)
        const geometry = new THREE.PlaneGeometry(5, 3); 

        for (let i = 0; i < numMeshes; i++) {
            const texture = textures[i % numTextures]; 
            
            const material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                side: THREE.DoubleSide, 
                transparent: false,
                color: 0xffffff 
            }); 
            const mesh = new THREE.Mesh(geometry, material);

            // Cálculo de Posición Esférica
            const phi = Math.acos(1 - (2 * i) / numMeshes); 
            const theta = Math.sqrt(numMeshes * Math.PI) * phi; 

            mesh.position.setFromSphericalCoords(radius, phi, theta);
            mesh.lookAt(new THREE.Vector3(0, 0, 0)); 
            
            tempMeshes.push(mesh);
        }
        return tempMeshes;
    }, [textures]);

    // Lógica de rotación de la esfera
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1; 
        }
    });

    return (
        <group ref={groupRef}>
            {meshes.map((mesh, index) => (
                <primitive key={index} object={mesh} />
            ))}
        </group>
    );
}

// Componente de Fallback visible mientras carga la escena 3D
function LoadingFallback() {
    return (
        <Html center>
            <div className="text-gray-900 text-lg font-semibold bg-white/70 p-4 rounded-lg shadow-xl">
                Cargando imágenes 3D... (Si esto no desaparece, revisa la Consola F12 por errores de ruta)
            </div>
        </Html>
    );
}

// Componente principal Hero3D
export default function Hero3D({ title, subtitle, className, ctaLabel, onCtaClick }: Hero3DProps) {
  return (
    <section className={("relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-sky-100 ") + (className ?? "")}>
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <Suspense fallback={<LoadingFallback />}> 
            {/* Luces y Fondo */}
            <ambientLight intensity={0.8} /> 
            <pointLight position={[10, 10, 10]} intensity={0.5} />
          <Stars radius={100} depth={80} count={2000} factor={4} fade speed={0.5} />
          
            {/* ESCENA 3D: ESFERA DE IMÁGENES DENTRO DEL LÍMITE DE ERROR */}
            <ErrorBoundary>
            <ImageSphereCampus /> 
            </ErrorBoundary>
            
          {/* Controles */}
          <OrbitControls 
                enablePan={false} 
                maxPolarAngle={Math.PI} 
                minDistance={15} 
                maxDistance={80} 
                autoRotate={true} 
                autoRotateSpeed={0.5}
            />
        </Suspense>
      </Canvas>
      
        {/* CONTENEDOR DE TEXTO SUPERPUESTO (UI) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
        <div className="pointer-events-auto max-w-3xl rounded-2xl border bg-background/70 p-6 backdrop-blur">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">{subtitle}</p>
          {ctaLabel ? (
            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-primary-foreground shadow-lg shadow-black/10 transition-transform duration-300 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
              >
                {ctaLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}