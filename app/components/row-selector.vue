<template>
    <div class="row-selector">
        <label class="row-selector__label" :for="selectId">row</label>
        <select
            :id="selectId"
            v-model.number="selectedRow"
            class="row-selector__select"
        >
            <option
                v-for="row in rowOptions"
                :key="row"
                :value="row"
            >
                {{ row }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        matrixRowLength: number;
    }>();

    const selectedRow = defineModel<number>('selectedRow', { required: true });

    const selectId = useId();

    const rowOptions = computed(() => {
        return Array.from(
            { length: props.matrixRowLength },
            (_unused, index) => index + 1,
        );
    });
</script>

<style scoped>
    .row-selector {
        display: inline-block;
        flex-direction: column;
        gap: 0.25rem;
    }

    .row-selector__label {
        margin-right: 5px;
    }

    .row-selector__select {
        max-width: 100%;
    }
</style>
