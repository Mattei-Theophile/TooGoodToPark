<script setup>
import { onBeforeMount, ref } from 'vue'
import { Cars } from '@/services/Cars.js'
import CarBigInfo from '@/components/car/carBigInfo.vue'

const cars = ref(null)
cars.value = new Cars()
onBeforeMount(async () => {
  try {
    cars.value.fetchMyCars()
  } catch (error) {
    console.error('Failed to fetch cars:', error)
  }
})
</script>

<template>
  <p>My Cars</p>

  <car-big-info v-for="car in cars.centralizedCars" :key="car.id" :car="car" />

  <div v-if="cars.centralizedCars.length === 0">No cars found.</div>

  <div class="add-car" @click="$router.push('cars/add')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      class="bi bi-plus-circle-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"
      />
    </svg>
  </div>
</template>

<style scoped>
.add-car {
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  svg {
    fill: #216c37;
  }
}
</style>
