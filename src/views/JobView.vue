<!-- 
This is the View for the job View,
It can be divided up into 4 main components
    1.) A job photo
    2.) Name
    3.) Short Description
    4.) Message Button
-->

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRoute, useRouter } from "vue-router";


const job_title = ref("Fetching details");
const salary_per_hour = ref("");
const job_mini_description = ref("");
const job_description = ref("");
const job_author = ref("Please wait...");
const desired_months_experience = ref(0);
const county = ref();
const type = ref();
const type_text = ref();
const author_email = ref();
const days = ref([]);
const days_text = ref("");
const tags = ref([]);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const job_ID = route.params.job_ID.toString();
  const docRef = doc(db, "jobs", job_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    job_title.value = data.job_title || 'Unknown Title';
    salary_per_hour.value = data.salary_per_hour || 0;
    job_mini_description.value = data.job_mini_description || 'No details Provided';
    job_description.value = data.job_description || 'No details Provided';
    job_author.value = data.job_author || 'Unknown Author';
    desired_months_experience.value = data.desired_months_experience || 0;
    county.value = data.county || "N/A";
    type.value = data.type || "N/A";
    author_email.value = data.author_email || "NoEmailProvided";
    tags.value = data.tags || [];
    days.value = data.working_days || []; 
  } else {
    console.warn("ERROR 404: No document found for user " + job_ID);
  }

  type.value["MULTIPLE DAYS"] ? type_text.value = "Multiple Days" : type_text.value = type_text.value;
  type.value["ONETIME"] ? type_text.value = "One-Time" : type_text.value = type_text.value; 
  type.value["RECURRING"] ? type_text.value = "Recurring" : type_text.value = type_text.value; 

  days.value["MONDAY"] ? days_text.value += "Monday\t" : days_text.value = days_text.value
  days.value["TUESDAY"] ? days_text.value += "Tuesday " : days_text.value = days_text.value
  days.value["WEDNESDAY"] ? days_text.value += "Wednesday\t" : days_text.value = days_text.value
  days.value["THURSDAY"] ? days_text.value += "Thursday\t" : days_text.value = days_text.value
  days.value["FRIDAY"] ? days_text.value += "Friday\t" : days_text.value = days_text.value
  days.value["SATURDAY"] ? days_text.value += "Saturday\t" : days_text.value = days_text.value
  days.value["SUNDAY"] ? days_text.value += "Sunday\t" : days_text.value = days_text.value

  
});



function email_author() {
  var mailto_link = "mailto:" + author_email.value + `?subject=Hey, let's talk! I saw your UCVME job Listing! `;
  console.debug("Attempting to go to " + mailto_link);
  window.location.href = mailto_link;
}


</script>

<template>
  <div class="container flex-wrap  p-4">
    <div class="flex flex-col">




      <div class="bg-white lg:w-2/3 md:w-full shadow-xl md:rounded-full sm:rounded-3xl  p-5 md:px-10 sm:px-6 mt-6 md:pl-24 sm:pl-0 border">
        <h3 class="font-bold text-4xl px-5 mb-2">{{ job_title }}</h3>
        <p class="px-5">{{ job_mini_description }}</p>
        <button @click="email_author()"
          class="py-4 px-5 bg-emerald-600 mx-5 my-3 rounded-full hover:bg-emerald-300 text-white font-bold  border-b-4 border-emerald-700 hover:border-emerald-500 ">
          <span class="text-xl">Message {{ job_author }}</span>
        </button>
        <div class="flex flex-wrap gap-2 mt-2 pb-5 px-5">
          <span class="px-2 py-1 text-sm bg-gray-200 rounded" v-for="tag in tags" :key="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="bg-white shadow-lg w-full md:rounded-full sm:rounded-3xl  pb-16 pt-20 p-5 md:px-20 sm:px-2 mt-6 border">
        <h3 class="font-bold text-2xl mb-2">About:</h3>
        <p class="text-lg">{{ job_description }}</p>
        <hr class="m-5">
        <ul class="mx-5 mt-5">
          <li>Desired Experience : {{ desired_months_experience }} months</li>
          <li>Salary : €{{ salary_per_hour }} </li>
          <li>Where : {{ county }} </li>
          <li>Type : {{ type_text }} </li>
          <li>Days : {{ days_text }} </li>
        </ul>
      </div>

      
    </div>
  </div>

</template>
