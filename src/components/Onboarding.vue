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

const currentStep = ref(0);

const firstName = ref("")
const lastName = ref("")
const town = ref("")
const county = ref("")

const steps = [
  { number: 0, component: Step1 },
  { number: 1, component: Step2 },
];

const currentStepComponent = computed(() => {
  const step = steps.find((s) => s.number === currentStep.value);
  return step ? step.component : null;
});

const updateData = (data) => {
  firstName.value = data.first
  lastName.value = data.last
  
};


const nextStep = (step) => {
  currentStep.value = step;
};


</script>

