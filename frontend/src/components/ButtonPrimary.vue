<script setup lang="ts">

</script>

<template>
  <button class="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg">
    <slot />
  </button>
</template>

<style scoped>
button:active {
  opacity: 0.8;
}
</style>