// https://nuxt.com/docs/api/configuration/nuxt-config
import { bootstrapColorModeHeadScript } from './app/bootstrap-color-mode-script';

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    imports: {
        dirs: ['types'],
    },
    css: ['bootstrap/dist/css/bootstrap.min.css'],
    app: {
        head: {
            script: [
                {
                    key: 'bootstrap-color-mode',
                    innerHTML: bootstrapColorModeHeadScript,
                    type: 'text/javascript',
                    tagPosition: 'head',
                },
            ],
        },
    },
});
