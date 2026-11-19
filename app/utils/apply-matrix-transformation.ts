import type { AddMatrixTransformation, MatrixTransformation, MatrixTransformationResult, MultiplyMatrixTransformation } from '../types/matrix-transformation';

const IDENTITY_SCALE = 1;

const copyMatrixRow = ({ matrix, rowId }: { matrix: Map<number, number[]>; rowId: number }): number[] => {
    const row = matrix.get(rowId);

    if (row === undefined) {
        throw new Error(`Matrix row ${rowId} is missing`);
    }

    return [...row];
};

const multiplyRowValues = ({ row, multiplier }: { row: number[]; multiplier: number }): number[] => {
    return row.map((currentElement) => currentElement * multiplier);
};

const applyMultiplyTransformation = ({ matrix, transformation }: { matrix: Map<number, number[]>; transformation: MultiplyMatrixTransformation }): MatrixTransformationResult => {
    const nextMatrix = new Map(matrix);

    nextMatrix.set(
        transformation.rowId,
        multiplyRowValues({
            row: copyMatrixRow({ matrix, rowId: transformation.rowId }),
            multiplier: transformation.multiplier,
        })
    );

    const steps = transformation.multiplier === IDENTITY_SCALE ? [] : [new Map(nextMatrix)];

    return { matrix: nextMatrix, steps };
};

const applyAddTransformation = ({ matrix, transformation }: { matrix: Map<number, number[]>; transformation: AddMatrixTransformation }): MatrixTransformationResult => {
    if (transformation.rowIdToReplace !== transformation.rowId01 && transformation.rowIdToReplace !== transformation.rowId02) {
        throw new Error(`rowIdToReplace must be ${transformation.rowId01} or ${transformation.rowId02}`);
    }

    if (transformation.rowIdToReplace === transformation.rowId01 && transformation.rowIdToReplace === transformation.rowId02) {
        throw new Error(`rowIdToReplace cannot be both ${transformation.rowId01} and ${transformation.rowId02}`);
    }

    const row01 = copyMatrixRow({ matrix, rowId: transformation.rowId01 });
    const row02 = copyMatrixRow({ matrix, rowId: transformation.rowId02 });

    const transformed01 = multiplyRowValues({
        row: row01,
        multiplier: transformation.coefficient01,
    });
    const transformed02 = multiplyRowValues({
        row: row02,
        multiplier: transformation.coefficient02,
    });
    const replacementRow = transformed01.map((element, index) => element + transformed02[index]);

    const isRow01Replaced = transformation.rowIdToReplace === transformation.rowId01;
    const rowIdToRestore = isRow01Replaced ? transformation.rowId02 : transformation.rowId01;
    const rowToRestore = isRow01Replaced ? row02 : row01;
    const coefficientToRestore = isRow01Replaced ? transformation.coefficient02 : transformation.coefficient01;

    // Each step snapshots the matrix as the student would write it on paper,
    // so scaled rows stay scaled until the final "unscale" step.
    const workingMatrix = new Map(matrix);
    const steps: Map<number, number[]>[] = [];

    const recordStep = (): void => {
        steps.push(new Map(workingMatrix));
    };

    if (transformation.coefficient01 !== IDENTITY_SCALE) {
        workingMatrix.set(transformation.rowId01, transformed01);
        recordStep();
    }

    if (transformation.coefficient02 !== IDENTITY_SCALE) {
        workingMatrix.set(transformation.rowId02, transformed02);
        recordStep();
    }

    workingMatrix.set(transformation.rowIdToReplace, replacementRow);
    recordStep();

    if (coefficientToRestore !== IDENTITY_SCALE) {
        workingMatrix.set(rowIdToRestore, rowToRestore);
        recordStep();
    }

    return { matrix: new Map(workingMatrix), steps };
};

export const applyMatrixTransformation = ({ matrix, transformation }: { matrix: Map<number, number[]>; transformation: MatrixTransformation }): MatrixTransformationResult => {
    if (transformation.type === 'multiply') {
        return applyMultiplyTransformation({ matrix, transformation });
    }

    return applyAddTransformation({ matrix, transformation });
};
