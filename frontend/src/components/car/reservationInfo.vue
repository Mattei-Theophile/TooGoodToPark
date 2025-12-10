<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

const isLoading = ref(true)

// Helper to format dates cleanly
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString)
    .toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '.')
}

const pricePerDay = computed(() => {
  if (!props.reservation?.price || !props.reservation?.totalDays) return '0.00'
  return (props.reservation.price / props.reservation.totalDays).toFixed(2)
})

onBeforeMount(async () => {
  if (props.reservation?.car) {
    // Await these if they return promises, otherwise keep as is
    await props.reservation.car.fetchCarById()
    await props.reservation.car.fetchCarImages()
  }
  isLoading.value = false
})

const handleDelete = async () => {
  const res = props.reservation.delete()
  console.log('Deleted:', res)
}
</script>

<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="image, list-item-two-line"
    class="mb-4 rounded-lg"
    height="150"
  ></v-skeleton-loader>

  <v-alert v-else-if="!props.reservation" type="error" variant="tonal" class="mb-4">
    Error loading reservation display.
  </v-alert>

  <v-card v-else elevation="2" rounded="lg" class="mb-4 reservation-card">
    <v-row no-gutters>
      <v-col cols="4" sm="3" md="2">
        <v-img
          :src="props.reservation.car.images?.[0]"
          alt="Car Image"
          cover
          height="100%"
          class="rounded-s-lg"
          min-height="120"
        >
        </v-img>
      </v-col>

      <v-col cols="8" sm="9" md="10">
        <div class="d-flex flex-column h-100 pa-3">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-h6 font-weight-bold text-truncate">
                {{ props.reservation.car.brand }} {{ props.reservation.car.model }}
              </div>
              <div class="text-subtitle-1 text-green-darken-2 font-weight-bold">
                £{{ pricePerDay }} <span class="text-body-2 text-grey">/ day</span>
              </div>
            </div>

            <div class="d-flex align-center">
              <v-btn
                :to="`/announce/${props.reservation.car.id}`"
                icon="mdi-text-box-search-outline"
                variant="text"
                color="grey-darken-1"
                density="comfortable"
                title="View Details"
              ></v-btn>

              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-dots-vertical"
                    variant="text"
                    color="grey-darken-1"
                    density="comfortable"
                  ></v-btn>
                </template>

                <v-list density="compact" elevation="3" rounded="lg">
                  <v-list-item @click="handleDelete" base-color="error">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-trash-can-outline"></v-icon>
                    </template>
                    <v-list-item-title>Delete Reservation</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>

          <v-divider class="my-2"></v-divider>

          <div class="d-flex align-center text-body-2 text-grey-darken-2 mt-auto">
            <v-icon icon="mdi-calendar-range" start size="small" class="mr-2"></v-icon>
            <span>{{ formatDate(props.reservation.start) }}</span>
            <v-icon icon="mdi-arrow-right" size="small" class="mx-2 text-grey-lighten-1"></v-icon>
            <span>{{ formatDate(props.reservation.end) }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
/* Almost no CSS needed!
   Vuetify utility classes handle spacing (pa-3, my-2),
   typography (text-h6), and layout (d-flex).
*/

.reservation-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.reservation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
</style>
