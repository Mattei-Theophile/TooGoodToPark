<script setup lang="ts">

</script>

<template>
  <div class="car-card">
    <img class="car-image" :src="image" :alt="title" />
    <div class="car-info">
      <div>
        <h2 class="car-title">{{ title }}</h2>
        <p class="car-location">{{ location }}</p>
      </div>
      <div class="car-price">
        <span class="price">{{ price }}£</span><span class="per">/day</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.car-card {
  width: 350px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

.car-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.car-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px 14px;
}

.car-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.car-location {
  font-size: 14px;
  color: #666;
  margin: 2px 0 0 0;
}

.car-price {
  text-align: right;
}

.price {
  font-size: 20px;
  font-weight: bold;
}

.per {
  font-size: 14px;
  color: #888;
  margin-left: 2px;
}
</style>