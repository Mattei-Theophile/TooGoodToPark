<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import Logout from '@/components/core/authentification/Logout.vue'
import logo from '@/assets/logo_TGTP_white.png'
import { useRouter } from 'vue-router'
const router = useRouter()

import { useDisplay } from 'vuetify'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const internalDrawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { mobile } = useDisplay()
</script>

<template>
  <v-navigation-drawer v-model="internalDrawer" color="white" class="rounded-e-xl" elevation="2">
    <div
      @click="$router.push('/')"
      class="d-flex align-center pa-4"
      style="background-color: #216c37; color: white"
    >
      <v-img :src="logo" alt="TooGoodToPark Logo" width="40" height="40" class="mr-3"></v-img>
      <h3 class="text-h6 font-weight-bold mb-0">TooGood<br />ToPark</h3>
    </div>

    <v-divider></v-divider>

    <v-list nav class="mt-2">
      <v-list-item
        to="/account"
        prepend-icon="mdi-account"
        title="My account"
        active-color="primary"
      ></v-list-item>

      <v-list-item
        to="/account/reservations"
        prepend-icon="mdi-calendar-check"
        title="My reservations"
        active-color="primary"
      ></v-list-item>

      <v-list-item
        to="/account/cars"
        prepend-icon="mdi-car"
        title="My cars"
        active-color="primary"
      ></v-list-item>
    </v-list>

    <v-divider class="my-2"></v-divider>

    <v-list nav>
      <v-list-item to="/account/settings" prepend-icon="mdi-cog" title="Settings"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <logout />
      </div>
    </template>
  </v-navigation-drawer>
</template>
