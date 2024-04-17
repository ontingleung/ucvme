<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { collection, query, orderBy, startAfter, limit, getDocs, where, Query, or, QuerySnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import Job_Card from "../components/JobSearch/Job_Card.vue"
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const counties: [string, boolean][] = [
    ['Antrim', false],
    ['Armagh', false],
    ['Carlow', false],
    ['Cavan', false],
    ['Clare', false],
    ['Cork', false],
    ['Derry', false],
    ['Donegal', false],
    ['Down', false],
    ['Dublin', false],
    ['Fermanagh', false],
    ['Galway', false],
    ['Kerry', false],
    ['Kildare', false],
    ['Kilkenny', false],
    ['Laois', false],
    ['Leitrim', false],
    ['Limerick', false],
    ['Longford', false],
    ['Louth', false],
    ['Mayo', false],
    ['Meath', false],
    ['Monaghan', false],
    ['Offaly', false],
    ['Roscommon', false],
    ['Sligo', false],
    ['Tipperary', false],
    ['Tyrone', false],
    ['Waterford', false],
    ['Westmeath', false],
    ['Wexford', false],
    ['Wicklow', false],
];
const filter_county = ref(counties);
const filter_job_title = ref("");
const listings = ref([])
const no_listings_found = ref(false);

var last_searched_job = "";

onMounted(() => {
    query_listings();
    setInterval(show_no_results_message, 2000);
});


function show_no_results_message() {
    if (listings.value.length <= 0) {
        no_listings_found.value = true
    }
    else {
        no_listings_found.value = false
    }
}

const update_listings = (results_buffer: QuerySnapshot<DocumentData, DocumentData>, clear_listing_list: boolean) => {

    var local_buffer = [];
    var bother_check_counties = false;
    var acceptable_counties: string[] = [];

    for (let index = 0; index < counties.length; index++) {
        if (counties[index][1] == true) {
            bother_check_counties = true;
            console.debug("Adding " + counties[index][0] + " : " + typeof (counties[index][0]) + " to counties to filter for");
            acceptable_counties.push(counties[index][0]);
        }
    }

    if (bother_check_counties == true) {
        results_buffer.docs.forEach((doc) => {
            console.debug("Is " + doc.data()["county"] + " in " + acceptable_counties + " == " + (acceptable_counties.indexOf(doc.data()["county"]) > -1));
            if (acceptable_counties.indexOf(doc.data()["county"]) > -1) {
                local_buffer.push(doc);
            }

        })
    }
    else {
        local_buffer = results_buffer.docs;
    }

    // We need to clear the profiles list first, rather than adding to it already
    if (clear_listing_list == true) {
        for (let index = listings.value.length; index >= 0; index--) {
            listings.value.pop();
        }
    }

    console.debug("Current Local Job Listing buffer is " + local_buffer.length)
    local_buffer.forEach((doc) => {
        var current_listing = JSON.stringify(doc.data());
        var current_listing_JSON = JSON.parse(current_listing);
        current_listing_JSON["job_ID"] = doc.id;

        if (current_listing_JSON["job_title"] === "") {
            console.debug("Invalid job encountered ID : " + current_listing_JSON["job_ID"]);
        }

        else if (listings.value.includes(doc.id) == false) {
            listings.value.push(JSON.stringify(current_listing_JSON));
            console.debug("Pushed " + JSON.stringify(current_listing_JSON) + " onto job list");
        }

    });
}

const query_listings = async () => {

    // Step 1 : Clear everything first
    var listings_buffer: QuerySnapshot<DocumentData, DocumentData>;

    // Step 2 : Has the user typed a name to search for?
    let jname_search_field: string = (document.getElementById("job_title_search") as HTMLInputElement).value;

    if (jname_search_field.length > 0 && jname_search_field != last_searched_job) {     // We need to look for someone!


        last_searched_job = jname_search_field; // We dont want to look for the SAME name


        // TODO : THIS IS AWFUL!!! STRING COMPARISONS SHOULD BE DONE BY TYPESENSE! 
        var job_name_results_query = query(collection(db, "jobs"), where("job_title", ">=", jname_search_field));

        console.debug("Getting collection data now");
        var job_name_results = await getDocs(job_name_results_query);
        console.debug("Collection data recieved");


        // Add job title Name Results first
        listings_buffer = job_name_results;
        console.debug("Job listing buffer is now : " + listings_buffer.docs);
        console.debug("jname buffer is now : " + job_name_results.docs);


        job_name_results.forEach((jobname_doc) => {
            if (listings_buffer.docs.includes(jobname_doc) == false)  // Do we already have this profile in our first name list of results?
            {
                listings_buffer.docs.concat(jobname_doc);
            }
        })

        update_listings(listings_buffer, true); // update the list of profiles AND clear whatever was there before
    }

    else {  // No name was enetered
        //await new Promise(r => setTimeout(r, 90000000)); 
        listings_buffer = await getDocs(query(collection(db, "jobs"), limit(2))); // get the first 2 profiles
        update_listings(listings_buffer, true);

        listings_buffer = await getDocs(query(collection(db, "jobs"), limit(2), startAfter(listings_buffer.docs[listings_buffer.docs.length - 1]))); // get the next first 2 profiles
        update_listings(listings_buffer, false);

        listings_buffer = await getDocs(query(collection(db, "jobs"), startAfter(listings_buffer.docs[listings_buffer.docs.length - 1]))); // get the rest
        update_listings(listings_buffer, false);
    }
}

</script>

<template>

    <div class="p-5 grid grid-cols-2">
        <div class="mx-auto bg-gradient-to-r from-green-200 to-green-100 rounded-2xl col-span-2 lg:px-28 md:px-16 sm:px-4 py-16 my-16">
            <h2 class="text-3xl font-bold tracking-tight text-gray-600 sm:text-4xl">Here's who around!</h2>
            <p class="mt-4 text-lg leading-8 text-gray-600">You can specify filters here</p>
            <div class="mt-6 flex max-w-md gap-x-4 ">
                <input id="job_title_search" type="text" v-on:input="query_listings"
                    class=" min-w-0 flex-auto rounded-xl border-0 text-xl bg-slate-50  ring-black px-3.5 py-2  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-md sm:leading-6"
                    placeholder="Gardener">

                <!-- Filter -->
                <div class="top-16 w-50  px-4 mx-5">
                    <Popover v-slot="{ open }" class="relative">
                        <PopoverButton :class="open ? 'text-white' : 'text-white/90'"
                            class="group inline-flex items-center rounded-xl bg-green-600 p-2  font-medium hover:text-green focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                class="bi bi-funnel" viewBox="0 0 16 16">
                                <path
                                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                            </svg>

                        </PopoverButton>

                        <transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100"
                            leave-active-class="transition duration-150 ease-in"
                            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                            <PopoverPanel
                                class="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                                <div class="overflow-hidden rounded-lg shadow-xl ring-1 ring-black/5">
                                    <div class="relative grid gap-1 bg-white p-7 grid-cols-2">
                                        <h1 class="font-sans font-medium text-lg ">Only show users profiles from: </h1>
                                        <span></span>
                                        <div v-for="(county, index) in counties" :key="index" class="checkbox">
                                            <input type="checkbox" :id="county[0]" v-model="county[1]"
                                                @change="query_listings">
                                            <label class="px-1" :for="county[0]">{{ county[0] }}</label>
                                        </div>
                                    </div>
                                </div>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </div>
            </div>
        </div>

        <div class="  2xl:px-72 xl:px-10 lg:px-48 md:px-32 sm:px-0 mx-5 grid xl:grid-cols-2 lg:grid-cols-1 justify-stretch col-span-2 gap-36 ">
            <div v-if="!listings.length && !no_listings_found">
                <h1>Fetching Profiles... Please wait</h1>
                <div class="spinny_loading_circle" id="loading_circle"></div>
            </div>
            <div v-if="no_listings_found">
                <h1>No Joblistings were found, consider adjusting your filters</h1>
            </div>

            <div v-for="job of listings">
                <Job_Card 
                :job_ID     =   JSON.parse(job).job_ID
                :job_county =   JSON.parse(job).county
                :job_author  =   JSON.parse(job).job_author
                :job_title  =   JSON.parse(job).job_title
                :job_description = JSON.parse(job).job_description
                />

            </div>
        </div>
    </div>


</template>

<style scoped>




.spinny_loading_circle {
    border: 16px solid rgb(from color r g b);
    /* Light grey */
    border-top: 16px solid lightgreen;
    border-radius: 100%;
    /* This makes it like a blade,,, is cool*/
    width: 8rem;
    height: 8rem;
    display: grid;
    align-items: center;
    place-content: center;
    place-items: center;
    animation: spin 1s linear infinite;
}


@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>