<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
</script>

<template>
  <v-btn
    variant="outlined"
    color="error"
    prepend-icon="mdi-logout"
    @click="userStore.logout()"
    class="text-none font-weight-bold"
  >
    Log out
  </v-btn>
</template>

<style scoped></style>
