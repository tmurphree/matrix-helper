<template>
    <section class="card shadow-sm h-100" aria-label="Matrix transformations">
        <div class="card-body">
            <h2 class="h4 card-title">Transformations</h2>
            <p class="text-body-secondary fst-italic mb-3">
                Placeholder — not wired up yet.
            </p>
            <div class="mb-4">
                <h3 class="h6 text-uppercase text-body-secondary">
                    Current matrix
                </h3>
                <pre
                    class="bg-body-secondary bg-opacity-10 border rounded p-3 mb-0 font-monospace small"
                    >{{ formatMatrix(Array.from(matrix.values())) }}</pre
                >
            </div>
            <div>
                <h3 class="h6 text-uppercase text-body-secondary">
                    Next operation (placeholder)
                </h3>
                <ul class="list-group list-group-flush mb-3">
                    <li class="list-group-item px-0">
                        <label
                            class="d-flex flex-wrap align-items-center gap-2"
                        >
                            <input
                                v-model="selectedOperationType"
                                class="form-check-input mt-0 flex-shrink-0"
                                type="radio"
                                name="selected-operation-type"
                                value="multiply"
                            />
                            <span
                                class="d-flex flex-wrap align-items-center gap-2"
                            >
                                Multiply
                                <RowSelector
                                    v-model:selected-row="
                                        multiplyOperationRowId
                                    "
                                    :matrix-row-length="matrixRowLength"
                                />
                                by
                                <input
                                    v-model="multiplyOperationValue"
                                    class="form-control form-control-sm matrix-number-input"
                                    type="number"
                                />
                            </span>
                        </label>
                    </li>
                    <li class="list-group-item px-0">
                        <label
                            class="d-flex flex-wrap align-items-center gap-2"
                        >
                            <input
                                v-model="selectedOperationType"
                                class="form-check-input mt-0 flex-shrink-0"
                                type="radio"
                                name="selected-operation-type"
                                value="add"
                            />
                            <span
                                class="d-flex flex-wrap align-items-center gap-2"
                            >
                                Add
                                <input
                                    v-model.number="addOperationValue01"
                                    class="form-control form-control-sm matrix-number-input"
                                    type="number"
                                />
                                ×
                                <RowSelector
                                    v-model:selected-row="addOperationRowId01"
                                    :matrix-row-length="matrixRowLength"
                                />
                                to
                                <input
                                    v-model.number="addOperationValue02"
                                    class="form-control form-control-sm matrix-number-input"
                                    type="number"
                                />
                                ×
                                <RowSelector
                                    v-model:selected-row="addOperationRowId02"
                                    :matrix-row-length="matrixRowLength"
                                />
                                and replace
                                <RowSelector
                                    v-model:selected-row="
                                        addOperationRowToReplace
                                    "
                                    :matrix-row-length="matrixRowLength"
                                />
                            </span>
                        </label>
                    </li>
                </ul>
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="applyTransformation"
                >
                    Apply transformation
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { applyMatrixTransformation } from '../utils/apply-matrix-transformation';

    const matrix = defineModel<Map<number, number[]>>('matrix', {
        required: true,
    });
    type OperationType = 'multiply' | 'add';

    const addOperationRowId01 = ref(1);
    const addOperationRowId02 = ref(2);
    const addOperationValue01 = ref(1);
    const addOperationValue02 = ref(1);
    const addOperationRowToReplace = ref(1);
    const multiplyOperationRowId = ref(1);
    const multiplyOperationValue = ref(1);
    const selectedOperationType = ref<OperationType>('multiply');

    const matrixRowLength = computed(() => matrix.value.size);

    const applyTransformation = (): void => {
        if (selectedOperationType.value === 'multiply') {
            matrix.value = applyMatrixTransformation({
                matrix: matrix.value,
                transformation: {
                    type: 'multiply',
                    rowId: multiplyOperationRowId.value,
                    multiplier: multiplyOperationValue.value,
                },
            });

            return;
        }

        matrix.value = applyMatrixTransformation({
            matrix: matrix.value,
            transformation: {
                type: 'add',
                coefficient01: addOperationValue01.value,
                rowId01: addOperationRowId01.value,
                coefficient02: addOperationValue02.value,
                rowId02: addOperationRowId02.value,
                rowIdToReplace: addOperationRowToReplace.value,
            },
        });
    };

    const formatMatrix = (rows: Array<number[]>): string => {
        return rows.map((row) => row.join('\t')).join('\n');
    };
</script>

<style scoped>
    .matrix-number-input {
        width: 4.5rem;
    }
</style>
