<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import CarBigInfo from '@/components/car/carBigInfo.vue'
import { Cars } from '@/services/Cars.js'

const currentSlide = ref(0)
const carsService = ref(null)
const isLoading = ref(true)
const autoplay = ref(true)

// Use Vuetify display composable to control arrow visibility
const { mdAndUp } = useDisplay()

carsService.value = new Cars()

const carsLength = computed(() => carsService.value?.centralizedCars?.length || 0)

const carouselItems = computed(() => {
  return carsService.value?.centralizedCars || []
})

onBeforeMount(async () => {
  try {
    await carsService.value.fetchCars(10)
    console.log('Fetched cars:', carsService.value.centralizedCars)
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load cars:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <div class="carousel-section">
    <v-container v-if="isLoading">
      <v-row justify="center" class="loading-container">
        <v-col cols="auto" class="text-center">
          <v-progress-circular indeterminate color="green-darken-3" size="64" width="6" />
          <p class="text-h6 mt-4">Loading amazing cars...</p>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="!carsLength">
      <v-alert type="info" variant="tonal" prominent border="start" class="no-cars-alert">
        <v-alert-title>
          <v-icon class="mr-2">mdi-car-off</v-icon>
          No Cars Available
        </v-alert-title>
        <div>Currently, there are no vehicles available in our fleet. Please check back later.</div>
      </v-alert>
    </v-container>

    <div v-else>
      <v-carousel
        v-model="currentSlide"
        :cycle="autoplay"
        :interval="5000"
        hide-delimiter-background
        :show-arrows="mdAndUp"
        height="auto"
        class="car-carousel-wrapper"
      >
        <template v-slot:prev="{ props }">
          <v-btn v-bind="props" icon size="large" color="green-darken-3" class="prev-arrow">
            <v-icon size="x-large">mdi-chevron-left</v-icon>
          </v-btn>
        </template>

        <template v-slot:next="{ props }">
          <v-btn v-bind="props" icon size="large" color="green-darken-3" class="next-arrow">
            <v-icon size="x-large">mdi-chevron-right</v-icon>
          </v-btn>
        </template>

        <v-carousel-item v-for="(car, index) in carouselItems" :key="car.id" class="carousel-slide">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="10" lg="8">
                <div class="car-slide-content">
                  <car-big-info :car="car" />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-carousel-item>
      </v-carousel>

      <v-container class="carousel-indicators-container">
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <div class="carousel-indicators">
              <v-btn
                v-for="(car, index) in carouselItems"
                :key="`indicator-${car.id}`"
                :color="currentSlide === index ? 'green-darken-3' : 'grey-lighten-1'"
                :variant="currentSlide === index ? 'elevated' : 'flat'"
                size="x-small"
                icon
                class="indicator-dot"
                @click="currentSlide = index"
              >
                <v-icon v-if="currentSlide === index" size="small">mdi-circle</v-icon>
                <v-icon v-else size="x-small">mdi-circle-outline</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-chip size="small" variant="outlined">
              {{ currentSlide + 1 }} / {{ carsLength }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.carousel-section {
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  padding: 3rem 0;
}

.loading-container {
  min-height: 400px;
}

.no-cars-alert {
  margin: 2rem auto;
  max-width: 600px;
}

.car-carousel-wrapper {
  border-radius: 20px;
  overflow: visible !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.prev-arrow {
  margin-left: 1rem;
}

.next-arrow {
  margin-right: 1rem;
}

/* Carousel slide styling */
.carousel-slide {
  background: transparent;
  padding: 2rem 0;
}

.car-slide-content {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom indicators */
.carousel-indicators-container {
  margin-top: 1rem;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.indicator-dot {
  transition: all 0.3s ease;
  min-width: 32px !important;
}

.indicator-dot:hover {
  transform: scale(1.2);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .carousel-section {
    padding: 2rem 0;
  }

  /* Arrows are now handled via the :show-arrows prop, so no CSS needed here */

  .car-slide-content {
    padding: 0 1rem;
  }
}

/* Smooth transitions */
:deep(.v-carousel__controls) {
  background: transparent;
  padding: 1rem;
}

:deep(.v-carousel) {
  overflow: visible;
}
</style>
