<template>
    <NuxtLink :to="`${ props.link }`" class="p-3 w-full border-round mainMenuButton" activeClass = "mainMenuButtonActive">
        {{ props.name }}
    </NuxtLink>
</template>

<script setup>
    const props = defineProps({
        name: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        }
    })
</script>

<style lang="scss" scoped>
.mainMenuButton {
    text-decoration-color: var(--gray-800) !important;
    background-color: white !important;
    transition: 0.3s !important;
    display: block !important;
    text-decoration: none !important;
}
.mainMenuButton:hover {
    background-color: var(--gray-200) !important;
}
.mainMenuButtonActive {
    background-color: $theme-yellow !important;
}
.mainMenuButtonActive:hover {
    background-color: $theme-yellow !important;
}

.mainMenuButton:visited { 
 text-decoration: none; 
 color: var(--gray-800) !important;
}

a {
    color: var(--gray-800) !important;
}

a:link {
    color: var(--gray-800) !important;
}
</style>