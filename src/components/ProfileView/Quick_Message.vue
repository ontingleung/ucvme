<script setup lang="ts">
defineProps<{
    user_ID_to_message?: number
}>()


</script>

<!-- TODO: Should implement Tailwindcss instead of custom CSS -->

<template>
    <router-link to="/MessagingView">
        <button class="the_button">
            <img src="../../assets/Icons/message.svg" alt="External SVG">
        </button>
    </router-link>
</template>

<style scoped>
.the_button {
    width: 20vw;
    height: 20vw;
    border-radius: 2rem;
    background-color: var(--vt-c-white-soft);
    border: none;
    cursor: pointer;
    position: fixed;
    justify-content: center;
    align-items: center;

    bottom: 2vh;
    right: 3vw;
}

.the_button img {
    width: 70%;
    fill: var(--vt-c-black-mute);
}

.the_button:hover {
    background-color: var(--vt-c-text-dark-2);
}
</style>