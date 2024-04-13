<template>
    <div>
      <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 3 of 6: Tell Us More About Yourself!</h2>
      <div class="m-1 overflow-hidden rounded-full bg-gray-200">
          <div class="h-2 w-3/6 rounded-full bg-emerald-500"></div>
      </div>
  
      <p class="mt-5 text-md leading-6 text-gray-600">Upload your profile picture and share something about yourself.</p>
  
      <div class="mt-5 flex items-center justify-center w-full">
          <label for="profilePictureInput"
              class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center cursor-pointer">
              <div class="h-full w-full text-center flex flex-col items-center justify-center items-center">
                  <img class="h-36 object-center" :src="currentProfileImageUrl" alt="upload">
                  <p class="pointer-none text-gray-500"><span>Drag and drop</span> your picture here <br />
                      or select a file from your device
                  </p>
              </div>
              <input id="profilePictureInput" ref="profilePictureInput" type="file" class="hidden" @change="uploadProfilePicture">
          </label>
      </div>
  
      <div class="mt-5">
          <label for="aboutMe" class="block text-sm font-medium text-gray-700">About Me</label>
          <div class="mt-1">
            <textarea id="aboutMe" rows="3" class="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder="Share something about yourself..." v-model="aboutMe"></textarea>
          </div>
      </div>
  
      <div class="mt-5">
          <label for="tags" class="block text-sm font-medium text-gray-700">Tags (e.g., gardener, painter, developer)</label>
          <input id="tags" type="text" class="shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder="Add your tags separated by commas" v-model="tags">
      </div>
  
      <div class="flex justify-between mt-10">
          <button @click="$emit('next', 1)" class="bg-gray-500 text-white py-2 px-4 rounded-full">Previous</button>
          <button @click="submitStep, $emit('next', 3);" class="bg-emerald-500 text-white py-2 px-4 rounded-full">Next</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { storage, auth, db } from '@/firebase';
  import { ref as storageRef, uploadBytes, getDownloadURL } from "@firebase/storage";
  import { v4 as uuidv4 } from 'uuid';
  import { updateDoc, doc } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  
  const profilePictureInput = ref(null);
  const currentProfileImageUrl = ref("https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fupload.png?alt=media&token=db4c1b88-764b-442a-b253-f9c235148952");
  const aboutMe = ref('');
  const tags = ref('');
  let userRef;
  
  onAuthStateChanged(auth, (user) => {
      if (user) {
          userRef = doc(db, "users", user.uid);
      } else {
          console.log("No user is signed in.");
      }
  });
  
  const uploadProfilePicture = async () => {
      const file = profilePictureInput.value.files[0];
      if (!file) return;
      const uniqueID = uuidv4();
      const profilePictureRef = storageRef(storage, `profilePictures/${uniqueID}`);
      try {
          const snapshot = await uploadBytes(profilePictureRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          currentProfileImageUrl.value = downloadURL;
          await updateDoc(userRef, {
              profilePictureUrl: downloadURL,
          });
      } catch (error) {
          console.error('Error uploading profile picture:', error);
      }
  };
  
  const submitStep = async () => {
      await updateDoc(userRef, {
          aboutMe: aboutMe.value,
          tags: tags.value.split(',').map(tag => tag.trim()),
      });
  };
  </script>
  