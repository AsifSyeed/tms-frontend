<template>
  <div>
    <div class="mx-auto w-full px-4 sm:px-2 lg:px-4">
      <div class="mx-auto max-w-2xl lg:max-w-none py-2">
        <h2 class="text-2xl font-bold text-white">Events</h2>
        <div class="grid">
            <div v-for="event in events.data" :key="event.eventId" class="lg:col-4 sm:col-12 p-4">
              <Card style="overflow: hidden" class="bg-gray-800">
                  <template #header>
                      <img alt="user header" src="https://images.unsplash.com/photo-1604514288114-3851479df2f2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" class="h-15rem w-full overflow-hidden" />
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
