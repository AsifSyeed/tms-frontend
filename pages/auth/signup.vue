<template>
  <div class=" flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
    style="height: 100%; min-height: 98vh">
    <img src="~/assets/Logo_new.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2" style="height: 30%; width: 20%;">
      <GlobalInputText type="text" v-model="userName" placeholder="User Name" class="w-full mb-2 border-round" />
      <GlobalInputText type="text" v-model="phoneNumber" placeholder="Phone Number" class="w-full mb-2 border-round" />
      <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
      <GlobalInputText type="password" v-model="password" placeholder="Password" class="w-full mb-4 border-round" />
      <GlobalButton @buttonTapped="handleButtonTap" title="Sign Up" :disabled="false"/>
      <div class="w-full text-center pt-4">Already a member? <NuxtLink class="signupLink font-bold" to="/auth/signin">Sign In</NuxtLink> </div>
      <div class="w-full text-center pt-4"> <NuxtLink class="signupLink font-bold" to="/">Back to Home</NuxtLink> </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isAuthenticatedState } from '~/composables/state';

definePageMeta({
  layout: 'auth'
})
const email = ref(null);
const password = ref(null);
const phoneNumber = ref(null);
const userName = ref(null);
const handleButtonTap = () => {
  onSubmit()
};

const onSubmit = async () => {
  const { data: responseData } = await useFetch('https://api.countersbd.com/api/v1/user/signup', {
    method: 'post',
    body: {
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
      userName: userName.value,
      userRole: 1
    }
  })
  if (responseData.value.responseCode === 200) {
    navigateTo("/auth/signin")
  }
}


</script>

<style lang="scss" scoped>
.signupLink {
  text-decoration-color: $theme-yellow;
}

a {color: $theme-yellow;}         /* Unvisited link  */
a:visited {color:$theme-yellow;} /* Visited link    */
a:hover {color:$theme-yellow;}   /* Mouse over link */
a:active {color:$theme-yellow;}  /* Selected link   */
</style>