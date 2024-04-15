<template>
    <div class="container bg-white flex flex-col items-center text-center px-4">
        <h1 class="text-5xl font-bold mb-4">
            Create a Personal Video CV
        </h1>
        <p class="text-2xl text-blue-600 mb-6">
            Make videos to showcase your casual work as a <span class="typewriter text-emerald-600">{{ currentJob
                }}</span>
        </p>
        <p class="mb-8">
            Introduce yourself and present your best qualities through a personal video cv.
        </p>
        <button
            class="bg-emerald-500 text-white font-bold py-2 px-8 rounded-full hover:bg-emerald-600 transition-colors"
            @click="signup"
            >
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
    background-image: url('https://firebasestorage.googleapis.com/v0/b/ucvme-global.appspot.com/o/assets%2FHomeBackground.png?alt=media&token=f569a739-b0d4-46b8-93f7-92fe3b99c7ce');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}


.typewriter {
    display: inline-flex;
    overflow: hidden;
    border-right: .15em solid rgb(57, 176, 14);
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