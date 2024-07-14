<template>
    <div>
        <Toast/>
        <div class="mx-auto w-full px-4 sm:px-2 lg:px-4">
            <div class="mx-auto max-w-2xl lg:max-w-none py-2">
                <h2 class="text-2xl font-bold text-white">My Tickets</h2>


                <h3 class="text-xl font-bold text-white">Upcoming Events</h3>
                <div v-for="event in upcomingEvents" :key="event.ticketId"
                    class="formgrid grid bg-gray-800 border-round h-25rem md:h-10rem overflow-hidden mb-4">
                    <div class="field col-12 md:col-3 m-0 p-0 h-12rem md:h-10rem">
                        <img alt="user header"
                            src="https://countersbd-ticket-bucket.s3.ap-south-1.amazonaws.com/event_C216860256.jpg"
                            class=" w-full h-full" style="object-fit: cover" />
                    </div>
                    <div class="field col-12 md:col-7 m-0 p-0">
                        <div class="flex align-content-center flex-wrap h-6rem md:h-10rem p-3">
                            <div class="flex align-items-center justify-content-left w-full">
                                <div class="text-2xl font-bold text-white">{{ event.eventName }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-left w-full mt-1">
                                <div class="text-sm font-bold p-1 px-2 border-round mr-2"
                                    style="background-color: #FBAF44;">{{ event.ticketCategoryName }}</div>
                                <div class="text-sm font-bold p-1 px-2 border-round mr-2"
                                    style="background-color: #FBAF44;">{{ getDate(event.validityDate) }}</div>
                                <div class="text-sm font-bold p-1 px-2 border-round" style="background-color: #FBAF44;">
                                    {{ getTime(event.validityDate) }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-left w-full pt-4">
                                <div class="text-xl font-bold text-white">৳ {{ event.ticketPrice }}</div>
                            </div>

                        </div>
                    </div>
                    <div class="field col-12 md:col-2 m-0 p-0">
                        <div class="flex align-content-center flex-wrap h-2rem md:h-10rem">
                            <Button @click="sendEmail(event.ticketId)" class="flex align-items-center justify-content-center w-full m-3">Email
                                Ticket</Button>
                        </div>
                    </div>
                </div>


                <h3 class="text-xl font-bold text-white mt-6">Past Events</h3>
                <div v-for="event in pastEvents" :key="event.ticketId"
                    class="formgrid grid bg-gray-800 border-round h-25rem md:h-10rem overflow-hidden mb-4">
                    <div class="field col-12 md:col-3 m-0 p-0 h-12rem md:h-10rem">
                        <img alt="user header"
                            src="https://countersbd-ticket-bucket.s3.ap-south-1.amazonaws.com/event_C216860256.jpg"
                            class=" w-full h-full" style="object-fit: cover" />
                    </div>
                    <div class="field col-12 md:col-7 m-0 p-0">
                        <div class="flex align-content-center flex-wrap h-6rem md:h-10rem p-3">
                            <div class="flex align-items-center justify-content-left w-full">
                                <div class="text-2xl font-bold text-white">{{ event.eventName }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-left w-full mt-1">
                                <div class="text-sm font-bold p-1 px-2 border-round mr-2"
                                    style="background-color: #FBAF44;">{{ event.ticketCategoryName }}</div>
                                <div class="text-sm font-bold p-1 px-2 border-round mr-2"
                                    style="background-color: #FBAF44;">{{ getDate(event.validityDate) }}</div>
                                <div class="text-sm font-bold p-1 px-2 border-round" style="background-color: #FBAF44;">
                                    {{ getTime(event.validityDate) }}</div>
                            </div>
                            <div class="flex align-items-center justify-content-left w-full pt-4">
                                <div class="text-xl font-bold text-white">৳ {{ event.ticketPrice }}</div>
                            </div>

                        </div>
                    </div>
                    <div class="field col-12 md:col-2 m-0 p-0">
                        <div class="flex align-content-center flex-wrap h-2rem md:h-10rem">
                            <Button disabled class="flex align-items-center justify-content-center w-full m-3"
                                severity="secondary">Event Over</Button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
        <div style="height: 120px;"></div>
    </div>
</template>

<script lang="ts" setup>
let pastEvents = ref([])
let upcomingEvents = ref([])
const userToken = useCookie('userToken')
const token = "Bearer " + userToken.value
const toast = useToast()


function getDate(input) {
    var date = new Date(input.replace(/ /g, 'T'));
    return date.getDate() + ' ' + [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ][date.getMonth()] + ', ' + date.getFullYear();
}

function getTime(input) {
    var date = new Date(input.replace(/ /g, 'T'));
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
}

function sendEmail(input) {
    useFetch('https://api.countersbd.com/api/v1/ticket/send-email?ticketId='+input, {
        headers: {
            "Authorization": token
        },
        method: "GET"
    }).then(res => {
        const data = res.data.value
        const error = res.error.value
        if (error) {
            // dealing error
            toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
        } else {
            console.log(data)
            if (data.responseCode !== null && data.responseCode === 200) {
                toast.add({ severity: 'success', summary: 'Success!', detail: data.message, life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
            }
        }
    }, error => {
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
    })
}

const onSubmit = async () => {
    
}


useFetch('https://api.countersbd.com/api/v1/ticket/my-tickets', {
    headers: {
        "Authorization": token
    },
    method: "GET"
}).then(res => {
    const data = res.data.value
    const error = res.error.value
    if (error) {
        // dealing error
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
    } else {
        console.log(data)
        if (data.responseCode !== null && data.responseCode === 200) {
            pastEvents.value = data.data.filter((e) => e.ticketStatus === true)
            upcomingEvents.value = data.data.filter((e) => e.ticketStatus === false)

            console.log(pastEvents.value)
            console.log(upcomingEvents.value)
        } else {
            toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
        }
    }
}, error => {
    toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
})
</script>
const pastEvents = ref([])
<style></style>