<script setup>
import { ref, onBeforeMount } from 'vue'
import { Car } from '@/services/Car.js'

const props = defineProps(['carID'])
const isLoading = ref(true)
const car = ref()
car.value = new Car()

const carSnackBar = ref(false)
const carSnackBarText = ref('')
const carSnackBarTimeout = ref(2000)
const deleteCar = async () => {
  const res = await car.value.delete()
  console.log(res)
  if (res?.success) {
    carSnackBarText.value = 'Car deleted successfully'
    carSnackBar.value = true
  } else {
    carSnackBarText.value = 'problem during deletion of car'
    carSnackBar.value = true
  }
}

onBeforeMount(async () => {
  try {
    car.value.initById(props.carID)
    await car.value.fetchCarById()
    await car.value.fetchCarImages()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <v-skeleton-loader v-if="isLoading" type="card-avatar" height="150"></v-skeleton-loader>

  <v-card v-else class="rounded-lg elevation-2 overflow-hidden" v-if="car">
    <div class="d-flex flex-no-wrap">
      <v-avatar class="ma-0" size="150" rounded="0">
        <v-img
          :src="
            car.images && car.images.length
              ? car.images[0]
              : 'https://via.placeholder.com/250x150?text=No+Image'
          "
          cover
        ></v-img>
      </v-avatar>

      <div class="flex-grow-1 pa-4 d-flex flex-column justify-space-between">
        <div class="d-flex justify-space-between align-start">
          <div>
            <h3 class="text-h6 font-weight-bold text-truncate">{{ car.brand }} {{ car.model }}</h3>
            <div class="text-subtitle-2 text-grey-darken-1">
              {{ car.licensePlate }}
            </div>
          </div>

          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                density="comfortable"
                v-bind="props"
              ></v-btn>
            </template>

            <v-list density="compact" elevation="2" class="rounded-lg">
              <v-list-item @click="$router.push(`/account/cars/edit/${car.id}`)">
                <template v-slot:prepend>
                  <v-icon icon="mdi-pencil" size="small" class="mr-2"></v-icon>
                </template>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>

              <v-list-item @click="deleteCar" color="error">
                <template v-slot:prepend>
                  <v-icon icon="mdi-delete" color="error" size="small" class="mr-2"></v-icon>
                </template>
                <v-list-item-title class="text-error">Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <div>
          <v-chip
            :color="car.status === 'available' ? 'green-lighten-4' : 'orange-lighten-4'"
            :text-color="car.status === 'available' ? 'green-darken-3' : 'orange-darken-3'"
            class="font-weight-bold mt-2"
            size="small"
            label
          >
            <template v-slot:prepend>
              <v-icon
                icon="mdi-circle-medium"
                :color="car.status === 'available' ? 'green' : 'orange'"
                start
              ></v-icon>
            </template>
            <span
              :class="car.status === 'available' ? 'text-green-darken-4' : 'text-orange-darken-4'"
            >
              {{ car.status }}
            </span>
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>
  <v-snackbar v-model="carSnackBar" :timeout="carSnackBarTimeout" color="#216c37">
    {{ carSnackBarText }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="carSnackBar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>
