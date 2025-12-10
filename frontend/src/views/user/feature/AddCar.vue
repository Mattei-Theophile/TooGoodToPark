<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Car } from '@/services/Car.js'
import { useRouter } from 'vue-router'
const router = useRouter()

const isLoading = ref(true)
const car = ref(new Car())

// For v-file-input model
const newImageFile = ref<File | null>(null)

const removeImage = (index: number) => {
  car.value.images.splice(index, 1)
}

const handleImageUpload = (file: File | File[]) => {
  const targetFile = Array.isArray(file) ? file[0] : file
  if (targetFile) {
    const previewUrl = URL.createObjectURL(targetFile)
    car.value.images.push({
      preview: previewUrl,
      file: targetFile,
    })
    newImageFile.value = null
  }
}

const saveChanges = async () => {
  try {
    await car.value.create({
      brand: car.value.brand,
      model: car.value.model,
      year: car.value.year,
      mileage: car.value.mileage,
      licensePlate: car.value.licensePlate,
      description: car.value.description,
      price: car.value.price,
      passenger: car.value.passenger,
      location: car.value.location,
      status: true,
    })
    for (const image of car.value.images) {
      await car.value.uploadImages(image)
    }
    await router.push('/account/cars')
  } catch (error) {
    console.error('Failed to save changes:', error)
  }
}

onBeforeMount(() => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading" class="d-flex justify-center align-center py-10">
    <v-progress-circular indeterminate color="#216c37" size="64"></v-progress-circular>
  </div>

  <v-container v-else maxWidth="900">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4 font-weight-bold text-grey-darken-3">Add Car to your list</h2>
      <v-btn variant="outlined" color="grey-darken-1" @click="$router.push('/account/cars')">
        Cancel
      </v-btn>
    </div>

    <v-card elevation="2" rounded="lg" class="mb-6">
      <v-card-title class="text-h6 font-weight-medium px-4 pt-4">
        <v-icon icon="mdi-camera" class="mr-2" color="#216c37"></v-icon>
        Car Photos
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col v-for="(image, index) in car.images" :key="index" cols="6" sm="4" md="3">
            <v-card flat border rounded="lg" class="position-relative overflow-hidden">
              <v-img :src="image" aspect-ratio="1.5" cover bg-color="grey-lighten-2"></v-img>

              <v-btn
                icon="mdi-trash-can"
                size="small"
                color="error"
                variant="flat"
                class="position-absolute top-0 right-0 ma-1"
                @click="removeImage(index)"
              ></v-btn>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="3" class="d-flex align-center">
            <div class="w-100">
              <v-file-input
                v-model="newImageFile"
                accept="image/*"
                label="Add Photo"
                prepend-icon=""
                prepend-inner-icon="mdi-camera-plus"
                variant="outlined"
                hide-details
                density="compact"
                @update:model-value="handleImageUpload"
              ></v-file-input>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="2" rounded="lg" class="mb-6">
      <v-card-title class="text-h6 font-weight-medium px-4 pt-4">
        <v-icon icon="mdi-car-info" class="mr-2" color="#216c37"></v-icon>
        Car Details
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.brand"
              label="Brand"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.model"
              label="Model"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.year"
              label="Year"
              type="number"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.location"
              label="Location (City)"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.mileage"
              label="Mileage (km)"
              type="number"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.licensePlate"
              label="License Plate"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.passenger"
              label="Passenger Capacity"
              type="number"
              variant="outlined"
              color="#216c37"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="2" rounded="lg" class="mb-6">
      <v-card-title class="text-h6 font-weight-medium px-4 pt-4">
        <v-icon icon="mdi-cash" class="mr-2" color="#216c37"></v-icon>
        Rental Information
      </v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="car.price"
              label="Rental Price"
              prefix="£"
              suffix="/day"
              type="number"
              variant="outlined"
              color="#216c37"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="d-flex align-center justify-space-between border rounded pa-3">
              <div class="text-subtitle-1">Available for Rent</div>
              <v-switch
                v-model="car.status"
                true-value="available"
                false-value="blocked"
                color="#216c37"
                hide-details
                inset
              ></v-switch>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-btn
      block
      color="#216c37"
      theme="dark"
      size="x-large"
      class="mt-4"
      elevation="4"
      @click="saveChanges"
    >
      Add Your Car
    </v-btn>
  </v-container>
</template>
