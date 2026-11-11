<template>
    <div>
        <NuxtRouteAnnouncer />
        <HelloWorld />
        <NuxtWelcome />
    </div>
</template>

<script setup>
    useSeoMeta({
        title: 'App base title',
        description: 'An application base that has some common settings and nothing else'
    });
</script>
