import { beforeEach, describe, expect, it } from 'vitest';
import { applyMatrixTransformation } from './apply-matrix-transformation';

describe('applyMatrixTransformation', () => {
    describe('multiplying only', () => {
        it('multiplies the selected row by the multiplier', () => {
            const matrix: Map<number, number[]> = new Map([
                [1, [9, 3]],
                [2, [2, 4]],
            ]);

            const { matrix: nextMatrix } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'multiply',
                    rowId: 1,
                    multiplier: 2,
                },
            });

            expect(nextMatrix.get(1)).toEqual([18, 6]);
            expect(nextMatrix.get(2)).toEqual([2, 4]);
        });

        it('throws when the row to multiply is missing', () => {
            const matrix: Map<number, number[]> = new Map([
                [1, [9, 3]],
                [2, [2, 4]],
            ]);

            expect(() =>
                applyMatrixTransformation({
                    matrix,
                    transformation: {
                        type: 'multiply',
                        rowId: 99,
                        multiplier: 2,
                    },
                })
            ).toThrow('Matrix row 99 is missing');
        });
    });

    describe('row combination and replacement', () => {
        let matrix: Map<number, number[]>;

        beforeEach(() => {
            matrix = new Map([
                [1, [9, 3]],
                [2, [2, 4]],
            ]);
        });

        it('adds the rows together and writes the result to the replace row', () => {
            const { matrix: nextMatrix } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 1,
                    rowId01: 1,
                    coefficient02: 1,
                    rowId02: 2,
                    rowIdToReplace: 1,
                },
            });

            expect(nextMatrix.get(1)).toEqual([11, 7]);
            expect(nextMatrix.get(2)).toEqual([2, 4]);
        });

        it('writes the scaled row sum to the replace row on add', () => {
            const { matrix: nextMatrix } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 3,
                    rowId01: 1,
                    coefficient02: 2,
                    rowId02: 2,
                    rowIdToReplace: 2,
                },
            });

            // Initial:
            // [9, 3][2, 4]
            // After the multiplication:
            // [27, 9][4, 8]
            expect(nextMatrix.get(1)).toEqual([9, 3]);
            expect(nextMatrix.get(2)).toEqual([31, 17]);
        });

        it('works on arrays that are 4 x 6 (not 2x2)', () => {
            matrix = new Map([
                [1, [1, 2, 3, 4, 5, 6]],
                [2, [2, 2, 2, 2, 2, 2]],
                [3, [0, 1, 0, 1, 0, 1]],
                [4, [10, 0, 0, 0, 0, 1]],
            ]);

            const { matrix: nextMatrix } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    rowId01: 1,
                    coefficient01: 3,
                    rowId02: 4,
                    coefficient02: 2,
                    rowIdToReplace: 4,
                },
            });

            expect(nextMatrix.get(1)).toEqual([1, 2, 3, 4, 5, 6]);
            expect(nextMatrix.get(2)).toEqual([2, 2, 2, 2, 2, 2]);
            expect(nextMatrix.get(3)).toEqual([0, 1, 0, 1, 0, 1]);
            expect(nextMatrix.get(4)).toEqual([23, 6, 9, 12, 15, 20]);
        });

        it('throws when a source row is missing on add', () => {
            expect(() =>
                applyMatrixTransformation({
                    matrix,
                    transformation: {
                        type: 'add',
                        coefficient01: 1,
                        rowId01: 99,
                        coefficient02: 1,
                        rowId02: 2,
                        rowIdToReplace: 2,
                    },
                })
            ).toThrow('Matrix row 99 is missing');
        });

        it('throws when the replace row is neither source row', () => {
            expect(() =>
                applyMatrixTransformation({
                    matrix,
                    transformation: {
                        type: 'add',
                        coefficient01: 1,
                        rowId01: 1,
                        coefficient02: 1,
                        rowId02: 2,
                        rowIdToReplace: 3,
                    },
                })
            ).toThrow('rowIdToReplace must be 1 or 2');
        });

        it('throws when both source rows and the replace row are the same', () => {
            expect(() =>
                applyMatrixTransformation({
                    matrix,
                    transformation: {
                        type: 'add',
                        coefficient01: 1,
                        rowId01: 1,
                        coefficient02: 1,
                        rowId02: 1,
                        rowIdToReplace: 1,
                    },
                })
            ).toThrow('rowIdToReplace cannot be both 1 and 1');
        });
    });

    describe('steps', () => {
        let matrix: Map<number, number[]>;

        beforeEach(() => {
            matrix = new Map([
                [1, [5, 6]],
                [2, [7, 8]],
            ]);
        });

        it('records one step for a multiply', () => {
            const { steps } = applyMatrixTransformation({
                matrix,
                transformation: { type: 'multiply', rowId: 1, multiplier: 2 },
            });

            expect(steps).toEqual([
                new Map([
                    [1, [10, 12]],
                    [2, [7, 8]],
                ]),
            ]);
        });

        it('records no steps for a multiply by 1', () => {
            const { matrix: nextMatrix, steps } = applyMatrixTransformation({
                matrix,
                transformation: { type: 'multiply', rowId: 1, multiplier: 1 },
            });

            expect(steps).toEqual([]);
            expect(nextMatrix).toEqual(matrix);
        });

        it('records scale, scale, sum, and unscale steps when R2 is replaced', () => {
            matrix = new Map([
                [1, [10, 12]],
                [2, [7, 8]],
            ]);

            const { matrix: nextMatrix, steps } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 2,
                    rowId01: 1,
                    coefficient02: 3,
                    rowId02: 2,
                    rowIdToReplace: 2,
                },
            });

            expect(steps).toEqual([
                new Map([
                    [1, [20, 24]],
                    [2, [7, 8]],
                ]),
                new Map([
                    [1, [20, 24]],
                    [2, [21, 24]],
                ]),
                new Map([
                    [1, [20, 24]],
                    [2, [41, 48]],
                ]),
                new Map([
                    [1, [10, 12]],
                    [2, [41, 48]],
                ]),
            ]);
            expect(nextMatrix).toEqual(steps[3]);
        });

        it('records scale, scale, sum, and unscale steps when R1 is replaced', () => {
            const { steps } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 2,
                    rowId01: 1,
                    coefficient02: 3,
                    rowId02: 2,
                    rowIdToReplace: 1,
                },
            });

            expect(steps).toEqual([
                new Map([
                    [1, [10, 12]],
                    [2, [7, 8]],
                ]),
                new Map([
                    [1, [10, 12]],
                    [2, [21, 24]],
                ]),
                new Map([
                    [1, [31, 36]],
                    [2, [21, 24]],
                ]),
                new Map([
                    [1, [31, 36]],
                    [2, [7, 8]],
                ]),
            ]);
        });

        it('skips the scale and unscale steps when the coefficients are 1', () => {
            const { steps } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 1,
                    rowId01: 1,
                    coefficient02: 1,
                    rowId02: 2,
                    rowIdToReplace: 2,
                },
            });

            expect(steps).toEqual([
                new Map([
                    [1, [5, 6]],
                    [2, [12, 14]],
                ]),
            ]);
        });

        it('only scales the source row for R2 -> R2 + 3R1', () => {
            const { steps } = applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 3,
                    rowId01: 1,
                    coefficient02: 1,
                    rowId02: 2,
                    rowIdToReplace: 2,
                },
            });

            expect(steps).toEqual([
                new Map([
                    [1, [15, 18]],
                    [2, [7, 8]],
                ]),
                new Map([
                    [1, [15, 18]],
                    [2, [22, 26]],
                ]),
                new Map([
                    [1, [5, 6]],
                    [2, [22, 26]],
                ]),
            ]);
        });

        it('does not mutate the matrix passed in', () => {
            applyMatrixTransformation({
                matrix,
                transformation: {
                    type: 'add',
                    coefficient01: 2,
                    rowId01: 1,
                    coefficient02: 3,
                    rowId02: 2,
                    rowIdToReplace: 2,
                },
            });

            expect(matrix).toEqual(
                new Map([
                    [1, [5, 6]],
                    [2, [7, 8]],
                ])
            );
        });
    });
});
