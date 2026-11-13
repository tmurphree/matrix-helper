<template>
    <aside class="card shadow-sm h-100" aria-label="Transformation history">
        <div class="card-body">
            <h2 class="h4 card-title">History</h2>
            <ul class="list-group list-group-flush">
                <li v-for="(matrix, index) in history" :key="index" class="list-group-item px-0">
                    <p class="fw-semibold mb-1">Step {{ index + 1 }}</p>
                    <pre class="bg-body-secondary bg-opacity-10 border rounded p-2 mb-0 font-monospace small">{{ toDisplayMatrix(matrix) }}</pre>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup lang="ts">
    defineProps<{
        history: Map<number, number[]>[];
    }>();

    const toDisplayMatrix = (matrix: Map<number, number[]>): number[][] => {
        return [...matrix.values()];
    };
</script>
