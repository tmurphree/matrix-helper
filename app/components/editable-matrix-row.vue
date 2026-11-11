<template>
    <div class="editable-matrix-row">
        <input
            v-for="(cell, columnIndex) in rowData"
            :key="columnIndex"
            type="number"
            :value="cell"
            @input="
                updateCell(
                    columnIndex,
                    Number(($event.target as HTMLInputElement).value)
                )
            "
        />
    </div>
</template>

<script setup lang="ts">
    const rowData = defineModel<number[]>('rowData', { required: true });

    const updateCell = (columnIndex: number, value: number): void => {
        const nextValues = [...rowData.value];
        nextValues[columnIndex] = value;
        rowData.value = nextValues;
    };
</script>

<style scoped>
    .editable-matrix-row {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }
</style>
