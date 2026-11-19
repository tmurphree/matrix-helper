<template>
    <div class="d-flex flex-wrap gap-2 editable-matrix-row">
        <input
            v-for="(cell, columnIndex) in rowData"
            :key="columnIndex"
            class="form-control form-control-sm matrix-cell-input"
            type="number"
            :value="cell"
            @input="updateCell(columnIndex, Number(($event.target as HTMLInputElement).value))"
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
    .matrix-cell-input {
        width: 4.5rem;
    }
</style>
