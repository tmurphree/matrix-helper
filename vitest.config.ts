import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
    test: {
        coverage: {
            provider: 'v8',
        },
        environment: 'nuxt',
        include: ['app/**/*.{test,spec}.ts'],
    },
});
