<script setup></script>

<template>
  <div class="add-car" @click="$router.push('/account/cars/add')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      class="bi bi-plus-circle-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"
      />
    </svg>

    <p>List Your Car</p>
  </div>
</template>

<style scoped>
.add-car {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: 1px solid #216c37;
  border-radius: 10px;
  padding: 5px 5rem;
  background-color: #216c37;
  color: #f8f9fa;
}

p {
  font-size: 1.2rem;
}
</style>
