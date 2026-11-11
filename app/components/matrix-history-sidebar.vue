<template>
    <aside class="matrix-history-sidebar" aria-label="Transformation history">
        <h2>History</h2>
        <p class="matrix-history-sidebar__notice">Placeholder — not wired up yet.</p>
        <ol class="matrix-history-sidebar__list">
            <li
                v-for="entry in placeholderHistory"
                :key="entry.step"
                class="matrix-history-sidebar__item"
            >
                <p class="matrix-history-sidebar__step">Step {{ entry.step }}</p>
                <p class="matrix-history-sidebar__description">{{ entry.description }}</p>
                <pre class="matrix-history-sidebar__matrix">{{
                    formatMatrix(entry.matrix)
                }}</pre>
            </li>
        </ol>
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

<style scoped>
    .matrix-history-sidebar {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .matrix-history-sidebar__notice {
        margin: 0;
        font-style: italic;
    }

    .matrix-history-sidebar__list {
        margin: 0;
        padding-left: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .matrix-history-sidebar__item {
        list-style: decimal;
    }

    .matrix-history-sidebar__step {
        margin: 0 0 0.25rem;
        font-weight: 600;
    }

    .matrix-history-sidebar__description {
        margin: 0 0 0.25rem;
    }

    .matrix-history-sidebar__matrix {
        margin: 0;
        font-family: ui-monospace, monospace;
    }
</style>
