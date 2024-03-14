<template>
    <div class="mainmenu p-2">
        <div class="w-full flex flex-column bg-white p-2">
            <div class="pb-4">
                <NuxtLink to="/">
                    <img src="~/assets/Logo.png" alt="" class="w-full">
                </NuxtLink>
            </div>
            <template v-for="item in items" class="p-4">
                <div class="text-gray font-bold pb-2">{{ item.label }}</div>
                <template v-for="i in item.items">
                    <MainMenuButton :name="i.label" :link="i.link" />
                    <div class="p-1"></div>
                </template>
                <div class="pb-3"></div>
            </template>

        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const items = ref([
    {
        label: 'Events',
        items: [
            {
                label: 'Create',
                link: '/events/create'
            },
            {
                label: 'Event List',
                link: '/events'
            }
        ]
    },
    {
        label: 'Users',
        items: [
            {
                label: 'Create',
                link: '/users/create'
            },
            {
                label: 'User List',
                link: '/users'
            }
        ]
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                link: '/settings'
            },
            {
                label: 'Logout',
                link: '/logout'
            }
        ]
    },
]);
</script>

<style>
.mainmenu {
    height: 100% !important; /* Full-height: remove this if you want "auto" height */
    width: 14.2% !important; /* Set the width of the sidebar */
    position: fixed !important; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1 !important; /* Stay on top */
    top: 0 !important; /* Stay at the top */
    left: 0 !important;
    background-color: white !important; /* Black */
    overflow-x: hidden !important; /* Disable horizontal scroll */
    padding-top: 20px !important;
}
</style>