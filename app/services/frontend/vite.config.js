import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

//TODO: There should be a better way to solve the bare specifier error, than creating an alias for the node-modules
export default defineConfig({
  plugins: [vue()],
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
