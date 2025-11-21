<script setup>
import { ref, computed, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Review } from '@/services/review.js'

const props = defineProps({
  ID_Car: {
    type: String,
    required: true,
  },
})

const addReviewBox = ref(false)
const target = useTemplateRef < HTMLElement > 'commentary-form'

const review = ref(null)
review.value = new Review()
review.value.car.initById(props.ID_Car)

// This stores the temporary hover state
const hoverRating = ref(0)
// review.value.rating now stores the *actual* clicked rating

// The rating to display is the hover value, or (if not hovering) the clicked value.
const displayRating = computed(() => {
  return hoverRating.value || review.value.rating
})

// setRating permanently sets the *actual* rating
function setRating(rating) {
  review.value.rating = rating
}

// setHoverRating temporarily sets the *hover* rating
function setHoverRating(rating) {
  hoverRating.value = rating
}

// When the mouse leaves, reset the *hover* rating to 0
function resetHoverRating() {
  hoverRating.value = 0
}

const launchCreateCommentary = async () => {
  console.log(review.value.rating)
  console.log(review.value.commentary)
  const res = await review.value.createReview()
  console.log(res)
}
</script>

<template>
  <div class="add-commentary-container">
    <button class="add-commentary-button" @click="addReviewBox = !addReviewBox">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-plus"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
        />
      </svg>
    </button>

    <div v-if="addReviewBox" class="add-commentary-box">
      <form @submit.prevent="launchCreateCommentary">
        <label for="commentary-rating">Rating</label>

        <div class="star-rating" @mouseleave="resetHoverRating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= displayRating }"
            @mouseover="setHoverRating(star)"
            @click="setRating(star)"
          >
            ★
          </span>
        </div>

        <label for="commentary-text">Comment</label>
        <input v-model="review.commentary" type="text" id="commentary-text" />

        <button type="submit">create the review</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-commentary-box {
  position: absolute;
}

.star-rating {
  display: inline-block;
}

.star {
  font-size: 2.5rem; /* Adjust size as needed */
  color: #ccc; /* Empty star color */
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

/* This class is added dynamically */
.star.filled {
  color: #fdd835; /* Filled star color (gold) */
}
</style>
