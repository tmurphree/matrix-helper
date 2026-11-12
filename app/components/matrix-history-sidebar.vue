<template>
    <aside class="card shadow-sm h-100" aria-label="Transformation history">
        <div class="card-body">
            <h2 class="h4 card-title">History</h2>
            <p class="text-body-secondary fst-italic mb-3">
                Placeholder — not wired up yet.
            </p>
            <ol class="list-group list-group-numbered">
                <li
                    v-for="entry in placeholderHistory"
                    :key="entry.step"
                    class="list-group-item border-0 px-0"
                >
                    <p class="fw-semibold mb-1">Step {{ entry.step }}</p>
                    <p class="mb-2">{{ entry.description }}</p>
                    <pre
                        class="bg-body-secondary bg-opacity-10 border rounded p-2 mb-0 font-monospace small"
                        >{{ formatMatrix(entry.matrix) }}</pre
                    >
                </li>
            </ol>
        </div>
    </aside>
</template>

<script setup lang="ts">
    type HistoryPlaceholderEntry = {
        step: number;
        description: string;
        matrix: number[][];
    };

    const placeholderHistory: HistoryPlaceholderEntry[] = [
        {
            step: 1,
            description: 'Initial matrix',
            matrix: [
                [1, 2],
                [3, 4],
            ],
        },
        {
            step: 2,
            description: 'R2 ← R2 − 3R1',
            matrix: [
                [1, 2],
                [0, -4],
            ],
        },
        {
            step: 3,
            description: 'R2 ← −¼R2',
            matrix: [
                [1, 2],
                [0, 1],
            ],
        },
    ];

    const formatMatrix = (rows: number[][]): string => {
        return rows.map((row) => row.join('\t')).join('\n');
    };
</script>
