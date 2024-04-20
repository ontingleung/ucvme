<script setup lang="ts">

import { auth, db } from '@/firebase';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { job_tags, All_Counties } from '@/main';
import { v4 as uuidv4 } from 'uuid';


const chosen_job_tags = ref([job_tags[0], job_tags[0], job_tags[0], job_tags[0], job_tags[0], job_tags[0]]);
const job_type = ref('ONETIME');
const months_exp = ref(0);
const salary = ref(15);
const job_title = ref("");
const job_bio = ref("");

const chosen_days = ref([
    ["Monday", true],
    ["Tuesday", true],
    ["Wednesday", true],
    ["Thursday", true],
    ["Friday", true],
    ["Saturday", false],
    ["Sunday", false]
]);


const job_type_options = [
    { text: 'One Time', value: 'ONETIME' },
    { text: 'Contract', value: 'MULTIPLE DAYS' },
    { text: 'Recurring', value: 'RECURRING' }
]

const router = useRouter();
const route = useRoute();
const profileID = route.params.profileID;
const profileID_str = profileID.toString();
const userName = ref("");




var textarea_placeholder = `My old wooden fense is in dire need of a fresh coat of paint...
 - Willing to pay in Cash or Revolut
 - Hours which suit me are Monday - Friday, 9am - 4pm
 - Please contact me at Joe.Blogs@placeholdermail.com
`
const job_desc_content = ref("");

const target_county = ref(All_Counties[All_Counties.indexOf("Dublin")]); // target county is dublin by default

const user = auth.currentUser;
const has_login_been_implement_yet: boolean = false;
const show_anyway = true;

onMounted(async () => {
    console.debug("tags are " + chosen_job_tags.value[0] + ", " + chosen_job_tags.value[1] + ", " + chosen_job_tags.value[2] + ", " + chosen_job_tags.value[3])
    update_job_type_help_text();
    update_months_side_text();
    update_salary_side_text();

    if (user || show_anyway) {
        //console.debug("Current user ID is " + user.uid);
        if (profileID_str != user.uid) {
            console.warn("WARNING : Router ID isnt same as Saved user ID... sus")
        }

        // Proceed on and set our data to work with
        var user_data = await getDoc(doc(db, "users", user.uid));
        userName.value = user_data.data()["firstname"] + " " + user_data.data()["surname"];
        target_county.value = user_data.data()["county"];
    }
    else {
        console.error("HEY! WE ARE NOT SIGNED IN!!! REDIRECTING")
        if (has_login_been_implement_yet) {
            router.push(`/login`);
        }
        else {
            console.warn("DEBUG : Log in hasn't be done properly yet... stay here for now")
        }
    }



});

function update_job_type_help_text() {
    var help_text = document.getElementById("job_type_help_text");
    switch (job_type.value) {
        case job_type_options[0]["value"]:  // One time
            help_text.innerHTML = " - Will close on finish"
            break;
        case job_type_options[1]["value"]:  // Multiple Days
            help_text.innerHTML = " - May stay open on finish"
            break;
        case job_type_options[2]["value"]:  // Full employement
            help_text.innerHTML = " - Looking to hire"
            break;

        default:
            help_text.innerHTML = " - Please select what type of work this is"
            break;
    }
}

function update_salary_side_text() {
    var side_text = document.getElementById("salary_side_text");
    if (salary.value <= 0) {
        side_text.innerHTML = "to be negotiated";
    }
    else {
        side_text.innerHTML = "€ / hour";
    }
}



function update_months_side_text() {
    var side_text = document.getElementById("months_side_text");
    if (months_exp.value <= 0) {
        side_text.innerHTML = "Not required";
    }
    else {
        side_text.innerHTML = "Months";
    }
}


async function submit_listing(doc_data: {}) {

    console.log(doc_data);

    const docRef = await addDoc(collection(db, "jobs"), {
        county: doc_data["county"],
        deadline: doc_data["deadline"],
        desired_months_experience: doc_data["desired_months_experience"],
        job_author: doc_data["job_author"],
        job_description: doc_data["job_description"],
        job_mini_description: doc_data["job_mini_description"],
        job_title: doc_data["job_title"],
        salary_per_hour: doc_data["salary_per_hour"],
        tags: doc_data["tags"],
        type: doc_data["type"],
        working_days: doc_data["working_days"]
    });

    router.push("/view-listings"); 
}

function verify_and_create_listing() {
    var good_to_submit = true;
    var acceptable_tags: string[] = []
    if (chosen_job_tags.value[0] == "No Tag" &&
        chosen_job_tags.value[1] == "No Tag" &&
        chosen_job_tags.value[2] == "No Tag" &&
        chosen_job_tags.value[3] == "No Tag" &&
        chosen_job_tags.value[4] == "No Tag" &&
        chosen_job_tags.value[5] == "No Tag") {
        good_to_submit = false;
        alert("Please choose at least One Tag which you believe is relevant to this listing");
    }
    else {
        for (let index = 0; index < chosen_job_tags.value.length; index++) {
            if (chosen_job_tags.value[index] != "No Tag") {
                acceptable_tags.push(chosen_job_tags.value[index]);
            }
        }

        const test_set = new Set(acceptable_tags);
        if (test_set.size !== acceptable_tags.length) {
            console.warn("The Tags : " + acceptable_tags + " got repeats.");
            alert("Please don't choose the same tags... Please choose different ones");

            good_to_submit = false;
        }
    }

    var job_type_map = new Map();

    job_type_map.set("ONETIME", (job_type.value === "ONETIME"));
    job_type_map.set("MULTIPLE DAYS", (job_type.value === "MULTIPLE DAYS"));
    job_type_map.set("RECURRING", (job_type.value === "RECURRING"));
    
    const obj: { [key: string]: boolean } = {};
    job_type_map.forEach((value, key) => 
    {
        obj[key] = value;
    });
    const job_type_json = obj;
    
    var chosen_days_map = new Map();
    chosen_days_map.set((chosen_days.value[0][0] as string).toUpperCase(), chosen_days.value[0][1])
    chosen_days_map.set((chosen_days.value[1][0] as string).toUpperCase(), chosen_days.value[1][1])
    chosen_days_map.set((chosen_days.value[2][0] as string).toUpperCase(), chosen_days.value[2][1])
    chosen_days_map.set((chosen_days.value[3][0] as string).toUpperCase(), chosen_days.value[3][1])
    chosen_days_map.set((chosen_days.value[4][0] as string).toUpperCase(), chosen_days.value[4][1])
    chosen_days_map.set((chosen_days.value[5][0] as string).toUpperCase(), chosen_days.value[5][1])
    chosen_days_map.set((chosen_days.value[6][0] as string).toUpperCase(), chosen_days.value[6][1])
    
    
    const obj2: { [key: string]: boolean } = {};
    chosen_days_map.forEach((value, key) => 
    {
        obj2[key] = value;
    });
    const chosen_days_json = obj2;
    
    var data_to_submit = {}

    data_to_submit["county"] = target_county.value;
    data_to_submit["deadline"] = '01 Jan 3000 00:00:00 GMT'; // is a hack, dont know if we care about deadline?
    data_to_submit["desired_months_experience"] = months_exp.value;
    data_to_submit["job_author"] = userName.value;
    data_to_submit["job_description"] = job_desc_content.value;
    data_to_submit["job_mini_description"] = job_bio.value;
    data_to_submit["job_title"] = job_title.value;
    data_to_submit["salary_per_hour"] = salary.value;
    data_to_submit["tags"] = acceptable_tags;
    data_to_submit["type"] = job_type_json;
    data_to_submit["working_days"] = chosen_days_json;

    console.debug(data_to_submit);

    if (user !== null || has_login_been_implement_yet === false) {
        good_to_submit = true;
        submit_listing(data_to_submit);
    }
    else {
        alert("We weren't able to verify your current crednetials, this could be fixed by logging out and logging back in, sorry for this inconvience");
    }


}
</script>

<template>
    <div class="w-full sm:w-full p-2 mx-auto max-w-4xl">
        <h1
            class="font-bold text-4xl p-10 my-5 outline text-slate-50 font-sans rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-300">
            Create a new Job Listing</h1>
        <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-lg mt-4 font-sans font-bold mb-2"
                    for="grid-title">
                    Job title
                    <span class=" pl-3 text-xs text-gray-500 font-normal">
                        - The title of the Job that will be shown to users
                    </span>
                </label>

                <input required v-model="job_title"
                    class=" rounded-full appearance-none  md:w-1/2 block w-full bg-gray-200 text-gray-700    py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-grid-title" type="text" placeholder="Painter Wanted">
            </div>
            <div class="w-full  px-3">
                <label class="block uppercase mt-8 tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                    for="grid-short-desc">
                    Short description
                    <span class=" pl-3 text-xs text-gray-500 font-normal">
                        - 10-15 words about what it is you're looking for
                    </span>
                </label>

                <input required
                    class=" rounded-full appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                    id="grid-short-desc" type="text" placeholder="Need help painting my outside fense">
            </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6 ">
            <div class="w-full  mt-8 px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                    for="grid-desc">
                    Description

                </label>
                <textarea required rows="6" v-model="job_desc_content"
                    class="  shadow-xl p-3 rounded-3xl resize-y  appearance-none block w-full bg-gray-200 text-gray-700 border  py-3 px-4 leading-tight focus:outline-dashed focus:bg-white focus:border-green-500"
                    id="grid-desc" type="text" :placeholder=textarea_placeholder></textarea>
            </div>
        </div>
        <div class="flex flex-wrap -mx-3 mt-5 mb-2">
            <div class="w-full mt-8 px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2" for="exp">
                    Desired experience
                    <span class=" pl-3 text-xs text-gray-500 font-normal">
                        - Leave blank or '0' for Any
                    </span>
                </label>

                <div class="relative md:w-1/3">
                    <input type="number" v-model="months_exp" :onChange="update_months_side_text"
                        class="shadow-lg rounded-full appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                        id="exp" placeholder="0" pattern="^4[0-9]{12}(?:[0-9]{3})?$" min="0" />
                    <div id="months_side_text"
                        class="absolute inset-y-0 end-0 top-0 flex items-center pe-10 pointer-events-none">

                    </div>
                </div>
            </div>

            <div class="md:w-1/2 px-3 mt-8 md:mb-0 shadow-md p-3  rounded-3xl">
                <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                    for="county">
                    County

                </label>
                <select v-model="target_county"
                    class="w-full appearance-none p-2 bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                    id="county">
                    <option v-for="county in All_Counties" :value="county">{{ county }}</option>

                </select>
            </div>

            <div class="md:w-1/2 px-3 mt-8 md:mb-0 shadow-md p-3 rounded-3xl">
                <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2" for="type">
                    type of work
                    <span id="job_type_help_text" class=" pl-3 text-xs text-gray-500 font-normal">
                        - What type of employment will this be?
                    </span>

                </label>

                <select v-model="job_type" :onChange="update_job_type_help_text" id="type"
                    class="w-full appearance-none  bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                    <option v-for="option in job_type_options" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>

            <div class="px-3  mt-10 md:mb-0">
                <label class="   block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2">
                    Available days
                </label>

                <!-- VUE can NOT deal with horizontal lists, I tried-->
                <ul class="flex flex-col md:flex-row shadow-xl rounded-lg">

                    <!-- Monday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-1" name=" checkbox-1" type="checkbox"
                                    class="border-gray-200  checked:bg-green-500 rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[0][1]">
                            </div>
                            <label for=" checkbox-1" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[0][0] }}
                            </label>
                        </div>
                    </li>

                    <!-- Tuesday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-2" name=" checkbox-2" type="checkbox"
                                    class="border-gray-200  checked:bg-green-500 rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[1][1]">
                            </div>
                            <label for=" checkbox-2" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[1][0] }}
                            </label>
                        </div>
                    </li>

                    <!-- Wednesday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-3" name=" checkbox-3" type="checkbox"
                                    class="border-gray-200  checked:bg-green-500 rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[2][1]">
                            </div>
                            <label for=" checkbox-3" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[2][0] }}
                            </label>
                        </div>
                    </li>

                    <!-- Thursday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-4" name=" checkbox-4" type="checkbox"
                                    class="border-gray-200  checked:bg-green-500 rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[3][1]">
                            </div>
                            <label for=" checkbox-4" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[3][0] }}
                            </label>
                        </div>
                    </li>

                    <!-- Friday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-5" name=" checkbox-5" type="checkbox"
                                    class="border-gray-200  checked:bg-green-500 rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[4][1]">
                            </div>
                            <label for=" checkbox-5" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[4][0] }}
                            </label>
                        </div>
                    </li>

                    <!-- Saturday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-6" name=" checkbox-6" type="checkbox"
                                    class="border-gray-200 checked:bg-green-500  rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[5][1]">
                            </div>
                            <label for=" checkbox-6" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[5][0] }}
                            </label>
                        </div>
                    </li>

                    <!-- Sunday -->
                    <li
                        class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <div class="flex items-center h-5">
                                <input id=" checkbox-7" name=" checkbox-7" type="checkbox"
                                    class="border-gray-200 checked:bg-green-500 rounded-full disabled:opacity-50  "
                                    v-model="chosen_days[6][1]">
                            </div>
                            <label for=" checkbox-7" class="ms-3.5 block w-full text-sm text-gray-800">
                                {{ chosen_days[6][0] }}
                            </label>
                        </div>
                    </li>


                </ul>

            </div>

            <div class="w-full mt-16 px-3 shadow-lg p-5 rounded-3xl ">
                <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                    for="salary">
                    Salary (€ per hour)
                    <span class=" pl-3 text-xs text-gray-500 font-normal">
                        - Leave blank or '0' if it's to be discussed
                    </span>
                </label>

                <div class="relative md:w-1/3 ">
                    <input type="number" v-model="salary" :onChange="update_salary_side_text" id="salary"
                        class=" appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-full py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                        placeholder="0" pattern="^4[0-9]{12}(?:[0-9]{3})?$" min="0" />
                    <div id="salary_side_text"
                        class="absolute inset-y-0 end-0 top-0 flex items-center pe-10 pointer-events-none">

                    </div>
                </div>
            </div>




            <div class="w-full my-16  px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2">
                    Relevant Tags
                    <span class=" pl-3 text-xs text-gray-500 font-normal">
                        - Please choose up to 6 tags that you feel are most relavant to this job
                    </span>
                </label>


                <ul class="flex flex-col md:flex-row shadow-lg rounded-lg">
                    <!-- Tag 1 -->
                    <li
                        class="inline-flex items-center gap-x-2 py-3 px-1 text-xs font-light bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <select v-model="chosen_job_tags[0]" required
                                class="w-full appearance-none bg-blue-300 ps-2 border border-gray-200 text-gray-700 py-3 px-1 pr-6 rounded-full  leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option v-for="(tag, index) in job_tags" :key="index" :value="tag"
                                    :disabled="index === 0">{{ tag }}</option>
                            </select>
                        </div>
                    </li>
                    <!-- Tag 2 -->
                    <li
                        class="inline-flex items-center gap-x-2 py-3 px-1 text-xs font-light bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <select v-model="chosen_job_tags[1]"
                                class="w-full appearance-none bg-amber-300 ps-2 border border-gray-200 text-gray-700 py-3 px-1 pr-6  rounded-full  leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option v-for="(tag, index) in job_tags" :key="index" :value="tag">{{ tag }}</option>
                            </select>
                        </div>
                    </li>
                    <!-- Tag 3 -->
                    <li
                        class="inline-flex items-center gap-x-2 py-3 px-1 text-xs font-light bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <select v-model="chosen_job_tags[2]"
                                class="w-full appearance-none bg-emerald-300 ps-2 border border-gray-200 text-gray-700 py-3 px-1 pr-6  rounded-full  leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option v-for="(tag, index) in job_tags" :key="index" :value="tag">{{ tag }}</option>
                            </select>
                        </div>
                    </li>
                    <!-- Tag 4 -->
                    <li
                        class="inline-flex items-center gap-x-2 py-3 px-1 text-xs font-light bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <select v-model="chosen_job_tags[3]"
                                class="w-full appearance-none bg-teal-100 border ps-2 border-gray-200 text-gray-700 py-3 px-1 pr-6  rounded-full  leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option v-for="(tag, index) in job_tags" :key="index" :value="tag">{{ tag }}</option>
                            </select>
                        </div>
                    </li>
                    <!-- Tag 5 -->
                    <li
                        class="inline-flex items-center gap-x-2 py-3 px-1 text-xs font-light bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <select v-model="chosen_job_tags[4]"
                                class="w-full appearance-none bg-lime-200 ps-2 border border-gray-200 text-gray-700 py-3 px-1 pr-6  rounded-full  leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option v-for="(tag, index) in job_tags" :key="index" :value="tag">{{ tag }}</option>
                            </select>
                        </div>
                    </li>
                    <!-- Tag 6 -->
                    <li
                        class="inline-flex items-center gap-x-2 py-3 px-1 text-xs font-light bg-white border text-gray-900 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg   ">
                        <div class="relative flex items-start w-full">
                            <select v-model="chosen_job_tags[5]"
                                class="w-full appearance-none bg-red-200 border ps-2 border-gray-200 text-gray-700 py-3 px-1 pr-6  rounded-full  leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option v-for="(tag, index) in job_tags" :key="index" :value="tag">{{ tag }}</option>
                            </select>
                        </div>
                    </li>



                </ul>
            </div>


            <div
                class="w-full flex flex-col md:flex-row place-content-center bg-gradient-to-r shadow-2xl from-emerald-500 to-emerald-500 my-16 mb-32 p-5 shadown-2xl rounded-xl">
                <h1 class="place-self-center font-bold text-xl text-slate-50">Once you're sure that all the information
                    is correct, you can submit this listing!</h1>
                <button @click="verify_and_create_listing()"
                    class="py-8 px-10 bg-emerald-600 rounded-xl hover:bg-emerald-300 text-white font-bold  border-b-4 border-emerald-700 hover:border-emerald-500 ">
                    <span class="text-2xl">Create Job Listing</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style></style>
