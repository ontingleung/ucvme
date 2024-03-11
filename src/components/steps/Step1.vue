<script setup>
import { ref } from 'vue';

const props = defineProps({
  firstName: String,
  lastName: String,
});

const userNames = ref({
  first: props.firstName,
  last: props.lastName
});

</script>

<template>
    <div>
        <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 1 of 4: Personal Information</h2>
        <div class="m-1 overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 w-1/4 rounded-full bg-emerald-300"></div>
        </div>

        <p class="mt-5 text-md leading-6 text-gray-600">What is your name?</p>

        <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
                <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900" >First Name</label>
                <div class="mt-2">
                    <input type="text" name="first-name" id="first-name" autocomplete="given-name"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        v-model="userNames.first"/>
                </div>
            </div>

            <div class="sm:col-span-3">
                <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                <div class="mt-2">
                    <input type="text" name="last-name" id="last-name" autocomplete="family-name"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        v-model="userNames.last"/>
                </div>
            </div>
        </div>
        <div class="flex justify-end mt-10">
            <button @click="$emit('next', 1), $emit('update', 1, userNames)" class="bg-emerald-500 text-white py-2 px-4 rounded-full">Next</button>
        </div>
    </div>
</template>
