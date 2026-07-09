import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { execSync } from "node:child_process"

// Inject build SHA so the UI footer can show which commit is live
function gitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch { return 'dev'; }
}

// Security headers plugin for production
function securityHeaders() {
  return {
    name: 'security-headers',
    enforce: 'post' as const,
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      return [
        {
          tag: 'meta',
          attrs: { name: 'X-Content-Type-Options', content: 'nosniff' },
          inject: 'head',
        },
        {
          tag: 'meta',
          attrs: { name: 'X-Frame-Options', content: 'DENY' },
          inject: 'head',
        },
        {
          tag: 'meta',
          attrs: { name: 'X-XSS-Protection', content: '1; mode=block' },
          inject: 'head',
        },
        {
          tag: 'meta',
          attrs: { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
          inject: 'head',
        },
        {
          tag: 'meta',
          attrs: { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' },
          inject: 'head',
        },
      ]
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react({
      // Enable error overlay in development
      devTargets: ['chrome'],
    }),
    securityHeaders(),
  ],
  server: {
    port: 3000,
    // Show detailed error messages in browser
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Generate source maps for better error debugging
    sourcemap: true,
    // Minification using esbuild (default)
    minify: 'esbuild',
    // Chunk size limits
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'recharts'],
          utils: ['zustand', 'zod', 'clsx'],
        },
      },
    },
  },
  // CSS configuration
  css: {
    devSourcemap: true,
  },
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'framer-motion',
    ],
  },
  define: {
    'import.meta.env.VITE_BUILD_SHA': JSON.stringify(gitSha()),
  },
})
