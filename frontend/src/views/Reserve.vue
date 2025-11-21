<script setup>
import { onBeforeMount, ref, watch } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()
const res = ref(null)
import { useUserStore } from '@/stores/UserStore.js'
const userStore = useUserStore()

import Reservationcalendar from '@/components/calendar/reservationcalendar.vue'
const props = router.currentRoute.value.query

const userInformation = ref({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
})

const dateSelected = ref({
  start: props.departure ? props.departure : null,
  end: props.return ? props.return : null,
})

onBeforeMount(() => {
  if (userStore.isAuthenticated) {
    console.log('logged in')
  } else {
    console.log('not logged in')
    router.push('/login')
  }
})

const createReservation = async () => {}

watch(dateSelected, (newValue) => {})
</script>

<template>
  <div>
    <p>Reserve</p>

    <form>
      <label> Last Name</label>
      <input
        :name="userInformation.lastName"
        v-model="userInformation.lastName"
        type="text"
        placeholder="Doe"
      />

      <label> First Name</label>
      <input v-model="userInformation.firstName" type="text" placeholder="John" />
      <label> Email</label>
      <input
        v-model="userInformation.email"
        type="email"
        placeholder="moncompte@TooGoodToPark.com"
      />
      <label> Phone</label>
      <input v-model="userInformation.phone" type="tel" placeholder="0600000000" />

      <input type="submit" value="Reserve" @click="createReservation()" />
    </form>

    <reservationcalendar
      :ID_Car="props.id"
      :rangeDate="dateSelected"
      @date-selected="dateSelected"
    />
  </div>
</template>

<style scoped></style>
