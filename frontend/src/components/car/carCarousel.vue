<script setup>
import {onBeforeMount, onMounted, ref} from 'vue';
import CarBigInfo from "@/components/car/carBigInfo.vue";
import { useApi } from '@/services/api/useApi.js'
const {loading, error, get} = useApi()

let cars = ref(null);
let carsImage = ref([]);
let indexCarousel = ref(0);


onBeforeMount(async () => {
  await fetchCars();
  await fetchCarImages();
})


const fetchCars = async () => {
  try {
    cars.value = await get('http://localhost:3000/api/cars',
    {
      params: {
        index: 0,
        limit: 10,
      }
    });
    console.log(cars.value);

  }catch (error) {
    console.log(error);
  }
}

const fetchCarImages = async () => {
  try {
    console.log(carsImage.value);
    for(let i = 1; i < cars.value.data.length; i++){
      const res = await get(`http://localhost:3000/api/car/${i}/images`)
      if (res.data.length > 0){
        res.data.forEach(element => {
          if (element.Is_Primary){
            carsImage.value.push(element.Image_Path)
          }
        })
      }else{
        carsImage.value.push(undefined)
      }
    }
  }catch (error) {
    console.log(error);
  }
}

</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error || cars === null">Error: {{ error }}</div>
  <div v-else>


  <div class="carousel-container">

    <button class="direction-carousel" @click="indexCarousel = (indexCarousel - 1 + cars.data.length) % cars.data.length ">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
      </svg>
    </button>


    <div class="car-carousel">

        <car-big-info class="banner-car-carousel" :car="cars.data[(indexCarousel - 1 + cars.data.length) % cars.data.length]" :image="carsImage[(indexCarousel - 1 + cars.data.length) % cars.data.length]"/>
        <car-big-info class="banner-car-carousel" :car="cars.data[indexCarousel]" :image="carsImage[indexCarousel]"/>
        <car-big-info class="banner-car-carousel" :car="cars.data[(indexCarousel + 1) % cars.data.length]" :image="carsImage[(indexCarousel + 1) % cars.data.length]"/>

    </div>

    <button class="direction-carousel" @click="indexCarousel = (indexCarousel + 1) % cars.data.length">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
      </svg>
    </button>

  </div>
  <div class="length-car-carousel">
    <svg v-for="(dot, index) in cars.data.length" :key="index" :class="{dotIndex : indexCarousel ===index }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle fill="current-color" cx="8" cy="8" r="8"/>
    </svg>

  </div>
  </div>


</template>

<style scoped>

.carousel-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}


.car-carousel {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }

.length-car-carousel{
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
}


.dotIndex{
  fill: #F4F4F4;
}
</style>
