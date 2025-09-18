<script setup lang="ts">

</script>

<template>
  <template>
    <div class="flex items-center gap-2 border rounded-lg p-2 bg-white">
      <input
          type="text"
          v-model="query"
          placeholder="Search for an ad..."
          class="flex-1 outline-none text-sm"
      />
      <button class="bg-green-700 text-white p-2 rounded-lg flex items-center justify-center">
        🔍
      </button>
    </div>
  </template>

</template>

<style scoped>

</style>