export const useMatrixData = async () => {
    const isMatrixInitialized = ref(false);
    const matrix = ref<Map<number, number[]>>(
        new Map([
            [1, [0, 0]],
            [2, [0, 0]],
        ])
    );
    const matrixColumnLength = ref(2);
    const matrixRowLength = ref(2);

    const addIdentityMatrix = (): void => {
        console.log('TODO - implement addIdentityMatrix');
    };

    const roundToGreaterThanZero = (count: number): number => Math.max(Math.round(count), 1);

    const changeRowCount = (): void => {
        matrixRowLength.value = roundToGreaterThanZero(matrixRowLength.value);

        console.debug('changeRowCount', matrixRowLength.value);
        const nextMatrix = new Map<number, number[]>();

        for (let row = 1; row <= matrixRowLength.value; row++) {
            const existingRow = matrix.value.get(row);

            nextMatrix.set(
                row,
                existingRow === undefined ? new Array<number>(matrixColumnLength.value).fill(0) : [...existingRow]
            );
        }

        matrix.value = nextMatrix;
    };

    const changeColumnCount = (): void => {
        matrixColumnLength.value = roundToGreaterThanZero(matrixColumnLength.value);

        const nextMatrix = new Map<number, number[]>();

        for (const [row, values] of matrix.value) {
            const rowFillingFunction = (_unused: number, index: number) => values[index] ?? 0;

            nextMatrix.set(
                row,
                // Works because Array.from's first argument is an array-like object.
                Array.from({ length: matrixColumnLength.value }, rowFillingFunction)
            );
        }

        matrix.value = nextMatrix;
    };

    const getMatrixRow = (row: number): number[] => {
        const rowData = matrix.value.get(row);

        if (rowData === undefined) {
            throw new Error(`Matrix row ${row} is missing`);
        }

        return rowData;
    };

    const resetMatrix = (): void => {
        for (const key of matrix.value.keys()) {
            const currentValue = matrix.value.get(key);

            matrix.value.set(key, currentValue.fill(0));
        }
    };

    const setMatrixData = ({ row, column, value }: { row: number; column: number; value: number }): void => {
        const rowData = getMatrixRow(row);
        const nextRowData = [...rowData];

        nextRowData[column - 1] = value;
        matrix.value.set(row, nextRowData);
    };

    const setMatrixRow = (row: number, values: number[]): void => {
        getMatrixRow(row);
        matrix.value.set(row, [...values]);
    };

    return {
        addIdentityMatrix,
        changeRowCount,
        changeColumnCount,
        getMatrixRow,
        isMatrixInitialized,
        matrix,
        matrixColumnLength,
        matrixRowLength,
        resetMatrix,
        roundToGreaterThanZero,
        setMatrixData,
        setMatrixRow,
    };
};
