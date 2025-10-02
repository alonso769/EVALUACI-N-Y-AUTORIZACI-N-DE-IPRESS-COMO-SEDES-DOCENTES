// vite.config.ts
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // *** CORRECCIÓN CRUCIAL PARA LA CARGA DE ASSETS (IMÁGENES) ***
  // Usamos la ruta completa del repositorio TERMINADA en barra diagonal.
  // Esto asegura que Three.js sepa dónde buscar la carpeta 'images' de 'public'.
  base: '/EVALUACI-N-Y-AUTORIZACI-N-DE-IPRESS-COMO-SEDES-DOCENTES/', 
  // ----------------------------------------------------------------------
  server: {
    host: "::",
    port: 8080,
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    // Es CRUCIAL que esto coincida con la carpeta servida en GH Pages
    outDir: "docs", 
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", 
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}