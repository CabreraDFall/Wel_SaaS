import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
<<<<<<< HEAD
   
=======
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
>>>>>>> 12a4bf48120bbb42fa7967eeaa0046bfb9a93987
  ],
})
