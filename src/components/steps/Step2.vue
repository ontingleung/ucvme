<script setup>
import { ref } from 'vue';

const props = defineProps({
    firstName: String,
    town: String,
    county: String
});

const userLoc = ref({
    town: props.town,
    county: props.county
});

</script>

<template>
    <div>
        <h2 class="pt-5 text-base font-semibold leading-7 text-gray-900">Step 2 of 4: Location 📍</h2>
        <div class="m-1 overflow-hidden rounded-full bg-gray-200">
            <div class="h-2 w-1/2 rounded-full bg-emerald-400"></div>
        </div>
        <p class="mt-5 text-md leading-6 text-gray-600">Hello {{ props.firstName }}, 👋🏼 Welcome!</p>
        <p class="text-md leading-6 text-gray-600">Enter your location to get jobs listing close to you.</p>
        <p class="text-md leading-6 text-gray-600"></p>
        <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
                <label for="city" class="block text-sm font-medium leading-6 text-gray-900">Town</label>
                <div class="mt-2">
                    <input type="text" name="city" id="city" autocomplete="address-level2"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        v-model="userLoc.town" />
                </div>
            </div>

            <div class="sm:col-span-3">
                <label for="county" class="block text-sm font-medium leading-6 text-gray-900">County</label>
                <div class="mt-2">
                    <select id="county" name="county" autocomplete="county-name"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        v-model="userLoc.county">
                        <option disabled selected>{{ props.county }}</option>
                        <option>Antrim</option>
                        <option>Armagh</option>
                        <option>Carlow</option>
                        <option>Cavan</option>
                        <option>Clare</option>
                        <option>Cork</option>
                        <option>Donegal</option>
                        <option>Down</option>
                        <option>Derry</option>
                        <option>Dublin</option>
                        <option>Galway</option>
                        <option>Kerry</option>
                        <option>Fermanagh</option>
                        <option>Kildare</option>
                        <option>Kilkenny</option>
                        <option>Laois</option>
                        <option>Leitrim</option>
                        <option>Limerick</option>
                        <option>Longford</option>
                        <option>Louth</option>
                        <option>Mayo</option>
                        <option>Meath</option>
                        <option>Monaghan</option>
                        <option>Offaly</option>
                        <option>Roscommon</option>
                        <option>Sligo</option>
                        <option>Tipperary</option>
                        <option>Tyrone</option>
                        <option>Waterford</option>
                        <option>Westmeath</option>
                        <option>Wexford</option>
                        <option>Wicklow</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="flex justify-between mt-10">
            <button @click="$emit('next', 0)" class="bg-gray-500 text-white py-2 px-4 rounded-full">Previous</button>
            <button @click="$emit('next', 2), $emit('update', 2, userLoc)" class="bg-emerald-500 text-white py-2 px-4 rounded-full">Next</button>
        </div>
    </div>
</template>
