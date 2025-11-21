<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
const route = useRoute();
const idCard = route.params.id;


onMounted(() => {

  loadCar()
})


async function loadCar() {
  const res = await fetch("/api/cars",{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include',
  })
}

</script>

<template>

</template>

<style scoped>

</style>
