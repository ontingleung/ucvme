<template>
    <div class="max-w-screen-sm mx-auto shadow bg-white md:rounded-lg flex justify-center">
        <div class="pb-12 m-10">
            <component :is="currentStepComponent" />
            <button v-if="currentStep !== 0" @click="previousStep" class="mt-4 bg-gray-500 text-white py-2 px-4 rounded-full">Previous</button>
            <button @click='nextStep' class="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-full">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Step1 from '@/components/steps/Step1.vue';
import Step2 from '@/components/steps/Step2.vue';

const currentStep = ref(0);

const steps = [
  { number: 0, component: Step1 },
  { number: 1, component: Step2 },
];

const currentStepComponent = computed(() => {
  const step = steps.find((s) => s.number === currentStep.value);
  return step ? step.component : null;
});

const nextStep = () => {
console.log(currentStep.value)

  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
};

const previousStep = () => {
console.log(currentStep.value)

  if (currentStep.value < steps.length) {
    currentStep.value--;
  }
};


</script>