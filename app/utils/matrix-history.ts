export const MATRIX_HISTORY_KEY_PREFIX = 'matrix-history-';
export const MAX_MATRIX_HISTORY_STEPS = 999;

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

export const recordHistory = ({ matrix }: { matrix: Map<number, number[]> }): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    const stepNumber = getHistoryKeys().length + 1;

    if (stepNumber > MAX_MATRIX_HISTORY_STEPS) {
        throw new Error(`Matrix history cannot have more than ${MAX_MATRIX_HISTORY_STEPS} steps`);
    }

    localStorage.setItem(buildHistoryKey(stepNumber), JSON.stringify([...matrix.entries()]));
};

export const readHistory = (): Map<number, number[]>[] => {
    if (!isLocalStorageAvailable()) {
        return [];
    }

    return getHistoryKeys().map((key) => {
        const storedMatrix = localStorage.getItem(key);

        if (storedMatrix === null) {
            throw new Error(`Matrix history ${key} is missing`);
        }

        return new Map<number, number[]>(JSON.parse(storedMatrix));
    });
};

export const clearHistory = (): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    for (const key of getHistoryKeys()) {
        localStorage.removeItem(key);
    }
};
