<template>
    <div>
        <div v-if="isLoading" class="w-full text-center flex-column justify-content-center align-content-center" style="min-height: 78vh;">
            <img src="~/assets/loader2.gif" alt="" class="h-3rem m-auto" style="">
            <div class="text-white mt-6">Validating transaction...</div>
        </div>
        <div v-else class="w-full flex justify-content-center flex-wrap" style="min-height: 78vh">
            <div v-if="isSuccess" class="flex align-items-center justify-content-center" style="min-height: 78vh">
                <div class="card flex flex-column p-7 bg-white border-round shadow-2 justify-content-center align-content-center align-items-center" style="width: 100%;">
                    <img src="~/assets/checked.png" alt="" class="h-8rem w-8rem mb-5">
                    <div class="pb-5 text-xl font-bold">We have mailed you the ticket/tickets with necessary information</div>
                    <div><span class="">Total Amount:</span> <span class="font-bold"> BDT {{ res.totalAmount }}</span></div>
                </div>
            </div>
            <div v-else class="flex align-items-center justify-content-center" style="min-height: 78vh">
                <div class="card flex flex-column p-7 bg-white border-round shadow-2 justify-content-center align-content-center align-items-center" style="width: 100%;">
                    <img src="~/assets/cancel.png" alt="" class="h-8rem w-8rem mb-5">
                    <div class="pb-5 text-xl font-bold">Transaction Failed!</div>
                </div>
            </div>
        </div>
        
    </div>
</template>
  
<script setup>
definePageMeta({
      middleware: 'auth'
})

const isLoading = ref(true)
const tran_id = useRoute().query.tran_id
const res = ref()
const isSuccess = ref()

const payload = {
    transactionRefNo: tran_id
}
    const userToken = useCookie('userToken')
    const token = "Bearer " + userToken.value

    console.log(token)
    console.log(tran_id)
    console.log(payload)
    
        const { data, pending, error, refresh } = await $fetch('https://api.countersbd.com/api/v1/transaction/check-status', {
        onRequest({ request, options }) {
            options.headers = {
                "Authorization": token
            }
            options.method = 'post'
            options.body = payload
            
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
            console.log(error)
        },
        onResponse({ request, response, options }) {
            // Process the response data
            isLoading.value = false
            if (response._data.data.transactionStatus == 3) {
                isSuccess.value = true
                res.value = response._data.data
                console.log(res.value)
            } else {
                isSuccess.value = false
                res.value = response._data.data
            }
            // console.log(response._data.data)
        },
        onResponseError({ request, response, options }) {
            // Handle the response errors
            console.log(response)
        }
    })

</script>