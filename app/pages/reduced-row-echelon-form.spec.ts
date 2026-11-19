import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import ReducedRowEchelonForm from './reduced-row-echelon-form.vue';

describe('ReducedRowEchelonForm', () => {
    it('renders the component', async () => {
        const component = await mountSuspended(ReducedRowEchelonForm);
        expect(component.html()).toContain('Reduced Row Echelon Form');
    });
});
