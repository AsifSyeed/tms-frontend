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
        var date = new Date(input.replace(/ /g,'T'));
        return [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ][date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    function getTime(input) {
        var date = new Date(input.replace(/ /g,'T'));
        return date.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'});
    }

</script>

<template>
  <div class="text-white mb-8 pb-6">
    <div class="px-2 mt-6">
        <div class="w-12 h-22rem border-round-xl overflow-hidden container">
            
            <img src="https://countersbd-ticket-bucket.s3.ap-south-1.amazonaws.com/event_C216860256.jpg">
            <div class="w-full h-22rem centered opacity-50" style="background-color: black;"></div>
            <div class="text-7xl centered">{{ selectedEvent.eventName}}</div>
            
        </div>
    </div>

    <Fieldset legend="Event Details" class="mx-2 mt-4 text-white bg-transparent border-round-xl">
        <p class="m-0">
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
        </p>
    </Fieldset>

    <div class="grid mt-4 mx-2 border-round-xl border-1">
        <div class="col-12 md:col-6 lg:col-6 border-round-xl font-bold">
            <div class="flex justify-content-center flex-wrap">
                <div class="flex align-items-center justify-content-center">
                     <i class="pi pi-calendar text-white text-center " style="font-size: 3rem">
                    </i>
                </div>
                <div class="flex align-items-center justify-content-center">
                    <p class="text-center text-2xl p-3 ">{{ getDate(selectedEvent.eventStartDate) }}
                    </p>
                </div>
            </div>
        </div>

        <div class="col-12 md:col-6 lg:col-6 border-round-xl font-bold">
           <div class="flex justify-content-center flex-wrap">
               <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-clock text-white text-center " style="font-size: 3rem">
                   </i>
               </div>
               <div class="flex align-items-center justify-content-center">
                   <p class="text-center text-2xl p-3">{{ getTime(selectedEvent.eventStartDate)  }}
                   </p>
               </div>
           </div>
       </div>
    </div>

    <!-- <div class="mt-4 text-center text-2xl font-bold">Ticket Categories</div> -->
    <div class="grid mt-4 px-2">
            <div v-for="category in selectedEvent.categoryList" :key="category.categoryId" class="lg:col-4 col-12 p-2">
                <Card style="overflow: hidden" class="bg-gray-800 w-full">
                    <template #title>
                        <div class="text-white text-center">
                            {{category.categoryName}}
                        </div>
                    </template>
                    <template #content>
                        <div class="text-white text-center">
                            {{ category.categoryDescription }}
                        </div>
                    </template>
                    <template #footer>
                        <div @click="navigateTo('/checkout/'+selectedEvent.eventId+'/'+category.categoryId)" class="cursor-pointer p-2 border-round-xl text-center font-bold text-3xl" style="background-color: #d82127; color:black;">
                            ৳{{ category.categoryPrice }}
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

.container {
  position: relative;
  text-align: center;
  color: white;
}

.p-fieldset .p-fieldset-legend {
    background: #d82127 !important;
    color: #000 !important;
}
.p-fieldset .p-fieldset-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
}
</style>