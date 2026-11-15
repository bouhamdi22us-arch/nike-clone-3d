import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project pages URL is https://bouhamdi22us-arch.github.io/nike-clone-3d/,
// so every built asset URL must be prefixed with the repo name.
export default defineConfig({
  base: '/nike-clone-3d/',
  plugins: [react()],
})
