<template>
    <div class="d-flex flex-column min-vh-100">
        <NuxtRouteAnnouncer />
        <header class="border-bottom">
            <nav class="navbar navbar-expand-lg bg-body-tertiary" aria-label="Main navigation">
                <div class="container">
                    <NuxtLink class="navbar-brand fw-semibold" to="/"> Matrix Helper </NuxtLink>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div id="mainNav" class="collapse navbar-collapse">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <NuxtLink class="nav-link" active-class="active" to="/"> Home </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink class="nav-link" active-class="active" to="/inverse"> Inverse </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink class="nav-link" active-class="active" to="/reduced-row-echelon-form"> RREF </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <main class="flex-grow-1 py-4">
            <NuxtPage />
        </main>
        <footer class="border-top py-3 mt-auto">
            <div class="container text-center text-body-secondary small">Matrix Helper — step through matrix operations with fewer mistakes</div>
        </footer>
    </div>
</template>

<script setup>
    useSeoMeta({
        title: 'Matrix Helper',
        description: 'Avoid common mistakes with matrix operations',
    });
</script>
