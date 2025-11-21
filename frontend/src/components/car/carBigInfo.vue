<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  car: Object,
})
</script>

<template>
  <div class="information-car">
    <img
      @click="router.push({ path: 'announce', query: { id: `${props.car.id}` } })"
      class="image-car"
      :src="props.car.images[0]"
      alt="rental car"
    />
    <div class="description-car">
      <div class="header-description-car">
        <h3 class="name-car">
          {{ props.car.brand + props.car.model }}
        </h3>
        <p class="location-car">{{ props.car.mileage }}</p>
      </div>

      <p class="price-car">
        <span>{{ props.car.price }}€</span>/day
      </p>
    </div>
  </div>
</template>

<style scoped>
.image-car {
  width: 288px;
  height: 154px;
  border-radius: 10px;
}
.description-car {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.header-description-car {
  display: flex;
  flex-direction: column;
  padding: 0;

  .name-car {
    margin: 0;
  }

  .location-car {
    margin: 0;
    color: gray;
  }
}

.price-car {
  color: gray;
  span {
    font-weight: bold;
    font-size: 1.7rem;
    color: black;
  }
}
</style>
