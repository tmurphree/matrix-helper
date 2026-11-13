import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearHistory, isLocalStorageAvailable, MAX_MATRIX_HISTORY_STEPS, readHistory, recordHistory } from './matrix-history';

const firstMatrix: Map<number, number[]> = new Map([
    [1, [5, 6]],
    [2, [7, 8]],
]);
const secondMatrix: Map<number, number[]> = new Map([
    [1, [10, 12]],
    [2, [7, 8]],
]);

const preloadHistory = ({ stepCount }: { stepCount: number }): void => {
    for (let step = 1; step <= stepCount; step++) {
        localStorage.setItem(`matrix-history-${String(step).padStart(3, '0')}`, '[[1,[0,0]]]');
    }
};

const stubUnavailableLocalStorage = (): void => {
    const denyAccess = (): never => {
        throw new Error('localStorage is disabled');
    };

    vi.stubGlobal('localStorage', {
        getItem: denyAccess,
        key: denyAccess,
        length: 0,
        removeItem: denyAccess,
        setItem: denyAccess,
    });
};

describe('matrix-history', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('recordHistory', () => {
        it('stores the matrix entries as JSON under a zero-padded key', () => {
            recordHistory({ matrix: firstMatrix });

            expect(localStorage.getItem('matrix-history-001')).toBe('[[1,[5,6]],[2,[7,8]]]');
        });

        it('uses the next step number for each record', () => {
            recordHistory({ matrix: firstMatrix });
            recordHistory({ matrix: secondMatrix });

            expect(localStorage.getItem('matrix-history-002')).toBe('[[1,[10,12]],[2,[7,8]]]');
        });

        it('allows exactly the maximum number of steps', () => {
            preloadHistory({ stepCount: MAX_MATRIX_HISTORY_STEPS - 1 });

            recordHistory({ matrix: firstMatrix });

            expect(localStorage.getItem('matrix-history-999')).not.toBeNull();
        });

        it('throws when the maximum number of steps is exceeded', () => {
            preloadHistory({ stepCount: MAX_MATRIX_HISTORY_STEPS });

            expect(() => recordHistory({ matrix: firstMatrix })).toThrow('Matrix history cannot have more than 999 steps');
        });

        it('does nothing when localStorage is unavailable', () => {
            stubUnavailableLocalStorage();

            expect(() => recordHistory({ matrix: firstMatrix })).not.toThrow();
        });
    });

    describe('readHistory', () => {
        it('returns the recorded matrices in step order as Maps', () => {
            recordHistory({ matrix: firstMatrix });
            recordHistory({ matrix: secondMatrix });

            expect(readHistory()).toEqual([firstMatrix, secondMatrix]);
        });

        it('returns an empty array when nothing is recorded', () => {
            expect(readHistory()).toEqual([]);
        });

        it('returns an empty array when localStorage is unavailable', () => {
            stubUnavailableLocalStorage();

            expect(readHistory()).toEqual([]);
        });
    });

    describe('clearHistory', () => {
        it('removes only the matrix history keys', () => {
            recordHistory({ matrix: firstMatrix });
            localStorage.setItem('unrelated', 'keep me');

            clearHistory();

            expect(readHistory()).toEqual([]);
            expect(localStorage.getItem('unrelated')).toBe('keep me');
        });

        it('starts numbering again from step 1', () => {
            recordHistory({ matrix: firstMatrix });
            clearHistory();
            recordHistory({ matrix: secondMatrix });

            expect(localStorage.getItem('matrix-history-001')).toBe('[[1,[10,12]],[2,[7,8]]]');
        });

        it('does nothing when localStorage is unavailable', () => {
            stubUnavailableLocalStorage();

            expect(() => clearHistory()).not.toThrow();
        });
    });

    describe('isLocalStorageAvailable', () => {
        it('is true when localStorage works', () => {
            expect(isLocalStorageAvailable()).toBe(true);
        });

        it('is false when localStorage throws', () => {
            stubUnavailableLocalStorage();

            expect(isLocalStorageAvailable()).toBe(false);
        });
    });
});
