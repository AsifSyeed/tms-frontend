<template>
    <div class="w-full p-1">
        <div class="flex justify-content-center flex-wrap">
            <h2 class="text-4xl font-bold text-white">Checkout</h2>
        </div>
        <div class="formgrid grid bg-gray-800 p-3 border-round pt-4 mx-1">

            <div class="field col-12 md:col-5">
                <label class="text-white">Event</label>
                <Dropdown v-model="selectedEvent" :options="events.data" optionLabel="eventName"
                    placeholder="Select Event" class="w-full bg-white" @change="changedEvent" />
            </div>
            <div class="field col-12 md:col-5">
                <label class="text-white">Ticket Category</label>
                <Dropdown v-model="selectedCategory" :options="selectedEvent ? selectedEvent.categoryList : []"
                    optionLabel="categoryName" placeholder="Select Category" class="w-full bg-white"
                    @change="updateTotalPrice">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.value.categoryName }} - ৳{{ slotProps.value.discountedPrice }}</div>
                            </div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <div>{{ slotProps.option.categoryName }} - ৳{{ slotProps.option.discountedPrice }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="field col-12 md:col-2">
                <label class="text-white">Number of Tickets</label>
                <Dropdown v-model="numberOfTickets" :options="numberOfTicketsOpttions" @change="updateAttendeeCount"
                    optionLabel="name" optionValue="value" class="w-full bg-white" />
            </div>
        </div>

        <div v-if="numberOfTickets > 0" class="formgrid grid bg-gray-800 p-3 border-round pt-2 mt-4 mx-1">
            <div class="field col-12 md:col-12 text-white">
                <h3>Attendee List</h3>
            </div>
            <template v-for="(attendee, index) in attendeeList">
                <div class="field col-12 md:col-5">
                    <GlobalInputText :placeholder="'Name of attendee: ' + index" v-model="attendee.ticketOwnerName" />
                </div>
                <div class="field col-12 md:col-4">
                    <GlobalInputText placeholder="Email" v-model="attendee.ticketOwnerEmail" />
                </div>
                <div class="field col-12 md:col-3">
                    <GlobalInputText placeholder="Phone" v-model="attendee.ticketOwnerNumber" />
                </div>
            </template>
            <div class="field col-12 md:col-10"></div>


        </div>
        <div class="flex justify-content-center flex-wrap">
            <div class="flex align-items-center justify-content-center mt-5 h-3rem">
                <div class="border-round text-4xl font-bold text-white">Total: ৳{{ totalPrice }}</div>
            </div>
        </div>
        <div class="flex justify-content-center flex-wrap mt-4">
            <div class="flex align-items-center">
                <Checkbox v-model="agreedToTerms" :binary="true" inputId="checkbox" />
                <label for="checkbox" class="ml-2 text-white text-sm">
                    By clicking you agree to our
                    <span class="text-blue-300 cursor-pointer" @click="termsConditions">Terms & Privacy
                        Policy</span>,
                    <span class="text-blue-300 cursor-pointer" @click="refundpolicy">Refund Policy</span>
                </label>
            </div>
        </div>
        <div class="flex justify-content-center flex-wrap mb-6">
            <GlobalButton :disabled="!agreedToTerms" title="Purchase Tickets"
                class="flex align-items-center justify-content-center mt-5 w-4 h-3rem" @buttonTapped="purchaseTicket" />
        </div>
    </div>
</template>

<script setup>
const refundpolicy = () => {
    navigateTo("/refundpolicy")
};

const termsConditions = () => {
    navigateTo("/termsAndConditions")
};
definePageMeta({
    //   middleware: ["authMiddleware"]
    middleware: 'auth'
})
const { data: events } = await useFetch('https://api.countersbd.com//api/v1/event/all')
const selectedEvent = ref();
const selectedCategory = ref();
const agreedToTerms = ref(false);
const numberOfTickets = ref(1);
const numberOfTicketsOpttions = ref([
    { name: "1", value: 1 },
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
]);

const eventDetails = ref({
    eventCapacity: null,
    eventEndDate: "",
    eventName: "",
    eventStartDate: ""
})

const attendeeList = ref([
    {
        ticketOwnerEmail: "",
        ticketOwnerName: "",
        ticketOwnerNumber: ""
    }
])
let totalPrice = ref(0)

const updateAttendeeCount = () => {
    attendeeList.value = []
    for (let i = 0; i < numberOfTickets.value; i++) {
        const newAttendee = {
            ticketOwnerEmail: "",
            ticketOwnerName: "",
            ticketOwnerNumber: ""
        }
        attendeeList.value.push(newAttendee)
    }
    console.log(numberOfTickets.value)
    console.log(selectedEvent.value.eventName)
    console.log(selectedCategory.value)
    updateTotalPrice()
};

const updateTotalPrice = () => {
    if (selectedCategory.value) {
        console.log(selectedCategory.value.categoryPrice)
        console.log(numberOfTickets.value)
        totalPrice = selectedCategory.value.categoryPrice * numberOfTickets.value
    } else {
        totalPrice = 0
    }
};

const changedEvent = () => {
    selectedCategory.value = null
    updateTotalPrice()
};

const purchaseTicket = async () => {
    const eventData = {
        eventId: selectedEvent.value.eventId,
        ticketCategory: selectedCategory.value.categoryId,
        ticketOwnerInformation: attendeeList.value
    }
    const userToken = useCookie('userToken')
    const token = "Bearer " + userToken.value
    const { data, pending, error, refresh } = await useFetch('https://api.countersbd.com//api/v1/ticket/buy', {
        onRequest({ request, options }) {
            options.headers = {
                "Authorization": token
            }
            options.method = 'post'
            options.body = eventData
        },
        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        onResponse({ request, response, options }) {
            // Process the response data
            console.log(response.value.data)
        },
        onResponseError({ request, response, options }) {
            // Handle the response errors
        }
    })

    //   if (responseData.value.responseCode === 200) {
    //     window.localStorage.setItem("token", responseData.value.data.token)
    //     const isAuthenticated = isAuthenticatedState()
    //     isAuthenticated.value = true
    //     navigateTo("/")
    //   }
};
</script>

<style lang="scss">
.p-checkbox.p-highlight .p-checkbox-box {
    border-color: #d82127 !important;
    background: #d82127 !important;
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover).p-highlight .p-checkbox-box {
    border-color: #d82127 !important;
    background: #d82127 !important;
    color: #ffffff;
}

/* Prevent the label from being clickable */
.non-clickable-label {
    pointer-events: none;
    /* Disable pointer events on the label */
}
</style>