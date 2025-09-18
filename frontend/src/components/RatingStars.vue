<script setup>
defineProps({
  rating: { type: Number, required: true },
  reviews: { type: Number, default: 0 }
})
</script>

<template>
  <div class="flex items-center gap-1">
    <span
        v-for="n in 5"
        :key="n"
        class="text-xl"
        :class="n <= rating ? 'text-green-600' : 'text-gray-300'"
    >
      ★
    </span>
    <span class="text-sm text-gray-600 ml-2">{{ reviews }} reviews</span>
  </div>
</template>

<style scoped>


</style>