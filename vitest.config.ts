import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
    test: {
        coverage: {
            provider: 'v8',
            thresholds: {
                lines: 100,
                functions: 100,
                branches: 100,
                statements: 100,
            },
        },
        environment: 'nuxt',
        include: ['app/**/*.{test,spec}.ts'],
    },
});
