<!-- 
This is the View for the Profile View,
It can be divided up into 4 main components
    1.) A profile photo
    2.) Name
    3.) Short Description
    4.) Message Button
-->

<script setup lang="ts">
import Profile_Card from '@/components/ProfileView/Profile_Card.vue';
import Profile_Description from '@/components/ProfileView/Profile_Description.vue';
import Profile_Subtitle from '@/components/ProfileView/Profile_Subtitle.vue';
import Quick_Message from '@/components/ProfileView/Quick_Message.vue';
import Back_Button from '@/components/Back_Button.vue';

// TODO : On page load, get details from Database
</script>

<template>
    <!-- ### PROFILE PICTURE + NAME ###-->
    <Profile_Card profile_name="John, 27" />

    <!-- ### PROFILE SUBTITLE    -->
    <Profile_Subtitle profile_subtitle="From Cork" />

    <!-- ### PROFILE DESCRIPTION    -->
    <Profile_Description profile_desc="YAY" />

    <!-- ### CONTACT BUTTON     -->
    <Quick_Message :user_ID_to_message="1234" />

    <Back_Button />


</template>

<!-- TODO: Should implement Tailwindcss instead of custom CSS -->

<style scoped>
body {
    width: 100%;
    display: grid;
    margin: 0;
}
</style>