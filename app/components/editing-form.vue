<template>
    <section class="editing-form" aria-label="Matrix transformations">
        <h2>Transformations</h2>
        <p class="editing-form__notice">Placeholder — not wired up yet.</p>
        <div>
            <p>Current matrix</p>
            <pre class="editing-form__matrix">{{ formatMatrix(matrix.values()) }}</pre>
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
                        Add <input type="number" v-model="addOperationValue01"> x <RowSelector v-model:selected-row="addOperationRowId01" :matrix-row-length="matrixRowLength" />
                        to <input type="number" v-model="addOperationValue02"> x <RowSelector v-model:selected-row="addOperationRowId02" :matrix-row-length="matrixRowLength" />
                    </label>
                </li>
            </ul>
            <button type="button" disabled>Apply transformation</button>
        </div>
    </section>
</template>

<script setup lang="ts">
    const matrix = defineModel<Map<number, number[]>>('matrix', { required: true });
    type OperationType = 'multiply' | 'add';

    const selectedOperationType = ref<OperationType>('multiply');
    const multiplyOperationRowId = ref(1);
    const multiplyOperationValue = ref(1);
    const addOperationValue01 = ref(1);
    const addOperationRowId01 = ref(1);
    const addOperationValue02 = ref(1);
    const addOperationRowId02 = ref(1);


    const placeholderOperation = {
        type: 'Add multiple of one row to another',
        expression: 'R2 ← R2 − 3R1',
    };

    const matrixRowLength = computed(() => matrix.value.size);

    const formatMatrix = (rows: number[][]): string => {
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
