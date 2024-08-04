import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
//import VueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify';


// https://vitejs.dev/config/
export default defineConfig({
 

  plugins: [
 
    vue(), 
    vuetify({
      autoImport: true,
      styles: { configFile: 'src/scss/variables.scss' }
    }),
    //VueDevTools(),
    VitePWA({
    //registerType: 'prompt',
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'francis-peluqueria',
      short_name: 'francis-peluqueria',
      description: 'francis-peluqueria',
      theme_color: '#ffffff',
      start_url: '.',
      display: 'standalone',
      background_color: '#140505'
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
        scss: {}
    }
  },
  optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue']
  },
})