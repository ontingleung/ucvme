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
    profile_ID: "",
    profile_county: "",
    // profile_town: "",
    profile_fname: "",
    profile_lname: "",
    profile_description: " ",
    profile_email: ""
});

const max_description_length = 60;

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
    <div class="flex text-center flex-col sm:flex-row"> 
        <button
            class="grid grid-cols-1  text-center m-2 sm:m-0 grid-rows-4 sm:grid-cols-2 w-full sm:grid-rows-4 max-h-72 gap-4 p-2 sm:p-4 justify-center bg-white shadow-md rounded-3xl ring-emerald-200 ring-2"
            @click="GoToProfile(profile_ID)">
            <div class=" bg-slate-200 ring-4 mx-4 my-4 ring-emerald-500 row-span-4 rounded-full grid content-around w-24 h-24 sm:w-48 sm:h-48 place-content-center text-center"
                :style="{backgroundImage: `url('${props.profile_thumbnail_url}')`, backgroundSize: `cover`, backgroundPositionY: `center`, backgroundPositionX: `center`}">
            
            </div>
            <div class="p-2">
                <h1 class="font-sans overflow-hidden text-slate-600 text-xl sm:text-3xl font-bold">{{ profile_fname }}</h1>
            </div>
            <div class="p-2 text-center">
                <p class="font-sans overflow-hidden text-center max-w-36 max-h-15 font-bold text-m sm:text-xl text-slate-600"> From {{ profile_county }} </p>
            </div>
            <div class="pt-10">
                <div class="">
                    <button v-on:click.stop @click="GoToMessageProfile(profile_ID)"
                        class="bg-emerald-600 w-full overflow-hidden content-around hover:bg-emerald-400 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline  rounded-xl"
                        type="button">
                        Contact {{ profile_fname }}
                    </button>
                </div>
            </div>
            <div class="mt-20 col-start-1 flex-initial px-1 font-bold max-h-10 text-emerald-800 col-end-3 max-w-74 max-h-16 overflow-hidden text-center font-sans  rounded-3xl  ">
                "{{ profile_desc_truncated }}"
            </div>
        </button>
    </div>
</template>


<style></style>