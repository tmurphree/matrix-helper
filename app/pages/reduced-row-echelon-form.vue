<template>
    <div>
        <h1>Reduced Row Echelon Form</h1>
        <p>This is a tool to help you with matrix operations.</p>
        <div>
            <p> Debug matrix: {{ debugMatrix() }}</p>
        </div>
        <div
            data-name="add-transformations"
            v-if="isMatrixInitialized"
            class="add-transformations"
        >
            <EditingForm
                v-model:matrix="matrix"
                class="add-transformations__main"
                @update:matrix="onMatrixTransformation"
            />
            <MatrixHistorySidebar class="add-transformations__history" />
        </div>
        <div data-name="initial-data-entry" v-else>
            <p>Let's get started!  Enter the matrix data then click the "Start transformations" button.</p>
            <div>
                <label for="matrix-data">Matrix Data</label>
                <div v-for="row in matrixRowLength" :key="row">
                    <EditableMatrixRow
                        :row-data="getMatrixRow(row)"
                        @update:row-data="setMatrixRow(row, $event)"
                    />
                </div>
                <button @click="startTransformations">Start transformations</button>
            </div>
        </div>
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
        setMatrixRow,
    } = await useMatrixData();

    const startTransformations = () => {
        isMatrixInitialized.value = true;
    };

    const onMatrixTransformation = () => {
        console.log('todo replace this');
    };

    const startOver = () => {
        const userAgreed = confirm('Are you sure?  This resets your matrix.');
        if (userAgreed) {
            isMatrixInitialized.value = false;
            resetMatrix();
        }
    };

    // TODO Tom Murphree: remove this
    setTimeout(() => {
        matrix.value = new Map([[1, [9, 3]], [2, [2, 4]]]);
        isMatrixInitialized.value = true;
    }, 0);

    // TODO Tom Murphree: remove this
    const debugMatrix = (): number[][] => {
        const displayMatrix = [];

        for (const columns of matrix.value.values()) {
            displayMatrix.push(columns);
        }

        return displayMatrix;
    };
</script>

<style scoped>
    .add-transformations {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: stretch;
    }

    .add-transformations__main {
        flex: 0 0 50%;
        width: 50%;
        box-sizing: border-box;
    }

    .add-transformations__history {
        flex: 0 0 50%;
        width: 50%;
        box-sizing: border-box;
    }
</style>
