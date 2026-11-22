<template>
    <Teleport to="body">
        <div
            v-if="open"
            ref="modalRoot"
            class="modal fade show"
            style="display: block"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            :aria-label="content"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <p class="mb-0">⚠️ {{ content }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="dismiss">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="open" class="modal-backdrop fade show"></div>
    </Teleport>
</template>

<script setup lang="ts">
    defineProps<{
        content: string;
    }>();

    const open = defineModel<boolean>('open', { required: true });
    const modalRoot = ref<HTMLDivElement | null>(null);

    const dismiss = (): void => {
        open.value = false;
    };

    const dismissKeys = new Set(['Enter', 'Escape', 'NumpadEnter']);

    const onWindowKeyDown = (event: KeyboardEvent): void => {
        if (!open.value || !dismissKeys.has(event.key)) {
            return;
        }

        event.preventDefault();
        dismiss();
    };

    watch(open, async (isOpen): Promise<void> => {
        if (isOpen) {
            window.addEventListener('keydown', onWindowKeyDown, true);
            await nextTick();
            modalRoot.value?.focus();
            return;
        }

        window.removeEventListener('keydown', onWindowKeyDown, true);
    });

    onUnmounted((): void => {
        window.removeEventListener('keydown', onWindowKeyDown, true);
    });
</script>
