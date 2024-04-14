<template>
  <div>
    <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 4 of 6: Your Experience and Education</h2>
    <div class="m-1 overflow-hidden rounded-full bg-gray-200">
      <div class="h-2 w-4/5 rounded-full bg-emerald-500"></div>
    </div>

    <!-- Work Experience Section -->
    <div class="mt-5">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Work Experience</h3>
      <div v-for="(work, index) in workExperiences" :key="'work-' + index">
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700">Job Title</label>
          <input type="text" required class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="work.jobTitle">
        </div>
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700">Company Name</label>
          <input type="text" required class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="work.companyName">
        </div>
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700">Duration</label>
          <input type="text" required class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="work.jobDuration">
        </div>
      </div>
      <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addWorkExperience">Add Work Experience</button>
    </div>

    <!-- Education Section -->
    <div class="mt-5">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Education</h3>
      <div v-for="(education, index) in educations" :key="'education-' + index">
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700">School Name</label>
          <input type="text" required class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="education.schoolName">
        </div>
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700">Degree</label>
          <input type="text" required class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="education.degree">
        </div>
        <div class="mt-3">
          <label class="block text-sm font-medium text-gray-700">Years Attended</label>
          <input type="text" required class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="education.yearsAttended">
        </div>
      </div>
      <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addEducation">Add Education</button>
    </div>

    <div class="flex justify-between mt-10">
      <button @click="$emit('next', 2)" class="bg-gray-500 text-white py-2 px-4 rounded-full">Previous</button>
      <button @click="$emit('next', 4), $emit('update', 4, { workExperiences, educations })" class="bg-emerald-500 text-white py-2 px-4 rounded-full">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { db, auth } from '@/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

let userRef;
const workExperiences = reactive([{ jobTitle: '', companyName: '', jobDuration: '' }]);
const educations = reactive([{ schoolName: '', degree: '', yearsAttended: '' }]);

onAuthStateChanged(auth, (user) => {
  if (user) {
    userRef = doc(db, "users", user.uid);
  } else {
    console.log("No user is signed in.");
  }
});

const addWorkExperience = () => {
  workExperiences.push({ jobTitle: '', companyName: '', jobDuration: '' });
};

const addEducation = () => {
  educations.push({ schoolName: '', degree: '', yearsAttended: '' });
};

</script>
