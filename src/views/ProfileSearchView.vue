<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { collection, query, orderBy, startAfter, limit, getDocs, where, Query, or, QuerySnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import Profile_Card from "../components/ProfileSearch/Profile_Card.vue"
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const counties = ["Cork", "Galway", "Mayo", "Donegal", "Kerry", "Tipperary", "Clare", "Tyrone", "Antrim", "Limerick", "Roscommon", "Down", "Wexford", "Meath", "Derry", "Kilkenny", "Wicklow", "Offaly", "Cavan", "Waterford", "Westmeath", "Sligo", "Laois", "Kildare", "Fermanagh", "Leitrim", "Armagh", "Monaghan", "Longford", "Dublin", "Carlow", "Louth"];
const filter_age_max = ref("150");
const filter_age_min = ref("16");
const filter_county = ref(counties);
const filter_name = ref("");
const profiles = ref([])

var last_searched_name = "";

onMounted(() => {
    query_profiles();

});

const update_profiles = (results_buffer: QuerySnapshot<DocumentData, DocumentData>, clear_profile_list: boolean) => {

    // We need to clear the profiles list first, rather than adding to it already
    if (clear_profile_list == true) {
        for (let index = profiles.value.length; index >= 0; index--) {
            profiles.value.pop();
        }
    }

    results_buffer.forEach((doc) => {
        var current_profile = JSON.stringify(doc.data());
        var current_profile_JSON = JSON.parse(current_profile);
        current_profile_JSON["profile_ID"] = doc.id;

        if (profiles.value.includes(doc.id) == false) {
            profiles.value.push(JSON.stringify(current_profile_JSON));
            console.debug("Pushed " + JSON.stringify(current_profile_JSON) + " onto profile list");
        }

    });
}

const query_profiles = async () => {

    // Step 1 : Clear everything first
    var profiles_buffer: QuerySnapshot<DocumentData, DocumentData> = null;

    // Step 2 : Has the user typed a name to search for?
    let name_search_field: string = (document.getElementById("profile_name") as HTMLInputElement).value;

    if (name_search_field.length > 0 && name_search_field != last_searched_name) {     // We need to look for someone!
        console.debug("Preforming Name query");
        last_searched_name = name_search_field; // We dont want to look for the SAME name

        // TODO : THIS IS AWFUL!!! STRING COMPARISONS SHOULD BE DONE BY TYPESENSE! 
        var first_name_results_query = query(collection(db, "users"), where("firstname", ">=", name_search_field)); // Firestore string querys are weird
        var last_name_results_query = query(collection(db, "users"), where("surname", ">=", name_search_field));

        var first_name_results = await getDocs(first_name_results_query);
        var last_name_results = await getDocs(last_name_results_query);


        // Add First Name Results first, THEN surname results
        profiles_buffer = first_name_results;
        console.debug("Profile buffer is now : " + profiles_buffer.docs);
        console.debug("fname buffer is now : " + first_name_results.docs);
        console.debug("lname buffer is now : " + last_name_results.docs);


        last_name_results.forEach((surname_doc) => {
            if (profiles_buffer.docs.includes(surname_doc) == false)  // Do we already have this profile in our first name list of results?
            {
                profiles_buffer.docs.concat(surname_doc);
            }
        })

        update_profiles(profiles_buffer, true); // update the list of profiles AND clear whatever was there before
    }

    else {  // No name was enetered
        profiles_buffer = await getDocs(query(collection(db, "users"), limit(2))); // get the first 2 profiles
        update_profiles(profiles_buffer, true);

        profiles_buffer = await getDocs(query(collection(db, "users"), limit(2), startAfter(profiles_buffer.docs[profiles_buffer.docs.length - 1]))); // get the next first 2 profiles
        update_profiles(profiles_buffer, false);

        profiles_buffer = await getDocs(query(collection(db, "users"), startAfter(profiles_buffer.docs[profiles_buffer.docs.length - 1]))); // get the rest
        update_profiles(profiles_buffer, false);
    }


    /*
    // TODO : Update structure of users collection in firebase to allow for additional parametres such as age
    const profile_search_query = query(collection(db, "users"), 
        where("age", ">=", filter_age_min),
        where("age", "<=", filter_age_max));
    
    

    console.log("FETCHING FIRST COUPLE PROFILES");

    

    //clear everything first
    var profiles_buffer = null; 
    for (let index = profiles.value.length - 1; index >= 0; index--) {
        profiles.value.pop()
    }
    
    
    // Query the first page of docs based on the name(s)
    profiles_buffer = await query_name_search();

    profiles_buffer.forEach((doc) => {
        var current_profile = JSON.stringify(doc.data());
        var current_profile_JSON = JSON.parse(current_profile);
        current_profile_JSON["profile_ID"] = doc.id;
        profiles.value.push(JSON.stringify(current_profile_JSON));
        console.log("Pushed " + JSON.stringify(current_profile_JSON) + " onto profile buffer");
    });

    console.log("FETCHING LATER PROFILES");

    // Construct a new query starting at this document,
    const next = query(collection(db, "users"), startAfter(profiles_buffer.docs[profiles_buffer.docs.length - 1]));
    profiles_buffer = await getDocs(next);
    if (profiles_buffer.size > 0) {
        profiles_buffer.forEach((doc) => {
            var current_profile = JSON.stringify(doc.data());
            var current_profile_JSON = JSON.parse(current_profile);
            current_profile_JSON["profile_ID"] = doc.id;
            profiles.value.push(JSON.stringify(current_profile_JSON));
            console.log("Pushed " + JSON.stringify(current_profile_JSON) + " onto profile buffer");
        });
    }
    else {
        console.warn("ERROR 404 : No other users found... Please ensure filters are correct!");
    }
    */
}


</script>


<template>


    <div class="m-5 p-5 lg:max-w-lg ">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Here's who around.</h2>
        <p class="mt-4 text-lg leading-8 text-gray-600">You can specify filters</p>
        <div class="mt-6 flex max-w-md gap-x-4">
            <input id="profile_name" type="text" v-on:input="query_profiles"
                class="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                placeholder="John Doe">

            <!-- Filter -->
            <div class="top-16 w-50  px-4 mx-5">
                <Popover v-slot="{ open }" class="relative">
                    <PopoverButton :class="open ? 'text-white' : 'text-white/90'"
                        class="group inline-flex items-center rounded-md bg-green-700 p-2  font-medium hover:text-green focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                            class="bi bi-funnel" viewBox="0 0 16 16">
                            <path
                                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                        </svg>
                        <ChevronDownIcon :class="open ? 'text-orange-300' : 'text-orange-300/70'"
                            class="transition duration-150 ease-in-out group-hover:text-orange-300/80"
                            aria-hidden="true" />
                    </PopoverButton>

                    <transition enter-active-class="transition duration-200 ease-out"
                        enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                        <PopoverPanel
                            class="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                            <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div class="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                                   <input type="checkbox" id="scales" name="scales" checked /> 
                                </div>

                            </div>
                        </PopoverPanel>
                    </transition>
                </Popover>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-4 place-content-around">
        <div v-for="prof of profiles">
            <Profile_Card :profile_ID=JSON.parse(prof).profile_ID :profile_thumbnail_url=JSON.parse(prof).profileImage
                :profile_name=JSON.parse(prof).firstname description="TODO : Add User description field in firestore" />

        </div>
    </div>
</template>

<style scoped></style>