import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vite config for the demo client.
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  server: {
    port: 5173,
    strictPort: true
  }
});

