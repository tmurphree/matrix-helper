<template>
    <div>
        <h1>Reduced Row Echelon Form</h1>
        <p>This is a tool to help you with matrix operations.</p>
    </div>
</template>

<script setup lang="ts">
    useSeoMeta({
        title: 'Reduced Row Echelon Form',
        description: 'Reduce a matrix to reduced row echelon form'
    });

    const matrix = ref<Matrix>({
        data: new Map(),
        id: 0
    });
</script>
