<script setup lang="ts">
import {settingsStore} from '@/stores/SettingsStore'

const settings = settingsStore()

settings.theme = 'light';
</script>

<template>
  <h2> Footer</h2>
  <p> theme : {{settings.theme}}</p>
</template>

<style scoped>

</style>