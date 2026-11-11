export const useMatrixData = async () => {
    const isMatrixInitialized = ref(false);
    const matrix = ref<Map<number, number[]>>(new Map([
        [1, [0, 0]],
        [2, [0, 0]],
    ]));
    const matrixRowLength = ref(2);

    const getMatrixRow = (row: number): number[] => {
        const rowData = matrix.value.get(row);

        if (rowData === undefined) {
            throw new Error(`Matrix row ${row} is missing`);
        }

        return rowData;
    };

    const setMatrixData = ({row, column, value }: 
        {row: number, column: number, value: number}
    ): void => {
        const rowData = getMatrixRow(row);
        const nextRowData = [...rowData];

        nextRowData[column - 1] = value;
        matrix.value.set(row, nextRowData);
    };

    const resetMatrix = (): void => {
        for (const key of matrix.value.keys()) {
            const currentValue = matrix.value.get(key);

            matrix.value.set(key, currentValue.fill(0));
        }
    };

    return {
        getMatrixRow,
        isMatrixInitialized,
        matrix,
        matrixRowLength,
        resetMatrix,
        setMatrixData,
    };
};
