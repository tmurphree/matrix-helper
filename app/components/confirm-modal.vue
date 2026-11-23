<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="modal fade show"
            style="display: block"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            :aria-label="content"
            @click.self="answer(false)"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <p class="mb-0">⚠️ {{ content }}</p>
                    </div>
                    <div class="modal-footer">
                        <button ref="noButton" type="button" class="btn btn-secondary" @click="answer(false)">No</button>
                        <button type="button" class="btn btn-danger" @click="answer(true)">Yes</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="open" class="modal-backdrop fade show"></div>
    </Teleport>
</template>

<script setup lang="ts">
    const props = defineProps<{
        content: string;
        open: boolean;
    }>();

    const emit = defineEmits<{
        answer: [userAgreed: boolean];
    }>();

    const noButton = ref<HTMLButtonElement | null>(null);

    watch(
        () => props.open,
        async (isOpen): Promise<void> => {
            if (isOpen) {
                window.addEventListener('keydown', onWindowKeyDown, true);
                await nextTick();
                noButton.value?.focus();
                return;
            }

            window.removeEventListener('keydown', onWindowKeyDown, true);
        }
    );

    onUnmounted((): void => {
        window.removeEventListener('keydown', onWindowKeyDown, true);
    });

    const onWindowKeyDown = (event: KeyboardEvent): void => {
        if (!props.open || event.key !== 'Escape') {
            return;
        }

        event.preventDefault();
        answer(false);
    };

    const answer = (userAgreed: boolean): void => {
        emit('answer', userAgreed);
    };
</script>
