import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    clearHistory,
    isLocalStorageAvailable,
    MAX_MATRIX_HISTORY_STEPS,
    readHistory,
    recordHistory,
} from './matrix-history';

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

            expect(localStorage.getItem('matrix-history-001')).toBe('{"matrix":[[1,[5,6]],[2,[7,8]]]}');
        });

        it('stores a summary when one is recorded', () => {
            recordHistory({ matrix: secondMatrix, summary: '2R1' });

            expect(localStorage.getItem('matrix-history-001')).toBe('{"matrix":[[1,[10,12]],[2,[7,8]]],"summary":"2R1"}');
        });

        it('uses the next step number for each record', () => {
            recordHistory({ matrix: firstMatrix });
            recordHistory({ matrix: secondMatrix, summary: '2R1' });

            expect(localStorage.getItem('matrix-history-002')).toBe('{"matrix":[[1,[10,12]],[2,[7,8]]],"summary":"2R1"}');
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
            recordHistory({ matrix: secondMatrix, summary: '2R1' });

            expect(readHistory()).toEqual([{ matrix: firstMatrix }, { matrix: secondMatrix, summary: '2R1' }]);
        });

        it('reads a legacy entries array as a matrix with no summary', () => {
            localStorage.setItem('matrix-history-001', '[[1,[5,6]],[2,[7,8]]]');

            expect(readHistory()).toEqual([{ matrix: firstMatrix }]);
        });

        it('skips invalid stored values', () => {
            localStorage.setItem('matrix-history-001', 'not json');
            localStorage.setItem('matrix-history-002', 'null');
            localStorage.setItem('matrix-history-003', '5');
            localStorage.setItem('matrix-history-004', '{"matrix":"nope"}');
            localStorage.setItem('matrix-history-005', '{"matrix":[[1,[1,2]]],"summary":1}');
            localStorage.setItem('matrix-history-006', '["nope"]');
            localStorage.setItem('matrix-history-007', '[[1]]');
            localStorage.setItem('matrix-history-008', '[["row",[1]]]');
            localStorage.setItem('matrix-history-009', '[[1,"row"]]');
            localStorage.setItem('matrix-history-010', '[[1,[1,"a"]]]');
            localStorage.setItem('matrix-history-011', '[[1,[5,6]],[2,[7,8]]]');

            expect(readHistory()).toEqual([{ matrix: firstMatrix }]);
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

            expect(localStorage.getItem('matrix-history-001')).toBe('{"matrix":[[1,[10,12]],[2,[7,8]]]}');
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
