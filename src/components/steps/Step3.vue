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
        <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 3 of 4: Snapshot Video 🎬</h2>
        <div class="m-1 overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 w-3/4 rounded-full bg-emerald-500"></div>
        </div>

        <p class="mt-5 text-md leading-6 text-gray-600">Upload a video up to 1 minute long talking about yourself!</p>

        <div class="mt-5 flex items-center justify-center w-full">
            <label class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                <div class="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    <div class="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                        <img class="h-36 object-center"
                            src="https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fupload.png?alt=media&token=db4c1b88-764b-442a-b253-f9c235148952"
                            alt="upload">
                    </div>
                    <p class="pointer-none text-gray-500 "><span >Drag and drop</span> files here <br />
                        or <a class="text-blue-600 hover:underline">select a file</a> from your device
                    </p>
                </div>
                <input type="file" class="hidden">
            </label>
        </div>

        <div class="flex justify-between mt-10">
            <button @click="$emit('next', 1)" class="bg-gray-500 text-white py-2 px-4 rounded-full">Previous</button>
            <button @click="$emit('next', 3)" class="bg-emerald-500 text-white py-2 px-4 rounded-full">Next</button>
        </div>
    </div>
</template>
