<script setup>
import {ref} from "vue";
import CarBigInfo from "@/components/car/carBigInfo.vue";
import { useApi } from "@/services/api/useApi";
const {loading, error, get} = useApi();
import {useRouter} from "vue-router";
import {onBeforeMount} from "vue";

const router = useRouter();
const {city, startDate, endDate} = router.currentRoute.value.query;

let cars = ref(null)

onBeforeMount(() => {
  fetchCars()
})

const fetchCars = async () => {
  try{
    cars.value = await get("http://localhost:3000/api/cars/available", {
      params: {
        startDate : startDate,
        endDate: endDate,
      }
    } );
    console.log(cars)

  }catch (error) {
    console.log(error)
  }
}



</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error || cars ===null">Error: {{ error }}</div>
  <div v-else>

<<div class="description-car">
  <button class="return-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
    </svg>
  </button>
  <div class="description-car-container" >
    <div class="header-description-car">
      <h3 class="city-search">
        {{city}}
      </h3>
      <div class="dates-search">
        <p>{{startDate}} </p>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
          </svg>
        </p>
        <p>{{endDate}}</p>
      </div>
    </div>

  </div>

</div>

  <div>
    <div class="settings-search-container">
      <p class="result-search"> {{cars.data.length}} search results</p>
      <div class="filters-container">
        <div class="tag-filter-container">
          <button class="button-filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </button>
          <p class="name-filter"> Distance</p>
        </div>

        <button class="range-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-sort-down" viewBox="0 0 16 16">
            <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
          </svg>
        </button>

      </div>
    </div>
    <div class="result-car-search-container">
      <car-big-info class="banner-car-carousel" v-for="car in cars.data" :key="car.name" :car="car"/>

    </div>

  </div>
  </div>
</template>

<style scoped>



.dates-search{
  display: flex;
  flex-direction: row;
  p{
      margin: 0 0.5rem ;
  }
}


.description-car{
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 2px solid #DCDCDC;

  .return-button{
    background-color: #F4F4F4;
    border-radius: 10px;
    padding: 0 1rem;
  }
}

.description-car-container{
  display: flex;
  flex-direction: row;
  width: 90%;
  gap: 1rem;
}
.header-description-car{
  display: flex;
  flex-direction: column;

  padding: 0;

  .city-search{
    margin: 0;
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.settings-search-container{
  padding: 1rem 0;
  .result-search{
    padding: 1rem 0;
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.filters-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tag-filter-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
  background-color: #F4F4F4;
  border-radius: 10px;
  font-size: 1.2rem;
}

.result-car-search-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
</style>
