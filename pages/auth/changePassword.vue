<template>
  <div class=" flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
    style="height: 100%; min-height: 98vh">
    <Toast />
    <img src="~/assets/Logo_new.png" alt="" class="max-w-18rem mb-5">
    <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-3 lg-w-30 sm-w-90" style="height: 30%;">
      <div class="text-center mb-3 font-bold text-xl">Change Password</div>
      <GlobalInputText type="password" v-model="oldPassword" placeholder="Old Password"
        class="w-full mb-2 border-round" />
      <GlobalInputText type="password" v-model="newPassword" placeholder="New Password"
        class="w-full mb-2 border-round" />
      <GlobalInputText type="password" v-model="retypePassword" placeholder="Retype Password"
        class="w-full mb-2 border-round" />

      <GlobalInputText type="number" v-model="otp" placeholder="OTP" class="w-full mb-2 border-round" />

      <GlobalButton @buttonTapped="handleButtonTap" title="Submit" :disabled="false" />
      <GlobalButton class="mt-4" @buttonTapped="handleResendButtonTap" title="Resend OTP" :disabled="false" />
      <div class="w-full text-center pt-4">
        <NuxtLink class="signupLink font-bold" to="/">Back to Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})

const oldPassword = ref(null);
const newPassword = ref(null);
const retypePassword = ref(null);
const otp = ref(null);
const email = ref('')
const code = 4
const session = useCookie('otpSession')
const toast = useToast()
const userToken = useCookie('userToken')
const token = "Bearer " + userToken.value

useFetch('https://api.countersbd.com/api/v1/user/me', {
  method: 'get',
  headers: {
    "Authorization": token
  }
}).then(res => {
  const data:any = res.data.value
  const error = res.error.value
  if (error) {
    // dealing error
    toast.add({ severity: 'error', summary: 'Opps!', detail: error.data.message, life: 3000 });
  } else {
    console.log(data)
    if (data.responseCode !== null && data.responseCode === 200) {
      email.value = data.data.emailId
      onSendOTP()
    } else {
      toast.add({ severity: 'error', summary: 'Opps!', detail: data.message, life: 3000 });
    }
  }
}, error => {
  toast.add({ severity: 'error', summary: 'Opps!', detail: error.data.message, life: 3000 });
})

const handleButtonTap = () => {
  onSubmit()
};

const handleResendButtonTap = () => {
  onSendOTP()
};

const canProceed = (): boolean => {
  if (otp.value !== null && otp.value !== "" &&
    oldPassword.value !== null && oldPassword.value !== "" &&
    newPassword.value !== null && newPassword.value !== "" &&
    retypePassword.value !== null && retypePassword.value !== "") {
    if (newPassword.value === retypePassword.value) {
      return true
    } else {
      toast.add({ severity: 'error', summary: 'Error!', detail: "Password does not match!", life: 3000 });
      return false
    }
  } else {
    toast.add({ severity: 'error', summary: 'Error!', detail: "Please fill up all the fields", life: 3000 });
    return false
  }
};

const onSendOTP = async () => {
  useFetch('https://api.countersbd.com/api/v1/user/generic-otp?emailId=' + email.value + '&featureCode=' + code, {
    headers: {
      "Authorization": token
    },
    method: "POST",
    body: {}
  }).then(res => {
    const data: any = res.data.value
    const error = res.error.value
    if (error) {
      toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
    } else {
      if (data.responseCode !== null && data.responseCode === 200) {
        session.value = data.data.sessionId
      } else {
        toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
      }
    }
  }, error => {
    toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
  })
}

const onSubmit = async () => {
  if (canProceed()) {
    let url = 'api/v1/user/change-password'
    let body = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      tfaData: {
        featureCode: code,
        otp: otp.value,
        sessionId: session.value
      }
    }
    useFetch('https://api.countersbd.com/' + url, {
      headers: {
        "Authorization": token
      },
      method: "POST",
      body: body
    }).then(res => {
      const data: any = res.data.value
      const error = res.error.value
      if (error) {
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
      } else {
        if (data.responseCode !== null && data.responseCode === 200) {
          session.value = null
          toast.add({ severity: 'success', summary: 'Success!', detail: '', life: 3000 });
          navigateTo('/')
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

a {
  color: $theme-yellow;
}

/* Unvisited link  */
a:visited {
  color: $theme-yellow;
}

/* Visited link    */
a:hover {
  color: $theme-yellow;
}

/* Mouse over link */
a:active {
  color: $theme-yellow;
}

/* Selected link   */
</style>