import type {
    AddMatrixTransformation,
    MatrixTransformation,
    MultiplyMatrixTransformation,
} from '../types/matrix-transformation';

const copyMatrixRow = ({
    matrix,
    rowId,
}: {
    matrix: Map<number, number[]>;
    rowId: number;
}): number[] => {
    const row = matrix.get(rowId);

    if (row === undefined) {
        throw new Error(`Matrix row ${rowId} is missing`);
    }

    return [...row];
};

const multiplyRowValues = ({
    row,
    multiplier,
}: {
    row: number[];
    multiplier: number;
}): number[] => {
    return row.map((currentElement) => currentElement * multiplier);
};

const applyMultiplyTransformation = ({
    matrix,
    transformation,
}: {
    matrix: Map<number, number[]>;
    transformation: MultiplyMatrixTransformation;
}): Map<number, number[]> => {
    const nextMatrix = new Map(matrix);

    nextMatrix.set(
        transformation.rowId,
        multiplyRowValues({
            row: copyMatrixRow({ matrix, rowId: transformation.rowId }),
            multiplier: transformation.multiplier,
        })
    );

    return nextMatrix;
};

const applyAddTransformation = ({
    matrix,
    transformation,
}: {
    matrix: Map<number, number[]>;
    transformation: AddMatrixTransformation;
}): Map<number, number[]> => {
    if (transformation.rowIdToReplace !== transformation.rowId01 && transformation.rowIdToReplace !== transformation.rowId02) {
        throw new Error(`rowIdToReplace must be ${transformation.rowId01} or ${transformation.rowId02}`);
    }

    if (transformation.rowIdToReplace === transformation.rowId01 && transformation.rowIdToReplace === transformation.rowId02) {
        throw new Error(`rowIdToReplace cannot be both ${transformation.rowId01} and ${transformation.rowId02}`);
    }

    const row01 = copyMatrixRow({ matrix, rowId: transformation.rowId01 });
    const row02 = copyMatrixRow({ matrix, rowId: transformation.rowId02 });

    const transformed01 = multiplyRowValues({ row: row01, multiplier: transformation.coefficient01 });
    const transformed02 = multiplyRowValues({ row: row02, multiplier: transformation.coefficient02 });
    const replacementRow = transformed01.map((element, index) => (element + transformed02[index]));

    const nextMatrix = new Map(matrix);

    nextMatrix.set(transformation.rowIdToReplace, replacementRow);

    return nextMatrix;
};

export const applyMatrixTransformation = ({
    matrix,
    transformation,
}: {
    matrix: Map<number, number[]>;
    transformation: MatrixTransformation;
}): Map<number, number[]> => {
    if (transformation.type === 'multiply') {
        return applyMultiplyTransformation({ matrix, transformation });
    }

    return applyAddTransformation({ matrix, transformation });
};
