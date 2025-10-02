// vite.config.ts
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // *** SOLUCIÓN FINAL: Quitar la barra diagonal inicial y final ***
  // La ruta debe ser el nombre del repositorio SIN barras diagonales en los extremos.
base: './', // Esto genera rutas relativas (ej: assets/index-hash.js)
  // --------------------------------------------------------------
  server: {
    host: "::",
    port: 8080,
    fs: {
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "docs", // La carpeta de salida es "docs"
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