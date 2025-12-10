<script setup lang="ts"></script>

<template>
  <v-bottom-navigation app grow color="primary" class="d-md-none" height="80">
    <v-btn to="/">
      <v-icon size="x-large" class="mb-1">mdi-home</v-icon>
      <span class="text-body-1">Home</span>
    </v-btn>

    <v-btn to="/account/reservations">
      <v-icon size="x-large" class="mb-1">mdi-history</v-icon>
      <span class="text-body-1">History</span>
    </v-btn>

    <v-btn to="/account">
      <v-icon size="x-large" class="mb-1">mdi-account</v-icon>
      <span class="text-body-1">Account</span>
    </v-btn>
  </v-bottom-navigation>
</template>
