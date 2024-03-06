<script setup lang="ts">
export interface Props {
    profile_desc: string
}

// TODO: Use Async await to fetch description... this approach is too bad. Must compare and see which method is fastest
const props = withDefaults(defineProps<Props>(), {
    profile_desc: "This profiles description is loading... Please be patient as we grab it now"
})
</script>

<!-- TODO: Should implement Tailwindcss instead of custom CSS -->
<template>
    <div class="Description_Holder">
        
        <hr>
        <br>
        <div class="Description_Text">
            {{ profile_desc }}
        
        </div>
        <br>
        <hr>
    </div>
</template>

<style scoped>
.Description_Holder {
    display: grid;
    padding: 3vw;
}

.Description_Holder>h2 {
    font-weight: 100;
}

.Description_Holder>hr {
    border: none;
    margin-left: -3vw;
    margin-right: -3vw;
    height: 1px;
    background-color: var(--vt-c-white-mute);
}

</style>