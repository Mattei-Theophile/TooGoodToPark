<script setup lang="ts">

</script>

<template>
  <div class="card">
    <div class="card-left">
      <div class="logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" alt="Mercedes">
      </div>
      <div class="text">
        <h2>Mercedes CLA 2014</h2>
        <p>20.01.25 → 28.01.25</p>
      </div>
    </div>
    <div class="card-right">
      <div class="icon">
        <img src="https://img.icons8.com/ios-filled/50/note.png" alt="Note">
      </div>
      <div class="icon">
        <img src="https://img.icons8.com/ios-filled/50/more.png" alt="Menu">
      </div>
    </div>
  </div>

</template>


<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #fff;
}

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 12px;
  width: 480px;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  background-color: #000;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 24px;
  height: 24px;
  filter: invert(100%); /* logo blanc */
}

.text {
  display: flex;
  flex-direction: column;
}

.text h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.text p {
  margin: 2px 0 0 0;
  color: #888;
  font-size: 14px;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  width: 32px;
  height: 32px;
  background-color: #eaeaea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon img {
  width: 16px;
  height: 16px;
}

</style>