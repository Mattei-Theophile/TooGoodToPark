<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Reservationcalendar from '@/components/calendar/reservationcalendar.vue'
import Review from '@/components/Review.vue'
import { useRouter } from 'vue-router'
import { Car } from '@/services/Car'

const isLoading = ref(true)

const router = useRouter()
const props = defineProps({
  id: String,
})
// Reactive data
const selectedDateRange = ref({
  departure: null,
  return: null,
})
const car = ref(null)
car.value = new Car()
const selectedImageIndex = ref(0)

const currentCarImage = computed(() => car.value?.images[selectedImageIndex.value])
const availableImages = computed(() => car.value?.images || [])

const selectImage = (index) => {
  selectedImageIndex.value = index
}
const isImageSelected = (index) => {
  return selectedImageIndex.value === index
}

const isErrorDateSelected = ref(false)
const handleDateSelection = (selectedDates) => {
  selectedDateRange.value.departure = selectedDates.start
  selectedDateRange.value.return = selectedDates.end
}

const launchReservation = async () => {
  if (selectedDateRange.value.departure && selectedDateRange.value.return) {
    await router.push({
      path: '/reservation',
      query: {
        id: props.id,
        departure: selectedDateRange.value.departure,
        return: selectedDateRange.value.return,
      },
    })
  } else {
    isErrorDateSelected.value = true
  }
}

onMounted(async () => {
  try {
    car.value.initById(props.id)
    await car.value.fetchCarById()
    await car.value.fetchCarImages()
    console.log(car)
    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = true
  }
})
</script>

<template>
  <v-container fluid>
    <v-row v-if="isLoading" align="center" justify="center" class="my-10">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-col>
    </v-row>

    <v-row v-else class="announce-container">
      <v-col cols="12">
        <!-- Car Details Section -->
        <v-card flat class="car-container">
          <v-sheet class="description-car-container" rounded="lg">
            <div class="header-description-car">
              <h3 class="name-car">{{ car?.brand }} {{ car?.model }}</h3>
            </div>
            <div class="price-car d-flex align-center">
              <v-chip color="primary" variant="elevated" size="large" class="font-weight-bold mr-2">
                {{ car?.price }}€
              </v-chip>
              <span>/day</span>
            </div>
          </v-sheet>

          <!-- Image Gallery Section -->
          <div v-if="availableImages.length > 0">
            <v-img :src="currentCarImage" class="show-image-car" cover rounded="lg" />
            <div class="images-car-carousel-container mt-4">
              <v-btn
                v-for="(image, index) in availableImages"
                :key="index"
                :variant="isImageSelected(index) ? 'flat' : 'text'"
                :color="isImageSelected(index) ? 'primary' : undefined"
                size="small"
                class="pa-0"
                @click="selectImage(index)"
              >
                <v-img
                  :src="image"
                  :alt="`Car image ${index + 1}`"
                  class="image-car"
                  cover
                  rounded
                />
              </v-btn>
            </div>

            <div class="technical-car-information">
              <v-chip color="secondary" class="ma-2">
                <v-icon start icon="mdi-calendar"></v-icon>
                Year: {{ car?.year }}
              </v-chip>
              <v-chip color="secondary" class="ma-2">
                <v-icon start icon="mdi-seat"></v-icon>
                Passengers: {{ car?.passenger }}
              </v-chip>
              <v-chip color="secondary" class="ma-2">
                <v-icon start icon="mdi-map-marker"></v-icon>
                Location: {{ car?.location }}
              </v-chip>

              <v-chip color="secondary" class="ma-2">
                <v-icon start icon="mdi-gas-station"> </v-icon>
                Mileage : {{ car?.mileage }}
              </v-chip>
            </div>
          </div>

          <!-- Reviews Section -->
          <v-card-title class="px-0 pt-6">Review and comments</v-card-title>
          <v-card-text class="px-0">
            <review :ID_Car="props.id" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Reservation Section -->
      <div class="reservation-container">
        <div class="button-reservation-container">
          <reservationcalendar
            :ID_Car="props.id"
            @dateSelected="handleDateSelection"
            id="reservation-calendar"
          />

          <v-btn color="#216c37" size="x-large" class="pay-button" @click="launchReservation">
            Reserve and pay
          </v-btn>
        </div>
        <v-snackbar v-model="isErrorDateSelected" :timeout="2000" color="error" top>
          Please select a date for your booking
          <template v-slot:actions>
            <v-btn color="white" text @click="isErrorDateSelected = false"> Close </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped>
.announce-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 5rem;
}

.car-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.description-car-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 2px solid #dcdcdc;
  background-color: #216c37;
  color: #fff;
}
.header-description-car {
  display: flex;
  flex-direction: column;
  padding: 0;
  .name-car {
    margin: 0 1rem;
    font-weight: bold;
    font-size: 1.5rem;
  }
  .location-car {
    margin: 0 1rem;
  }
}
.price-car {
  margin: 1rem;
  span {
    font-weight: bold;
    font-size: 1.7rem;
  }
}
.images-car-carousel-container {
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  .image-car {
    width: 83px;
    height: 51px;
    border-radius: 10px;
  }
}

.selectedImageCar {
  filter: brightness(30%);
}
.show-image-car {
  width: 70%;
  height: 300px;
  border-radius: 10px;
}

.technical-car-information {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.reservation-container {
  position: fixed;
  bottom: 100px;
  width: 100%;
}

.button-reservation-container {
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
  gap: 0.5rem;
  .pay-button {
    height: 70px;
    padding: 0 5rem;
    font-weight: bold;
  }
}

#reservation-calendar {
  display: block;
}
.error {
  color: red;
  padding: 1rem;
  border-radius: 10px;
  font-weight: bold;
}

@media (min-width: 960px) {
  .announce-container {
    flex-direction: row;
  }

  .reservation-container {
    position: static;
    align-self: flex-start;
  }
  .button-reservation-container {
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
