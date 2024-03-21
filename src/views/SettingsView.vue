<template>
    <div class="max-w-screen-xl mx-auto p-6 bg-white md:rounded-lg settings">
      <div class="flex flex-col items-center">
        <h1 class="text-2xl xl:text-3xl font-bold mb-6">
          User Settings
        </h1>
        <div class="w-full max-w-md">
          <form class="space-y-6" @submit.prevent="updateSettings">
            <div class="flex flex-col mb-4">
              <label for="profile-image" class="block text-gray-700 mb-2">Profile Picture</label>
              <input type="file" id="profile-image" @change="previewImage" accept="image/*">
              <div v-if="user.profilePicture" class="mt-3">
                <img :src="user.profilePicture" alt="Profile Image Preview" class="h-20 w-20 object-cover rounded-full">
              </div>
            </div>
            <div>
              <label class="block text-gray-700">Email</label>
              <input
                class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                type="email" placeholder="Email" v-model="user.email">
            </div>
            <div>
              <label class="block text-gray-700">Password</label>
              <input
                class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                type="password" placeholder="Password" v-model="user.password">
            </div>
            <div>
              <label class="block text-gray-700">Town</label>
              <input
                class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                type="text" placeholder="Town" v-model="user.town">
            </div>
            <div>
              <label class="block text-gray-700">County</label>
              <input
                class="w-full px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                type="text" placeholder="County" v-model="user.county">
            </div>
            <button
              class="w-full block bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-lg px-4 py-3 mt-6">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const user = ref({
    email: '',
    password: '',
    town: '',
    county: '',
    profilePicture: null // im assuming url
  });
  
  function updateSettings() {
    // Update logic here
    console.log('Settings updated:', user.value);
  }
  
  function previewImage(event) {
    const file = event.target.files[0];
    user.profilePicture = URL.createObjectURL(file);
    // file upload for the picture
  }
  </script>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>