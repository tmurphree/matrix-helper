// https://nuxt.com/docs/api/configuration/nuxt-config
import { setBootstrapColorMode } from './app-head-scripts/set-bootstrap-color-mode';

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
                    innerHTML: setBootstrapColorMode,
                    type: 'text/javascript',
                    tagPosition: 'head',
                },
            ],
        },
    },
});
