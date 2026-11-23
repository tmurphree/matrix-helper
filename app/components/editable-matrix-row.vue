<template>
    <div class="d-flex flex-wrap gap-2 editable-matrix-row">
        <input
            v-for="(cell, columnIndex) in rowData"
            :key="columnIndex"
            class="form-control form-control-sm matrix-cell-input"
            type="number"
            :value="cell"
            @input="updateCell(columnIndex, $event)"
        />
    </div>
</template>

<script setup lang="ts">
    const rowData = defineModel<number[]>('rowData', { required: true });

    const updateCell = (columnIndex: number, event: Event): void => {
        const input = event.target as HTMLInputElement;

        // A lone "-" is unfinished. Writing Number("") back would replace it with 0.
        if (input.validity.badInput) {
            return;
        }

        const value = input.value === '' ? 0 : input.valueAsNumber;
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
