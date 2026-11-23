import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import RowSelector from './row-selector.vue';

type MountedRowSelector = Awaited<ReturnType<typeof mountSuspended<typeof RowSelector>>>;

describe('RowSelector', () => {
    let component: MountedRowSelector;

    beforeEach(async (): Promise<void> => {
        component = await mountSuspended(RowSelector, {
            props: { matrixRowLength: 3, selectedRow: 1 },
        });
    });

    afterEach((): void => {
        component.unmount();
    });

    describe('rowOptions', () => {
        it('renders one option per matrix row', () => {
            const optionLabels = component.findAll('option').map((el) => el.text());

            expect(optionLabels).toEqual(['1', '2', '3']);
        });
    });

    describe('selectedRow', () => {
        it('emits update:selectedRow as a number when a row is selected', async () => {
            await component.find('select').setValue('3');

            expect(component.emitted('update:selectedRow')).toEqual([[3]]);
        });
    });

    describe('valid', () => {
        it('does not mark the select invalid by default', () => {
            expect(component.find('select').classes()).not.toContain('is-invalid');
        });

        it('marks the select invalid when valid is false', async () => {
            await component.setProps({ valid: false });

            expect(component.find('select').classes()).toContain('is-invalid');
        });
    });
});
