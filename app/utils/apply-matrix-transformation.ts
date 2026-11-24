import type {
    AddMatrixTransformation,
    MatrixTransformation,
    MatrixTransformationResult,
    MatrixTransformationStep,
    MultiplyMatrixTransformation,
} from '../types/matrix-transformation';

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

const applyMultiplyTransformation = ({
    matrix,
    transformation,
}: {
    matrix: Map<number, number[]>;
    transformation: MultiplyMatrixTransformation;
}): MatrixTransformationResult => {
    const nextMatrix = new Map(matrix);

    nextMatrix.set(
        transformation.rowId,
        multiplyRowValues({
            row: copyMatrixRow({ matrix, rowId: transformation.rowId }),
            multiplier: transformation.multiplier,
        })
    );

    const steps: MatrixTransformationStep[] =
        transformation.multiplier === IDENTITY_SCALE
            ? []
            : [
                  {
                      matrix: new Map(nextMatrix),
                      summary: `${transformation.multiplier}R${transformation.rowId}`,
                  },
              ];

    return { matrix: nextMatrix, steps };
};

const applyAddTransformation = ({
    matrix,
    transformation,
}: {
    matrix: Map<number, number[]>;
    transformation: AddMatrixTransformation;
}): MatrixTransformationResult => {
    if (
        transformation.rowIdToReplace !== transformation.rowId01 &&
        transformation.rowIdToReplace !== transformation.rowId02
    ) {
        throw new Error(`rowIdToReplace must be ${transformation.rowId01} or ${transformation.rowId02}`);
    }

    if (
        transformation.rowIdToReplace === transformation.rowId01 &&
        transformation.rowIdToReplace === transformation.rowId02
    ) {
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
    const replacementRow = transformed01.map((element, index): number => {
        const pairedElement = transformed02[index];

        if (pairedElement === undefined) {
            throw new Error(`Matrix column ${index + 1} is missing`);
        }

        return element + pairedElement;
    });

    const isRow01Replaced = transformation.rowIdToReplace === transformation.rowId01;
    const rowIdToRestore = isRow01Replaced ? transformation.rowId02 : transformation.rowId01;
    const rowToRestore = isRow01Replaced ? row02 : row01;
    const coefficientToRestore = isRow01Replaced ? transformation.coefficient02 : transformation.coefficient01;

    // Each step snapshots the matrix as the student would write it on paper,
    // so scaled rows stay scaled until the final "unscale" step.
    const workingMatrix = new Map(matrix);
    const steps: MatrixTransformationStep[] = [];

    const recordStep = ({ summary }: { summary: string }): void => {
        steps.push({ matrix: new Map(workingMatrix), summary });
    };

    if (transformation.coefficient01 !== IDENTITY_SCALE) {
        workingMatrix.set(transformation.rowId01, transformed01);
        recordStep({ summary: `${transformation.coefficient01}R${transformation.rowId01}` });
    }

    if (transformation.coefficient02 !== IDENTITY_SCALE) {
        workingMatrix.set(transformation.rowId02, transformed02);
        recordStep({ summary: `${transformation.coefficient02}R${transformation.rowId02}` });
    }

    workingMatrix.set(transformation.rowIdToReplace, replacementRow);
    recordStep({
        summary: `R${transformation.rowId01} + R${transformation.rowId02} -> R${transformation.rowIdToReplace}`,
    });

    if (coefficientToRestore !== IDENTITY_SCALE) {
        workingMatrix.set(rowIdToRestore, rowToRestore);
        recordStep({ summary: `unscale (1/${coefficientToRestore} R${rowIdToRestore})` });
    }

    return { matrix: new Map(workingMatrix), steps };
};

export const applyMatrixTransformation = ({
    matrix,
    transformation,
}: {
    matrix: Map<number, number[]>;
    transformation: MatrixTransformation;
}): MatrixTransformationResult => {
    if (transformation.type === 'multiply') {
        return applyMultiplyTransformation({ matrix, transformation });
    }

    return applyAddTransformation({ matrix, transformation });
};
