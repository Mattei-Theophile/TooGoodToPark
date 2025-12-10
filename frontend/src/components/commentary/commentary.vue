<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  name: String,
  commentary: String,
  date: String,
})
</script>

<template>
  <v-card class="mb-4" elevation="2" rounded="lg" border>
    <v-sheet color="#216c37" class="px-4 py-3 d-flex justify-space-between align-center text-white">
      <span class="text-subtitle-1 font-weight-bold">{{ props.name }}</span>
      <span class="text-caption font-weight-medium opacity-80">
        {{ new Date(props.date).toLocaleDateString() }}
      </span>
    </v-sheet>

    <v-card-text class="pt-4 text-body-1">
      {{ props.commentary }}
    </v-card-text>
  </v-card>
</template>
