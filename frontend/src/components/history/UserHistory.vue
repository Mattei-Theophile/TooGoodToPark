<script setup>

import UserInfo from "@/components/user/UserInfo.vue";
</script>

<template>

  <user-info />
  <user-info />



  <router-link class="see-all-history" to="/history/users">
    See all history
  </router-link>


</template>

<style scoped>
.see-all-history{
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:#000000;
  border-radius: 10px;
  padding: 0.5rem 5rem;
  color:#FFFFFF;
  font-size: 1.2rem;


}
</style>
