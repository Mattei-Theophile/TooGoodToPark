<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const research = ref(false)
const researchForm = ref({
  city: '',
  startDate: '',
  endDate: '',
  passenger: 1,
})

const handleSubmitForm = () => {
  if (
    researchForm.value.city &&
    researchForm.value.startDate &&
    researchForm.value.endDate &&
    researchForm.value.passenger
  ) {
    router.push({
      name: 'Search',
      query: {
        city: researchForm.value.city,
        startDate: researchForm.value.startDate,
        endDate: researchForm.value.endDate,
        passenger: researchForm.value.passenger,
      },
    })
    research.value = false
  }
}
</script>

<template>
  <v-container class="search-bar">
    <v-btn
      height="48"
      elevation="2"
      class="font-weight-bold text-body-1"
      rounded="pill"
      @click="research = !research"
    >
      <v-icon size="32">mdi-magnify</v-icon>

      <span class="d-none d-sm-inline ml-2"> Search </span>
    </v-btn>
  </v-container>

  <v-bottom-sheet v-model="research">
    <v-card color="#1b3f25" theme="dark" class="rounded-t-xl pb-6">
      <v-card-title class="text-h5 font-weight-bold text-center py-6">
        Search for an ad
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4">
              <div
                class="text-subtitle-2 text-grey-lighten-1 mb-1 ml-1 text-uppercase font-weight-bold"
              >
                City
              </div>
              <v-text-field
                v-model="researchForm.city"
                placeholder="Paris"
                variant="solo-filled"
                bg-color="#327244"
                flat
                hide-details
                rounded="lg"
                prepend-inner-icon="mdi-map-marker"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="2">
              <div
                class="text-subtitle-2 text-grey-lighten-1 mb-1 ml-1 text-uppercase font-weight-bold"
              >
                Passenger
              </div>
              <v-text-field
                v-model="researchForm.passenger"
                type="number"
                min="1"
                max="10"
                variant="solo-filled"
                bg-color="#327244"
                flat
                hide-details
                rounded="lg"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="5">
              <div
                class="text-subtitle-2 text-grey-lighten-1 mb-1 ml-1 text-uppercase font-weight-bold text-center"
              >
                Dates
              </div>
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model="researchForm.startDate"
                    label="Departure"
                    type="date"
                    variant="solo-filled"
                    bg-color="#327244"
                    flat
                    hide-details
                    rounded="lg"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="researchForm.endDate"
                    label="Return"
                    type="date"
                    variant="solo-filled"
                    bg-color="#327244"
                    flat
                    hide-details
                    rounded="lg"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="center" class="mt-6">
            <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
              <v-btn
                color="white"
                class="text-green-darken-4 font-weight-bold text-h6"
                height="56"
                width="100%"
                rounded="xl"
                prepend-icon="mdi-magnify"
                @click="handleSubmitForm"
              >
                Start search
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<style scoped>
/* MOBILE: Force circle shape (< 600px) */
@media (max-width: 600px) {
  .search-btn {
    min-width: 48px !important;
    width: 48px !important;
    padding: 0 !important;
    border-radius: 50% !important; /* Overrides rounded="pill" */
  }
}

/* DESKTOP: Ensure proper spacing when text is visible (>= 600px) */
@media (min-width: 600px) {
  .search-btn {
    padding-left: 20px !important;
    padding-right: 24px !important;
  }
}
</style>
