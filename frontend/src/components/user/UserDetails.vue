<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const formValid = ref(false) // For form validation

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: {
    street: '',
    city: '',
    zipCode: '',
    country: '',
  },
})

// Sync logic
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value.firstName = newUser.firstName || ''
      formData.value.lastName = newUser.lastName || ''
      formData.value.email = newUser.email || ''
      formData.value.phoneNumber = newUser.phoneNumber || ''
      if (newUser.address) {
        formData.value.address = { ...newUser.address }
      }
    }
  },
  { immediate: true, deep: true },
)

const onCountryChanged = (countryObject: any) => {
  if (countryObject && countryObject.name) {
    formData.value.address.country = countryObject.name
  }
}

const handleSave = () => {
  props.user.firstName = formData.value.firstName
  props.user.lastName = formData.value.lastName
  props.user.email = formData.value.email
  props.user.phoneNumber = formData.value.phoneNumber
  props.user.address = { ...formData.value.address }

  console.log('User details updated:', props.user)
  props.user.update()
}
</script>

<template>
  <v-form v-model="formValid" @submit.prevent="handleSave">
    <v-container class="pa-0">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.firstName"
            label="First Name"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account"
            color="#216c37"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.lastName"
            label="Last Name"
            variant="outlined"
            density="comfortable"
            color="#216c37"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-email"
            color="#216c37"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <label class="text-caption text-medium-emphasis ml-1">Phone Number</label>
          <div class="custom-input-wrapper">
            <vue-tel-input
              v-model="formData.phoneNumber"
              mode="international"
              :autoFormat="true"
              :preferredCountries="['GB', 'FR', 'DE']"
              @country-changed="onCountryChanged"
              class="mb-2"
            />
          </div>
        </v-col>
      </v-row>

      <v-row dense class="mt-2">
        <v-col cols="12">
          <v-text-field
            v-model="formData.address.street"
            label="Street Address"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-map-marker"
            color="#216c37"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.address.city"
            label="City"
            variant="outlined"
            density="comfortable"
            color="#216c37"
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="3">
          <v-text-field
            v-model="formData.address.zipCode"
            label="Zip Code"
            variant="outlined"
            density="comfortable"
            color="#216c37"
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="3">
          <div
            class="custom-input-wrapper"
            style="height: 48px; display: flex; align-items: center"
          >
            <country-select
              class="country-select-input"
              v-model="formData.address.country"
              :country="formData.address.country"
              topCountry="GB"
              :countryName="true"
              placeholder="GB"
            />
          </div>
        </v-col>
      </v-row>

      <v-btn
        block
        color="#216c37"
        theme="dark"
        size="large"
        class="mt-4"
        @click="handleSave"
        elevation="2"
      >
        Save Changes
      </v-btn>
    </v-container>
  </v-form>
</template>

<style scoped>
.custom-input-wrapper {
  border: 1px solid #9e9e9e;
  border-radius: 4px;
}
:deep(.vue-tel-input) {
  border: none;
  box-shadow: none;
}
:deep(.country-select-input) {
  width: 100%;
  border: none;
  outline: none;
  padding: 0 8px;
}
</style>
