<script setup lang="ts">
import { settingsStore } from '@/stores/SettingsStore'

const settings = settingsStore()
// Ensure theme defaults are set if needed
settings.theme = 'light'

const links = [
  { title: 'Home', url: '/' },
  { title: 'Search', url: '/search' },
  { title: 'My Account', url: '/account' },
]

const legals = [
  { title: 'Terms of Service', url: '#' },
  { title: 'Privacy Policy', url: '#' },
  { title: 'Cookie Policy', url: '#' },
]
</script>

<template>
  <v-footer color="#1F2937" class="text-white d-flex flex-column py-10">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <h3 class="text-h5 font-weight-bold mb-4 text-green-lighten-1">TooGoodToPark</h3>
          <p class="text-body-2 text-grey-lighten-1" style="max-width: 300px">
            The smarter way to rent vehicles. Sustainable, affordable, and accessible wherever you
            are.
          </p>
        </v-col>

        <v-col cols="6" md="2">
          <h4 class="text-subtitle-1 font-weight-bold mb-3">Explore</h4>
          <ul class="list-none pa-0">
            <li v-for="link in links" :key="link.title" class="mb-2">
              <router-link
                :to="link.url"
                class="text-grey-lighten-2 text-decoration-none hover-link"
              >
                {{ link.title }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <v-col cols="6" md="2">
          <h4 class="text-subtitle-1 font-weight-bold mb-3">Legal</h4>
          <ul class="list-none pa-0">
            <li v-for="item in legals" :key="item.title" class="mb-2">
              <a :href="item.url" class="text-grey-lighten-2 text-decoration-none hover-link">
                {{ item.title }}
              </a>
            </li>
          </ul>
        </v-col>

        <v-col cols="12" md="4" class="text-md-end">
          <v-btn icon variant="text" class="text-grey-lighten-1"
            ><v-icon>mdi-facebook</v-icon></v-btn
          >
          <v-btn icon variant="text" class="text-grey-lighten-1"
            ><v-icon>mdi-twitter</v-icon></v-btn
          >
          <v-btn icon variant="text" class="text-grey-lighten-1"
            ><v-icon>mdi-instagram</v-icon></v-btn
          >
          <div class="mt-4 text-caption text-grey">
            &copy; {{ new Date().getFullYear() }} TooGoodToPark Inc.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.hover-link:hover {
  color: #4ade80 !important; /* Green lighten-1 */
  text-decoration: underline;
}
.list-none {
  list-style: none;
}
</style>
