<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2">
    <button
      v-for="item in items"
      :key="item.label"
      class="flex flex-col items-center text-sm"
      :class="item.active ? 'text-green-700' : 'text-gray-500'"
    >
      <span class="text-lg">{{ item.icon }}</span>
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [
      { label: 'Home', icon: '🏠', active: true },
      { label: 'History', icon: '📑', active: false }
    ]
  }
})
</script>
