<template>
    <section class="editing-form" aria-label="Matrix transformations">
        <h2>Transformations</h2>
        <p class="editing-form__notice">Placeholder — not wired up yet.</p>
        <div>
            <p>Current matrix</p>
            <pre class="editing-form__matrix">{{ formatMatrix(Array.from(matrix.values())) }}</pre>
        </div>
        <div>
            <p>Next operation (placeholder)</p>
            <ul class="editing-form__operations">
                <li>
                    <label class="editing-form__operation-choice">
                        <input
                            v-model="selectedOperationType"
                            type="radio"
                            name="selected-operation-type"
                            value="multiply"
                        >
                        Multiply <RowSelector v-model:selected-row="multiplyOperationRowId" :matrix-row-length="matrixRowLength" /> by <input type="number" v-model="multiplyOperationValue">
                    </label>
                </li>
                <li>
                    <label class="editing-form__operation-choice">
                        <input
                            v-model="selectedOperationType"
                            type="radio"
                            name="selected-operation-type"
                            value="add"
                        >
                        Add <input type="number" v-model.number="addOperationValue01"> x <RowSelector v-model:selected-row="addOperationRowId01" :matrix-row-length="matrixRowLength" />
                        to <input type="number" v-model.number="addOperationValue02"> x <RowSelector v-model:selected-row="addOperationRowId02" :matrix-row-length="matrixRowLength" />
                        and replace <RowSelector v-model:selected-row="addOperationRowToReplace" :matrix-row-length="matrixRowLength" />
                    </label>
                </li>
            </ul>
            <button type="button" @click="applyTransformation">Apply transformation</button>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { applyMatrixTransformation } from '../utils/apply-matrix-transformation';

    const matrix = defineModel<Map<number, number[]>>('matrix', { required: true });
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
    .editing-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .editing-form__notice {
        margin: 0;
        font-style: italic;
    }

    .editing-form__matrix {
        margin: 0;
        font-family: ui-monospace, monospace;
    }

    .editing-form__operations {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .editing-form__operation-choice {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25rem 0.5rem;
        cursor: pointer;
    }

    .editing-form__operation {
        margin: 0;
        display: grid;
        gap: 0.5rem;
    }

    .editing-form__operation dt {
        font-weight: 600;
    }

    .editing-form__operation dd {
        margin: 0;
    }

    .editing-form input[type=number] {
        max-width: 50px;
    }
</style>
