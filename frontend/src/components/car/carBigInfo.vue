<script setup lang="ts">
import { defineProps, computed, onMounted } from 'vue'

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
})
console.log(props.car)

// Compute the main image safely
const mainCarImage = computed(() => {
  if (!props.car?.images?.length) return null
  return props.car.images[0]
})

const rating = computed(() => {
  return props.car?.rating || 0
})

const availabilityColor = computed(() => {
  console.log(props.car)
  return props.car?.status ? 'success' : 'error'
})

const carFeatures = computed(() => {
  if (!props.car) return []
  return [
    { icon: 'mdi-calendar', text: props.car.year || 'N/A' },
    { icon: 'mdi-speedometer', text: `${props.car.mileage || 0} km` },
    { icon: 'mdi-account-multiple', text: `${props.car.passenger || 4} seats` },
    { icon: 'mdi-fuel', text: props.car.fuelType || 'Gasoline' },
  ]
})

onMounted(() => {})
</script>

<template>
  <v-skeleton-loader
    v-if="!props.car || !props.car.id"
    type="image, article"
    class="mb-4 rounded-lg"
    height="220"
  />

  <v-card
    v-else
    elevation="3"
    class="car-card"
    hover
    @click="$router.push(`announce/${props.car.id}`)"
  >
    <v-row no-gutters>
      <v-col cols="12" md="4" class="position-relative">
        <div class="image-wrapper">
          <v-img
            :key="mainCarImage"
            :src="mainCarImage || ''"
            :lazy-src="mainCarImage || ''"
            :alt="`${props.car.brand} ${props.car.model}`"
            height="100%"
            min-height="220"
            cover
            class="car-image"
          >
            <template v-slot:error>
              <div
                class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-4"
              >
                <v-icon icon="mdi-car" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
                <span class="text-caption text-grey">No Image Available</span>
              </div>
            </template>
          </v-img>

          <v-chip
            :color="availabilityColor"
            size="small"
            class="availability-badge"
            prepend-icon="mdi-check-circle"
            variant="flat"
            elevation="2"
          >
            {{ props.car?.status ? 'Available' : 'Booked' }}
          </v-chip>
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <v-card-text class="car-details d-flex flex-column h-100">
          <div class="d-flex justify-space-between align-start mb-2">
            <div>
              <h3 class="car-title text-truncate">{{ props.car.brand }} {{ props.car.model }}</h3>
              <div class="d-flex align-center mt-1 location-wrapper">
                <v-icon size="small" color="grey-darken-1" class="mr-1">mdi-map-marker</v-icon>
                <span class="text-grey-darken-1 text-body-2">
                  {{ props.car.location || 'Location not specified' }}
                </span>
              </div>
            </div>

            <div class="text-right">
              <div class="d-flex align-baseline justify-end">
                <span class="text-h5 font-weight-bold text-green-darken-3 mr-1"
                  >{{ props.car.price }}€</span
                >
                <span class="text-caption text-grey">/day</span>
              </div>
            </div>
          </div>

          <div class="d-flex align-center mb-4">
            <v-rating
              :model-value="rating"
              color="amber-darken-2"
              active-color="amber-darken-2"
              density="compact"
              size="small"
              half-increments
              readonly
            />
            <span class="text-grey-darken-1 ml-2 text-caption">
              {{ rating }} ({{ props.car.reviewCount || 0 }} reviews)
            </span>
          </div>

          <div class="features-container mb-4">
            <v-chip
              v-for="(feature, index) in carFeatures"
              :key="index"
              variant="tonal"
              size="small"
              class="feature-chip mr-2 mb-2"
              color="blue-grey-darken-1"
            >
              <v-icon start size="small" :icon="feature.icon" />
              {{ feature.text }}
            </v-chip>
          </div>

          <v-divider class="mb-3" />

          <p class="car-description text-body-2 text-grey-darken-2 flex-grow-1">
            {{ props.car.description || 'No description available for this vehicle.' }}
          </p>

          <div class="d-flex justify-end mt-2">
            <v-btn
              color="green-darken-3"
              variant="text"
              append-icon="mdi-arrow-right"
              class="px-0 font-weight-bold"
              @click.stop="$router.push(`announce/${props.car.id}`)"
            >
              View Details
            </v-btn>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.car-card {
  border-radius: 16px !important;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  margin-bottom: 1.5rem;
  background-color: white;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
}

.image-wrapper {
  height: 100%;
  min-height: 220px;
  background-color: #f5f5f5;
  display: flex;
}

/* Ensure image covers full height of the row on desktop */
.car-image {
  border-radius: 16px 0 0 16px;
}

.availability-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.car-details {
  padding: 1.5rem !important;
}

.car-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.car-description {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .car-image {
    border-radius: 16px 16px 0 0;
    min-height: 200px;
  }

  .image-wrapper {
    height: 200px;
  }
}
</style>
