<script setup>
import { defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

const props = defineProps({
    firstName: String,
});

const router = useRouter();

let currentUserUid;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid;
    } else {
        console.log("No user is signed in.");
    }
});

onMounted(() => {
    setTimeout(() => {
        router.push(`/view-profile/${currentUserUid}`); 
    }, 5000); 
});
</script>

<template>
    <div>
        <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 6 of 6: Complete 🥳</h2>
        <div class="m-1 overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 w-4/4 rounded-full bg-emerald-600"></div>
        </div>
        <h1>Thank you {{ props.firstName }} for signing up for UVCME</h1>
    </div>
</template>
