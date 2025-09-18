<script setup lang="ts">
import {ref} from "vue";

let accountData = ref(null);
let accountDetails = ref(false);
let subscriptionDetails = ref(false);
let transactionDetails = ref(false);

fetch('http://localhost:3000/api/account/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  },
  credentials: 'include'
})
    .then(res => {
      if (res.ok) {
        return res.json() // Return the promise
      }
    })
    .then(data => {
      accountData.value = data.user // Now data is the resolved JSON
      console.log(accountData.value)
    })
    .catch(err => {
      console.log(err)
    })
</script>

<template>

</template>

<style scoped>

</style>