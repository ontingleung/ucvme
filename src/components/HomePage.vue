<template>

    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Pacifico&display=swap"
            rel="stylesheet">

        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet">

    </head>
    <div class="container bg-white px-4">
        <div class="bg-emerald-700 p-4 header">
            <br>
            <h1 class="text-white text-6xl font-bold mb-4 head">
                Create a Personal Video CV
            </h1>
            <br>
        </div>
        <br>
        <p class=" bg-white text-2xl text-emerald-700 drop-shadow-lg mb-6 p-3 rounded-full tagline">
            Make videos to showcase your casual work as a <span class="typewriter text-blue-600">{{ currentJob
                }}</span>
        </p>
        <p class=" bg-white text-xl text-emerald-700 drop-shadow-lg mb-6 p-3 rounded-full tagline">
            Introduce yourself and present your best qualities through a personal video cv.
        </p>
        <button
            class="bg-emerald-500 text-white p-7 rounded-full hover:bg-emerald-600 transition-colors drop-shadow-md tagline-b"
            @click="signup">
            START CREATING
        </button>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const jobs = ref([
    "Gardener",
    "Painter",
    "Tutor",
    "Developer",
    "Writer",
]);
const currentIndex = ref(0);
const currentJob = ref(jobs.value[currentIndex.value]);

const animateTypewriter = () => {
    setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % jobs.value.length;
        currentJob.value = jobs.value[currentIndex.value];
    }, 5000);
};

const signup = () => {
    router.push('/signup');
}

onMounted(animateTypewriter);
</script>

<style scoped>
.container {
    min-height: 100vh;
    min-width: 100dvw;
    background-image: url('../assets/pattern.jpeg');
    background-size: contain;
    background-position: center;
    background-repeat: repeat-x;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.header {
    width: 100dvw;
}

.head {
    font-family: "Pacifico", cursive;
    font-weight: 400;
    font-style: normal;
}

.tagline {
    font-family: "Comfortaa", sans-serif;
    font-optical-sizing: auto;
    font-weight: normal;
    font-style: normal;
}
.tagline-b {
    font-family: "Comfortaa", sans-serif;
    font-optical-sizing: auto;
    font-weight: bolder;
    font-style: normal;
}

.typewriter {
    display: inline-flex;
    overflow: hidden;
    border-right: .15em solid rgb(92, 129, 222);
    white-space: nowrap;

    margin: 0;
    letter-spacing: .05em;
    animation: typing 5s steps(30, end) infinite, blink-caret .75s step-end infinite;
    max-width: 0px;
}

@keyframes typing {

    0%,
    100% {
        max-width: 0;
    }

    50% {
        max-width: 12em;
    }
}

@keyframes blink-caret {
    50% {
        border-color: transparent;
    }
}
</style>