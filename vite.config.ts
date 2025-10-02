import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// Nota: El plugin 'expressPlugin' asume que tienes un archivo './server.ts' para el desarrollo.

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // *** CORRECCIÓN CRUCIAL PARA LA CARGA DE ASSETS (IMÁGENES) ***
  // Usamos la cadena vacía ('') para que los assets cargados dinámicamente
  // (como en Hero3D.tsx con import.meta.env.BASE_URL) se resuelvan correctamente
  // desde el subdirectorio de GH Pages (la carpeta /docs).
  base: '', 
  // ----------------------------------------------------------------------
  server: {
    host: "::",
    port: 8080,
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    // CRUCIAL: Mantenemos outDir como 'docs' para GitHub Pages
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
      // Nota: Necesitas la función createServer() definida en tu entorno.
      // Si esto no se usa, puedes quitar esta función y el plugin.
      // const app = createServer(); 
      // server.middlewares.use(app);
    },
  };
}