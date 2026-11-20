import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Index from './index.vue';

describe('ReducedRowEchelonForm', () => {
    it('renders the component', async () => {
        const component = await mountSuspended(Index);
        expect(component.html()).toContain('Reduced Row Echelon Form');
    });
});
