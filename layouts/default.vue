
<template>
    <div>
        <div class="card max-w-screen lg:w-9 sm:w-full pt-2 mx-auto">
            
            <Menubar :model="items" class="bg-gray-800 mx-2 mb-2 border-none">
                <template #start>
                        <img src="~/assets/Logo_new.png" alt="" class="h-3rem px-3 py-1">
                </template>
                <template #item="{ item }" class="h-0">
                    <NuxtLink :to="`${item.action}`" class="mx-2 text-white">{{item.label}}</NuxtLink>
                </template>
                <template #end>
                    <div class="flex align-items-left gap-2 pr-2">
                        <div v-if="isAuthenticated" class="mr-2 text-white">Hello, {{ userName }}</div>
                        <GlobalButton v-if="isAuthenticated" title="Log Out" class="" @buttonTapped="logOut" />
                        <GlobalButton v-else title="Sign In" class="" @buttonTapped="signIn" />
                    </div>
                </template>
            </Menubar>

            <slot/>
            
            <div class="text-white footer text-center text-xs">
                <img src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png" alt="" class="max-w-full pb-4 pt-4">
                <span>
                    <a :onClick="termsConditions" style="cursor: pointer" class="mr-3"> Terms & Conditions</a>
                    <a :onClick="refundpolicy" style="cursor: pointer"> Refund Policy</a>
                </span>
                <br/>
                <br/>
                <span>
                    &copy; Counters 2024
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { isAuthenticatedState } from '~/composables/state';
const isAuthenticated = isAuthenticatedState()
const userName = ref()

const items = ref([
    {
        label: 'Home',
        action: '/'
    },
    {
        label: 'Events',
        action: '/events'
    },
    {
        label: 'About Us',
        action: '/aboutus'
    },
]);

const signIn = () => {
    navigateTo("/auth/signin")
};

const logOut = () => {
    navigateTo("/auth/logout")
};

const refundpolicy = () => {
    navigateTo("/refundpolicy")
};

const termsConditions = () => {
    navigateTo("/termsAndConditions")
};
const userToken = useCookie('userToken')
    const token = "Bearer " + userToken.value

    const { data: responseData } = await useFetch('https://api.countersbd.com/api/v1/user/me', {
    method: 'get',
    headers: {
        "Authorization": token
    }
  })
  console.log()
  
  if (responseData._value !== null) {
    isAuthenticated.value = true
    userName.value = responseData._value.data.userName
  } else {
    isAuthenticated.value = false
  }

</script>

<style>

.p-menuitem {
    margin: 0 8px !important;
    padding: 0 0px; 
}

.p-menuitem-content{
    padding: 8px 0px !important;
    text-decoration-color: white !important;
}
.p-focus{
    background-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0);
}

.p-menuitem-content:hover{
    background-color: #FBAF44;
}

.p-menuitem .p-menubar-root-list > .p-menuitem:not(.p-highlight):not(.p-disabled) > .p-menuitem-content:hover {
    background-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0);
}

.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus > .p-menuitem-content {
    background-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0);
}

.router-link-active {
    margin: 0;
    padding: 8px 8px;
    border-radius: 5px;
    background-color: #FBAF44;
}

a {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
  color: white;
}

/* .footer {
  position: absolute;
  bottom: 0;
  width: 70%;
  height: 70px;
} */


</style>
