<template>
  <div class="max-w-screen-sm mx-auto shadow bg-white md:rounded-lg">
    <div class="pb-12 m-20">
      <component :is="currentStepComponent" v-on:next="nextStep" :firstName="firstName" :lastName="lastName"
        :town="town" :county="county" v-on:update="updateData" />
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { auth, db } from '@/firebase';
import { updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';


import Step1 from '@/components/steps/Step1.vue';
import Step2 from '@/components/steps/Step2.vue';
import Step3 from '@/components/steps/Step3.vue';
import Step4 from '@/components/steps/Step4.vue';

const currentStep = ref(0);
let userRef;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const currentUserUid = user.uid;
    userRef = doc(db, "users", currentUserUid);
  } else {
    console.log("No user is signed in.");
  }
});

const firstName = ref("");
const lastName = ref("");
const town = ref("");
const county = ref("Pick");

const steps = [
  { number: 0, component: Step1 },
  { number: 1, component: Step2 },
  { number: 2, component: Step3 },
  { number: 3, component: Step4 },
];

const currentStepComponent = computed(() => {
  const step = steps.find((s) => s.number === currentStep.value);
  return step ? step.component : null;
});

const updateData = async (step, data) => {
  switch (step) {
    case 1:
      firstName.value = data.first
      lastName.value = data.last

      await updateDoc(userRef, {
        firstname: firstName.value,
        surname: lastName.value
      });

      break;

    case 2:
      town.value = data.town
      county.value = data.county
      
      await updateDoc(userRef, {
        town: town.value,
        county: county.value
      });

      break;

    default:
      break;
  }


};


const nextStep = (step) => {
  currentStep.value = step;
};


</script>
