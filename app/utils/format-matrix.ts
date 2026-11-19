export const formatMatrix = (rows: Array<number[]>): string => {
    return rows.map((row) => row.join('\t')).join('\n');
};
