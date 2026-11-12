<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="text-center mb-4">
                    <h1 class="display-5 fw-bold mb-3">
                        Welcome to the Matrix Helper
                    </h1>
                    <p class="lead text-body-secondary">
                        This is a tool to help you with matrix operations.
                    </p>
                </div>
                <div class="row g-4">
                    <div class="col-md-4">
                        <NuxtLink
                            to="/inverse"
                            class="card text-decoration-none h-100 shadow-sm"
                        >
                            <div class="card-body">
                                <h2 class="h5 card-title">Inverse</h2>
                                <p class="card-text text-body-secondary">
                                    Find the inverse of a square matrix.
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                    <div class="col-md-4">
                        <NuxtLink
                            to="/reduced-row-echelon-form"
                            class="card text-decoration-none h-100 shadow-sm"
                        >
                            <div class="card-body">
                                <h2 class="h5 card-title">RREF</h2>
                                <p class="card-text text-body-secondary">
                                    Reduce a matrix to reduced row echelon form.
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    useSeoMeta({
        title: 'Home',
        description: 'The home page of the Matrix Helper',
    });
</script>
