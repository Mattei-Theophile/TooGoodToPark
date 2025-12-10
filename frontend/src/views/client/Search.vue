<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SearchCarFilter from '@/components/SearchCarFilter.vue'
import CarBigInfo from '@/components/car/carBigInfo.vue'
import { Cars } from '@/services/Cars'

const router = useRouter()
let { city, startDate, endDate, passenger } = router.currentRoute.value.query

const isLoading = ref(true)
const filteredCars = ref([])
const startDateMenu = ref(false)
const endDateMenu = ref(false)

const cars = ref(new Cars())

// Form data refs
const searchCity = ref(city || '')
const searchPassenger = ref(passenger || 1)
const searchStartDate = ref(startDate || new Date().toISOString().split('T')[0])
const searchEndDate = ref(endDate || new Date().toISOString().split('T')[0])

// Watch for changes and update query params
watch([searchStartDate, searchEndDate, searchCity, searchPassenger], () => {
  startDate = searchStartDate.value
  endDate = searchEndDate.value
  city = searchCity.value
  passenger = searchPassenger.value
})

const handleFilterUpdate = (updatedCars) => {
  filteredCars.value = updatedCars
}

const toSqlDate = (isoDate) => {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

const performSearch = async () => {
  isLoading.value = true
  try {
    await cars.value.fetchCarAvailable(
      toSqlDate(searchStartDate.value),
      toSqlDate(searchEndDate.value),
      searchCity.value,
      searchPassenger.value,
    )
    filteredCars.value = cars.value.centralizedCars
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  try {
    const formattedStart = startDate ? toSqlDate(startDate) : toSqlDate(searchStartDate.value)
    const formattedEnd = endDate ? toSqlDate(endDate) : toSqlDate(searchEndDate.value)
    await cars.value.fetchCarAvailable(formattedStart, formattedEnd, city, passenger)
    filteredCars.value = cars.value.centralizedCars
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="search-page-wrapper bg-grey-lighten-4 fill-height">
    <v-sheet class="search-hero py-6 px-4 mb-6" elevation="1">
      <v-container>
        <v-card class="search-card mx-auto" elevation="0" border>
          <v-card-text class="pa-2">
            <v-row no-gutters align="center" class="search-grid">
              <v-col cols="12" md="3" class="search-col">
                <v-text-field
                  v-model="searchCity"
                  label="Location"
                  prepend-inner-icon="mdi-map-marker"
                  variant="plain"
                  hide-details
                  class="px-2"
                  placeholder="Where to?"
                />
              </v-col>

              <v-divider vertical class="d-none d-md-block my-2" />

              <v-col cols="6" md="3" class="search-col">
                <v-menu
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="searchStartDate"
                      label="Pick-up"
                      prepend-inner-icon="mdi-calendar-start"
                      type="date"
                      variant="plain"
                      hide-details
                      class="px-2"
                      v-bind="props"
                    />
                  </template>
                </v-menu>
              </v-col>

              <v-divider vertical class="d-none d-md-block my-2" />

              <v-col cols="6" md="3" class="search-col">
                <v-menu
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="searchEndDate"
                      label="Drop-off"
                      prepend-inner-icon="mdi-calendar-end"
                      type="date"
                      variant="plain"
                      hide-details
                      class="px-2"
                      v-bind="props"
                    />
                  </template>
                </v-menu>
              </v-col>

              <v-divider vertical class="d-none d-md-block my-2" />

              <v-col cols="12" md="3" class="d-flex align-center pl-md-2">
                <v-text-field
                  v-model.number="searchPassenger"
                  label="Guests"
                  type="number"
                  variant="plain"
                  hide-details
                  class="flex-grow-1 px-2"
                  min="1"
                />
                <v-btn
                  @click="performSearch"
                  color="green-darken-3"
                  height="48"
                  width="48"
                  icon
                  class="ml-2 mr-1 search-btn"
                  elevation="2"
                  :loading="isLoading"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-sheet>

    <v-container fluid class="px-md-8">
      <v-row v-if="isLoading" justify="center" class="mt-12">
        <v-col cols="auto" class="text-center">
          <v-progress-circular indeterminate color="green-darken-3" size="64" />
          <p class="text-h6 mt-4 text-grey-darken-1">Finding the best wheels for you...</p>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" md="3" lg="2">
          <v-card elevation="0" class="bg-transparent">
            <div class="d-flex align-center mb-4">
              <h2 class="text-h6 font-weight-bold">Filters</h2>
              <v-chip class="ml-auto" size="small" color="grey"
                >{{ filteredCars.length }} results</v-chip
              >
            </div>

            <search-car-filter
              :cars="cars.centralizedCars"
              @update:filteredCars="handleFilterUpdate"
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="9" lg="10">
          <div v-if="filteredCars.length > 0">
            <v-row>
              <v-col v-for="car in filteredCars" :key="car.id" cols="12">
                <car-big-info :car="car" />
              </v-col>
            </v-row>
          </div>

          <v-sheet
            v-else
            class="d-flex flex-column align-center justify-center py-12 text-center rounded-xl bg-white"
            elevation="1"
          >
            <v-icon size="80" color="grey-lighten-2">mdi-car-off</v-icon>
            <h3 class="text-h5 font-weight-bold mt-4 text-grey-darken-2">No cars found</h3>
            <p class="text-body-1 text-grey mb-6">
              Try changing your dates or removing some filters.
            </p>
            <v-btn color="green-darken-3" variant="flat" @click="performSearch">
              Refresh Search
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.search-hero {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.search-card {
  border-radius: 50px !important; /* Pill shape */
  background: #f5f5f5;
  transition: all 0.3s;
}
.search-card:focus-within {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  border-color: #216c37 !important;
}

.search-btn {
  border-radius: 50%;
}

@media (max-width: 960px) {
  .search-card {
    border-radius: 16px !important;
  }
  .search-grid > .v-col {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 8px;
    padding-top: 8px;
  }
  .search-grid > .v-col:last-child {
    border-bottom: none;
  }
}
</style>
