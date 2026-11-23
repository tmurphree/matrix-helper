import { beforeEach, describe, expect, it } from 'vitest';
import { useMatrixData } from './use-matrix-data';

type MatrixDataApi = Awaited<ReturnType<typeof useMatrixData>>;

describe('useMatrixData', () => {
    let matrixApi: MatrixDataApi;

    beforeEach(async () => {
        matrixApi = await useMatrixData();
    });

    describe('matrix', () => {
        it('starts with two rows of two zero columns', () => {
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [0, 0]],
                    [2, [0, 0]],
                ])
            );
        });
    });

    describe('isMatrixInitialized', () => {
        it('starts false', () => {
            expect(matrixApi.isMatrixInitialized.value).toBe(false);
        });
    });

    describe('getMatrixRow', () => {
        it('returns the row values', () => {
            matrixApi.setMatrixData({ row: 1, column: 2, value: 7 });
            expect(matrixApi.getMatrixRow(1)).toEqual([0, 7]);
        });

        it('throws when the row is missing', () => {
            expect(() => matrixApi.getMatrixRow(99)).toThrow('Matrix row 99 is missing');
        });
    });

    describe('setMatrixData', () => {
        it('updates an existing cell', () => {
            matrixApi.setMatrixData({ row: 2, column: 1, value: 4 });
            expect(matrixApi.matrix.value.get(2)).toEqual([4, 0]);
        });

        it('throws when the row key is missing', () => {
            expect(() => matrixApi.setMatrixData({ row: 3, column: 1, value: 2 })).toThrow('Matrix row 3 is missing');
        });
    });

    describe('setMatrixRow', () => {
        it('replaces the row values', () => {
            matrixApi.setMatrixRow(1, [3, 5]);
            expect(matrixApi.matrix.value.get(1)).toEqual([3, 5]);
            expect(matrixApi.getMatrixRow(1)).toEqual([3, 5]);
        });

        it('throws when the row is missing', () => {
            expect(() => matrixApi.setMatrixRow(99, [1, 2])).toThrow('Matrix row 99 is missing');
        });
    });

    describe('changeColumnCount', () => {
        it('pushes a zero onto every row when the column count is incremented', () => {
            matrixApi.setMatrixData({ row: 1, column: 1, value: 5 });
            matrixApi.matrixColumnLength.value = 3;
            matrixApi.changeColumnCount();
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [5, 0, 0]],
                    [2, [0, 0, 0]],
                ])
            );
        });

        it('removes the last column from every row when the column count is decremented', () => {
            matrixApi.setMatrixRow(1, [1, 2]);
            matrixApi.setMatrixRow(2, [3, 4]);
            matrixApi.matrixColumnLength.value = 1;
            matrixApi.changeColumnCount();
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [1]],
                    [2, [3]],
                ])
            );
        });

        it('adds the full difference when the column count jumps by more than one', () => {
            matrixApi.matrixColumnLength.value = 5;
            matrixApi.changeColumnCount();
            expect(matrixApi.getMatrixRow(1)).toEqual([0, 0, 0, 0, 0]);
        });

        it.each([0, -3])('keeps at least one column when the count is %s', (columnCount) => {
            matrixApi.matrixColumnLength.value = columnCount;
            matrixApi.changeColumnCount();
            expect(matrixApi.matrixColumnLength.value).toBe(1);
            expect(matrixApi.getMatrixRow(1)).toHaveLength(1);
        });

        it.each([
            [2.4, 2],
            [2.6, 3],
        ])('rounds a column count of %s to %s', (columnCount, expectedColumnCount) => {
            matrixApi.matrixColumnLength.value = columnCount;
            matrixApi.changeColumnCount();
            expect(matrixApi.matrixColumnLength.value).toBe(expectedColumnCount);
            expect(matrixApi.getMatrixRow(1)).toHaveLength(expectedColumnCount);
        });
    });

    describe('changeRowCount', () => {
        it('adds a zero-filled row when the row count is incremented', () => {
            matrixApi.setMatrixRow(1, [1, 2]);
            matrixApi.matrixRowLength.value = 3;
            matrixApi.changeRowCount();
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [1, 2]],
                    [2, [0, 0]],
                    [3, [0, 0]],
                ])
            );
        });

        it('uses the current column count for the new row', () => {
            matrixApi.matrixColumnLength.value = 3;
            matrixApi.changeColumnCount();
            matrixApi.matrixRowLength.value = 3;
            matrixApi.changeRowCount();
            expect(matrixApi.getMatrixRow(3)).toEqual([0, 0, 0]);
        });

        it('removes the last row when the row count is decremented', () => {
            matrixApi.setMatrixRow(1, [1, 2]);
            matrixApi.matrixRowLength.value = 1;
            matrixApi.changeRowCount();
            expect(matrixApi.matrix.value).toEqual(new Map([[1, [1, 2]]]));
        });

        it('adds the full difference when the row count jumps by more than one', () => {
            matrixApi.matrixRowLength.value = 5;
            matrixApi.changeRowCount();
            expect([...matrixApi.matrix.value.keys()]).toEqual([1, 2, 3, 4, 5]);
        });

        it.each([0, -3])('keeps at least one row when the count is %s', (rowCount) => {
            matrixApi.matrixRowLength.value = rowCount;
            matrixApi.changeRowCount();
            expect(matrixApi.matrixRowLength.value).toBe(1);
            expect(matrixApi.matrix.value.size).toBe(1);
        });

        it.each([
            [2.4, 2],
            [2.6, 3],
        ])('rounds a row count of %s to %s', (rowCount, expectedRowCount) => {
            matrixApi.matrixRowLength.value = rowCount;
            matrixApi.changeRowCount();
            expect(matrixApi.matrixRowLength.value).toBe(expectedRowCount);
            expect(matrixApi.matrix.value.size).toBe(expectedRowCount);
        });
    });

    describe('addIdentityMatrix', () => {
        it('opens the warning modal and leaves the matrix unchanged when the matrix is rectangular', () => {
            matrixApi.matrixRowLength.value = 3;
            matrixApi.matrixColumnLength.value = 2;

            matrixApi.addIdentityMatrix();

            expect(matrixApi.showWarningModal.open).toBe(true);
            expect(matrixApi.showWarningModal.content).toBe("Can't add an identity matrix to a rectangular matrix.");
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [0, 0]],
                    [2, [0, 0]],
                ])
            );
            expect(matrixApi.matrixColumnLength.value).toBe(2);
        });

        it('appends the identity block and doubles the column count on a default 2x2 matrix', () => {
            matrixApi.addIdentityMatrix();

            expect(matrixApi.showWarningModal.open).toBe(false);
            expect(matrixApi.showWarningModal.content).toBe('');
            expect(matrixApi.matrixColumnLength.value).toBe(4);
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [0, 0, 1, 0]],
                    [2, [0, 0, 0, 1]],
                ])
            );
        });

        it('preserves existing row data when appending the identity block', () => {
            matrixApi.setMatrixRow(1, [5, 6]);
            matrixApi.setMatrixRow(2, [7, 8]);

            matrixApi.addIdentityMatrix();

            expect(matrixApi.matrixColumnLength.value).toBe(4);
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [5, 6, 1, 0]],
                    [2, [7, 8, 0, 1]],
                ])
            );
        });
    });

    describe('resetMatrix', () => {
        it('sets every cell to zero', () => {
            matrixApi.setMatrixData({ row: 1, column: 1, value: 9 });
            matrixApi.setMatrixData({ row: 1, column: 2, value: 3 });
            matrixApi.setMatrixData({ row: 2, column: 1, value: 4 });
            matrixApi.resetMatrix();
            expect(matrixApi.matrix.value).toEqual(
                new Map([
                    [1, [0, 0]],
                    [2, [0, 0]],
                ])
            );
        });

        it('keeps existing row keys', () => {
            matrixApi.setMatrixData({ row: 1, column: 2, value: 7 });
            matrixApi.resetMatrix();
            expect([...matrixApi.matrix.value.keys()]).toEqual([1, 2]);
            expect(matrixApi.matrix.value.size).toBe(2);
        });
    });
});
