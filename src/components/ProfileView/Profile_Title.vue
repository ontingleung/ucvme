<!-- 

This is the title for each Profile

"John, 27 years old from Cork"

-->

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

export interface Props {
    firstName: string,
    surname: string,
    profile_town: string
}

const props = withDefaults(defineProps<Props>(), {
    firstName: 'Loading...',
    surname: '',
    profile_town: '...'
});
</script>

<template>
    <div class="flex justify-center items-center">
        <h1 class="text-2xl font-bold text-center p-4 bg-white/60 backdrop-blur-md shadow-md">
            {{ props.firstName }} {{ props.surname }}, from {{ props.profile_town }}
        </h1>
    </div>
</template>
