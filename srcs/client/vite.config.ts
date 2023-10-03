import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 8080, // cf. Docker/Nginx configuration file.
        hmr: {
            path: '/hmr', // Change default to avoid conflict with server sockets.
            port: 443
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});
