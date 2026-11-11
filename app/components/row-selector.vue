<template>
    <div class="d-inline-flex align-items-center gap-1 row-selector">
        <label class="form-label mb-0 small" :for="selectId">row</label>
        <select
            :id="selectId"
            v-model.number="selectedRow"
            class="form-select form-select-sm"
        >
            <option v-for="row in rowOptions" :key="row" :value="row">
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
        (_unused, index) => index + 1
    );
});
</script>
