<!-- 
    
    This is the card for each Job Listing when searching 
    
-->
<script setup lang="ts">

import { defineProps, withDefaults, ref } from 'vue';
import { useRouter } from 'vue-router';



const router = useRouter();

const props = withDefaults(defineProps<{
    job_ID: string,
    job_county: string,
    job_town: string,
    job_author: string,
    job_title: string,
    job_description: string
}>(), {
    job_ID: "Loading...",
    job_county: "Loading...",
    job_town: "Loading...",
    job_author: "Loading...",
    job_title: "Loading...",
    job_description: "Loading..."
});

// function GoToMessageProfile(profile_link_to_nav_to: string) {
//     router.push(`/messaging`);
//     // router.push(`/messaging/${profile_link_to_nav_to}`); // Need to implement messaging
// }


function GoToJob(job_link_to_nav_to: string) {
    router.push(`/view-job/${job_link_to_nav_to}`);
}


</script>

<template>


    <button
        class="grid w-full grid-cols-2 max-h-72 grid-rows-4 auto-rows-auto gap-4 p-4 justify-stretch bg-gradient-to-r from-green-500 to-green-700 rounded-3xl ring-4 ring-black"
        @click="GoToJob(job_ID)">

        <!-- <div
            class=" bg-slate-200 ring-4  ring-black row-span-4 rounded-full grid w-48 h-48 place-content-center text-center">
            <img :src="job_img"></img>
        </div> -->
        <div class="">
            <h1 class="font-sans text-green-50 text-3xl font-bold">{{ job_title }}</h1>
        </div>
        <div class="pt-4">
            <p class="font-sans font-bold text-slate-100"> From {{ job_town }}, {{ job_county }} </p>
        </div>
        <div class=" auto-rows-min mx-0">
            <div class="py-1 my-1">
                <button
                    class="bg-gradient-to-r w-full from-green-300 to-blue-400 hover:from-teal-300 hover:to-green-400 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline ring-2 ring-black rounded-xl"
                    type="button">
                    Play video </button>
            </div>
            <!-- <div class="">
                <button v-on:click.stop @click="GoToMessageProfile(profile_ID)"
                    class="bg-gradient-to-r w-full from-green-300 to-teal-500 hover:from-lime-300 hover:to-green-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline ring-2 ring-black rounded-xl"
                    type="button">
                    Contact {{ job_author }}
                </button>
            </div> -->
        </div>
        <div class="col-start-1 col-end-3 max-w-prose text-center font-sans backdrop-brightness-125 rounded-3xl  ">
            {{ job_description }} 
        </div>
    </button>
</template>



<style></style>