<template>
    <div>
        <NuxtRouteAnnouncer />
        <div>
            <nav>
                <ol>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/inverse">Inverse</NuxtLink></li>
                    <li><NuxtLink to="/reduced-row-echelon-form">RREF</NuxtLink></li>
                </ol>
            </nav>
        </div>
        <div>
            <NuxtPage />
        </div>
    </div>
</template>

<script setup>
    useSeoMeta({
        title: 'Matrix Helper',
        description: 'Avoid common mistakes with matrix operations'
    });
</script>
