import { describe, expect, it, beforeEach } from 'vitest';
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

    describe('getMatrixData', () => {
        it('returns the value at the given row and column', () => {
            matrixApi.setMatrixData(1, 2, 7);
            expect(matrixApi.getMatrixData(1, 2)).toBe(7);
        });

        it('throws when the row is missing', () => {
            expect(() => matrixApi.getMatrixData(99, 1)).toThrow(
                'Matrix row 99 is missing'
            );
        });

        it('throws when the column index is missing in the row', () => {
            matrixApi.matrix.value.set(3, []);
            expect(() => matrixApi.getMatrixData(3, 1)).toThrow(
                'Matrix column 1 is missing in row 3'
            );
        });
    });

    describe('setMatrixData', () => {
        it('updates an existing cell', () => {
            matrixApi.setMatrixData(2, 1, 4);
            expect(matrixApi.matrix.value.get(2)).toEqual([4, 0]);
        });

        it('creates a row when the row key is missing', () => {
            matrixApi.setMatrixData(3, 1, 2);
            expect(matrixApi.matrix.value.get(3)).toEqual([2]);
        });
    });

    describe('resetMatrix', () => {
        it('removes all rows', () => {
            matrixApi.setMatrixData(1, 1, 9);
            matrixApi.resetMatrix();
            expect(matrixApi.matrix.value.size).toBe(0);
        });
    });
});
