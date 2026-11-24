<template>
    <aside class="card shadow-sm h-100" aria-label="Transformation history">
        <div class="card-body">
            <h2 class="h4 card-title">History</h2>
            <ul class="list-group list-group-flush">
                <li v-for="(entry, index) in history" :key="index" class="list-group-item px-0">
                    <p v-if="index > 0" class="fw-semibold mb-1">{{ stepLabel({ index, summary: entry.summary }) }}</p>
                    <p v-else class="fw-semibold mb-1">Initial matrix</p>
                    <pre class="bg-body-secondary bg-opacity-10 border rounded p-2 mb-0 font-monospace small">{{
                        toDisplayMatrix(entry.matrix)
                    }}</pre>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup lang="ts">
    import type { MatrixHistoryEntry } from '../utils/matrix-history';

    defineProps<{
        history: MatrixHistoryEntry[];
    }>();

    const stepLabel = ({ index, summary }: { index: number; summary: string | undefined }): string => {
        if (summary === undefined) {
            return `Step ${index}`;
        }

        return `Step ${index}: ${summary}`;
    };

    const toDisplayMatrix = (matrix: Map<number, number[]>): string => {
        return formatMatrix([...matrix.values()]);
    };
</script>
