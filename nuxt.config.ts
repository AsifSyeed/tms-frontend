// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "~/assets/style/main.scss",
    'primevue/resources/themes/aura-light-green/theme.css',
    '/node_modules/primeflex/primeflex.css',
    '/node_modules/primeicons/primeicons.css',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/global.scss" as *;'
        }
      }
    }
  },
  modules: [
    'nuxt-primevue'
  ],
  primevue: {
    
  },
  imports: {
    dirs: ['types/*.ts', 'types/**/*.ts'],
  },
})