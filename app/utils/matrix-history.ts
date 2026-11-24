export const MATRIX_HISTORY_KEY_PREFIX = 'matrix-history-';
export const MAX_MATRIX_HISTORY_STEPS = 999;

export type MatrixHistoryEntry = {
    matrix: Map<number, number[]>;
    summary?: string;
};

const STEP_NUMBER_DIGITS = String(MAX_MATRIX_HISTORY_STEPS).length;
const STORAGE_PROBE_KEY = 'matrix-helper-storage-probe';
const MATRIX_HISTORY_KEY_PATTERN = new RegExp(`^${MATRIX_HISTORY_KEY_PREFIX}\\d{${STEP_NUMBER_DIGITS}}$`);

// Browsers can throw on any access to localStorage (blocked cookies, private
// mode, quota of zero), so availability can only be learned by trying it.
export const isLocalStorageAvailable = (): boolean => {
    try {
        localStorage.setItem(STORAGE_PROBE_KEY, STORAGE_PROBE_KEY);
        localStorage.removeItem(STORAGE_PROBE_KEY);

        return true;
    } catch {
        return false;
    }
};

const getHistoryKeys = (): string[] => {
    const keys: string[] = [];

    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);

        if (key !== null && MATRIX_HISTORY_KEY_PATTERN.test(key)) {
            keys.push(key);
        }
    }

    return keys.sort();
};

const buildHistoryKey = (stepNumber: number): string => {
    return `${MATRIX_HISTORY_KEY_PREFIX}${String(stepNumber).padStart(STEP_NUMBER_DIGITS, '0')}`;
};

const isNumberArray = (value: unknown): value is number[] => {
    return Array.isArray(value) && value.every((element) => typeof element === 'number');
};

const isMatrixEntries = (value: unknown): value is [number, number[]][] => {
    if (!Array.isArray(value)) {
        return false;
    }

    return value.every((entry) => {
        if (!Array.isArray(entry) || entry.length !== 2) {
            return false;
        }

        const rowId: unknown = entry[0];
        const row: unknown = entry[1];

        return typeof rowId === 'number' && isNumberArray(row);
    });
};

const parseHistoryEntry = (value: unknown): MatrixHistoryEntry | undefined => {
    if (isMatrixEntries(value)) {
        return { matrix: new Map(value) };
    }

    if (typeof value !== 'object' || value === null) {
        return undefined;
    }

    const record = value as { matrix?: unknown; summary?: unknown };

    if (!isMatrixEntries(record.matrix)) {
        return undefined;
    }

    if (record.summary !== undefined && typeof record.summary !== 'string') {
        return undefined;
    }

    if (record.summary === undefined) {
        return { matrix: new Map(record.matrix) };
    }

    return { matrix: new Map(record.matrix), summary: record.summary };
};

export const recordHistory = ({ matrix, summary }: { matrix: Map<number, number[]>; summary?: string }): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    const stepNumber = getHistoryKeys().length + 1;

    if (stepNumber > MAX_MATRIX_HISTORY_STEPS) {
        throw new Error(`Matrix history cannot have more than ${MAX_MATRIX_HISTORY_STEPS} steps`);
    }

    const storedEntry =
        summary === undefined ? { matrix: [...matrix.entries()] } : { matrix: [...matrix.entries()], summary };

    localStorage.setItem(buildHistoryKey(stepNumber), JSON.stringify(storedEntry));
};

export const readHistory = (): MatrixHistoryEntry[] => {
    if (!isLocalStorageAvailable()) {
        return [];
    }

    const entries: MatrixHistoryEntry[] = [];

    for (const key of getHistoryKeys()) {
        const storedEntry = localStorage.getItem(key);

        // getHistoryKeys only returns keys that exist in localStorage, so getItem cannot return null here.
        /* v8 ignore if -- @preserve */
        if (storedEntry === null) {
            continue;
        }

        try {
            const entry = parseHistoryEntry(JSON.parse(storedEntry));

            if (entry !== undefined) {
                entries.push(entry);
            }
        } catch {
            continue;
        }
    }

    return entries;
};

export const clearHistory = (): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    for (const key of getHistoryKeys()) {
        localStorage.removeItem(key);
    }
};
