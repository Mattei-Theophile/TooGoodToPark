<script setup lang="js">
defineProps({
  title: String,
  date: String,
  image: String
})
</script>

<template>
  <div class="flex items-center justify-between p-3 border rounded-lg mb-2 bg-white">
    <div class="flex items-center gap-3">
      <img :src="image" alt="car" class="w-12 h-12 rounded object-cover" />
      <div>
        <p class="font-semibold">{{ title }}</p>
        <p class="text-sm text-gray-500">{{ date }}</p>
      </div>
    </div>
    <button class="text-gray-500 text-lg">⋮</button>
  </div>
</template>

<style scoped>

</style>