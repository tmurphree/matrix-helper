<template>
    <div class="container">
        <header class="mb-4">
            <h1 class="h2 mb-2">Reduced Row Echelon Form</h1>
            <p class="text-body-secondary mb-0">This is a tool to help you with matrix operations.</p>
        </header>
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
                <div class="mb-3">
                    <label class="form-label fw-semibold" for="matrix-data"> Matrix data </label>
                    <div id="matrix-data" class="d-flex flex-column gap-2">
                        <div v-for="row in matrixRowLength" :key="row" class="row g-2 align-items-center">
                            <div class="col-auto text-body-secondary small">Row {{ row }}</div>
                            <div class="col">
                                <EditableMatrixRow :row-data="getMatrixRow(row)" @update:row-data="setMatrixRow(row, $event)" />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-primary" @click="startTransformations">Start transformations</button>
            </div>
        </div>
        <div class="mt-4">
            <button type="button" class="btn btn-outline-secondary" @click="startOver">Start over</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    useSeoMeta({
        title: 'Reduced Row Echelon Form',
        description: 'Reduce a matrix to reduced row echelon form',
    });

    const { getMatrixRow, isMatrixInitialized, matrix, matrixRowLength, resetMatrix, setMatrixRow } = await useMatrixData();

    const { history, isLocalStorageEnabled, recordSteps, resetHistory, startHistory } = useMatrixHistory();

    const startTransformations = (): void => {
        startHistory({ matrix: matrix.value });
        isMatrixInitialized.value = true;
    };

    const onTransformationApplied = (steps: Map<number, number[]>[]): void => {
        recordSteps({ steps });
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
