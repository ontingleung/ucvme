<!-- 
This is the View for the Profile View,
It can be divided up into 4 main components
    1.) A profile photo
    2.) Name
    3.) Short Description
    4.) Message Button
-->

<script setup lang="ts">

import { onMounted, ref } from "vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRoute } from "vue-router";

import Profile_Title from "../components/ProfileView/Profile_Title.vue";
import Profile_Video from "../components/ProfileView/Profile_Video.vue";
import Text_Block from "../components/ProfileView/Text_Block.vue";


const profile_name = ref("Fetching details");
const profile_video_url = ref("");
const profile_poster_url = ref("");
const Profile_town = ref("Firebase, please wait...");



onMounted(async () => {
    const route = useRoute();
    const profileID = route.params.profileID;
    const doc_id = profileID.toString();

    const docRef = doc(db, "users", doc_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Profile Found: + ", docSnap.data());
        profile_name.value = docSnap.data().firstname;
        profile_poster_url.value = docSnap.data().profileImage;
        profile_video_url.value = docSnap.data().videoUrl;
        Profile_town.value = docSnap.data().town;

    } else {
        // docSnap.data() will be undefined in this case
        console.warn("ERROR 404 : No document found for user " + doc_id);
    }
});



</script>

  <template>
    <div class="container mx-auto p-4 flex">
      <div class="flex flex-col items-center w-1/5 ml-200"> 
        <div class="border-4 border-dashed rounded-full p-2">
          <img src="../assets/default_user_image.png" alt="Profile Image" class="rounded-full w-full h-auto object-cover" />
        </div>
  
        <div class="text-center mt-4">
          <h2 class="text-xl font-bold">{{ profile_name }}</h2>
          <p class="text-sm">{{ Profile_town }}</p>
        </div>
  
      </div>
  
      <div class="w-4/5"> 
        <Profile_Video :video_url="profile_video_url" :poster_url="profile_poster_url" />
        <Text_Block text_string="About: Your description here..." />
      </div>
    </div>
  </template>
  
  



<style></style>