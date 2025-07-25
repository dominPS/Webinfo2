import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs'; // <<--- to było potrzebne!

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        https: {
            key: fs.readFileSync('D:/mkcert/localhost-key.pem'),
            cert: fs.readFileSync('D:/mkcert/localhost.pem'),
        },
        proxy: {
            '/auth': {
                target: 'https://localhost:44316',
                changeOrigin: true,
                secure: true,
            },
            // inne proxy jeśli trzeba
        },
    },
});