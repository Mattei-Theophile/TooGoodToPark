<script setup lang="ts">
import { onBeforeMount, ref, computed, onMounted } from 'vue'
import CarBigInfo from '@/components/car/carBigInfo.vue'
import { Cars } from '@/services/Cars.js'

const cars = ref(null)
const currentIndex = ref(0)
const carsService = ref(null)
const isLoading = ref(true) // Add loading state

carsService.value = new Cars()

// Wait for cars to load
const loadCars = async () => {
  try {
    await carsService.value.fetchCars(10)
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load cars:', error)
    isLoading.value = true
  }
}

const carsLength = computed(() => carsService.value?.centralizedCars?.length || 0)

const getPreviousIndex = computed(
  () => (currentIndex.value - 1 + carsLength.value) % carsLength.value,
)

const getNextIndex = computed(() => (currentIndex.value + 1) % carsLength.value)

const carouselItems = computed(() => {
  if (!carsService.value?.centralizedCars?.length) return []

  return [
    carsService.value.centralizedCars[getPreviousIndex.value],
    carsService.value.centralizedCars[currentIndex.value],
    carsService.value.centralizedCars[getNextIndex.value],
  ]
})

const goToPrevious = () => {
  currentIndex.value = getPreviousIndex.value
}

const goToNext = () => {
  currentIndex.value = getNextIndex.value
}

onMounted(() => {
  loadCars()
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="loading">Loading cars...</div>
    <div v-else-if="!carsLength" class="no-cars">No cars available</div>
    <div v-else>
      <div class="carousel-container">
        <button class="direction-carousel" @click="goToPrevious">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            class="bi bi-chevron-compact-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"
            />
          </svg>
        </button>
        <div class="car-carousel">
          <car-big-info
            v-for="(item, index) in carouselItems"
            :key="index"
            class="banner-car-carousel"
            :car="item"
          />
        </div>
        <button class="direction-carousel" @click="goToNext">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            class="bi bi-chevron-compact-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"
            />
          </svg>
        </button>
      </div>
      <div class="length-car-carousel">
        <svg
          v-for="(dot, dotIndex) in carsLength"
          :key="dotIndex"
          :class="{ dotIndex: currentIndex === dotIndex }"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <circle fill="current-color" cx="8" cy="8" r="8" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.car-carousel {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 100%;

  .banner-car-carousel {
    margin: 0 10px;
  }
}

.length-car-carousel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;

  svg {
    margin: 0 0.3rem;
  }
}

.dotIndex {
  fill: #216c37;
}
</style>
