<template>
  <div class="max-w-screen-sm mx-auto shadow bg-white md:rounded-lg">
    <div class="pb-12 m-20">
      <component
        :is="currentStepComponent"
        v-on:next="nextStep"
        :firstName="firstName"
        :lastName="lastName"
        :town="town"
        :county="county"
        v-on:update="updateData"
      />
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import Step1 from '@/components/steps/Step1.vue';
import Step2 from '@/components/steps/Step2.vue';
import Step3 from '@/components/steps/Step3.vue';
import Step4 from '@/components/steps/Step4.vue';

const currentStep = ref(0);

const firstName = ref("")
const lastName = ref("")
const town = ref("")
const county = ref("Pick")

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

const updateData = (step, data) => {
  switch (step) {
    case 1:
      firstName.value = data.first
      lastName.value = data.last

      break;
 
    case 2:
      town.value = data.town
      county.value = data.county

      break;

    default:
      break;
  }


};


const nextStep = (step) => {
  currentStep.value = step;
};


</script>

