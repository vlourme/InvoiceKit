import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Disable server rendering
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'InvoiceKit',
    titleTemplate: '%s | InvoiceKit',
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/notification.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAcSX6hQoAUOy3_msOBLPUnDwrrHsBM8PQ',
          authDomain: 'invoicekit01.firebaseapp.com',
          databaseURL: 'https://invoicekit01.firebaseio.com',
          projectId: 'invoicekit01',
          storageBucket: 'invoicekit01.appspot.com',
          messagingSenderId: '457758151352',
          appId: '1:457758151352:web:d22eb03c9eee56b64c5a4d',
          measurementId: 'G-MSHNV4CNP5',
        },
        services: {
          auth: {
            initialize: {
              onAuthStateChangedAction: 'auth/onAuthStateChanged',
            },
          },
          firestore: {
            enablePersistence: true,
          },
          storage: true,
        },
      },
    ],
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Vuetify Configuration
  vuetify: {
    theme: {
      dark: true,
    },
  },
}

export default config
