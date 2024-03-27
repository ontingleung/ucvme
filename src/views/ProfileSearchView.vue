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

    // Query the first page of docs
    // const first = query(collection(db, "users"), limit(2), where("firstname", "==", "John"));
    const first = query(collection(db, "users"), limit(2));
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
    <h1>This is the Profile Search page!</h1>
    <div class="grid grid-cols-2 gap-4 place-content-around">
        <div v-for="prof of profiles">
            <Profile_Card :profile_ID=JSON.parse(prof).profile_ID :profile_thumbnail_url=JSON.parse(prof).profileImage
                :profile_name=JSON.parse(prof).firstname description="TODO : Add User description field in firestore" />

        </div>


    </div>
</template>

<style scoped></style>