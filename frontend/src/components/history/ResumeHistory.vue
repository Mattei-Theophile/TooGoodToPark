<script setup>

import CarSmallInfo from "@/components/car/carSmallInfo.vue";

import {useApi} from '@/services/api/useApi.js'
import {onBeforeMount, ref} from "vue";
import {isLoggedIn} from "@/services/Auth/auth.js";
const {loading, error, get} = useApi()

const history = ref(null);

onBeforeMount(() => {
  if(isLoggedIn()){
    fetchHistory()
  } else {
    console.log("not logged in")
  }
})

const fetchHistory = async () => {
  try {
    history.value = await get(`http://localhost:3000/api/cars/myreservations`,{
      query:{
        limit:3
      }
    });
    console.log(history.value);
  }catch (error) {
    console.log(error);
  }
}

</script>

<template>

  <div v-if="!isLoggedIn()">
    <p>You must be logged in to see your history</p>
    <button>
      <router-link to="/login">Log in !</router-link>
    </button>
  </div>
  <div v-else>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error"> Error : {{error}}</div>
    <div v-else>
      <car-small-info v-for="reservation in history.data.reservations" :car="reservation.car" :startDate="reservation.startDate" :endDate="reservation.endDate"/>

      <router-link to="/history" class="see-all-history">
        See all history
      </router-link>

    </div>
  </div>




</template>

<style scoped>


.see-all-history{
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:#000000;
  border-radius: 10px;
  padding: 0.5rem 5rem;
  color:#FFFFFF;
  font-size: 1.2rem;


}
</style>
