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

    describe('getMatrixRow', () => {
        it('returns the row values', () => {
            matrixApi.setMatrixData({ row: 1, column: 2, value: 7 });
            expect(matrixApi.getMatrixRow(1)).toEqual([0, 7]);
        });

        it('throws when the row is missing', () => {
            expect(() => matrixApi.getMatrixRow(99)).toThrow(
                'Matrix row 99 is missing'
            );
        });
    });

    describe('setMatrixData', () => {
        it('updates an existing cell', () => {
            matrixApi.setMatrixData({ row: 2, column: 1, value: 4 });
            expect(matrixApi.matrix.value.get(2)).toEqual([4, 0]);
        });

        it('throws when the row key is missing', () => {
            expect(() =>
                matrixApi.setMatrixData({ row: 3, column: 1, value: 2 })
            ).toThrow('Matrix row 3 is missing');
        });
    });

    describe('setMatrixRow', () => {
        it('replaces the row values', () => {
            matrixApi.setMatrixRow(1, [3, 5]);
            expect(matrixApi.matrix.value.get(1)).toEqual([3, 5]);
            expect(matrixApi.getMatrixRow(1)).toEqual([3, 5]);
        });

        it('throws when the row is missing', () => {
            expect(() => matrixApi.setMatrixRow(99, [1, 2])).toThrow(
                'Matrix row 99 is missing'
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
