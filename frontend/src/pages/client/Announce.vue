<script setup lang="ts">

import Review from "@/components/Review.vue";
import {onMounted, ref} from "vue";
import {useApi} from "@/services/api/useApi"
import {useRouter} from "vue-router";
import {FunctionalCalendar} from "vue-functional-calendar";

const {loading, error, get} = useApi();

const router = useRouter();
const props = router.currentRoute.value.query;

const car = ref(null);
const carImages = ref(null);
let selectedImageCard = ref(0)
let calendarShow = ref(false);
let calendarData = ref({})

onMounted(() => {
  fetchCarsById()
  fetchCarImages()
})

const fetchCarsById = async () => {
  try {
    car.value = await get(`http://localhost:3000/api/car/${props.id}`);
    console.log(car.value)

    for (let elem in car.value.data[0]) {
      console.log(elem);
    }
  } catch (error) {
    console.log(error);
  }
}

const fetchCarImages = async () => {
  try {
    carImages.value = await get(`http://localhost:3000/api/car/${props.id}/images`);
    console.log(carImages.value)
  } catch (error) {
    console.log(error);
  }
}


</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error || car === null">Error: {{ error }}</div>
  <div v-else>

    <div class="car-container">

      <div class="description-car">
        <button class="return-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
          </svg>
        </button>
        <div class="description-car-container" >
          <div class="header-description-car">
            <h3 class="name-car">
              {{car.data.Name_Car}}
            </h3>
            <p class="location-car">  {{car.data.Kilometrage_Car}}</p>
          </div>

          <p class="price-car"> <span>{{car.data.Prix_Car}}€</span>/day</p>
        </div>

      </div>


      <div v-if="carImages">

          <div>
            <img class="show-image-car" :src="carImages.data[selectedImageCard].Image_Path" alt=""/>
          </div>
          <div class="images-car-carousel-container">
            <button v-for="(image, index) in carImages.data" :key="index" :class="{selectedImageCar: selectedImageCard === index }"  @click="() => { selectedImageCard = index}">
              <img class="image-car" :src="image.Image_Path" alt=""/>
            </button>

          </div>
      </div>


      <p> {{car.data.Description_Car}}</p>
    </div>
  </div>


  <div>

    <h2> Review and comments</h2>
    <review :ID_Car="props.id"/>
  </div>



  <div class="reservation-container">
    <button class="pay-button"> Reserve and pay </button>
    <button class="calender-button" @click="calendarShow = !calendarShow">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3" viewBox="0 0 16 16">
        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"/>
        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
      </svg>
    </button>
    <div>

    </div>

  </div>

</template>

<style scoped>

.car-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;

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
  justify-content: space-between;
  width: 90%;
  gap: 1rem;
}
.header-description-car{
  display: flex;
  flex-direction: column;

  padding: 0;

  .name-car{
    margin: 0;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .location-car{
    margin: 0;
    color: gray;
  }

}

.price-car{
  color: gray;
  span{
    font-weight: bold;
    font-size: 1.7rem;
    color: black;
  }
}

.images-car-carousel-container{

  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;

  .image-car{
    width: 83px;
    height: 51px;
    border-radius: 10px;
  }
}
.selectedImageCar{
  filter: brightness(30%);

}

.show-image-car{
  width: 70%;
  height: 300px;
  border-radius: 10px;
}

.reservation-container{
  display: flex;
  align-items: center;
  gap: 0.5rem;
  .pay-button{
    background-color: #000000;
    color: #FFFFFF;
    border-radius: 10px;
    padding: 1rem 5rem;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: end;
  }

  .calender-button{
    padding: 1rem;
    background-color: #DCDCDC;
    border-radius: 10px;
  }
}

</style>
