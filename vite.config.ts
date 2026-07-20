import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            // Solo los iconos: las fotos y los MP3 se quedan fuera del precache a
            // proposito, para que instalar la app no descargue decenas de MB.
            includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
            devOptions: {
                enabled: true
            },
            manifest: {
                id: '/',
                lang: 'es',
                name: 'Mariaa 💕',
                short_name: 'Mariaa',
                description: 'Un pequeño rincón para darte ánimos.',
                // Ambos deben coincidir con --bg-0 de globals.css (#07070f).
                theme_color: '#07070f',
                background_color: '#07070f',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/icon-maskable-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },
            manifestFilename: 'manifest.json',
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,jpg}']
            }
        })
    ],
    server: {
        host: true
    }
});
