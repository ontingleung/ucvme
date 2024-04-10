<template>
  <div class="settings-container">
    <div class="settings-card">
      <h1 class="settings-header">
        User Settings
      </h1>
      <form class="settings-form" @submit.prevent="updateSettings">
        <div class="input-group">
          <label for="profile-image" class="input-label">Profile Picture</label>
          <input type="file" id="profile-image" @change="previewImage" accept="image/*" class="input-file">
          <div v-if="user.profilePicture" class="image-preview">
            <img :src="user.profilePicture" alt="Profile Image Preview" class="image-thumbnail">
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
        <button class="submit-button">
          Update
        </button>
      </form>
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

<style scoped>
.settings-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f7f6;
}

.settings-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.settings-header {
  color: #047857;
  /* Emerald color */
  text-align: center;
  margin-bottom: 2rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  color: #1f2937;
  /* Gray-800 */
  margin-bottom: 0.5rem;
}

.input-file {
  border: 2px solid #d1fae5;
  /* Light emerald */
  border-radius: 0.375rem;
  /* 6px */
  padding: 0.5rem;
}

.input-file::file-selector-button {
  padding: 0.5rem;
  border: none;
  background-color: #10b981;
  /* Emerald */
  color: white;
  border-radius: 0.375rem;
  /* 6px */
  margin-right: 0.5rem;
}

.image-preview {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.image-thumbnail {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.submit-button {
  padding: 0.75rem;
  background-color: #059669;
  /* Emerald */
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  /* 6px */
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #047857;
  /* Darker emerald */
}

/* Responsive design for smaller screens */
@media (max-width: 640px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-card {
    padding: 1.5rem;
  }
}
</style>
