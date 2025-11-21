<script setup>
import Commentary from '@/components/commentary.vue'
import { onBeforeMount, onMounted, ref, useTemplateRef } from 'vue'
import { Reviews } from '@/services/Reviews.js'
import AddCommentary from '@/components/commentary/addCommentary.vue'

const props = defineProps({
  ID_Car: String,
})

const isLoading = ref(true)
const reviews = ref(null)
reviews.value = new Reviews()
const loadReview = async () => {
  try {
    await reviews.value.fetchReviewsByCar(props.ID_Car)
    console.log(reviews.value)
    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = true
  }
}

onMounted(() => {
  loadReview()
})
</script>

<template>
  <div v-if="isLoading">loading reviews ...</div>
  <div v-else>
    <div class="review-container">
      <h2>{{ reviews.averageRating }}</h2>
      <div class="details-review-container">
        <div class="score-review-container">
          <svg
            v-for="i in 5"
            :class="{ validStar: i <= reviews.averageRating }"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-star-fill nonValidStar"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
        </div>

        <p>{{ reviews.centralizedReviews.length }} reviews</p>
      </div>
      <add-commentary :ID_Car="props.ID_Car" />
    </div>

    <div class="commentaries-container">
      <commentary
        v-for="commentary in reviews.centralizedReviews"
        :name="commentary.lastName + ' ' + commentary.firstName"
        :date="new Date(commentary.date).toLocaleDateString()"
        :commentary="commentary.commentary"
      />
    </div>
  </div>
</template>

<style scoped>
.review-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 0 2rem;
  margin: 0 2rem;
  h2 {
    font-weight: 700;
    font-size: 3rem;
  }

  .details-review-container {
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;
    font-size: 1.2rem;
    margin: 1rem 0;
    .score-review-container {
      display: flex;
      gap: 2rem;
      svg {
        width: 40px;
        height: 40px;
      }
    }
  }
}

.nonValidStar {
  color: gray;
}

.validStar {
  color: green;
}

.commentaries-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin: 1rem 0;
}
</style>
