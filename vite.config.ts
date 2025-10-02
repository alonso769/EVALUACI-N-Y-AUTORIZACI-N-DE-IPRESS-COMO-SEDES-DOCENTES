import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// NOTA: Se asume que 'createServer' y el servidor Express solo se usan en desarrollo y no afectan el build final.
import { createServer } from "./server"; 

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // *** CORRECCIÓN CRUCIAL PARA LA CARGA DE ASSETS (IMÁGENES) ***
  // Usamos la cadena vacía ('') para que import.meta.env.BASE_URL se resuelva 
  // correctamente en el subdirectorio de GitHub Pages (la carpeta /docs).
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
    // CRUCIAL: outDir 'docs' es necesario si GitHub Pages está configurado
    // para servir el sitio desde la carpeta /docs.
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
      // Si usas Express, la lógica iría aquí. Dejamos el esqueleto.
      // const app = createServer(); 
      // server.middlewares.use(app);
    },
  };
}
