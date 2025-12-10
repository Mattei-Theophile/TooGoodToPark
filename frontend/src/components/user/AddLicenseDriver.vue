<script setup lang="ts">
import { ref } from 'vue'

const driverLicenseImage = ref<string | ArrayBuffer | null>(null)
const selectedFile = ref<File | null>(null)

// Handle file change via v-file-input
const handleFileChange = (files: File | File[]) => {
  // v-file-input can return an array or single file. We take the first one.
  const file = Array.isArray(files) ? files[0] : files

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        driverLicenseImage.value = e.target.result
      }
    }
    reader.readAsDataURL(file)
  } else {
    driverLicenseImage.value = null
  }
}
</script>

<template>
  <v-container class="pa-0">
    <v-sheet
      border="dashed"
      rounded="lg"
      class="d-flex flex-column align-center justify-center pa-6 mb-4 bg-grey-lighten-4"
    >
      <v-icon
        icon="mdi-card-account-details-outline"
        size="48"
        color="grey-darken-1"
        class="mb-2"
      ></v-icon>

      <div class="text-body-2 text-grey-darken-1 mb-4 text-center">
        Upload a clear image of your driver's license.
      </div>

      <v-file-input
        v-model="selectedFile"
        accept="image/*, application/pdf"
        label="Select File"
        prepend-icon=""
        prepend-inner-icon="mdi-camera"
        variant="outlined"
        density="compact"
        color="#216c37"
        class="w-100 max-width-300"
        @update:model-value="handleFileChange"
        show-size
      ></v-file-input>

      <v-img
        v-if="driverLicenseImage && typeof driverLicenseImage === 'string'"
        :src="driverLicenseImage"
        max-height="150"
        max-width="250"
        class="mt-4 rounded border"
        contain
      ></v-img>
    </v-sheet>

    <v-btn block color="#216c37" theme="dark" size="large" elevation="2" :disabled="!selectedFile">
      Save License Driver
    </v-btn>
  </v-container>
</template>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
</style>
