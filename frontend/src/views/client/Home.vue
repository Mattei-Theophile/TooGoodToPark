<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import ResumeHistory from '@/components/history/ResumeHistory.vue'
import CarCarousel from '@/components/car/carCarousel.vue'
</script>

<template>
  <h2>Novelty</h2>
  <car-carousel />

  <h2>Rental history</h2>
  <ResumeHistory :default-limit-show="1" />
  <search-bar />
</template>

<style scoped>
h2 {
  font-size: 2rem;
  font-weight: 600;
}
</style>
