<!-- 

This is the card for each Profile when searching 

-->



<script setup lang="ts">


import { defineProps, withDefaults } from 'vue';
import { useRouter } from 'vue-router';

export interface Props {
    profile_ID: string,
    profile_thumbnail_url: string,
    profile_name: string,
    //profile_subtitle: string,
    description: string
}

const props = withDefaults(defineProps<Props>(), {
    profile_name: "Loading...",
    profile_subtitle: "Loading... Please wait",
    description: "Loading description... Please wait"
});

const router = useRouter();

function GoToProfile(profile_link_to_nav_to: string)
{
    router.push(`/view-profile/${profile_link_to_nav_to}`);
}


</script>

<template>
    <button class="max-w-sm rounded overflow-hidden shadow-lg bg-lime-700"
        @click="GoToProfile(profile_ID)"  >
        <img class="w-full" :src="props.profile_thumbnail_url" :alt="props.profile_name">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">{{ props.profile_name }}</div>
            <p class="text-gray-700 text-base">
                {{ props.description }}
            </p>
        </div>
        <div class="px-6 pt-4 pb-2">
            <!--
            <span
                class="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{{
                props.profile_subtitle }}
            </span>
            -->
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Contact {{ props.profile_name.split(' ')[0] }}
            </button>
            <button
                class="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Play video
            </button>
        </div>
    </button>
</template>



<style>
</style>