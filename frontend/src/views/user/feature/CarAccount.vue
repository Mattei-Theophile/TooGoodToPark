<script setup>
import { onBeforeMount, ref } from 'vue'
import { Cars } from '@/services/Cars.js'
import CarEditInfo from '@/components/car/CarEditInfo.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const isLoading = ref(true)
const cars = ref(new Cars())

onBeforeMount(async () => {
  try {
    await cars.value.fetchMyCars()
  } catch (error) {
    console.error('Failed to fetch cars:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <v-container fluid class="pa-4 fill-height align-start bg-grey-lighten-5">
    <div class="d-flex align-center mb-6">
      <h2 class="text-h4 font-weight-bold text-green-darken-3">My Cars</h2>
    </div>

    <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <div v-if="!isLoading" class="w-100">
      <v-alert
        v-if="cars.centralizedCars.length === 0"
        type="info"
        variant="tonal"
        icon="mdi-car-off"
        title="No cars found"
        text="You haven't added any cars yet."
      ></v-alert>

      <v-row v-else>
        <v-col cols="12" v-for="car in cars.centralizedCars" :key="car.id">
          <car-edit-info :carID="car.id" />
        </v-col>
      </v-row>
    </div>

    <v-btn
      icon="mdi-plus"
      color="#216c37"
      theme="dark"
      size="x-large"
      elevation="4"
      position="fixed"
      location="bottom right"
      :style="{ bottom: mobile ? '80px' : '32px', right: '32px', zIndex: 100 }"
      @click="$router.push('cars/add')"
    ></v-btn>
  </v-container>
</template>
