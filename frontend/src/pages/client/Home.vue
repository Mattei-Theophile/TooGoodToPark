<script setup lang="ts">
import BottomNav from "@/components/BottomNav.vue";
import ButtonPrimary from "@/components/ButtonPrimary.vue";
import CarCard from "@/components/CarCard.vue";
import History from "@/components/History.vue";
import RatingStars from "@/components/RatingStars.vue";
import RentalHistoryItem from "@/components/RentalHistoryItem.vue";
import ReviewItem from "@/components/ReviewItem.vue";
import SearchBar from "@/components/SearchBar.vue";
</script>

<template>
<p> Home2</p>

  <bottom-nav></bottom-nav>
  <button-primary></button-primary>
<car-card></car-card>
<history></history>
<rating-stars rating="3"></rating-stars>
<rental-history-item></rental-history-item>
<review-item></review-item>
<SearchBar></SearchBar>
</template>

<style scoped>

</style>