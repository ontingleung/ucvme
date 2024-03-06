<script setup lang="ts">
defineProps<{
    target_route: string
}>()

</script>

<!-- TODO: Should implement Tailwindcss instead of custom CSS -->

<template>
    <!-- TODO : NEED TO IMPLEMENT DYNAMIC ROUTING, Pressing Back will make you go back to home page for the moment-->
    <router-link to="/">
        <button class="the_button">
            <img src="../assets/Icons/arrow-left.svg" alt="External SVG">
        </button>
    </router-link>
</template>

<style scoped>
.the_button {
    width: 10vw;
    height: 10vw;
    border-radius: 2rem;
    background-color: var(--vt-c-white-soft);
    border: none;
    cursor: pointer;
    position: fixed;
    justify-content: center;
    align-items: center;

    top: 2vh;
    left: 3vw;
}

.the_button img {
    width: 80%;
    fill: var(--vt-c-black-mute);
}

.the_button:hover {
    background-color: var(--vt-c-text-dark-2);
}
</style>