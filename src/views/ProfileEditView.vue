<script setup lang="ts">

import { onMounted, reactive, ref } from "vue";
import { addDoc, collection, doc, getDoc, setDoc, updateDoc, type DocumentData } from "firebase/firestore";
import { db, storage } from "@/firebase";
import { useRoute } from "vue-router";

import { job_tags, All_Counties } from '@/main';
import Profile_Title from "../components/ProfileView/Profile_Title.vue";
import Profile_Video from "../components/ProfileView/Profile_Video.vue";
import Text_Block from "../components/ProfileView/Text_Block.vue";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import router from "@/router";
import { v4 as uuidv4 } from 'uuid';
import { ref as storageRef, uploadBytes, getDownloadURL } from "@firebase/storage";

const fileInput = ref(null);
const video_progress_img = ref("https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fupload.png?alt=media&token=db4c1b88-764b-442a-b253-f9c235148952");
const isUploadComplete = ref(false);

const workExperiences = ref([]);
const educations = ref([]);

const aboutMe = ref();
const county = ref();
const email = ref();
const firstname = ref();
const profilePictureUrl = ref();
const surname = ref();
const town = ref();
const videoUrl = ref();
const bother_saving = ref(false);
const show_save_msg = ref(false);
const profilePictureInput = ref(null);
const profile_pic_progress_img = ref("https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fvideocv.png?alt=media&token=db4c1b88-764b-442a-b253-f9c235148952");
const chosen_job_tags = ref([]);

const auth = getAuth();
var user_ref: User;
var user_doc_data;
var user_doc_ref;

const add_tag = (add: boolean) => {
    if (add) {
        chosen_job_tags.value[(chosen_job_tags.value.length)] = "";
    }
    else {
        chosen_job_tags.value.pop();
    }
}

const addWorkExperience = () => {
    workExperiences.value.push({ jobTitle: '', companyName: '', jobDuration: '' });
};
const newWorkExperience = (job_data, company_data, duration_data) => {
    workExperiences.value.push({ jobTitle: job_data, companyName: company_data, jobDuration: duration_data });
};

const addEducation = () => {
    educations.value.push({ schoolName: '', degree: '', yearsAttended: '' });
};
const newEducation = (school_name, degree_name, num_years) => {
    educations.value.push({ schoolName: school_name, degree: degree_name, yearsAttended: num_years });
};

function update_refs_from_document(doc_ref: DocumentData) {
    aboutMe.value = doc_ref.aboutMe;
    county.value = doc_ref.county;

    // Get all our educations
    try {
        doc_ref.educations.forEach(edu => {
            newEducation(edu["schoolName"], edu["degree"], edu["yearsAttended"]);
        });
    } catch (error) {
        console.debug(error);
    }

    // Get all our Exps    
    try {
        doc_ref.workExperiences.forEach(exp => {
            newWorkExperience(exp["companyName"], exp["jobDuration"], exp["jobTitle"]);
        });
    } catch (error) {
        console.debug(error);
    }

    // Get all our Tags
    var index = 0;
    try {
        doc_ref.tags.forEach(tag => {
            chosen_job_tags.value[index] = tag;
            index++;
        })
    } catch (error) {
        console.debug(error);
    }

    email.value = doc_ref.email;
    firstname.value = doc_ref.firstname;
    profilePictureUrl.value = doc_ref.profilePictureUrl;
    surname.value = doc_ref.surname;
    town.value = doc_ref.town;
    videoUrl.value = doc_ref.videoUrl;

}

async function create_document_if_none_exists() {
    var docRef = doc(db, "users", user_ref.uid);
    //var docRef = doc(db, "users", "jwi8myVdsoQ9v6KsQ1MxB9PHyk33");
    var docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.debug(user_ref.uid + " Exists in our users collection");
        user_doc_data = docSnap.data();
        user_doc_ref = docRef;
        update_refs_from_document(user_doc_data); // convert our user data from document to JSON
        return true;
    } else {
        // docSnap.data() will be undefined in this case
        console.warn(user_ref.uid + " does NOT exist in our users collection, lets check by email");

        await setDoc(doc(db, "users", user_ref.uid), {
            email: user_ref.email,
            firstname: user_ref.displayName,
            profilePictureUrl: user_ref.photoURL
        });

        docRef = doc(db, "users", user_ref.uid);
        docSnap = await getDoc(docSnap);

        if (docSnap.exists()) {
            console.debug("User doc : " + user_ref.uid + " created with email : " + user_ref.email + " firstname : " + user_ref.displayName);
            update_refs_from_document(docSnap.data());
            user_doc_ref = docRef;
            return true;
        }
        else {
            console.error("Failure to get and create a new user doc!");
            return false;
        }
    }
}


const uploadProfilePicture = async () => {
    const file = profilePictureInput.value.files[0];
    if (!file) return;
    const uniqueID = uuidv4();
    const profilePictureRef = storageRef(storage, `profilePictures/${uniqueID}`);
    try {
        const snapshot = await uploadBytes(profilePictureRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        profile_pic_progress_img.value = downloadURL;

        var user_doc = await doc(db, "users", user_ref.uid);
        await updateDoc(user_doc, {
            profilePictureUrl: downloadURL,
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
};

const uploadVideo = async () => {
    const file = fileInput.value.files[0];
    if (!file) return;
    const uniqueID = uuidv4();
    const userVideoRef = storageRef(storage, `userVideos/${uniqueID}.mp4`);
    const metadata = {
        contentType: 'video/mp4',
    };
    try {
        const snapshot = await uploadBytes(userVideoRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        videoUrl.value = downloadURL;
        var user_doc = await doc(db, "users", user_ref.uid);
        await updateDoc(user_doc, {
            videoUrl: videoUrl.value,
        });
        isUploadComplete.value = true;
        video_progress_img.value = "https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2Fok.png?alt=media&token=794cccb0-26a1-4623-b4fb-32e58680a7a2";
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        user_ref = user;
        const uid = user.uid;
        console.debug("User ID is " + user_ref.uid);
        create_document_if_none_exists();

    } else {
        // User is signed out
        console.warn("USER IS SIGNED OUT");
        router.push(`/`);
    }
});

const do_autosave = () => {
    bother_saving.value = true;
}



async function autosave_to_FB() { // Auto save any changes to FB

    if (bother_saving.value === true) {
        //console.debug("AUTOSAVING");

        show_save_msg.value = true;
        var data_to_pass = {};


        aboutMe.value ? data_to_pass["aboutMe"] = aboutMe.value : console.debug("aboutMe Field invalid");
        county.value ? data_to_pass["county"] = county.value : console.debug("county Field invalid");
        educations.value ? data_to_pass["educations"] = educations.value : console.debug("educations Field invalid");
        email.value ? data_to_pass["email"] = email.value : console.debug("email Field invalid");
        firstname.value ? data_to_pass["firstname"] = firstname.value : console.debug("firstname Field invalid");
        surname.value ? data_to_pass["surname"] = surname.value : console.debug("surname Field invalid");
        chosen_job_tags.value ? data_to_pass["tags"] = chosen_job_tags.value : console.debug("tags Field invalid");
        workExperiences.value ? data_to_pass["workExperiences"] = workExperiences.value : console.debug("workExperiences Field invalid");

        try {
            await setDoc(doc(db, "users", user_ref.uid), data_to_pass, { merge: true });

        } catch (error) {
            console.warn(error);
        }
        bother_saving.value = false;
        await new Promise(r => setTimeout(r = () => { show_save_msg.value = false}, 2000)); 
    }

}

onMounted(async () => {
    await user_ref; // make sure user credentials are gotten,,, avoid race condition

    setInterval(autosave_to_FB, 5000);
});


</script>

<template>
    <div class="container mx-auto p-8 px-20">
        <Transition enter-from-class="opacity-0" leave-to-class="opacity-0"
            enter-active-class="transition duration-300" leave-active-class="transition duration-300">
            <div v-if="show_save_msg"  class="fixed  py-4 px-5 mt-5 w-1/8 bg-lime-500 rounded-full text-white font-bold  border-b-4 border-lime-700 ">
                Changes Saved!
            </div>
        </Transition>
        <div class="flex gap-4">
            <div class="w-1/4">
                <p class="mt-5 text-md leading-6 text-gray-600">Upload a new profile picture</p>

                <div class="mt-5 flex items-center justify-center rounded-full w-11/12">
                    <label for="profilePictureInput"
                        class="flex flex-col rounded-full border-4 border-dashed w-full h-60 p-10 group text-center cursor-pointer">
                        <div class="h-full w-full text-center flex flex-col items-center justify-center ">
                            <img class="h-36 object-center" :src="profile_pic_progress_img" alt="upload">
                            <p class="pointer-none text-gray-500">Select a new picture from your device
                            </p>
                        </div>
                        <input id="profilePictureInput" ref="profilePictureInput" type="file" class="hidden"
                            accept="image/*" @change="uploadProfilePicture">
                    </label>
                </div>
            </div>

            <div class="flex-grow">
                <p class="mt-5 text-md leading-6 text-gray-600">Upload a new 1 minute video about yourself</p>

                <div class="mt-5 flex items-center justify-center w-full rounded-full ">
                    <label for="fileInput"
                        class="flex flex-col rounded-full border-4 border-dashed w-full  h-60 p-10 group text-center cursor-pointer">
                        <div class="h-full w-full text-center flex flex-col items-center justify-center">
                            <div class="flex flex-auto max-h-48 mx-auto -mt-10">
                                <img class="h-36 object-center" :src="video_progress_img" alt="upload">
                            </div>
                            <p class="pointer-none text-gray-500">Select a new video from your device
                            </p>
                        </div>
                        <input id="fileInput" ref="fileInput" type="file" accept="video/*" class="hidden"
                            @change="uploadVideo">
                    </label>
                </div>
                <hr class="mt-10">

                <div class="flex flex-wrap justify-between -mx-3 mb-6 ">
                    <div class="w-5/12  mt-8 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                            for="firstname">
                            First Name:
                        </label>
                        <input required v-model="firstname"
                            class=" rounded-full appearance-none  block w-full bg-gray-100   py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="email" type="text" placeholder="Your First Name" @change="do_autosave">
                    </div>

                    <div class="w-5/12  mt-8 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                            for="surname">
                            Last Name:
                        </label>
                        <input required v-model="surname"
                            class=" rounded-full appearance-none  block w-full bg-gray-100   py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="surname" type="text" placeholder="Your Surname" @change="do_autosave">
                    </div>
                </div>

                <div class="flex flex-wrap justify-between -mx-3 mb-6 ">
                    <div class=" w-1/2 mt-8 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                            for="email">
                            E-mail:
                        </label>
                        <input required v-model="email"
                            class=" rounded-full appearance-none  block w-full bg-gray-100  py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="email" type="email" placeholder="Your E-Mail" @change="do_autosave">
                    </div>
                </div>



                <div class="flex flex-wrap -mx-3 mb-6 ">
                    <div class="w-full  mt-8 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                            for="aboutMe">
                            About me

                        </label>
                        <textarea required rows="6" v-model="aboutMe"
                            class="  shadow-xl p-3 rounded-3xl resize-y  appearance-none block w-full bg-gray-100 text-gray-700 border  py-3 px-4 leading-tight focus:outline-dashed focus:bg-white focus:border-green-500"
                            id="aboutMe" type="text" placeholder="Write a bit about yourself"
                            @change="do_autosave"></textarea>
                    </div>
                </div>

                <div class="flex flex-wrap justify-between -mx-3 mb-6 ">
                    <div class=" w-1/2 mt-8 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2"
                            for="county">
                            County
                        </label>
                        <select v-model="county" @change="do_autosave"
                            class="w-full appearance-none bg-gray-100 border text-gray-700 py-3 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                            id="county">
                            <option v-for="county in All_Counties" :value="county">{{ county }}</option>
                        </select>
                    </div>
                </div>
                <hr>
                <div class="flex flex-grow w-full -mx-3 mb-6 shadow px-7 pb-5 pt-2 mt-3 rounded-2xl">
                    <div class=" w-full mt-8 px-3 ">
                        <label class="block uppercase tracking-wide text-gray-700 text-md font-sans font-bold mb-2 "
                            for="county">
                            What tags interest you?
                        </label>
                        <div v-for="(tag, index) in chosen_job_tags" class="grid ">
                            <div class="mt-2 resize-x">
                                <input rows="1" v-model="chosen_job_tags[index]" @change="do_autosave"
                                    class="shadow-xl p-3 rounded-3xl resize-y  appearance-none block w-1/6 bg-gray-100  border  py-3 px-4 leading-tight focus:outline-dashed focus:bg-white focus:border-green-500"
                                    id="aboutMe" type="text" placeholder="Gardening"></input>
                            </div>
                        </div>
                        <button
                            class="py-4 px-5 mt-5 bg-lime-500 rounded-full hover:bg-lime-300 text-white font-bold  border-b-4 border-lime-700 hover:border-lime-500"
                            @click="add_tag(true)">Add tag</button>
                        <button
                            class="py-4 px-5 mt-5 mx-5 bg-orange-500 rounded-full hover:bg-orange-300 text-white font-bold  border-b-4 border-orange-700 hover:border-orange-500"
                            @click="add_tag(false)">Remove tag</button>
                    </div>
                </div>

                <hr>

                <div class="flex flex-wrap justify-between -mx-8 mb-6 ">

                    <!-- Work Experience Section -->
                    <div class="mt-5 w-5/12">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">Work Experience</h3>
                        <div v-for="(work, index) in workExperiences" :key="'work-' + index"
                            class="shadow-2xl p-3 rounded-3xl">
                            <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" required @change="do_autosave"
                                    class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    v-model="work.jobTitle" placeholder="Painter">
                            </div>
                            <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700">Company Name</label>
                                <input type="text" required @change="do_autosave"
                                    class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    v-model="work.companyName" placeholder="Self-Employed">
                            </div>
                            <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700">Duration</label>
                                <input type="text" required @change="do_autosave"
                                    class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    v-model="work.jobDuration" placeholder="2020 - 2023">
                            </div>
                        </div>
                        <button
                            class="py-4 px-5 mt-5 bg-blue-500 rounded-full hover:bg-blue-300 text-white font-bold  border-b-4 border-blue-700 hover:border-blue-500"
                            @click="addWorkExperience">Add Work Experience</button>
                    </div>

                    <!-- Education Section -->
                    <div class="mt-5 w-5/12">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">Education</h3>
                        <div v-for="(education, index) in educations" :key="'education-' + index"
                            class="shadow-2xl p-3 rounded-3xl">
                            <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700">School Name</label>
                                <input type="text" required @change="do_autosave"
                                    class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    v-model="education.schoolName" placeholder="Insitution name">
                            </div>
                            <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700">Degree</label>
                                <input type="text" required @change="do_autosave"
                                    class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    v-model="education.degree" placeholder="Eg. Diploma">
                            </div>
                            <div class="mt-3">
                                <label class="block text-sm font-medium text-gray-700">Years Attended</label>
                                <input type="text" required @change="do_autosave"
                                    class="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    v-model="education.yearsAttended" placeholder="2015 - 2020">
                            </div>
                        </div>
                        <button
                            class="py-4 px-5 mt-5 bg-lime-500 rounded-full hover:bg-lime-300 text-white font-bold  border-b-4 border-lime-700 hover:border-lime-500"
                            @click="addEducation">Add Education</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
