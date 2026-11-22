<template>
    <div class="container">
        <div v-if="isMatrixInitialized" class="row g-4" data-name="add-transformations">
            <div class="col-lg-6">
                <EditingForm v-model:matrix="matrix" @transformation-applied="onTransformationApplied" />
            </div>
            <div v-if="isLocalStorageEnabled" class="col-lg-6">
                <MatrixHistorySidebar :history="history" />
            </div>
        </div>
        <div v-else class="card shadow-sm" data-name="initial-data-entry">
            <div class="card-body">
                <p class="mb-3">Let's get started! Enter the matrix data then click the "Start transformations" button.</p>
                <div>
                    <label class="form-label fw-semibold" for="row-count">Row count:</label>
                    <input class="ms-2" type="number" id="row-count" v-model.number="matrixRowLength" />
                    <br />
                    <label class="form-label fw-semibold" for="column-count">Column count:</label>
                    <input class="ms-2" type="number" id="column-count" v-model.number="matrixColumnLength" @change="changeColumnCount" />
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold" for="matrix-data"> Matrix data </label>
                    <div id="matrix-data" class="d-flex flex-column gap-2">
                        <div v-for="row in roundToGreaterThanZero(matrixRowLength)" :key="row" class="row g-2 align-items-center">
                            <div class="col-auto text-body-secondary small">Row {{ row }}</div>
                            <div class="col">
                                <EditableMatrixRow
                                    :row-data="getMatrixRow(row)"
                                    @update:row-data="setMatrixRow(row, $event)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <span
                        ref="addIdentityMatrixTooltipHost"
                        class="d-inline-block"
                        :tabindex="isRectangularMatrix ? 0 : undefined"
                    >
                        <button
                            :disabled="isRectangularMatrix"
                            type="button"
                            class="btn btn-primary"
                            @click="addIdentityMatrix"
                        >
                            Add identity matrix
                        </button>
                    </span>
                </div>
                <button
                    :disabled="showWarningModal.open"
                    type="button"
                    class="btn btn-primary"
                    @click="startTransformations"
                >
                    Start transformations
                </button>
            </div>
        </div>
        <div class="mt-4">
            <button type="button" class="btn btn-danger" @click="startOver">Start over</button>
        </div>
        <ContentModal
            v-model:open="showWarningModal.open"
            :content="showWarningModal.content"
        />
    </div>
</template>

<script setup lang="ts">
    import type { Tooltip } from 'bootstrap';

    useSeoMeta({
        title: 'Home',
        description: 'The home page of the Matrix Helper',
    });

    const {
        addIdentityMatrix,
        showWarningModal,
        changeColumnCount,
        changeRowCount,
        getMatrixRow,
        isMatrixInitialized,
        matrix,
        matrixColumnLength,
        matrixRowLength,
        resetMatrix,
        roundToGreaterThanZero,
        setMatrixRow,
    } = await useMatrixData();

    const { history, isLocalStorageEnabled, recordSteps, resetHistory, startHistory } = useMatrixHistory();

    const isRectangularMatrix = computed(
        (): boolean => matrixColumnLength.value !== matrixRowLength.value
    );

    const addIdentityMatrixTooltipHost = ref<HTMLElement | null>(null);

    let addIdentityMatrixTooltip: Tooltip | undefined;

    const syncAddIdentityMatrixTooltip = async (): Promise<void> => {
        addIdentityMatrixTooltip?.dispose();
        addIdentityMatrixTooltip = undefined;

        const host = addIdentityMatrixTooltipHost.value;
        if (!isRectangularMatrix.value || host === null) {
            return;
        }

        const { Tooltip: BootstrapTooltip } = await import('bootstrap');
        addIdentityMatrixTooltip = new BootstrapTooltip(host, {
            title: 'Can\'t add an identity matrix to a rectangular matrix.',
        });
    };

    watch(isRectangularMatrix, (): void => {
        nextTick(() => {
            void syncAddIdentityMatrixTooltip();
        });
    });

    onMounted((): void => {
        void syncAddIdentityMatrixTooltip();
    });

    onUnmounted((): void => {
        addIdentityMatrixTooltip?.dispose();
    });

    watch(matrixRowLength, (): void => {
        changeRowCount();
    });

    const onTransformationApplied = (steps: Map<number, number[]>[]): void => {
        recordSteps({ steps });
    };

    const startTransformations = (): void => {
        startHistory({ matrix: matrix.value });
        isMatrixInitialized.value = true;
    };

    const startOver = (): void => {
        const userAgreed = confirm('Are you sure?  This resets your matrix.');
        if (userAgreed) {
            isMatrixInitialized.value = false;
            resetMatrix();
            resetHistory();
        }
    };
</script>
