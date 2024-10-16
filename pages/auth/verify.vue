<template>
    <div class="flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
        style="height: 100%; min-height: 98vh">
        <Toast />
        <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-3 lg-w-30 sm-w-90" style="height: 30%;">
            <div class="text-center mb-3 font-bold text-xl">
                An OTP has been sent to your respective
                <span class="text-custom-red">email</span>
            </div>
            <br><br>
            <GlobalInputText type="password" v-if="code === '4'" v-model="oldPassword" placeholder="Old Password"
                class="w-full mb-2 border-round" />
            <GlobalInputText type="password" v-if="code === '4' || code === '3'" v-model="newPassword"
                placeholder="New Password" class="w-full mb-2 border-round" />
            <GlobalInputText type="password" v-if="code === '4' || code === '3'" v-model="retypePassword"
                placeholder="Retype Password" class="w-full mb-2 border-round" />

            <GlobalInputText type="number" v-model="otp" placeholder="OTP" class="w-full mb-2 border-round" />

            <div v-if="loading" class="loader-container">
                <div class="loader"></div>
            </div>
            <GlobalButton v-else @buttonTapped="handleButtonTap" title="Submit" :disabled="loading" />
            <GlobalButton class="mt-4" @buttonTapped="handleResendButtonTap" title="Resend OTP" :disabled="false" />
            <div class="w-full text-center pt-4">
                <NuxtLink class="signupLink font-bold" to="/">Back to Home</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const oldPassword = ref(null);
const newPassword = ref(null);
const retypePassword = ref(null);
const otp = ref(null);
const email = useRoute().query.email
const code = useRoute().query.code
const session = useCookie('otpSession')
const toast = useToast()
const loading = ref(false);

const handleButtonTap = () => {
    onSubmit()
};

const handleResendButtonTap = () => {
    onResend();
    clearInputFields();
};

const clearInputFields = () => {
    oldPassword.value = null;
    newPassword.value = null;
    retypePassword.value = null;
    otp.value = null;
};

const canProceed = (): boolean => {
    console.log(code)
    if (code === '1') {
        if (otp.value !== null && otp.value !== "") {
            return true
        } else {
            toast.add({ severity: 'error', summary: 'Error!', detail: "Please enter OTP", life: 3000 });
            return false
        }
    } else if (code === '3') {
        console.log("on 3")
        if (otp.value !== null && otp.value !== "" &&
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
    } else if (code === '4') {
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
    }
    return false
};

const onResend = async () => {
    useFetch('https://api.countersbd.com/api/v1/user/generic-otp?emailId=' + email + '&featureCode=' + code, {
        method: "POST",
        body: {}
    }).then(res => {
        const data = res.data.value
        const error = res.error.value
        if (error) {
            toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
        } else {
            if (data.responseCode !== null && data.responseCode === 200) {
                const session = useCookie('otpSession')
                session.value = data.data.sessionId
                toast.add({ severity: 'success', summary: 'Success!', detail: 'OTP has been resent successfully', life: 3000 });
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
        loading.value = true;
        let body = {}
        let url = ''
        if (code === '1') {
            url = 'api/v1/user/verify'
            body = {
                email: email,
                tfaData: {
                    featureCode: code,
                    otp: otp.value,
                    sessionId: session.value
                }
            }
        } else if (code === '3') {
            url = 'api/v1/user/forget-password/verify'
            body = {
                email: email,
                userRole: 1,
                newPassword: newPassword.value,
                tfaData: {
                    featureCode: code,
                    otp: otp.value,
                    sessionId: session.value
                }
            }
        } else if (code === '4') {
            url = 'api/v1/user/change-password'
            body = {
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
                tfaData: {
                    featureCode: code,
                    otp: otp.value,
                    sessionId: session.value
                }
            }
        }
        useFetch('https://api.countersbd.com/' + url, {
            method: "POST",
            body: body
        }).then(res => {
            const data = res.data.value
            const error = res.error.value
            if (error) {
                toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
            } else {
                if (data.responseCode !== null && data.responseCode === 200) {
                    const session = useCookie('otpSession')
                    session.value = null
                    if (code === '1') {
                        const userToken = useCookie('userToken')
                        const isAuthenticated = isAuthenticatedState()
                        isAuthenticated.value = true
                        navigateTo("/")
                    } else {
                        navigateTo("/auth/signin")
                    }
                } else {
                    toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
                }
            }
            loading.value = false;
        }, error => {
            toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
            loading.value = false;
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

.text-custom-red {
    color: #ac1a1f;
}

/* Loader styles */
.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px; /* Adjust height as needed */
}

.loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: $theme-yellow;
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
</style>