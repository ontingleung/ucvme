<!-- 
    
    This is the card for each Job Listing when searching 
    
-->
<script setup lang="ts">

import { defineProps, withDefaults, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const description_text_trunc = ref('');

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
const max_description_length = 230;

onMounted(() => 
{
    if(props.job_description.length >= max_description_length)
    {
      description_text_trunc.value  = props.job_description.slice(0, (max_description_length-3)) + "...";
    }
    else
    {
      description_text_trunc.value  = props.job_description;
    }
})

function GoToJob(job_link_to_nav_to: string) {
    router.push(`/view-listings/${job_link_to_nav_to}`);
}


</script>

<template>
  <button @click="GoToJob(job_ID)">
    <div class="job-card">
      <h1 class="font-sans text-green-50 text-3xl font-bold">{{ job_title }}</h1>
      
      <p class="font-sans font-bold text-slate-100">From {{ job_author }}, County {{ job_county }}</p>
      
      <div class="max-w-prose font-sans" style="max-height: 80px;">
        {{ description_text_trunc }} 
      </div>
    </div>
  </button>
</template>
  
<style scoped>
  .job-card {
    padding: 1rem;
    background: linear-gradient(to right, #68D391, #48BB78);
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
    height: 250px;
  }
  
  .job-card h1 {
    margin-bottom: 1rem;
  }
  
  .job-card p {
    margin-bottom: 1rem;
  }
  
  .job-card:hover {
    transform: translateY(-5px);
  }
</style>
  