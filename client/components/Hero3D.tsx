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

// ----------------------------------------------------------------------
// --- CÓDIGO CRUCIAL DE LA RUTA CORREGIDA ---
// ----------------------------------------------------------------------

// 1. Obtener la ruta base de Vite.
// En local: BASE_URL será "/"
// En producción (GitHub Pages): BASE_URL será "/EVALUACI-N-Y-AUTORIZACI-N-DE-IPRESS-COMO-SEDES-DOCENTES/"
const VITE_BASE_URL = import.meta.env.BASE_URL;

// 2. Función para construir la ruta para Three.js
const createImageUrl = (fileName: string) => {
    // Aseguramos que la base termine con una barra, y luego concatenamos la ruta relativa.
    const base = VITE_BASE_URL.endsWith('/') ? VITE_BASE_URL : VITE_BASE_URL + '/';
    
    // La ruta final debe ser: <BASE_URL>images/<fileName>
    const finalPath = `${base}images/${fileName}`;
    
    // NOTA: No necesitamos console.log aquí, ya que el useLoader lo imprime si falla.
    return finalPath;
};

// 3. Generar las URLs finales usando la ruta base de Vite
const RAW_IMAGE_NAMES = [
    'foto1.jpeg', 
    'foto2.jpeg', 
    'foto3.jpeg', 
    'foto4.jpeg', 
    'foto5.jpeg', 
    'foto6.jpeg', 
    'foto7.jpeg', 
    'foto8.jpeg', 
];
const IMAGE_URLS = RAW_IMAGE_NAMES.map(createImageUrl);

// --- NUEVO: Error Boundary simple para capturar fallos dentro del Canvas ---
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


// Componente de la Esfera de Imágenes (ImageSphereCampus - usando R3F)
function ImageSphereCampus() {
    const groupRef = useRef<THREE.Group>(null!);
    
    // Manejamos el error de carga configurando el 'manager' del loader.
    const textures = useLoader(THREE.TextureLoader, IMAGE_URLS, (loader) => {
        if (loader.manager) {
            // Este es el error que te dirá la URL exacta que falló.
            loader.manager.onError = (url) => console.error("❌ ERROR DE CARGA DE TEXTURA:", url);
        }
    });

    // Crea los meshes de la esfera
    const meshes = useMemo(() => {
        const tempMeshes = [];
        
        const numTextures = textures.length;
        if (numTextures === 0) return [];

        const numMeshes = 150; 
        // Aumentamos el radio para que se vea grande
        const radius = 25; 
        // AUMENTAMOS EL TAMAÑO DE LOS PLANOS
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

    // Lógica de rotación de la esfera (usa useFrame de R3F)
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
        <div className="pointer-events-auto max-w-3xl rounded-2xl border bg-white/70 backdrop-blur p-6 shadow-xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-gray-900">{title}</h1>
          <p className="mt-3 text-base sm:text-lg text-gray-700">{subtitle}</p>
          {ctaLabel ? (
            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal-500 px-6 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-[1.05] hover:bg-teal-600 active:scale-[0.98]"
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
