<script setup lang="ts">
import ResumeHistory from '@/components/history/ResumeHistory.vue'
import CarCarousel from '@/components/car/carCarousel.vue'
</script>

<template>
  <div class="home-view">
    <section>
      <car-carousel />
    </section>

    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="history-wrapper">
            <h2 class="text-h5 font-weight-bold">Rental history</h2>
            <ResumeHistory :default-limit-show="3" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.home-view {
  padding-bottom: 100px; /* Space for bottom nav on mobile */
}

@media (min-width: 960px) {
  .home-view {
    padding-bottom: 0;
  }
}
</style>
