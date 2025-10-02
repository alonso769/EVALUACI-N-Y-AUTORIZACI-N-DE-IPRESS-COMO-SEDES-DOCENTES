import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // *** SOLUCIÓN CLAVE para GitHub Pages: base: './' usa rutas relativas ***
  base: './', 
  // ----------------------------------------------------------------------
  server: {
    host: "::",
    port: 8080,
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
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
    apply: "serve", // Solo aplicar durante el desarrollo (modo serve)
    configureServer(server) {
      const app = createServer();

      // Agregar la aplicación Express como middleware al servidor de desarrollo de Vite
      server.middlewares.use(app);
    },
  };
}
