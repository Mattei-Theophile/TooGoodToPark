<template>
  <button class="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg">
    <slot />
  </button>
</template>

<script setup>
// Pas de logique, juste un bouton stylisé
</script>

<style scoped>
button:active {
  opacity: 0.8;
}
</style>
