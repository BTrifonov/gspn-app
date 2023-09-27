import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/


export default defineConfig({
  plugins: [vue()],
  base: "https://csl.bpm.in.tum.de/boris_frontend/",
  resolve: { 
    alias: {
       '@': '/src',
       'modules':'/node_modules' 
      } 
  },
  server: {
    host: true, 
    strictPort: true,
    port: 5173
  }
})
