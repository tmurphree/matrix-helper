import type { MatrixTransformationStep } from '../types/matrix-transformation';
import {
    clearHistory,
    isLocalStorageAvailable,
    readHistory,
    recordHistory,
    type MatrixHistoryEntry,
} from '../utils/matrix-history';

export const useMatrixHistory = () => {
    const history = ref<MatrixHistoryEntry[]>([]);
    const isLocalStorageEnabled = ref(false);

    const hasHistory = computed((): boolean => history.value.length > 0);

    const loadHistory = (): void => {
        history.value = readHistory();
    };

    const startHistory = ({ matrix }: { matrix: Map<number, number[]> }): void => {
        clearHistory();
        recordHistory({ matrix });
        loadHistory();
    };

    const recordSteps = ({ steps }: { steps: MatrixTransformationStep[] }): void => {
        for (const step of steps) {
            recordHistory({ matrix: step.matrix, summary: step.summary });
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
        hasHistory,
        history,
        isLocalStorageEnabled,
        loadHistory,
        recordSteps,
        resetHistory,
        startHistory,
    };
};
