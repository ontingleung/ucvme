<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { collection, query, orderBy, startAfter, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/firebase";

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
    profiles.value.push(profiles_buffer.docs);

    profiles_buffer.forEach((doc) => {
        console.log(JSON.stringify(doc.data()));
    });

    console.log("FETCHING LATER PROFILES");

    // Construct a new query starting at this document,
    const next = query(collection(db, "users"), startAfter(profiles_buffer.docs[profiles_buffer.docs.length - 1]));
    profiles_buffer = await getDocs(next);
    profiles.value.push(profiles_buffer.docs);

    profiles_buffer.forEach((doc) => {
        console.log(JSON.stringify(doc.data()));
    });
}

</script>


<template>
    <div class="Profile_Search">
        <h1>This is the Profile Search page!</h1>
    </div>
</template>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>