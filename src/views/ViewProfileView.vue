<!-- 
This is the View for the Profile View,
It can be divided up into 4 main components
    1.) A profile photo
    2.) Name
    3.) Short Description
    4.) Message Button
-->

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRoute } from "vue-router";

import Profile_Title from "../components/ProfileView/Profile_Title.vue";
import Profile_Video from "../components/ProfileView/Profile_Video.vue";
import Text_Block from "../components/ProfileView/Text_Block.vue";

const profile_name = ref("Fetching details");
const profile_surname = ref("");
const profile_video_url = ref("");
const profile_poster_url = ref("");
const profile_town = ref("Firebase, please wait...");
const aboutMe = ref("Loading about me...");
const tags = ref([]);
const workExperiences = ref([]);
const educations = ref([]);

onMounted(async () => {
    const route = useRoute();
    const profileID = route.params.profileID.toString();
    const docRef = doc(db, "users", profileID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        profile_name.value = data.firstname || 'Unknown';
        profile_surname.value = data.surname || 'User';
        profile_poster_url.value = data.profilePictureUrl || '/default_profile.jpg';
        profile_video_url.value = data.videoUrl || '';
        profile_town.value = data.town || 'Unknown Location';
        aboutMe.value = data.aboutMe || 'No details provided.';
        tags.value = data.tags || [];
        workExperiences.value = data.workExperiences || [];
        educations.value = data.educations || [];
    } else {
        console.warn("ERROR 404: No document found for user " + profileID);
    }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex gap-4">
      <div class="w-1/5"> 
        <div class="p-2 border border-gray-300 rounded-full"> 
          <img :src="profile_poster_url" alt="Profile Image" class="rounded-full w-full h-auto object-cover" />
        </div>
        <div class="text-center mt-4">
          <h2 class="text-xl font-bold">{{ profile_name }} {{ profile_surname }}</h2>
          <p class="text-sm">{{ profile_town }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="px-2 py-1 text-sm bg-gray-200 rounded" v-for="tag in tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="flex-grow"> 
        <Profile_Video :video_url="profile_video_url" :poster_url="profile_poster_url" />

        <div class="bg-white shadow-sm rounded-lg p-4 mt-6 border">
          <h3 class="font-bold text-lg mb-2">About</h3>
          <p>{{ aboutMe }}</p>
        </div>

        <div class="bg-white shadow-sm rounded-lg p-4 mt-4 border">
          <h3 class="font-bold text-lg mb-2">Experience</h3>
          <div v-for="work in workExperiences" :key="work.companyName" class="mt-4">
            <div class="flex items-center gap-4">
              <div class="flex-grow">
                <h4 class="font-bold">{{ work.jobTitle }}</h4>
                <p class="text-sm text-gray-600">{{ work.companyName }} • {{ work.jobDuration }}</p>
                <p class="text-sm text-gray-600">{{ work.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg p-4 mt-4 mb-6 border ">
          <h3 class="font-bold text-lg mb-2">Education</h3>
          <div v-for="edu in educations" :key="edu.schoolName" class="mt-4">
            <div class="flex items-center gap-4">
              <div class="flex-grow">
                <h4 class="font-bold">{{ edu.degree }}</h4>
                <p class="text-sm text-gray-600">{{ edu.schoolName }} • {{ edu.yearsAttended }}</p>
                <p class="text-sm text-gray-600">{{ edu.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
