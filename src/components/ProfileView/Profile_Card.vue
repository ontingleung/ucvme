<script setup lang="ts">
export interface Props {
    profile_name: string,
    profile_img?: string // TODO : Add Profile Picture URL

}

// TODO: Use Async await to fetch Profile name and details... this approach is too bad. Must compare and see which method is fastest
const props = withDefaults(defineProps<Props>(), {
    profile_name: 'Loading...',
    profile_img: "../../assets/Images/default_user.webp" // TODO : If no Image URL is provided, need to be able to use a default
})
</script>

<template>
    <div class="Profile_View">
        <!-- ### PROFILE PICTURE + NAME ###
            it'll take up the whole width and 1/2 -> 2/3 of the screen-->
        <!-- TODO: Ask Ileana which looks better, 50% of screen height, or 66%, or other -->
        <!-- TODO: <div class="Profile_Picture_Card" style="background-image: url({{ profile_img }});"> does NOT work... WHY??? -->
        <div class="Profile_Picture_Card">
            <h1>
                {{ profile_name }}
            </h1>
        </div>

    </div>
</template>

<style scoped>
.Profile_Picture_Card {
    width: 100%;
    height: 50vh;
    background-color: var(--vt-c-white-mute);
    background-image: url("../../assets/Images/default_user.webp");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    background-position-y: center;
    display: grid;
}

.Profile_Picture_Card>h1 {
    align-self: self-end;
    padding-left: 2vw;

    color: var(--vt-c-black-soft);
    font-weight: 500;

    /* TODO: Ask Ileana which blur affect looks best */
    backdrop-filter: blur(4px);
    /* 3px - 9px looks best*/
    background-color: rgba(255, 255, 255, 0.5);
    /* Adjust the alpha value (0.5 for semi-transparent) */
}
</style>