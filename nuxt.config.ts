// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    imports: {
        dirs: ['types'],
    },
    css: ['bootstrap/dist/css/bootstrap.min.css'],
    modules: ['@nuxtjs/color-mode'],
    colorMode: {
        preference: 'system',
        dataValue: 'bs-theme',
        classSuffix: '',
    },
});
