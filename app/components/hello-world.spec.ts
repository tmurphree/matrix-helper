import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import HelloWorld from './hello-world.vue';

describe('HelloWorld', () => {
    it('renders counter and reactive foo on mount', async () => {
        const component = await mountSuspended(HelloWorld);
        const text = component.text();

        expect(text).toContain('Welcome to my starter app!');
        expect(text).toContain('Just the value: 42');
        expect(text).toContain('asdf.foo is bar');
    });
});
