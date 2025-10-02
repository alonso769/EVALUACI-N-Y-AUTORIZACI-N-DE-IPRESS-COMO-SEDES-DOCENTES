import React, { useEffect, useRef } from "react";
// ✅ IMPORTACIONES CORREGIDAS ✅
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; 

// ----------------------------------------------------------------------
// --- CÓDIGO CRUCIAL DE LA RUTA CORREGIDA PARA VITE/GITHUB PAGES ---
// ----------------------------------------------------------------------

// 1. Obtener la ruta base de Vite.
const VITE_BASE_URL = import.meta.env.BASE_URL;

// 2. Función para construir la ruta
const createImageUrl = (fileName: string) => {
    // Aseguramos que la base termine con una barra, y luego concatenamos la ruta relativa.
    const base = VITE_BASE_URL.endsWith('/') ? VITE_BASE_URL : VITE_BASE_URL + '/';
    const finalPath = `${base}images/${fileName}`;
    return finalPath;
};

// Rutas de tus imágenes, ahora generadas dinámicamente:
const RAW_IMAGE_NAMES = [
    'foto1.jpeg', 
    'foto2.jpeg', 
    'foto3.jpeg', 
    'foto4.jpeg', 
    'foto5.jpeg', 
    'foto6.jpeg', 
    'foto7.jpeg', 
];

const IMAGE_URLS = RAW_IMAGE_NAMES.map(createImageUrl);

// --- FIN CÓDIGO CRUCIAL DE LA RUTA CORREGIDA ---
// ----------------------------------------------------------------------

const ImageSphere = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const highlightIntervalId = useRef<number | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        
        // 1. Configuración de la Escena, Cámara y Renderizador
        const scene = new THREE.Scene();
        // Aumentamos el FOV a 75 para un poco más de perspectiva
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 1, 2000);
        // Aumentamos la posición de la cámara para que la esfera sea más visible
        camera.position.z = 30; 
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // 2. Controladores de Órbita
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.autoRotate = true; // Dejamos la rotación automática para que se mueva sola
        controls.autoRotateSpeed = 0.5;

        // 3. Crear el Grupo de Imágenes (La Esfera de Fotos)
        const textureLoader = new THREE.TextureLoader(); 
        const imageGroup = new THREE.Group();
        scene.add(imageGroup);

        const numImages = 150; 
        // Aumentamos el radio para que la esfera se vea más grande
        const radius = 25;      
        // Aumentamos el tamaño de los planos para que las imágenes sean más grandes
        const geometry = new THREE.PlaneGeometry(5, 3); 

        for (let i = 0; i < numImages; i++) {
            const imageUrl = IMAGE_URLS[i % IMAGE_URLS.length];
            
            const texture = textureLoader.load(imageUrl, 
                () => {},
                undefined,
                (error) => {
                    console.error('Error al cargar la textura de Three.js. Ruta final fallida:', imageUrl, error);
                }
            );
            
            const material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.9 
            });
            const mesh = new THREE.Mesh(geometry, material);

            // Cálculo de Posición Esférica
            const phi = Math.acos(1 - (2 * i) / numImages); 
            const theta = Math.sqrt(numImages * Math.PI) * phi; 

            mesh.position.setFromSphericalCoords(radius, phi, theta);
            mesh.lookAt(new THREE.Vector3(0, 0, 0)); 

            imageGroup.add(mesh);
        }

        // 4. Lógica de Resaltado (Cada 5 segundos)
        let currentHighlightedMesh: THREE.Mesh | null = null;
        let originalScale = new THREE.Vector3();

        highlightIntervalId.current = window.setInterval(() => {
            if (currentHighlightedMesh) {
                currentHighlightedMesh.scale.copy(originalScale);
                currentHighlightedMesh = null;
            }

            const randomIndex = Math.floor(Math.random() * imageGroup.children.length);
            currentHighlightedMesh = imageGroup.children[randomIndex] as THREE.Mesh;

            originalScale.copy(currentHighlightedMesh.scale);
            currentHighlightedMesh.scale.multiplyScalar(1.5);
            
        }, 5000); 

        // 5. Bucle de Animación
        // Eliminamos la rotación aquí ya que controls.autoRotate está activo
        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            controls.update(); // Necesario para autoRotate y damping
            renderer.render(scene, camera);
        };

        animate();

        // 6. Manejo de Redimensionamiento de Ventana
        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // 7. Limpieza al desmontar
        return () => {
            cancelAnimationFrame(animationFrameId.current!);
            clearInterval(highlightIntervalId.current!);
            window.removeEventListener('resize', handleResize);
            // Limpieza de recursos para evitar "Context Lost"
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });

            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []); 

    return (
        <div 
            ref={mountRef} 
            // Esto asegura que el Canvas ocupe todo el espacio disponible
            className="absolute inset-0 w-full h-full" 
            style={{ pointerEvents: 'none' }}
        >
        </div>
    );
};

export default ImageSphere
