<template>
  <div class="flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
       style="height: 100%; min-height: 98vh">
    <Toast />
    <img src="~/assets/Logo_big.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 lg-w-30 sm-w-90" style="height: 30%;">
      <div class="text-center mb-3 font-bold text-xl">Forgot Password</div>
      <GlobalInputText
        type="text"
        v-model="email"
        placeholder="Email"
        class="w-full mb-2 border-round"
        @input="clearEmailError"
      />
      <p v-if="emailError" class="error-message">{{ emailError }}</p>
      <GlobalButton @buttonTapped="handleButtonTap" title="Submit" :disabled="false" />
      <div class="w-full text-center pt-4">
        <NuxtLink class="signupLink font-bold" to="/auth/signin">Go Back</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isAuthenticatedState } from '~/composables/state';

definePageMeta({
  layout: 'auth',
});

const email = ref<string | null>(null);
const emailError = ref<string | null>(null);
const toast = useToast();

const validateEmail = (email: string) => {
  // Email validation regex (same as backend)
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  return emailRegex.test(email);
};

const clearEmailError = () => {
  emailError.value = null;
};

const handleButtonTap = () => {
  onSubmit();
};

const onSubmit = async () => {
  // Reset email error
  emailError.value = null;

  // Validate email input
  if (!email.value) {
    emailError.value = "Please enter your email";
    return;
  } else if (!validateEmail(email.value)) {
    emailError.value = "Invalid email format";
    return;
  }

  // Make the API request
  try {
    const { data, error } = await useFetch(
      `https://api.countersbd.com/api/v1/user/generic-otp?emailId=${email.value}&featureCode=3`,
      {
        method: "POST",
        body: {},
      }
    );

    // Handle API error response
    if (error?.value) {
      emailError.value = error.value.data.message;
      return;
    }

    // Handle successful response
    if (data.value && data.value.responseCode === 200) {
      const session = useCookie('otpSession');
      session.value = data.value.data.sessionId;

      navigateTo({
        path: '/auth/verify',
        query: { email: email.value, code: 3 },
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Oops!',
        detail: data.value?.message || "Unexpected response from server.",
        life: 3000,
      });
    }
  } catch (error) {
    // Handle unexpected errors
    toast.add({
      severity: 'error',
      summary: 'Error!',
      detail: "An unexpected error occurred. Please try again later.",
      life: 3000,
    });
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

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
</style>
