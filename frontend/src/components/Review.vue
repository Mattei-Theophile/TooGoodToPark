<script setup>

import Commentary from "@/components/commentary.vue";
import {useApi} from '@/services/api/useApi.js'
import {onBeforeMount,onMounted, ref} from "vue";

const {loading, error, get} = useApi()

const reviews = ref(null);
const props = defineProps({
  ID_Car:String,
})

onMounted(() => {
  fetchReviews()
})

const fetchReviews = async () => {

  try {
    reviews.value = await get(`http://localhost:3000/api/cars/${props.ID_Car}/reviews`);
    console.log(reviews.value);
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>

  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error || reviews === null">Error: {{ error }}</div>
    <div v-else>

      <div class="review-container">
        <h2> {{reviews.data.stats.averageRating}}</h2>
        <div class="details-review-container">
          <div class="score-review-container">
            <svg v-for=" i in 5" :class="{validStar: i <= reviews.data.stats.averageRating }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill nonValidStar" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>


          <p> {{reviews.data.reviews.length}} reviews</p>
        </div>

      </div>

      <div class="commentaries-container">
        <commentary v-for="commentary in reviews.data.reviews" :name="commentary.reviewer.lastName" :date="commentary.createdAt" :commentary="commentary.comment" />
      </div>

    </div>
  </div>
</template>

<style scoped>
.review-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color:#F4F4F4;
  border-radius: 10px;
  padding: 0 2rem;
  margin: 0 2rem;
  h2{
    font-weight: 700;
    font-size: 3rem;
  }

  .details-review-container{
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;
    font-size: 1.2rem;
    margin: 1rem 0;
    .score-review-container{
      display: flex;
      gap: 2rem;
      svg{
        width: 40px;
        height: 40px;
      }
    }
  }

}

.nonValidStar{
  color: gray;
}

.validStar{
  color: green;
}

.commentaries-container{
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin: 1rem 0;
}
</style>
