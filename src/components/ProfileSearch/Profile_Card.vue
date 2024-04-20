<!-- 
    
    This is the card for each Profile when searching 
    
-->
<script setup lang="ts">



import { profile } from 'console';
import { defineProps, withDefaults, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';



const router = useRouter();

const props = withDefaults(defineProps<{
    profile_ID: string,
    profile_county: string,
    profile_town: string,
    profile_fname: string,
    profile_lname: string,
    profile_thumbnail_url: string,
    profile_description: string,
    profile_email : string
}>(), {
    profile_ID: "Loading...",
    profile_county: "Loading...",
    profile_town: "Loading...",
    profile_fname: "Loading...",
    profile_lname: "Loading...",
    profile_description: "Loading...",
    profile_email: ""
});

const max_description_length = 100;

const profile_img = ref()
const profile_desc_truncated = ref()

onMounted(() => 
{
    if(props.profile_description.length >= max_description_length)
    {
        profile_desc_truncated.value  = props.profile_description.slice(0, (max_description_length-3)) + "...";
    }
    else
    {
        profile_desc_truncated.value  = props.profile_description;
    }
})

if (props.profile_thumbnail_url == "") {
    import('@/assets/default_user_image.png').then(imageImports => {
        profile_img.value = imageImports.default
        console.log("Using default image");
    })
}
/*else {
    import(props.profile_thumbnail_url).then(imageImports => {
        profile_img.value = imageImports.default
        console.log("Using imported image");
    })
}*/


function GoToMessageProfile(profile_link_to_nav_to: string) {
    if(props.profile_email == "")
    {
        console.debug("No email is set for user, going to profile instead");
        router.push(`/view-profile/${profile_link_to_nav_to}`);
    }
    else
    {
        var mailto_link = "mailto:" + props.profile_email + `?subject=Hey, let's talk! I saw your UCVME profile! `;
        console.debug("Attempting to go to " + mailto_link);
        router.push(`/view-profile/${profile_link_to_nav_to}`);
        window.location.href = mailto_link;
        
    }
    // router.push(`/messaging/${profile_link_to_nav_to}`); // Need to implement messaging
}


function GoToProfile(profile_link_to_nav_to: string) {
    router.push(`/view-profile/${profile_link_to_nav_to}`);
}


</script>



<template>
    <div class="flex flex-col sm:flex-row"> 
        <button
            class="grid grid-cols-1 m-2 sm:m-0 grid-rows-4 sm:grid-cols-2 w-full sm:grid-rows-4 max-h-72 gap-4 p-2 sm:p-4 justify-center bg-gradient-to-r from-green-500 to-green-700 rounded-3xl ring-4 ring-black"
            @click="GoToProfile(profile_ID)">
            <div class=" bg-slate-200 ring-4 mx-4 my-4 ring-black row-span-4 rounded-full grid content-around w-24 h-24 sm:w-48 sm:h-48 place-content-center text-center"
                :style="{backgroundImage: `url('${props.profile_thumbnail_url}')`, backgroundSize: `cover`, backgroundPositionY: `center`, backgroundPositionX: `center`}">
            
            </div>
            <div class="p-2">
                <h1 class="font-sans overflow-hidden text-green-50 text-xl sm:text-3xl font-bold">{{ profile_fname }} {{ profile_lname }}</h1>
            </div>
            <div class="p-2">
                <p class="font-sans overflow-hidden max-w-36 max-h-15 font-bold text-m sm:text-xl text-slate-100"> From {{ profile_town }}, {{ profile_county }} </p>
            </div>
            <div class="p-2">
                <div class="py-1 my-1">
                    <button
                        class="bg-gradient-to-r w-full content-around from-green-300 to-blue-400 hover:from-teal-300 hover:to-green-400 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline ring-2 ring-black rounded-xl"
                        type="button">
                        Play video </button>
                </div>
                <div class="">
                    <button v-on:click.stop @click="GoToMessageProfile(profile_ID)"
                        class="bg-gradient-to-r w-full overflow-hidden content-around from-green-300 to-teal-500 hover:from-lime-300 hover:to-green-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline ring-2 ring-black rounded-xl"
                        type="button">
                        Contact {{ profile_fname }}
                    </button>
                </div>
            </div>
            <div class="col-start-1 flex-initial px-1 font-bold max-h-10 text-slate-100 col-end-3 max-w-74 max-h-16 overflow-hidden text-center font-sans backdrop-brightness-50 rounded-3xl  ">
                {{ profile_desc_truncated }}
            </div>
        </button>
    </div>
</template>


<style></style>