<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Reservationcalendar from '@/components/calendar/reservationcalendar.vue'
import Review from '@/components/Review.vue'
import { useRouter } from 'vue-router'
import { Car } from '@/services/Car'

const isLoading = ref(true)

const router = useRouter()
const routeQuery = router.currentRoute.value.query

// Reactive data
const selectedDateRange = ref({
  departure: null,
  return: null,
})
const car = ref(null)
car.value = new Car()
const selectedImageIndex = ref(0)

// Editor state
const isEditor = ref(true)
const editorMode = ref(false)

// Computed properties
const currentCarImage = computed(() => car.value?.images[selectedImageIndex.value])

const availableImages = computed(() => car.value?.images || [])

// Image carousel functions
const selectImage = (index) => {
  selectedImageIndex.value = index
}

const isImageSelected = (index) => {
  return selectedImageIndex.value === index
}

// Editor functions
const toggleEditorMode = () => {
  editorMode.value = !editorMode.value
}

// Date selection handler
const handleDateSelection = (selectedDates) => {
  selectedDateRange.value.departure = selectedDates.start
  selectedDateRange.value.return = selectedDates.end
}

// Navigation
const launchReservation = async () => {
  await router.push({
    path: '/reservation',
    query: {
      id: routeQuery.id,
      departure: selectedDateRange.value.departure,
      return: selectedDateRange.value.return,
    },
  })
}
const loadCar = async () => {
  try {
    car.value.initById(routeQuery.id)
    car.value.fetchCarById()
    await car.value.fetchCarImages()
    console.log(car)
    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = true
  }
}

onMounted(() => {
  loadCar()
  // TODO: Load car details and images based on routeQuery.id
})
</script>

<template>
  <div v-if="isLoading" class="loading">Loading cars...</div>
  <div v-else>
    <!-- Editor Controls -->
    <div v-if="isEditor">
      <button @click="toggleEditorMode">toggle editor mode : {{ editorMode }}</button>
      <button>Save</button>
    </div>

    <!-- Car Details Section -->
    <div class="car-container">
      <div class="description-car">
        <button class="return-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            class="bi bi-arrow-left-short"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
            />
          </svg>
        </button>
        <div class="description-car-container">
          <div class="header-description-car">
            <h3 class="name-car">
              {{ car?.brand + car?.model }}
            </h3>
            <p class="location-car">{{ car?.mileage }}</p>
          </div>
          <p class="price-car">
            <span>{{ car?.price }}€</span>/day
          </p>
        </div>
      </div>

      <!-- Image Gallery Section -->
      <div v-if="availableImages.length > 0">
        <div>
          <img class="show-image-car" :src="currentCarImage" alt="Selected car image" />
        </div>
        <div class="images-car-carousel-container">
          <button
            v-for="(image, index) in availableImages"
            :key="index"
            :class="{ selectedImageCar: isImageSelected(index) }"
            @click="selectImage(index)"
          >
            <img class="image-car" :src="image" :alt="`Car image ${index + 1}`" />
          </button>
          <button v-if="editorMode">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Car Description Section -->
      <div>
        <div v-if="editorMode">
          <input type="text" v-model="car.description" />
        </div>
        <p v-else>{{ car.description }}</p>
      </div>
    </div>

    <!-- Reviews Section -->
    <div>
      <h2>Review and comments</h2>
      <review :ID_Car="routeQuery.id" />
    </div>

    <!-- Reservation Section -->
    <div class="reservation-container">
      <button class="pay-button" @click="launchReservation">Reserve and pay</button>
      <reservationcalendar :ID_Car="routeQuery.id" @dateSelected="handleDateSelection" />
    </div>
  </div>
</template>

<style scoped>
.car-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.description-car {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 2px solid #dcdcdc;
  .return-button {
    background-color: #f4f4f4;
    border-radius: 10px;
    padding: 0 1rem;
  }
}
.description-car-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  gap: 1rem;
}
.header-description-car {
  display: flex;
  flex-direction: column;
  padding: 0;
  .name-car {
    margin: 0;
    font-weight: bold;
    font-size: 1.5rem;
  }
  .location-car {
    margin: 0;
    color: gray;
  }
}
.price-car {
  color: gray;
  span {
    font-weight: bold;
    font-size: 1.7rem;
    color: black;
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
.reservation-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .pay-button {
    background-color: #000000;
    color: #ffffff;
    border-radius: 10px;
    padding: 1rem 5rem;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: end;
  }
}
</style>
