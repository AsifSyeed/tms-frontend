<template>
    <div class=" flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
      style="height: 100%; min-height: 98vh">
      <Toast/>
      <img src="~/assets/Logo_big.png" alt="" class="max-w-18rem mb-5">
      <div class="card flex flex-column p-7 bg-white border-round shadow-2 lg-w-30 sm-w-90" style="height: 30%;">
        <div class="text-center mb-3 font-bold text-xl">Forgot Password</div>
        <GlobalInputText type="text" v-model="email" placeholder="Email" class="w-full mb-2 border-round" />
        <GlobalButton @buttonTapped="handleButtonTap" title="Submit" :disabled="false"/>
        <div class="w-full text-center pt-4"> <NuxtLink class="signupLink font-bold" to="/auth/signin">Go Back</NuxtLink> </div>
      </div>
    </div>
</template>
  
<script lang="ts" setup>
  import { isAuthenticatedState } from '~/composables/state';
  
  definePageMeta({
    layout: 'auth'
  })
  const email = ref(null);
  const toast = useToast()
  const handleButtonTap = () => {
    onSubmit()
  };
  
  const onSubmit = async () => {
    if (email.value === null || email.value === "") {
      toast.add({ severity: 'error', summary: 'Error', detail: "Please fill up all the fields", life: 3000 });
    } else {
      useFetch('https://api.countersbd.com/api/v1/user/generic-otp?emailId='+ email.value +'&featureCode=3', {
        method: "POST",
        body: {}
      }).then(res => {
        const data = res.data.value
        const error = res.error.value
        if (error) {
          // dealing error
          toast.add({ severity: 'error', summary: 'Opps!', detail: error.data.message, life: 3000 });
        } else {
          console.log(data)
          if (data.responseCode !==  null && data.responseCode === 200) {
            const session = useCookie('otpSession')
            session.value = data.data.sessionId
            navigateTo({
              path: '/auth/verify',
              query: { email: email.value, code: 3 }
            })
          } else {
            toast.add({ severity: 'error', summary: 'Opps!', detail: data.message, life: 3000 });
          }
        }
      }, error => {
        toast.add({ severity: 'error', summary: 'Opps!', detail: error.data.message, life: 3000 });
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