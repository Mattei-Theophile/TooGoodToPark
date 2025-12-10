<script setup lang="ts">
import { ref } from 'vue'
import { Review } from '@/services/review.js'

const props = defineProps({
  ID_Car: {
    type: String,
    required: true,
  },
})

const addReviewBox = ref(false)
const review = ref(new Review())

// Initialize with car ID
review.value.car.initById(props.ID_Car)
// Initialize rating to 0 ensures v-rating works correctly
review.value.rating = 0

const launchCreateCommentary = async () => {
  if (!review.value.rating || !review.value.commentary) {
    // Basic validation feedback could go here
    return
  }

  const res = await review.value.createReview()
  console.log(res)

  // Optional: Reset form and close box on success
  addReviewBox.value = false
  review.value.commentary = ''
  review.value.rating = 0
}
</script>

<template>
  <div class="d-flex flex-column align-end my-4">
    <v-btn
      color="#216c37"
      theme="dark"
      prepend-icon="mdi-plus"
      @click="addReviewBox = !addReviewBox"
      rounded="lg"
      elevation="2"
    >
      Add a commentary
    </v-btn>

    <v-expand-transition>
      <v-card v-if="addReviewBox" width="100%" class="mt-4 pa-4" elevation="2" rounded="lg" border>
        <div class="d-flex flex-column gap-2">
          <div class="d-flex flex-column mb-2">
            <label class="text-subtitle-1 font-weight-medium mb-1">Rating</label>
            <v-rating
              v-model="review.rating"
              hover
              color="amber-darken-2"
              active-color="amber-warning"
              density="comfortable"
              size="large"
            ></v-rating>
          </div>

          <v-textarea
            v-model="review.commentary"
            label="Your Comment"
            variant="outlined"
            color="#216c37"
            rows="3"
            auto-grow
            hide-details="auto"
            class="mb-4"
          ></v-textarea>

          <v-btn
            block
            color="#216c37"
            theme="dark"
            size="large"
            @click="launchCreateCommentary"
            :disabled="!review.rating"
          >
            Create Review
          </v-btn>
        </div>
      </v-card>
    </v-expand-transition>
  </div>
</template>
