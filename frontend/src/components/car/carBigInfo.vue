<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
  car: Object,
  image : String
})

</script>

<template>
  <div class="information-car">
    <img @click="router.push({path:'announce', query:{id:`${props.car.ID_Car}`}})" class="image-car" :src="props.image" alt="rental car">
    <div class="description-car">
      <div class="header-description-car">
        <h3 class="name-car">
          {{props.car.Name_Car}}
        </h3>
        <p class="location-car">  {{props.car.Kilometrage_Car}}</p>
      </div>

      <p class="price-car"> <span>{{props.car.Prix_Car}}€</span>/day</p>

    </div>

  </div>
</template>

<style scoped>

.image-car{
  width: 288px;
  height: 154px;
  border-radius: 10px;
}
.description-car{
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.header-description-car{
  display: flex;
  flex-direction: column;
  padding: 0;

  .name-car{
    margin: 0;
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

</style>
