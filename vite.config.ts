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
                name: 'Marii Gallery',
                short_name: 'Marii',
                description: 'Un pequeño rincón para darte ánimos.',
                theme_color: '#051025',
                background_color: '#000000',
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
