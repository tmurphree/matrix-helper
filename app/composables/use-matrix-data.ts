export const useMatrixData = () => {
    const matrix = ref<Map<number, number[]>>(new Map());
    const isMatrixInitialized = ref(false);

    const getMatrixData = (row: number, column: number): number => {
        const rowData = matrix.value.get(row);
        if (rowData === undefined) {
            return 0;
        }
        return rowData[column - 1] ?? 0;
    };

    const setMatrixData = (row: number, column: number, value: number): void => {
        const rowData = matrix.value.get(row) ?? [];
        const nextRowData = [...rowData];
        nextRowData[column - 1] = value;
        matrix.value.set(row, nextRowData);
    };

    const resetMatrix = (): void => {
        matrix.value.clear();
    };

    return {
        getMatrixData,
        isMatrixInitialized,
        matrix,
        resetMatrix,
        setMatrixData,
    };
};
