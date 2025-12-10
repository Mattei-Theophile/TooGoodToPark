<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Car } from '@/services/Car.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = router.currentRoute.value.params

const isLoading = ref(true)
const car = ref(new Car())
car.value = new Car()

const carSnackBar = ref(false)
const carSnackBarText = ref('')
const carSnackBarTimeout = ref<Number>(2000)
// For v-file-input model
const newImageFile = ref<File | null>(null)

const removeImage = (index: number) => {
  car.value.images.splice(index, 1)
}

const handleImageUpload = (file: File | File[]) => {
  // v-file-input can return an array or single object depending on props.
  // We assume single file selection here for simplicity per upload.
  const targetFile = Array.isArray(file) ? file[0] : file

  if (targetFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        car.value.images.push(e.target.result)
        // Reset input so user can add another if they want
        newImageFile.value = null
      }
    }
    reader.readAsDataURL(targetFile)
  }
}

const saveChanges = async () => {
  try {
    console.log(car.value.images)
    await car.value.update({
      carId: car.value.id,
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
    console.log(car.value.images)
    await car.value.updateImages(car.value.images)

    carSnackBarText.value = 'Car added successfully'
    carSnackBar.value = true
  } catch (error) {
    console.error('Failed to save changes:', error)
  }
}

onBeforeMount(() => {
  try {
    car.value.initById(props.carID)
    car.value.fetchCarById()
    car.value.fetchCarImages()
    console.log(car.value)
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load car details:', error)
  }
})
</script>

<template>
  <div v-if="isLoading" class="d-flex justify-center align-center py-10">
    <v-progress-circular indeterminate color="#216c37" size="64"></v-progress-circular>
  </div>

  <v-container v-else maxWidth="900">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4 font-weight-bold text-grey-darken-3">Edit your Car</h2>
      <v-btn variant="outlined" color="grey-darken-1" @click="$router.push('/account/cars')">
        Return
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
      Edit Your Car
    </v-btn>

    <v-snackbar v-model="carSnackBar" :timeout="carSnackBarTimeout">
      {{ carSnackBarText }}
      <template v-slot:actions>
        <v-btn color="white" text @click="carSnackBar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
