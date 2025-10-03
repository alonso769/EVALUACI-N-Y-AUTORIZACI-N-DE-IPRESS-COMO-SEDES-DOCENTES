import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; 

// ----------------------------------------------------------------------
// --- CONFIGURACIÓN DE RUTAS ---
// ----------------------------------------------------------------------

// 1. Función para construir la ruta simplificada (directa a /images)
const createImageUrl = (fileName: string) => {
    // La ruta absoluta desde la carpeta 'public' del proyecto.
    return `/images/${fileName}`;
};

// Rutas de tus imágenes
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

// ----------------------------------------------------------------------
// --- COMPONENTE THREE.JS ---
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
        // FOV y Aspecto
        const camera = new THREE.PerspectiveCamera(70, currentMount.clientWidth / currentMount.clientHeight, 1, 2000);
        // POSICIÓN Z ORIGINAL (más cerca)
        camera.position.z = 20; 
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // 2. Controladores de Órbita
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        // Desactivamos la rotación automática en Controls para usar la rotación manual en Animate
        controls.autoRotate = false; 

        // 3. Crear el Grupo de Imágenes (La Esfera de Fotos)
        const textureLoader = new THREE.TextureLoader(); 
        const imageGroup = new THREE.Group();
        scene.add(imageGroup);

        const numImages = 150; 
        // RADIO ORIGINAL (más pequeño)
        const radius = 10;      
        // GEOMETRÍA ORIGINAL (imágenes más pequeñas)
        const geometry = new THREE.PlaneGeometry(3, 2); 

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
        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            // Rotación manual para el efecto continuo
            imageGroup.rotation.y += 0.001; 
            controls.update(); // Necesario para damping
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
            // Limpieza de recursos
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
            // CLASES DE DISEÑO ORIGINAL: absolute inset-0 w-full h-full -z-10
            // Usamos h-screen para asegurar que ocupe todo el alto si es un fondo.
            className="absolute inset-0 w-full h-screen -z-10" 
            style={{ pointerEvents: 'none' }}
        >
        </div>
    );
};

export default ImageSphere;
