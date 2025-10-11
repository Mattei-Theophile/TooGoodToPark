<script setup>

import {ref} from "vue";
let selectedImageCard = ref(0)

const carForm = ref({
  brand:"",
  model:"",
  licensePlate:"",
  images:[]
});

</script>

<template>
    <h2> Edit your ad </h2>
  <form ref="carForm">
    <label> Brand </label>
    <input type="text" placeholder="Mercedes">

    <label> Model </label>
    <input type="text" placeholder="C-Class">

    <label> License plate</label>
    <div>
      <input type="text" placeholder="AB-123-cd">
    </div>
  </form>

  <div>
    <img class="show-image-car" :src="carForm.images[selectedImageCard]" alt=""/>
  </div>
  <div class="images-car-carousel-container">
    <button v-for="(image, index) in carForm.images" :key="index" :class="{selectedImageCar: selectedImageCard === index }"  @click="() => { selectedImageCard = index}">
      <img class="image-car" :src="image" alt=""/>
    </button>
  </div>
  <button> Add a picture </button>

  <button> Save the details </button>
</template>

<style scoped>

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
</style>
