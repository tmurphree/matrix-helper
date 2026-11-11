export const useMatrixData = async () => {
    const matrix = ref<Map<number, number[]>>(new Map([
        [1, [0, 0]],
        [2, [0, 0]],
    ]));
    const isMatrixInitialized = ref(false);

    const getMatrixData = (row: number, column: number): number => {
        const rowData = matrix.value.get(row);
        if (rowData === undefined) {
            throw new Error(`Matrix row ${row} is missing`);
        }
        const value = rowData[column - 1];
        if (value === undefined) {
            throw new Error(`Matrix column ${column} is missing in row ${row}`);
        }
        return value;
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
