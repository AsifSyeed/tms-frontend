<script setup>
const { id } = useRoute().params;
const { data: events } = await useFetch('https://api.countersbd.com/api/v1/event/all');
let selectedEvent = ref();

if (id !== null) {
    console.log(id)
    selectedEvent.value = events.value.data.filter((e) => e.eventId === id)[0]
    console.log(selectedEvent)
}
function getDate(input) {
    var date = new Date(input.replace(/ /g, 'T'));
    return [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ][date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function getTime(input) {
    var date = new Date(input.replace(/ /g, 'T'));
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
}

</script>

<template>
    <div class="text-white mb-8 pb-6">
        <div class="px-2 mt-6">
            <div class="w-12 h-12rem md:h-29rem border-round-xl overflow-hidden container">

                <img :src="selectedEvent.eventBannerUrl" class="w-12 h-12rem md:h-29rem" style="object-fit: cover;">
                <div class="w-full h-29rem md:h-29rem centered opacity-50" style="background-color: black;"></div>

            </div>
        </div>

        <Fieldset legend="Event Details" class="mx-2 mt-4 text-white bg-transparent border-round-xl">
            <p class="m-0" style="white-space: pre-line;">
                {{ selectedEvent.eventDescription }}
            </p>
        </Fieldset>

        <div class="grid mt-4 mx-2 border-round-xl border-1 d-flex justify-content-center">
            <!-- Event Date and Time -->
            <div
                class="col-12 md:col-4 mt-4 lg:col-4 border-round-xl font-bold d-flex flex-column align-items-center justify-content-center">
                <div class="text-center">
                    <div class="d-flex align-items-center justify-content-center mb-2">
                        <i class="pi pi-calendar text-white" style="font-size: 3rem; margin-right: 0.5rem;"></i>
                        <i class="pi pi-clock text-white" style="font-size: 3rem;"></i>
                    </div>
                    <p class="text-2xl">{{ getDate(selectedEvent.eventStartDate) }}, {{
                        getTime(selectedEvent.eventStartDate) }}</p>
                </div>
            </div>

            <!-- Event Location -->
            <div
                class="col-12 md:col-4 mt-4 lg:col-4 border-round-xl font-bold d-flex flex-column align-items-center justify-content-center">
                <div class="text-center">
                    <i class="pi pi-map-marker text-white mb-2" style="font-size: 3rem; display: block;"></i>
                    <a :href="'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(selectedEvent.eventLocation)"
                        target="_blank" class="text-2xl clickable-link">
                        {{ selectedEvent.eventLocation }}
                    </a>
                </div>
            </div>
        </div>

        <div class="grid mt-4 px-2">
        <div v-for="category in selectedEvent.categoryList" :key="category.categoryId" class="lg:col-4 col-12 p-2">
            <Card style="overflow: hidden" class="bg-gray-800 w-full">
                <template #title>
                    <div class="text-white text-center">
                        {{ category.categoryName }}
                    </div>
                    <!-- Display the category description above the price -->
                    <div class="text-gray-400 text-center mt-2">
                        {{ category.categoryDescription }}
                    </div>
                </template>
                <template #footer>

                        <!-- Display "Free" if price or discounted price is 0 -->
                    <div @click="navigateTo('/checkout/' + selectedEvent.eventId + '/' + category.categoryId)"
                        class="priceButton cursor-pointer p-2 border-round-xl text-center font-bold text-3xl">
                        <span v-if="category.discountedPrice === 0 || category.categoryPrice === 0">Free</span>
                        <span v-else>৳{{ category.discountedPrice }}</span>
                    </div>

                    <!-- Conditionally render the "Discounted Price!" text if discountedPrice is not equal to categoryPrice -->
                    <div v-if="category.discountedPrice !== category.categoryPrice"
                        class="text-green-500 text-center mt-2">
                        Discounted Price!
                    </div>
                </template>
            </Card>
        </div>
</div>


    </div>
</template>

<style lang="scss">
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.priceButton {
    background-color: #d82127;
    color: white;
    -webkit-transition: background-color 0.35s;
    -moz-transition: background-color 0.35s;
    -o-transition: background-color 0.35s;
    transition: background-color 0.35s;
}

.priceButton:hover {
    background-color: #ac1a1f;
    color: white;
}

.container {
    position: relative;
    text-align: center;
    color: white;
}

.p-fieldset .p-fieldset-legend {
    background: #d82127 !important;
    color: #fff !important;
}

.p-fieldset .p-fieldset-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.clickable-link {
    color: #00aced; // Light blue color for a clickable look
    text-decoration: none; // Remove underline by default
    transition: color 0.3s ease;
}

.clickable-link:hover {
    color: #1da1f2; // Slightly darker blue on hover
    text-decoration: underline; // Underline on hover
}
</style>