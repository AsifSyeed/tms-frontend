<template>
  <div class=" flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
    style="height: 100%; min-height: 98vh">
    <img src="~/assets/Logo_new.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-7" style="height: 30%; width: 20%;">
      <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
      <GlobalInputText type="password" v-model="password" placeholder="Password" class="w-full mb-4 border-round" />
      <GlobalButton @buttonTapped="handleButtonTap" title="Sign In" :disabled="false"/>
      <div class="w-full text-center pt-4">Not signed up yet? <NuxtLink class="signupLink font-bold" to="/auth/signup">Sign Up</NuxtLink> </div>
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
const handleButtonTap = () => {
  onSubmit()
};

const onSubmit = async () => {
  const { data: responseData } = await useFetch('http://3.111.122.85:8080/api/v1/auth/token', {
    method: 'post',
    body: {
      email: email.value,
      password: password.value,
      userRole: 1
    }
  })
  console.log(responseData)
  if (responseData.value.responseCode === 200) {
    const userToken = useCookie('userToken')
    userToken.value = responseData.value.data.token
    console.log("from cookieeee")
    console.log(userToken.value)
    const isAuthenticated = isAuthenticatedState()
    isAuthenticated.value = true
    navigateTo("/")
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