import { mountSuspended } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';

import ContentModal from './content-modal.vue';

type MountedModal = Awaited<ReturnType<typeof mountSuspended<typeof ContentModal>>>;

const findOkButton = (): HTMLButtonElement => {
    const okButton = document.body.querySelector<HTMLButtonElement>('button.btn-primary');

    if (okButton === null) {
        throw new Error('OK button was not found');
    }

    return okButton;
};

const mountOpenModal = async (): Promise<{
    open: ReturnType<typeof ref<boolean>>;
    wrapper: MountedModal;
}> => {
    const open = ref(false);

    const wrapper = await mountSuspended(ContentModal, {
        attachTo: document.body,
        props: {
            content: 'Test warning',
            open: false,
            'onUpdate:open': (value: boolean): void => {
                open.value = value;
                void wrapper.setProps({ open: value });
            },
        },
    });

    open.value = true;
    await wrapper.setProps({ open: true });
    await flushPromises();
    await nextTick();

    return { open, wrapper };
};

const getWindowKeyDownCaptureListener = (): ((event: KeyboardEvent) => void) => {
    const listenerCall = vi
        .mocked(window.addEventListener)
        .mock.calls.find(([eventType, , useCapture]) => eventType === 'keydown' && useCapture === true);

    if (listenerCall === undefined) {
        throw new Error('keydown capture listener was not registered');
    }

    return listenerCall[1] as (event: KeyboardEvent) => void;
};

const dispatchDismissKey = (key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    getWindowKeyDownCaptureListener()(event);

    return event;
};

describe('ContentModal', () => {
    let wrapper: MountedModal;

    afterEach((): void => {
        wrapper?.unmount();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('dismiss', () => {
        let open: ReturnType<typeof ref<boolean>>;

        beforeEach(async (): Promise<void> => {
            ({ open, wrapper } = await mountOpenModal());
        });

        it('sets open to false when OK is clicked', async (): Promise<void> => {
            findOkButton().click();
            await flushPromises();

            expect(open.value).toBe(false);
        });
    });

    describe('onWindowKeyDown', () => {
        let open: ReturnType<typeof ref<boolean>>;

        beforeEach(async (): Promise<void> => {
            vi.spyOn(window, 'addEventListener');
            ({ open, wrapper } = await mountOpenModal());
        });

        it.each(['Escape', 'Enter', 'NumpadEnter'])(
            'sets open to false when %s is pressed',
            async (key): Promise<void> => {
                const event = dispatchDismissKey(key);
                await flushPromises();

                expect(event.defaultPrevented).toBe(true);
                expect(open.value).toBe(false);
            }
        );

        it('ignores other keys while open', async (): Promise<void> => {
            const onWindowKeyDown = getWindowKeyDownCaptureListener();
            const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
            onWindowKeyDown(event);
            await flushPromises();

            expect(event.defaultPrevented).toBe(false);
            expect(open.value).toBe(true);
        });

        it('does nothing when the modal is already closed', async (): Promise<void> => {
            const onWindowKeyDown = getWindowKeyDownCaptureListener();

            open.value = false;
            await wrapper.setProps({ open: false });
            await flushPromises();

            const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
            onWindowKeyDown(event);

            expect(event.defaultPrevented).toBe(false);
        });
    });

    describe('watch open', () => {
        it('removes the keydown listener when open becomes false', async (): Promise<void> => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            ({ wrapper } = await mountOpenModal());

            findOkButton().click();
            await flushPromises();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
        });
    });

    describe('onUnmounted', () => {
        it('removes the keydown listener when the component is destroyed', async (): Promise<void> => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            ({ wrapper } = await mountOpenModal());

            wrapper.unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
        });
    });
});