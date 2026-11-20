<template>
    <div class="d-flex flex-column min-vh-100">
        <NuxtRouteAnnouncer />
        <header class="border-bottom">
            <h1 class="h2 mb-2 ms-3">Matrix Helper</h1>
            <p class="text-body-secondary ms-3">Matrix Helper — step through matrix operations with fewer mistakes</p>
        </header>
        <main class="flex-grow-1 py-4">
            <NuxtPage />
        </main>
        <footer class="border-top py-3 mt-auto">
            <div class="container text-center text-body-secondary small">Consider helping someone today.</div>
        </footer>
    </div>
</template>

<script setup>
    useSeoMeta({
        title: 'Matrix Helper',
        description: 'Avoid common mistakes with matrix operations',
    });
</script>
