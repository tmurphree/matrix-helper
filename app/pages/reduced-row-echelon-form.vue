<template>
    <div>
        <h1>Reduced Row Echelon Form</h1>
        <p>This is a tool to help you with matrix operations.</p>
        <div>
            <p> Debug matrix: {{ debugMatrix() }}</p>
        </div>
        <!-- <div v-if="isMatrixInitialized">
            <p>Matrix</p>
        </div>
        <div v-else> -->
            <p>Let's get started!  Enter the matrix data then click the "Start transformations" button.</p>
            <div>
                <label for="matrix-data">Matrix Data</label>
                <div v-for="row in matrixRowLength" :key="row">
                    <EditableMatrixRow
                        :model-value="getMatrixRow(row)"
                        @update:model-value="applyRowValues(row, $event)"
                    />
                </div>
                <button @click="startTransformations">Start transformations</button>
            </div>
        <!-- </div> -->
         <button @click="startOver">Start over</button>
    </div>
</template>

<script setup lang="ts">
    useSeoMeta({
        title: 'Reduced Row Echelon Form',
        description: 'Reduce a matrix to reduced row echelon form'
    });

    const { 
        getMatrixRow,
        isMatrixInitialized,
        matrix,
        matrixRowLength,
        resetMatrix,
        setMatrixData,
    } = await useMatrixData();

    const applyRowValues = (row: number, values: number[]): void => {
        values.forEach((value, index) => {
            setMatrixData({ row, column: index + 1, value });
        });
    };

    const startTransformations = () => {
        isMatrixInitialized.value = true;
    };

    const startOver = () => {
        resetMatrix();
    };

    // TODO Tom Murphree: remove this
    const debugMatrix = (): number[][] => {
        const displayMatrix = [];
        for (const [row, columns] of matrix.value.entries()) {
            displayMatrix.push(columns);
        }
        return displayMatrix;
    };
</script>
