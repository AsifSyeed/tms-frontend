<template>
  <div class="flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
    style="height: 100%; min-height: 98vh">
    <Toast />
    <img src="~/assets/Logo_big.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 lg-w-30 sm-w-90" style="height: 30%;">
      <!-- Input Fields -->
      <GlobalInputText type="text" v-model="firstName" placeholder="First Name" class="w-full mb-2 border-round" />
      <p v-if="firstNameError" class="error-message">{{ firstNameError }}</p>

      <GlobalInputText type="text" v-model="lastName" placeholder="Last Name" class="w-full mb-2 border-round" />
      <p v-if="lastNameError" class="error-message">{{ lastNameError }}</p>

      <GlobalInputText type="text" v-model="userName" placeholder="User Name" class="w-full mb-2 border-round" />
      <p v-if="userNameError" class="error-message">{{ userNameError }}</p>

      <GlobalInputText type="text" v-model="phoneNumber" placeholder="Phone Number" class="w-full mb-2 border-round" />
      <p v-if="phoneNumberError" class="error-message">{{ phoneNumberError }}</p>

      <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
      <p v-if="emailError" class="error-message">{{ emailError }}</p>

      <GlobalInputText type="password" v-model="password" placeholder="Password" class="w-full mb-4 border-round" />
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

      <!-- Loader and Sign Up button -->
      <div v-if="loading" class="loader">Loading...</div>
      <GlobalButton v-else @buttonTapped="handleButtonTap" title="Sign Up" :disabled="loading" />

      <div class="w-full text-center pt-4">Already a member?
        <NuxtLink class="signupLink font-bold" to="/auth/signin">Sign In</NuxtLink>
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
});

const firstName = ref(null);
const lastName = ref(null);
const userName = ref(null);
const phoneNumber = ref(null);
const email = ref(null);
const password = ref(null);
const loading = ref(false);

const firstNameError = ref(null);
const lastNameError = ref(null);
const userNameError = ref(null);
const phoneNumberError = ref(null);
const emailError = ref(null);
const passwordError = ref(null);

const toast = useToast();

const handleButtonTap = () => {
  onSubmit();
};

const validateEmail = (email: string) => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email);
const validatePassword = (password: string) => password.length >= 8;
const validatePhoneNumber = (phone: string) => /^\d{10,}$/.test(phone);
const validateUserName = (userName: string) => userName.length >= 3;

const onSubmit = async () => {
  // Reset error messages
  firstNameError.value = null;
  lastNameError.value = null;
  userNameError.value = null;
  phoneNumberError.value = null;
  emailError.value = null;
  passwordError.value = null;

  // Validate inputs
  if (!firstName.value) {
    firstNameError.value = "First name is required";
  }
  if (!lastName.value) {
    lastNameError.value = "Last name is required";
  }
  if (!userName.value || !validateUserName(userName.value)) {
    userNameError.value = "User name must be at least 3 characters long";
  }
  if (!phoneNumber.value || !validatePhoneNumber(phoneNumber.value)) {
    phoneNumberError.value = "Phone number must be at least 10 digits long";
  }
  if (!email.value || !validateEmail(email.value)) {
    emailError.value = "Invalid email format";
  }
  if (!password.value || !validatePassword(password.value)) {
    passwordError.value = "Password must be at least 8 characters long";
  }

  // Check for any validation errors
  if (firstNameError.value || lastNameError.value || userNameError.value || phoneNumberError.value || emailError.value || passwordError.value) {
    return;
  }

  loading.value = true;

  try {
    const { data, error } = await useFetch('https://api.countersbd.com/api/v1/user/signup', {
      method: "POST",
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        phoneNumber: phoneNumber.value,
        userName: userName.value,
        userRole: 1
      }
    });

    // Handle API error response using toast notification
    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Error!',
        detail: error.data.message || "An error occurred while processing your request.",
        life: 3000
      });
      loading.value = false;
      return;
    }

    // Handle successful response
    if (data.responseCode === 200) {
      const userToken = useCookie('userToken');
      userToken.value = data.data.token;

      const isAuthenticated = isAuthenticatedState();
      isAuthenticated.value = true;

      navigateTo("/");
    } else {
      // Show backend error message in a toast notification
      toast.add({
        severity: 'error',
        summary: 'Error!',
        detail: data.message || "An unexpected error occurred.",
        life: 3000
      });
    }
  } catch (error) {
    // Handle unexpected errors using toast notification
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

.loader {
  font-size: 1.2rem;
  text-align: center;
  color: $theme-yellow;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
</style>