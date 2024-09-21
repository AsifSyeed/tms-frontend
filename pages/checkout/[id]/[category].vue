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
                    @change="updateTotalPrice">
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

        <div class="flex justify-content-start flex-wrap mb-6 mt-5 mx-1">
            <div class="flex flex-column align-items-start justify-content-center mb-2 md:mr-2 w-full md:w-3">
                <!-- Coupon Input Field -->
                <!-- Coupon Input Field with @input event -->
                <GlobalInputText placeholder="Coupon Code" v-model="couponCode" @input="clearCouponMessage" />

                <!-- Display the coupon message just below the input field -->
                <div v-if="couponMessage" class="text-white text-sm mt-2 w-full">
                    <span :class="couponMessageClass">{{ couponMessage }}</span>
                </div>
            </div>

            <!-- Apply Button (Prevent it from resizing) -->
            <GlobalButton title="Apply" class="flex align-items-center justify-content-center mb-2 w-full md:w-1 h-3rem"
                @buttonTapped="couponApplied" />
        </div>


        <div class="w-full flex flex-column justify-content-center align-items-center">
            <div class="w-full flex justify-content-center mt-5 h-3rem">
                <div class="border-round text-2xl font-bold text-white">Total: ৳{{ totalPrice }}</div>
            </div>

            <div class="w-full flex justify-content-center mt-5 h-3rem" v-if="discount > 0">
                <div class="border-round text-2xl font-bold" style="color: #d82127;">Discounted: -৳{{ discount }}</div>
            </div>


            <div class="w-full flex justify-content-center mt-5 h-3rem" v-if="discount > 0">
                <div class="border-round text-4xl font-bold" style="color: #28a745;">Discounted Total: ৳{{
                    discountedTotal }}
                </div>
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

onMounted(() => {
    fetchReferral();
});

let totalPrice = ref(0)
let discount = ref(0)
let discountedTotal = totalPrice

const clearCouponMessage = () => {
    couponMessage.value = ''; // Clear the message
    couponMessageClass.value = ''; // Reset the class
    discount.value = 0; // Reset discount
    updateTotalPrice(); // Update the total price
};

// Fetch referral coupons from the API
const fetchReferral = async () => {
    try {
        const { data, error } = await useFetch(`https://api.countersbd.com/api/v1/referral/all?eventId=${selectedEvent.value.eventId}`, {
            headers: {
                "Authorization": token
            },
            method: "GET"
        });

        if (error.value) {
            // Handle error
            toast.add({ severity: 'error', summary: 'Error!', detail: error.value.data.message, life: 3000 });
        } else if (data.value && data.value.responseCode === 200) {
            // Store all the valid coupons in the list
            validCoupons.value = data.value.data.map((coupon) => ({
                referralCode: coupon.referralCode,
                referralDiscount: coupon.referralDiscount
            }));
            console.log('Valid Coupons:', validCoupons.value);

            // Call the function to apply referral type 1 coupon
            applyReferralTypeOneCoupon(data.value.data);
        } else {
            toast.add({ severity: 'error', summary: 'Error!', detail: data.value.message, life: 3000 });
        }
    } catch (err) {
        console.error("API call failed", err);
        toast.add({ severity: 'error', summary: 'Error!', detail: 'Failed to fetch coupons', life: 3000 });
    }
};

// Apply the referral type 1 coupon automatically
const applyReferralTypeOneCoupon = (coupons: any[]) => {
    const referralCoupon = coupons.find((coupon: any) => coupon.referralType === 1);

    if (referralCoupon) {
        couponCode.value = referralCoupon.referralCode;
        console.log('Referral Coupon Applied:', referralCoupon);
        couponApplied();
    }
};

// You can call fetchReferral once the selectedEvent is set, for example, after an event is selected.

const userToken = useCookie('userToken')
const token = "Bearer " + userToken.value
const toast = useToast()

let selectedEvent = ref();
const selectedCategory = ref();
const agreedToTerms = ref(false);

const couponCode = ref("")
const validCoupons = ref([]); // List of valid coupons
const couponMessage = ref(''); // Message to display under the coupon field
const couponMessageClass = ref(''); // Class to style the message

const couponApplied = () => {
    const coupon = validCoupons.value.find(coupon => coupon.referralCode === couponCode.value);

    if (coupon) {
        couponMessage.value = 'Coupon applied';
        couponMessageClass.value = 'text-green-500'; // Apply green color for success

        // Update discount
        discount.value = coupon.referralDiscount; // Update with the applied coupon's discount
    } else {
        couponMessage.value = 'Invalid Coupon';
        couponMessageClass.value = 'text-red-500'; // Apply red color for error
        couponCode.value = ''; // Clear the coupon field if invalid

        // Reset discount
        discount.value = 0; // Reset discount
    }

    // Update discounted total
    updateTotalPrice();
};

const calculateDiscountedTotal = () => {
    return totalPrice.value - discount.value;
};

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

const updateTotalPrice = () => {
    if (selectedCategory.value) {
        console.log(selectedCategory.value.categoryPrice)
        console.log(numberOfTickets.value)
        totalPrice.value = selectedCategory.value.categoryPrice * numberOfTickets.value
        let discountedUnitPrice = selectedCategory.value.categoryPrice - discount.value
        discountedTotal.value = discountedUnitPrice * numberOfTickets.value
    } else {
        totalPrice.value = 0
    }
};

if (id !== null && category !== null) {
    console.log(id)
    console.log(category)
    selectedEvent.value = events.value.data.filter((e) => e.eventId === id)[0]
    selectedCategory.value = selectedEvent.value.categoryList.filter((e) => e.categoryId === parseInt(category, 10))[0]
    updateTotalPrice()
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
