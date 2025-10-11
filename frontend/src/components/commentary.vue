<script setup>


const props = defineProps({
  name:String,
  commentary:String,
  date:String,
})

</script>

<template>
  <div class="commentary-container">
    <div class="header-commentary">
      <h3> {{props.name}}</h3>
      <p> {{new Date(props.date).toLocaleDateString()}}</p>
    </div>

    <p class="commentary"> {{props.commentary}}</p>

  </div>

</template>

<style scoped>

.commentary-container {
  display: flex;
  flex-direction: column;
}

.header-commentary{
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style>
