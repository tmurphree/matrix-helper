<template>
    <p>Welcome to my starter app!</p>
    <p>Just the value: {{ counter }}</p>
    <p>As a function: {{ showCounter(counter) }}.  Note that `counter` is not a Ref here.  Its value is unwrapped and it's just a value.</p>
    <p>asdf.foo is {{ asdf.foo }}</p>
</template>

<script setup lang="ts">
    const counter = ref(42);
    const asdf = reactive({ foo: 'bar' });

    const showCounter = (input: number): number => {
        return input;
    };

    let fooUpdateTimeoutId: ReturnType<typeof setTimeout> | undefined;

    onMounted(() => {
        fooUpdateTimeoutId = setTimeout(() => {
            asdf.foo = 'the new value';
        }, 3000);
    });

    onUnmounted(() => {
        if (fooUpdateTimeoutId !== undefined) {
            clearTimeout(fooUpdateTimeoutId);
        }
    });
</script>
