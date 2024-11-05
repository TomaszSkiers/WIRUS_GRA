import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/WIRUS_GRA/',  // Ustawienie ścieżek względnych
  plugins: [react()],
  server: {
    host: true, // Umożliwia dostęp przez sieć lokalną
    port: 3000, // Możesz też zmienić port, jeśli domyślny (3000) jest zajęty
  },
})