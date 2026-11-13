import { clearHistory, isLocalStorageAvailable, readHistory, recordHistory } from '../utils/matrix-history';

export const useMatrixHistory = () => {
    const history = ref<Map<number, number[]>[]>([]);
    const isLocalStorageEnabled = ref(false);

    const loadHistory = (): void => {
        history.value = readHistory();
    };

    const startHistory = ({ matrix }: { matrix: Map<number, number[]> }): void => {
        clearHistory();
        recordHistory({ matrix });
        loadHistory();
    };

    const recordSteps = ({ steps }: { steps: Map<number, number[]>[] }): void => {
        for (const step of steps) {
            recordHistory({ matrix: step });
        }

        loadHistory();
    };

    const resetHistory = (): void => {
        clearHistory();
        loadHistory();
    };

    // localStorage does not exist during server rendering, so reading it
    // before mount would cause a hydration mismatch.
    onMounted(() => {
        isLocalStorageEnabled.value = isLocalStorageAvailable();
        loadHistory();
    });

    return {
        history,
        isLocalStorageEnabled,
        loadHistory,
        recordSteps,
        resetHistory,
        startHistory,
    };
};
