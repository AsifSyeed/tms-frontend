<template>
  <div class="flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
       style="height: 100%; min-height: 98vh">
    <Toast />
    <img src="~/assets/Logo_big.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-3 lg-w-30 sm-w-90" style="height: 30%;">
      <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
      <GlobalInputText type="password" v-model="password" placeholder="Password" class="w-full mb-4 border-round" />

      <!-- Loader and Sign In button -->
      <div v-if="loading" class="loader">
        <div class="spinner"></div>
      </div>
      <GlobalButton v-else @buttonTapped="handleButtonTap" title="Sign In" :disabled="loading"/>
      
      <div class="flex justify-content-center flex-wrap mb-2 mt-3">
        <Checkbox v-model="rememberMe" :binary="true" inputId="checkbox" />
        <label for="checkbox" class="ml-2 text-sm"> Remember Me?</label>
      </div>
      <div class="w-full text-center pt-4">
        <NuxtLink class="signupLink font-bold" to="/auth/forgot">Forgot Password?</NuxtLink>
      </div>
      <div class="w-full text-center pt-4">Not signed up yet?
        <NuxtLink class="signupLink font-bold" to="/auth/signup">Sign Up</NuxtLink>
      </div>
      <div class="w-full text-center pt-4">
        <NuxtLink class="signupLink font-bold" to="/">Back to Home</NuxtLink>
      </div>
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
const loading = ref(false); // Loading state for the sign-in process

const toast = useToast();

const handleButtonTap = () => {
  onSubmit();
};

const onSubmit = async () => {
  if (email.value === null || email.value === "" || password.value === null || password.value === "") {
    toast.add({ severity: 'error', summary: 'Error!', detail: "Please fill up all the fields", life: 3000 });
  } else {
    loading.value = true; // Show the loader
    useFetch('https://api.countersbd.com/api/v1/auth/token', {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        userRole: 1
      }
    }).then(res => {
      const data = res.data.value;
      const error = res.error.value;
      if (error) {
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
        loading.value = false; // Hide the loader on error
      } else {
        if (rememberMe.value) {
          const userEmail = useCookie('userEmail');
          userEmail.value = email.value;
        }
        if (data.responseCode !== null && data.responseCode === 200) {
          const userToken = useCookie('userToken');
          userToken.value = data.data.token;
          const isAuthenticated = isAuthenticatedState();
          isAuthenticated.value = true;
          loading.value = false; // Hide the loader on success
          navigateTo("/");
        } else {
          toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
          loading.value = false; // Hide the loader on failure
        }
      }
    }, error => {
      toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
      loading.value = false; // Hide the loader on request error
    });
  }
};
</script>

<style lang="scss" scoped>
.signupLink {
  text-decoration-color: $theme-yellow;
}

a {color: $theme-yellow;}         /* Unvisited link  */
a:visited {color: $theme-yellow;} /* Visited link    */
a:hover {color: $theme-yellow;}   /* Mouse over link */
a:active {color: $theme-yellow;}  /* Selected link   */

/* Loader styles */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1); /* Light grey background for the spinner */
  border-top: 4px solid $theme-yellow; /* Yellow color for the active part of the spinner */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite; /* Animation that makes the circle spin */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
