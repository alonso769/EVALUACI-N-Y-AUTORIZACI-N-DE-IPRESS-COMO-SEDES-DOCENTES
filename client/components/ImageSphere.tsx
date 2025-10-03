import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; 

// ----------------------------------------------------------------------
// --- CÓDIGO CRUCIAL DE LA RUTA SIMPLIFICADA ---
// ----------------------------------------------------------------------

// 1. Obtener la ruta base de Vite.
// En local: BASE_URL será "/"
// En producción (GitHub Pages): BASE_URL será "/EVALUACI-N-Y-AUTORIZACI-N-DE-IPRESS-COMO-SEDES-DOCENTES/"
const VITE_BASE_URL = import.meta.env.BASE_URL;

// 2. Función para construir la ruta
const createImageUrl = (fileName: string) => {
    // 3. Eliminamos la barra inicial del BASE_URL si existe, y luego lo concatenamos con la ruta relativa.
    // Three.js Loader es inteligente y maneja las rutas relativas o absolutas.
    const base = VITE_BASE_URL.endsWith('/') ? VITE_BASE_URL : VITE_BASE_URL + '/';
    
    // La ruta final debe ser: <BASE_URL>images/<fileName>
    const finalPath = `${base}images/${fileName}`;

    console.log(`[Three.js Loader] Intentando cargar: ${finalPath}`);
    
    return finalPath;
};


const RAW_IMAGE_NAMES = [
    'foto1.jpeg', 
    'foto2.jpeg', 
    'foto3.jpeg', 
    'foto4.jpeg', 
    'foto5.jpeg', 
    'foto6.jpeg', 
    'foto7.jpeg', 
];

// Genera las URLs usando la ruta base de Vite
const IMAGE_URLS = RAW_IMAGE_NAMES.map(createImageUrl);


const ImageSphere = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const highlightIntervalId = useRef<number | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        
        // 1. Configuración de la Escena, Cámara y Renderizador
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, currentMount.clientWidth / currentMount.clientHeight, 1, 2000);
        camera.position.z = 20;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // 2. Controladores de Órbita
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.autoRotate = false;

        // 3. Crear el Grupo de Imágenes (La Esfera de Fotos)
        const textureLoader = new THREE.TextureLoader(); 
        const imageGroup = new THREE.Group();
        scene.add(imageGroup);

        const numImages = 150; 
        const radius = 10;      
        const geometry = new THREE.PlaneGeometry(3, 2); 

        for (let i = 0; i < numImages; i++) {
            const imageUrl = IMAGE_URLS[i % IMAGE_URLS.length];
            
            const texture = textureLoader.load(imageUrl, 
                // Éxito
                () => {},
                // Progreso
                undefined,
                // Error (Ahora te debe mostrar la ruta correcta en la consola)
                (error) => {
                    console.error('Error al cargar la textura de Three.js. Revisa la ruta de la imagen:', imageUrl, error);
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
        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            imageGroup.rotation.y += 0.001; 
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // 6. Manejo de Redimensionamiento de Ventana
        const handleResize = () => {
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
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
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
        };
    }, []); 

    return (
        <div 
            ref={mountRef} 
            className="w-full h-96 relative"
            style={{ minHeight: '400px', pointerEvents: 'none' }}
        >
        </div>
    );
};

export default ImageSphere;
