<script setup lang="js">

defineProps({
  author: String,
  date: String,
  comment: String
})
</script>

<template>
  <div class="border-b border-gray-200 pb-3 mb-3">
    <div class="flex justify-between items-center mb-1">
      <p class="font-semibold">{{ author }}</p>
      <span class="text-sm text-gray-500">{{ date }}</span>
    </div>
    <p class="text-gray-700 text-sm">{{ comment }}</p>
  </div>
</template>

<style scoped>

</style>