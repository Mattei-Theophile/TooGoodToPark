<script setup>
import { onBeforeMount, ref } from 'vue'
import { Cars } from '@/services/Cars'
import { useRouter } from 'vue-router'
import SearchCarFilter from '@/components/SearchCarFilter.vue'
import ReservationInfo from '@/components/car/reservationInfo.vue'
import CarBigInfo from '@/components/car/carBigInfo.vue'

const router = useRouter()
const { city, startDate, endDate } = router.currentRoute.value.query

const isLoading = ref(true)

// This will hold the list of cars after filtering
const filteredCars = ref([])

const cars = ref(null)
cars.value = new Cars()

onBeforeMount(async () => {
  try {
    await cars.value.fetchCarAvailable(startDate, endDate)
    filteredCars.value = cars.value.centralizedCars

    isLoading.value = false
  } catch (error) {
    console.error(error)
  }
})

const handleFilterUpdate = (updatedCars) => {
  filteredCars.value = updatedCars
}
</script>

<template>
  <div v-if="isLoading" class="loading">Loading cars...</div>
  <div v-else>
    <div class="description-car">
      <div class="description-car-container">
        <div class="header-description-car">
          <h3 class="city-search">
            {{ city }}
          </h3>
          <div class="dates-search">
            <p>{{ startDate }}</p>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            </p>
            <p>{{ endDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <p>{{ cars.centralizedCars.length }} search results</p>
      <div class="settings-search-container">
        <div class="filters-container">
          <div class="tag-filter-container">
            <search-car-filter
              :cars="cars.centralizedCars"
              @update:filteredCars="handleFilterUpdate"
            />
          </div>
        </div>

        <!-- Display the cars here using filteredCars -->
        <div class="result-car-search-container">
          <div v-if="filteredCars.length > 0">
            <div class="car-card">
              <car-big-info :car="car" v-for="car in filteredCars" :key="car.id" />
            </div>
          </div>
          <div v-else>
            <p>No cars found matching your criteria.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dates-search {
  display: flex;
  flex-direction: row;
  p {
    margin: 0 0.5rem;
  }
}

.description-car {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 2px solid #dcdcdc;

  .return-button {
    background-color: #f4f4f4;
    border-radius: 10px;
    padding: 0 1rem;
  }
}

.description-car-container {
  display: flex;
  flex-direction: row;
  width: 90%;
  gap: 1rem;
}
.header-description-car {
  display: flex;
  flex-direction: column;

  padding: 0;

  .city-search {
    margin: 0;
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.settings-search-container {
  padding: 1rem 0;
  .result-search {
    padding: 1rem 0;
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.result-car-search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
</style>
