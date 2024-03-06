<script setup lang="ts">
export interface Props {
    profile_subtitle: string
}

// TODO: Use Async await to fetch Profile details... this approach is too bad. Must compare and see which method is fastest
const props = withDefaults(defineProps<Props>(), {
    profile_subtitle: "Loading..."
})
</script>

<!-- TODO: Should implement Tailwindcss instead of custom CSS -->

<template>
    <div class="Description_Holder">
        <br>
        <h2>
            {{ profile_subtitle }}
        </h2>

    </div>
</template>

<style scoped>
.Description_Holder {
    display: grid;
    padding: 3vw;
}

.Description_Holder>h2 {
    font-weight: bold;
}


</style>