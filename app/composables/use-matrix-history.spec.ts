import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { readHistory } from '../utils/matrix-history';
import { useMatrixHistory } from './use-matrix-history';

type MatrixHistoryApi = ReturnType<typeof useMatrixHistory>;

const firstMatrix: Map<number, number[]> = new Map([
    [1, [5, 6]],
    [2, [7, 8]],
]);
const secondMatrix: Map<number, number[]> = new Map([
    [1, [10, 12]],
    [2, [7, 8]],
]);

const mountComposable = (): MatrixHistoryApi => {
    let api: MatrixHistoryApi | undefined;

    mount(
        defineComponent({
            setup() {
                api = useMatrixHistory();

                return () => null;
            },
        })
    );

    if (api === undefined) {
        throw new Error('useMatrixHistory was not set up');
    }

    return api;
};

describe('useMatrixHistory', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('enables local storage after mount when it is available', () => {
        const historyApi = mountComposable();

        expect(historyApi.isLocalStorageEnabled.value).toBe(true);
    });

    it('disables local storage after mount when it is unavailable', () => {
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

        const historyApi = mountComposable();

        expect(historyApi.isLocalStorageEnabled.value).toBe(false);
        expect(historyApi.history.value).toEqual([]);
    });

    it('loads the stored history on mount', () => {
        localStorage.setItem('matrix-history-001', '[[1,[5,6]],[2,[7,8]]]');

        const historyApi = mountComposable();

        expect(historyApi.history.value).toEqual([firstMatrix]);
    });

    describe('startHistory', () => {
        it('clears the old history and records the matrix as step 1', () => {
            localStorage.setItem('matrix-history-001', '[[1,[1,1]]]');
            localStorage.setItem('matrix-history-002', '[[1,[2,2]]]');
            const historyApi = mountComposable();

            historyApi.startHistory({ matrix: firstMatrix });

            expect(historyApi.history.value).toEqual([firstMatrix]);
            expect(readHistory()).toEqual([firstMatrix]);
        });
    });

    describe('recordSteps', () => {
        it('appends each step in order', () => {
            const historyApi = mountComposable();
            historyApi.startHistory({ matrix: firstMatrix });

            historyApi.recordSteps({ steps: [secondMatrix, firstMatrix] });

            expect(historyApi.history.value).toEqual([firstMatrix, secondMatrix, firstMatrix]);
        });
    });

    describe('resetHistory', () => {
        it('clears the stored and loaded history', () => {
            const historyApi = mountComposable();
            historyApi.startHistory({ matrix: firstMatrix });

            historyApi.resetHistory();

            expect(historyApi.history.value).toEqual([]);
            expect(readHistory()).toEqual([]);
        });
    });
});
