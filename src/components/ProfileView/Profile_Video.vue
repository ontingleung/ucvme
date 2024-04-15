<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';
import { VideoPlayer } from '@videojs-player/vue';
import 'video.js/dist/video-js.css';


const props = withDefaults(defineProps<{
    video_url: string,
    poster_url: string;
}>(), {
    video_url: 'NO URL PROVIDED',
    poster_url: "/TEST_Photo_Delete_later.gif"
});

</script>




<template>
    <div class="flex justify-center items-center">
        <div class="video-container rounded-full w-50 h-50 overflow-hidden " style="height: 380px; width: 70%;">
            <video-player 
                :src="props.video_url" 
                class="video-js  ucvme-theme" 
                :poster="props.poster_url" 
                controls
               
                :enableDocumentPictureInPicture="false" 
                :loop="true" 
                :autoplay="false" 
                :volume="0.6" />
        </div>
    </div>
    
</template>



<style>
@import url(/src/assets/VideoJS/video-js.min.css);
@import url(/src/assets/VideoJS/UCVME_theme.css);

.ucvme-theme {
height: 100%;
width: 100%;
}
</style>