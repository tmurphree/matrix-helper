export const useMatrixData = async () => {
    const isMatrixInitialized = ref(false);
    const matrix = ref<Map<number, number[]>>(
        new Map([
            [1, [0, 0]],
            [2, [0, 0]],
        ])
    );
    const showWarningModal = reactive({ open: false, content: '' });
    const matrixColumnLength = ref(2);
    const matrixRowLength = ref(2);

    const addIdentityMatrix = (): void => {
        if (matrixColumnLength.value !== matrixRowLength.value) {
            showWarningModal.open = true;
            showWarningModal.content = "Can't add an identity matrix to a rectangular matrix.";

            return;
        }

        for (const [currentMatrixKey, currentMatrixValue] of matrix.value.entries()) {
            // Every matrix row is written as an array, so an undefined row cannot occur through this composable.
            /* v8 ignore if -- @preserve */
            if (typeof currentMatrixValue === 'undefined') {
                continue;
            }

            const rowFillingFunction = (_element: unknown, index: number): number =>
                index === currentMatrixKey - 1 ? 1 : 0;
            const arrayToAppend = Array.from({ length: matrixColumnLength.value }, rowFillingFunction);

            matrix.value.set(currentMatrixKey, matrix.value.get(currentMatrixKey).concat(arrayToAppend));
        }

        matrixColumnLength.value = matrixColumnLength.value * 2;
    };

    const roundToGreaterThanZero = (count: number): number => Math.max(Math.round(count), 1);

    const changeRowCount = (): void => {
        matrixRowLength.value = roundToGreaterThanZero(matrixRowLength.value);

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
        matrixColumnLength.value = 2;
        matrixRowLength.value = 2;
        matrix.value = new Map([
            [1, [0, 0]],
            [2, [0, 0]],
        ]);
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
        showWarningModal,
    };
};
