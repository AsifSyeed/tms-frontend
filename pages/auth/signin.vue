<template>
  <div class=" flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
    style="height: 100%; min-height: 98vh">
    <Toast />
    <img src="~/assets/Logo_new.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-3 lg-w-30 sm-w-90" style="height: 30%;">
      <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
      <GlobalInputText type="password" v-model="password" placeholder="Password" class="w-full mb-4 border-round" />
      
      <GlobalButton @buttonTapped="handleButtonTap" title="Sign In" :disabled="false"/>
      <div class="flex justify-content-center flex-wrap mb-2 mt-3">
            <Checkbox v-model="rememberMe" :binary="true" inputId="checkbox" />
            <label for="checkbox" class="ml-2 text-sm"> Remember Me?</label>
        </div>
        <div class="w-full text-center pt-4"> <NuxtLink class="signupLink font-bold" to="/auth/forgot">Forgot Password?</NuxtLink> </div>
      <div class="w-full text-center pt-4">Not signed up yet? <NuxtLink class="signupLink font-bold" to="/auth/signup">Sign Up</NuxtLink> </div>
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
const rememberMe = ref(false);
const handleButtonTap = () => {
  onSubmit()
};

const toast = useToast()

const onSubmit = async () => {
  if (email.value === null || email.value === "" || password.value === null || password.value === "") {
    toast.add({ severity: 'error', summary: 'Error!', detail: "Please fill up all the fields", life: 3000 });
  } else {
    useFetch('https://api.countersbd.com/api/v1/auth/token', {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        userRole: 1
      }
    }).then(res => {
      const data = res.data.value
      const error = res.error.value
      if (error) {
        // dealing error
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
      } else {
        if (rememberMe) {
          const userEmail = useCookie('userEmail')
          userEmail.value = email.value
        }
        console.log(data)
        if (data.responseCode !==  null && data.responseCode === 200) {
          const userToken = useCookie('userToken')
          userToken.value = data.data.token
          const isAuthenticated = isAuthenticatedState()
          isAuthenticated.value = true
          navigateTo("/")
        } else {
          toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
        }
      }
    }, error => {
      toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
    })
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