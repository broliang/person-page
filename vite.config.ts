import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Set this to '/<repository-name>/' for GitHub Pages project sites
  base: '/person-page/', 
});