<template>
    <div class="w-full p-1">
        <Toast />
        <div class="flex justify-content-center flex-wrap">
            <h2 class="text-4xl font-bold text-white">Checkout</h2>
        </div>
        <div class="formgrid grid bg-gray-800 p-3 border-round pt-4 mx-1">

            <div class="field col-12 md:col-5">
                <label class="text-white">Event</label>
                <Dropdown dropdownIcon="asd" :disabled="true" v-model="selectedEvent" :options="events.data"
                    optionLabel="eventName" placeholder="Select Event" class="w-full bg-white" @change="changedEvent" />
            </div>
            <div class="field col-12 md:col-5">
                <label class="text-white">Ticket Category</label>
                <Dropdown v-model="selectedCategory" :options="selectedEvent ? selectedEvent.categoryList : []"
                    optionLabel="categoryName" placeholder="Select Category" class="w-full bg-white"
                    @change="changedCategory">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.value.categoryName }} - ৳{{ slotProps.value.categoryPrice }}</div>
                            </div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <div>{{ slotProps.option.categoryName }} - ৳{{ slotProps.option.categoryPrice }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="field col-12 md:col-2">
                <label class="text-white">Number of Tickets</label>
                <Dropdown dropdownIcon="asd" :disabled="true" v-model="numberOfTickets" :options="numberOfTicketsOpttions" @change="updateAttendeeCount"
                    optionLabel="name" optionValue="value" class="w-full bg-white" />
            </div>
        </div>

        <div v-if="numberOfTickets > 0" class="formgrid grid bg-gray-800 p-3 border-round pt-2 mt-4 mx-1">
            <div class="field col-12 md:col-12 text-white">
                <h3>Attendee List</h3>
            </div>
            <template v-for="(attendee, index) in attendeeList">
                <div class="field col-12 md:col-5">
                    <GlobalInputText :placeholder="'Name of attendee: ' + (index + 1)"
                        v-model="attendee.ticketOwnerName" />
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
            <GlobalButton :disabled="!canProceed()" title="Purchase Tickets"
                class="flex align-items-center justify-content-center mt-3 w-4 h-3rem" @buttonTapped="purchaseTicket" />
        </div>
        <div style="height: 120px;"></div>
    </div>
</template>

<script lang="ts" setup>
const { id, category } = useRoute().params;
const refundpolicy = () => {
    navigateTo("/refundpolicy")
};

const termsConditions = () => {
    navigateTo("/termsAndConditions")
};
definePageMeta({
    middleware: 'auth'
})

const userToken = useCookie('userToken')
const token = "Bearer " + userToken.value
const toast = useToast()

let selectedEvent = ref();
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

const { data: events } = await useFetch('https://api.countersbd.com/api/v1/event/all')

function bounceUser() {
    userToken.value = null
    const isAuthenticated = isAuthenticatedState()
    isAuthenticated.value = false
    navigateTo("/auth/signin")
}

const canProceed = (): boolean => {
    if (!agreedToTerms.value) {
        console.log("agreement")
        return false
    }
    let state = true
    for (let i = 0; i < attendeeList.value.length; i++) {
        if (attendeeList.value[i].ticketOwnerEmail === null || attendeeList.value[i].ticketOwnerEmail === "") {
            console.log("email")
            state = false
        }
        if (attendeeList.value[i].ticketOwnerName === null || attendeeList.value[i].ticketOwnerName === "") {
            console.log("name")
            state = false
        }
        if (attendeeList.value[i].ticketOwnerNumber === null || attendeeList.value[i].ticketOwnerNumber === "") {
            console.log("number")
            state = false
        }
    }
    console.log("state " + state)
    return state
};

useFetch('https://api.countersbd.com/api/v1/user/me', {
    method: 'get',
    headers: {
        "Authorization": token
    }
}).then(res => {
    const data: any = res.data.value
    const error = res.error.value
    if (error) {
        // dealing error
        bounceUser()
    } else {
        if (data.responseCode === null || data.responseCode !== 200) {
            bounceUser()
        }
    }
}, error => {
    bounceUser()
})

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

const changedCategory = () => {
    numberOfTickets.value = selectedCategory.value.maximumQuantity
    numberOfTicketsOpttions.value = [{ name: selectedCategory.value.maximumQuantity, value: selectedCategory.value.maximumQuantity }]
    updateTotalPrice()
    updateAttendeeCount()
}

const updateTotalPrice = () => {
    if (selectedCategory.value) {
        console.log(selectedCategory.value.categoryPrice)
        console.log(numberOfTickets.value)
        totalPrice.value = selectedCategory.value.categoryPrice * numberOfTickets.value
    } else {
        totalPrice.value = 0
    }
};

if (id !== null && category !== null) {
    console.log(id)
    console.log(category)
    selectedEvent.value = events.value.data.filter((e) => e.eventId === id)[0]
    selectedCategory.value = selectedEvent.value.categoryList.filter((e) => e.categoryId === parseInt(category, 10))[0]
    numberOfTickets.value = selectedCategory.value.maximumQuantity
    numberOfTicketsOpttions.value = [{ name: selectedCategory.value.maximumQuantity, value: selectedCategory.value.maximumQuantity }]
    updateTotalPrice()
    updateAttendeeCount()
}

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

    console.log(token)
    console.log(eventData)

    useFetch('https://api.countersbd.com/api/v1/ticket/buy', {
        headers: {
            "Authorization": token
        },
        method: 'POST',
        body: eventData
    }).then(res => {
        const data: any = res.data.value
        const error = res.error.value
        if (error) {
            // dealing error
            toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
        } else {
            console.log(data)
            if (data.responseCode !== null && data.responseCode === 200) {
                window.open(data.data.sslPaymentUrl, "_self");
            } else {
                toast.add({ severity: 'error', summary: 'Error!', detail: data.message, life: 3000 });
            }
        }
    }, error => {
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data.message, life: 3000 });
    })
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