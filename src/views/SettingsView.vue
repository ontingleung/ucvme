<template>
    <div class="max-w-screen-xl mx-auto p-6 bg-white md:rounded-lg settings">
      <div class="flex flex-col items-center">
        <h1 class="text-2xl xl:text-3xl font-bold mb-6">
          User Settings
        </h1>
        <div class="w-full max-w-md">
          <form class="space-y-6" @submit.prevent="updateSettings">
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
  });
  
  function updateSettings() {
    // put the update logic here
    console.log('Settings updated:', user.value);
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