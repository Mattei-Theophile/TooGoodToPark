<script setup lang="ts">
import Commentary from '@/components/commentary/commentary.vue'
import AddCommentary from '@/components/commentary/addCommentary.vue'
import { onMounted, ref } from 'vue'
import { Reviews } from '@/services/reviews.js'

const props = defineProps({
  ID_Car: String,
})

const isLoading = ref(true)
const reviews = ref(new Reviews())

const loadReview = async () => {
  isLoading.value = true
  try {
    await reviews.value.fetchReviewsByCar(props.ID_Car)
    if (reviews.value.centralizedReviews.length === 0) reviews.value.averageRating = 0
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadReview()
})
</script>

<template>
  <div class="d-flex flex-column fill-height">
    <div v-if="isLoading" class="d-flex justify-center align-center py-10">
      <v-progress-circular indeterminate color="#216c37" size="64"></v-progress-circular>
    </div>

    <div v-else>
      <v-card
        color="grey-lighten-4"
        flat
        rounded="lg"
        class="d-flex align-center justify-space-between px-6 py-4 mx-2"
      >
        <div class="text-h3 font-weight-bold text-grey-darken-3">
          {{ reviews.averageRating }} <span class="text-h5 text-grey">/ 5</span>
        </div>

        <div class="d-flex flex-column align-end">
          <v-rating
            :model-value="reviews.averageRating"
            readonly
            half-increments
            color="#216c37"
            active-color="#216c37"
            density="compact"
            size="small"
          ></v-rating>
          <span class="text-body-2 text-grey-darken-1 mt-1">
            {{ reviews.centralizedReviews.length }} reviews
          </span>
        </div>
      </v-card>

      <div class="mx-2">
        <add-commentary :ID_Car="props.ID_Car" />
      </div>

      <div class="d-flex flex-column gap-4 mx-2 mt-4">
        <commentary
          v-for="(commentary, index) in reviews.centralizedReviews"
          :key="commentary.id || index"
          :name="commentary.lastName + ' ' + commentary.firstName"
          :date="commentary.date"
          :commentary="commentary.commentary"
        />

        <v-alert
          v-if="reviews.centralizedReviews.length === 0"
          type="info"
          variant="tonal"
          color="#216c37"
          class="mt-4"
        >
          No reviews yet. Be the first to share your experience!
        </v-alert>
      </div>
    </div>
  </div>
</template>
