<template>
    <div>
        <h1>Reduced Row Echelon Form</h1>
        <p>This is a tool to help you with matrix operations.</p>
        <!-- <div v-if="isMatrixInitialized">
            <p>Matrix</p>
        </div>
        <div v-else> -->
            <p>Let's get started!  Enter the matrix data then click the "Initialize Matrix" button.</p>
            <div>
                <label for="matrix-data">Matrix Data</label>
                <div v-for="row in matrixRows" :key="row">
                    <EditableMatrixRow
                        :model-value="rowValues(row)"
                        @update:model-value="applyRowValues(row, $event)"
                    />
                </div>
                <button @click="initializeMatrix">Initialize Matrix</button>
                <div>
                    <p>{{ debugMatrix() }}</p>
                </div>
            </div>
        <!-- </div> -->
    </div>
</template>

<script setup lang="ts">
    useSeoMeta({
        title: 'Reduced Row Echelon Form',
        description: 'Reduce a matrix to reduced row echelon form'
    });

    const { getMatrixData, isMatrixInitialized, resetMatrix, setMatrixData, matrix } =
        await useMatrixData();

    const matrixColumns = ref(2);
    const matrixRows = ref(2);

    const rowValues = (row: number): number[] => {
        return Array.from({ length: matrixColumns.value }, (_, index) =>
            getMatrixData(row, index + 1)
        );
    };

    const applyRowValues = (row: number, values: number[]): void => {
        values.forEach((value, index) => {
            setMatrixData(row, index + 1, value);
        });
    };

    const initializeMatrix = () => {
        isMatrixInitialized.value = true;
    };

    const debugMatrix = (): number[][] => {
        const displayMatrix = [];
        for (const [row, columns] of matrix.value.entries()) {
            displayMatrix.push(columns);
        }
        return displayMatrix;
    };
</script>
