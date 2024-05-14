import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue()],
  base: "/gspn-app/",
  publicDir: "public", 
  resolve: { 
    alias: {
       '@': './src',
       //'modules':'./node_modules' 
      } 
  },
  server: {
    host: true, 
    strictPort: true,
    port: 5173
  }
})
