<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { collection, query, orderBy, startAfter, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/firebase";
import Profile_Card from "../components/ProfileSearch/Profile_Card.vue"

const counties = ["Cork", "Galway", "Mayo", "Donegal", "Kerry", "Tipperary", "Clare", "Tyrone", "Antrim", "Limerick", "Roscommon", "Down", "Wexford", "Meath", "Derry", "Kilkenny", "Wicklow", "Offaly", "Cavan", "Waterford", "Westmeath", "Sligo", "Laois", "Kildare", "Fermanagh", "Leitrim", "Armagh", "Monaghan", "Longford", "Dublin", "Carlow", "Louth"];
const filter_age_max = ref("150");
const filter_age_min = ref("16");
const filter_county = ref(counties);
const filter_name = ref("");
const profiles = ref([])

onMounted(() => {
    query_profiles();
});


const query_profiles = async () => {

    /*
    // TODO : Update structure of users collection in firebase to allow for additional parametres such as age
    const profile_search_query = query(collection(db, "users"), 
        where("age", ">=", filter_age_min),
        where("age", "<=", filter_age_max));
    
    */

    console.log("FETCHING FIRST COUPLE PROFILES");

    var first;

    // Query the first page of docs
    if ((document.getElementById("profile_name") as HTMLInputElement).value.length > 0) {
        // const first = query(collection(db, "users"), limit(2), where("firstname", "==", "John"));
        // TODO : Make query take the name from the search bar into account
        first = query(collection(db, "users"), limit(2));
    }
    else {
        first = query(collection(db, "users"), limit(2));
    }
    
    var profiles_buffer = await getDocs(first);

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
    else{
        console.warn("ERROR 404 : No other users found... Please ensure filters are correct!");
    }
}

</script>

<template>

    <div class="m-5 p-5 lg:max-w-lg ">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Here's who around.</h2>
        <p class="mt-4 text-lg leading-8 text-gray-600">You can specify filters</p>
        <div class="mt-6 flex max-w-md gap-x-4">
            <input id="profile_name" type="text"
                class="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                placeholder="John Doe">
            <button type="submit"
                class="flex-none rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300">

                <!--The "Filter SVG icon"-->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel"
                    viewBox="0 0 16 16">
                    <path
                        d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                </svg>
            </button>
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