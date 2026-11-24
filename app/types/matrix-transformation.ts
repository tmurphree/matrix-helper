export type MultiplyMatrixTransformation = {
    type: 'multiply';
    rowId: number;
    multiplier: number;
};

export type AddMatrixTransformation = {
    type: 'add';
    coefficient01: number;
    rowId01: number;
    coefficient02: number;
    rowId02: number;
    rowIdToReplace: number;
};

export type MatrixTransformation = MultiplyMatrixTransformation | AddMatrixTransformation;

export type MatrixTransformationStep = {
    matrix: Map<number, number[]>;
    summary: string;
};

export type MatrixTransformationResult = {
    matrix: Map<number, number[]>;
    steps: MatrixTransformationStep[];
};
