<script setup lang="ts">

import SearchBar from "@/components/SearchBar.vue";
import ResumeHistory from "@/components/history/ResumeHistory.vue";
import CarCarousel from "@/components/car/carCarousel.vue";
</script>

<template>

  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
    </svg>
    <p> Rent </p>
  </div>

  <h2>Novelty</h2>
  <car-carousel />

  <h2> Rental history</h2>
  <ResumeHistory />
  <search-bar />

</template>

<style scoped>
h2{
  font-size: 2rem;
  font-weight: 600;
}


</style>
