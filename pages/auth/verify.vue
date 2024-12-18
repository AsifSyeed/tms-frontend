<template>
    <div class="flex flex-column flex-wrap justify-content-center align-content-center align-items-center"
        style="height: 100%; min-height: 98vh">
        <Toast />
        <div class="card flex flex-column p-7 bg-white border-round shadow-2 mb-3 lg-w-30 sm-w-90" style="height: 30%;">
            <div class="text-center mb-3 font-bold text-xl">
                An OTP has been sent to: <br>
                <span class="text-custom-red">{{ email }}</span>
            </div>
            <br>
            <!-- OTP Input Boxes -->
            <div class="otp-container">
                <input v-for="(digit, index) in otpDigits" :key="index" type="text" class="otp-input" maxlength="1"
                    v-model="otpDigits[index]" @input="handleOtpInput(index)"
                    @keydown.backspace="handleBackspace(index)" :id="'otp-input-' + index" />
            </div>
            <GlobalInputText type="password" v-if="code === '4'" v-model="oldPassword" placeholder="Old Password"
                class="w-full mb-2 border-round" />
            <GlobalInputText type="password" v-if="code === '4' || code === '3'" v-model="newPassword"
                placeholder="New Password" class="w-full mb-2 border-round" />
            <GlobalInputText type="password" v-if="code === '4' || code === '3'" v-model="retypePassword"
                placeholder="Retype Password" class="w-full mb-2 border-round" />
            <br>

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
import { ref, onMounted } from 'vue';
import { useRoute, useCookie, useToast, navigateTo } from '#imports';

const oldPassword = ref<string | null>(null);
const newPassword = ref<string | null>(null);
const retypePassword = ref<string | null>(null);
const otpDigits = ref(Array(6).fill("")); // Array for 6 OTP digits
const email = useRoute().query.email;
const code = useRoute().query.code;
const session = useCookie('otpSession');
const toast = useToast();
const loading = ref(false);

const handleButtonTap = () => {
    onSubmit();
};

const handleResendButtonTap = () => {
    onResend();
    clearInputFields();
};

const clearInputFields = () => {
    oldPassword.value = null;
    newPassword.value = null;
    retypePassword.value = null;
    otpDigits.value = Array(6).fill("");
    document.getElementById('otp-input-0')?.focus();
};

const handleOtpInput = (index: number) => {
    const input = document.getElementById(`otp-input-${index}`) as HTMLInputElement;

    // Allow only one digit
    if (input.value.length > 1) {
        input.value = input.value.charAt(0);
    }

    otpDigits.value[index] = input.value;

    // Move to the next input if a digit is entered
    if (input.value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
};

const handleBackspace = (index: number) => {
    if (otpDigits.value[index] === "" && index > 0) {
        document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
};

onMounted(() => {
    document.getElementById('otp-input-0')?.focus();
});

const getOtp = () => otpDigits.value.join("");

const canProceed = (): boolean => {
    if (getOtp().length !== 6) {
        toast.add({ severity: 'error', summary: 'Error!', detail: "Please enter a valid 6-digit OTP", life: 3000 });
        return false;
    }
    return true;
};

const onSubmit = async () => {
    if (canProceed()) {
        loading.value = true;
        const otp = getOtp();
        let body = {};
        let url = '';

        if (code === '1') {
            url = 'api/v1/user/verify';
            body = {
                email: email,
                tfaData: {
                    featureCode: code,
                    otp,
                    sessionId: session.value,
                },
            };
        } else if (code === '3') {
            url = 'api/v1/user/forget-password/verify';
            body = {
                email: email,
                userRole: 1,
                newPassword: newPassword.value,
                tfaData: {
                    featureCode: code,
                    otp,
                    sessionId: session.value,
                },
            };
        } else if (code === '4') {
            url = 'api/v1/user/change-password';
            body = {
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
                tfaData: {
                    featureCode: code,
                    otp,
                    sessionId: session.value,
                },
            };
        }

        try {
            const { data, error } = await useFetch(`https://api.countersbd.com//${url}`, {
                method: "POST",
                body,
            });

            if (error?.value) {
                toast.add({ severity: 'error', summary: 'Error!', detail: error.value.data.message, life: 3000 });
            } else if (data.value?.responseCode === 200) {
                session.value = null;
                navigateTo(code === '1' ? "/" : "/auth/signin");
            } else {
                toast.add({ severity: 'error', summary: 'Error!', detail: data.value?.message, life: 3000 });
            }
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error!', detail: "An unexpected error occurred.", life: 3000 });
        } finally {
            loading.value = false;
        }
    }
};

const onResend = async () => {
    useFetch('https://api.countersbd.com//api/v1/user/generic-otp?emailId=' + email + '&featureCode=' + code, {
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
};
</script>

<style lang="scss" scoped>
.signupLink {
    text-decoration-color: $theme-yellow;
}

.otp-container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 20px;
}

.otp-input {
    width: 45px;
    height: 55px;
    text-align: center;
    font-size: 1.5rem;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
}

.otp-input:focus {
    border-color: $theme-yellow;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
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
