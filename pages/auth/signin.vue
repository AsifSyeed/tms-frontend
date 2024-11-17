<template>
  <div class="flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
    style="height: 100%; min-height: 98vh">
    <Toast />
    <img src="~/assets/Logo_big.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-3 lg-w-30 sm-w-90" style="height: 30%;">
      <!-- Email Input -->
      <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
      <p v-if="emailError" class="error-message">{{ emailError }}</p>

      <!-- Password Input -->
      <GlobalInputText type="password" v-model="password" placeholder="Password" class="w-full mb-4 border-round" />
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

      <!-- Loader and Sign In button -->
      <div v-if="loading" class="loader">
        <div class="spinner"></div>
      </div>
      <GlobalButton v-else @buttonTapped="handleButtonTap" title="Sign In" :disabled="loading" />

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

const email = ref<string | null>(null);
const password = ref<string | null>(null);
const rememberMe = ref(false);
const loading = ref(false);

const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);

const handleButtonTap = () => {
  onSubmit();
};

const toast = useToast();

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

const onSubmit = async () => {
  // Reset error messages
  emailError.value = null;
  passwordError.value = null;

  // Check if fields are empty
  if (!email.value) {
    emailError.value = "Please enter your email";
  } else if (!validateEmail(email.value)) {
    emailError.value = "Invalid email format";
  }

  if (!password.value) {
    passwordError.value = "Please enter your password";
  } else if (!validatePassword(password.value)) {
    passwordError.value = "Password must contain at least 8 characters";
  }

  // If there are validation errors, return early
  if (emailError.value || passwordError.value) {
    return;
  }

  loading.value = true;

  try {
    const { data, error } = await useFetch('https://api.countersbd.com/api/v1/auth/token', {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        userRole: 1
      }
    });

    // Handle API error response
    if (error) {
      // Display API error message in toast notification
      toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
      loading.value = false; // Hide the loader on error

      loading.value = false;
    }

    // Handle successful response
    if (data.responseCode === 200) {
      if (rememberMe.value) {
        const userEmail = useCookie('userEmail');
        userEmail.value = email.value;
      }

      const userToken = useCookie('userToken');
      userToken.value = data.data.token;

      const isAuthenticated = isAuthenticatedState();
      isAuthenticated.value = true;

      navigateTo("/");
    } else {
      toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
      loading.value = false; // Hide the loader on failure
    }
  } catch (error) {
    // Handle unexpected errors
    toast.add({
      severity: 'error',
      summary: 'Error!',
      detail: "An unexpected error occurred. Please try again later.",
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.signupLink {
  text-decoration-color: $theme-yellow;
}

a {
  color: $theme-yellow;
}

a:visited {
  color: $theme-yellow;
}

a:hover {
  color: $theme-yellow;
}

a:active {
  color: $theme-yellow;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid $theme-yellow;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
</style>
