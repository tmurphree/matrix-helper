import { mountSuspended } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import ConfirmModal from './confirm-modal.vue';

type MountedModal = Awaited<ReturnType<typeof mountSuspended<typeof ConfirmModal>>>;

const findButton = (text: string): HTMLButtonElement => {
    const button = [...document.body.querySelectorAll('button')].find((el) => el.textContent === text);

    if (button === undefined) {
        throw new Error(`${text} button was not found`);
    }

    return button;
};

const mountModal = async ({ open }: { open: boolean }): Promise<MountedModal> =>
    mountSuspended(ConfirmModal, { attachTo: document.body, props: { content: 'Test question', open } });

const openModal = async (wrapper: MountedModal): Promise<void> => {
    await wrapper.setProps({ open: true });
    await flushPromises();
    await nextTick();
};

describe('ConfirmModal', () => {
    let wrapper: MountedModal;

    afterEach((): void => {
        wrapper?.unmount();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('rendering', () => {
        it('renders nothing while closed', async () => {
            wrapper = await mountModal({ open: false });

            expect(document.body.querySelector('[role="dialog"]')).toBeNull();
        });

        it('shows the content with No and Yes buttons when open', async () => {
            wrapper = await mountModal({ open: true });

            expect(document.body.querySelector('[role="dialog"]')?.textContent).toContain('Test question');
            expect(findButton('No')).toBeDefined();
            expect(findButton('Yes')).toBeDefined();
        });
    });

    describe('focus', () => {
        it('focuses the No button when the modal opens', async () => {
            wrapper = await mountModal({ open: false });
            await openModal(wrapper);

            expect(document.activeElement).toBe(findButton('No'));
        });
    });

    describe('answer', () => {
        it('emits true when Yes is clicked', async () => {
            wrapper = await mountModal({ open: true });

            findButton('Yes').click();

            expect(wrapper.emitted('answer')).toEqual([[true]]);
        });

        it('emits false when No is clicked', async () => {
            wrapper = await mountModal({ open: true });

            findButton('No').click();

            expect(wrapper.emitted('answer')).toEqual([[false]]);
        });

        it('emits false when the backdrop is clicked', async () => {
            wrapper = await mountModal({ open: true });

            document.body.querySelector<HTMLElement>('[role="dialog"]')!.click();

            expect(wrapper.emitted('answer')).toEqual([[false]]);
        });

        it('does not emit when the dialog content is clicked', async () => {
            wrapper = await mountModal({ open: true });

            document.body.querySelector<HTMLElement>('.modal-content')!.click();

            expect(wrapper.emitted('answer')).toBeUndefined();
        });
    });

    describe('onWindowKeyDown', () => {
        it('emits false when Escape is pressed while open', async () => {
            wrapper = await mountModal({ open: false });
            await openModal(wrapper);

            const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
            window.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(true);
            expect(wrapper.emitted('answer')).toEqual([[false]]);
        });

        it('ignores other keys while open', async () => {
            wrapper = await mountModal({ open: false });
            await openModal(wrapper);

            const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
            window.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(false);
            expect(wrapper.emitted('answer')).toBeUndefined();
        });

        it('stops listening after the modal closes', async () => {
            wrapper = await mountModal({ open: false });
            await openModal(wrapper);
            await wrapper.setProps({ open: false });
            await flushPromises();

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

            expect(wrapper.emitted('answer')).toBeUndefined();
        });

        it('removes the keydown listener when the component is destroyed', async () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            wrapper = await mountModal({ open: false });
            await openModal(wrapper);

            wrapper.unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
        });
    });
});
