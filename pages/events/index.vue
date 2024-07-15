<template>
  <div>
    <div class="mx-auto w-full px-4 sm:px-2 lg:px-4 mb-8">
      <div class="mx-auto max-w-2xl lg:max-w-none py-2">
        <h2 class="text-2xl font-bold text-white">Events</h2>
        <div class="grid">
            <div v-for="event in events.data" :key="event.eventId" class="lg:col-4 sm:col-12 px-2 md:px-4 py-4">
              <Card style="overflow: hidden" class="bg-gray-800">
                  <template #header>
                    <div class="h-15rem overflow-hidden">
                      <img alt="user header" src="https://countersbd-ticket-bucket.s3.ap-south-1.amazonaws.com/event_C216860256.jpg" class="w-full" />
                    </div>
                      
                  </template>
                  <template #title><div class="text-white">{{ event.eventName }}</div></template>
                  <template #subtitle><div class="text-white">{{ getTime(event.eventStartDate) }}</div></template>
                  <template #content>
                     
                  </template>
                  <template #footer>
                      <div class="flex gap-3 mt-1">
                          <GlobalButton v-if="event.eventAvailableTickets > 0" title="Check Event" class="w-full" @button-tapped="navigateTo('/events/'+event.eventId)"/>
                          <GlobalButton v-else title="Sold Out" class="w-full soldOutButton" :disabled="true" @button-tapped="navigateTo('/events/'+event.eventId)"/>
                      </div>
                  </template>
              </Card>

             </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>

function getTime(input) {
        var date = new Date(input.replace(/ /g,'T'));
        return [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ][date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ', ' + date.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'});
    }
const { data: events } = await useFetch('https://api.countersbd.com/api/v1/event/all');

console.log(events)

</script>

<style>

.soldOutButton {
  background-color: #B00020 !important;
}

a {
  text-decoration: none;
}
</style>
