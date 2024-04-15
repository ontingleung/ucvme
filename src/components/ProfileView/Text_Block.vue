<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

export interface Props {
    text_string: string;
}

const props = withDefaults(defineProps<Props>(), {
    text_string: 'Loading...'
});
</script>

<template>
    <div class="flex justify-center items-center">
        <h1 class="text-1xl text-center p-4 bg-white/60 backdrop-blur-md shadow-lg">
            {{ props.text_string }}
        </h1>
    </div>
</template>
