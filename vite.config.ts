import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.png', 'icon.png', 'music/*.mp3', 'images/*.jpg', 'bebes/*.jpg'],
            devOptions: {
                enabled: true
            },
            manifest: {
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
                        src: '/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/icon.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
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
