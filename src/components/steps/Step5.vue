<template>
    <div>
        <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 5 of 6: Snapshot Video 🎬</h2>
        <div class="m-1 overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 w-5/6 rounded-full bg-emerald-500"></div>
        </div>

        <p class="mt-5 text-md leading-6 text-gray-600">Upload a video up to 1 minute long talking about yourself!</p>

        <div class="mt-5 flex items-center justify-center w-full">
            <label for="fileInput"
                class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center cursor-pointer">
                <div class="h-full w-full text-center flex flex-col items-center justify-center items-center">
                    <div class="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                        <img class="h-36 object-center" :src="currentImageUrl" alt="upload">
                    </div>
                    <p class="pointer-none text-gray-500"><span>Drag and drop</span> files here <br />
                        or select a file from your device
                    </p>
                </div>
                <input id="fileInput" ref="fileInput" type="file" accept="video/*" class="hidden" @change="uploadVideo">
            </label>
        </div>


        <div class="flex justify-between mt-10">
            <button @click="$emit('next', 3)" class="bg-gray-500 text-white py-2 px-4 rounded-full">Previous</button>
            <button @click="$emit('next', 5)" :disabled="!isUploadComplete"
                :class="{ 'bg-emerald-500': isUploadComplete, 'bg-red-500': !isUploadComplete }"
                class="text-white py-2 px-4 rounded-full">Next</button>
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

function generateUUID() {
    return uuidv4();
}

const fileInput = ref(null);
const videoUrl = ref('');
const isUploadComplete = ref(false);
let userRef;
const currentImageUrl = ref("https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fupload.png?alt=media&token=db4c1b88-764b-442a-b253-f9c235148952"); // Initial image URL

onAuthStateChanged(auth, (user) => {
    if (user) {
        const currentUserUid = user.uid;
        userRef = doc(db, "users", currentUserUid);
    } else {
        console.log("No user is signed in.");
    }
});

const uploadVideo = async () => {
    const file = fileInput.value.files[0];
    if (!file) return;
    const uniqueID = generateUUID();
    const userVideoRef = storageRef(storage, `userVideos/${uniqueID}.mp4`);
    const metadata = {
        contentType: 'video/mp4',
    };
    try {
        const snapshot = await uploadBytes(userVideoRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        videoUrl.value = downloadURL;
        await updateDoc(userRef, {
            videoUrl: videoUrl.value,
        });
        isUploadComplete.value = true;
        currentImageUrl.value = "https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fok.png?alt=media&token=794cccb0-26a1-4623-b4fb-32e58680a7a2";
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}
</script>