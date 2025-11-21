<script setup lang="ts">
import { ref, computed, watch, onBeforeMount } from 'vue'
let settingsCarMenu = ref(false)
const isLoading = ref(true)
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

onBeforeMount(() => {
  props.reservation.car.fetchCarById()
  isLoading.value = false
})
console.log(props.reservation)
const handleDelete = async () => {
  console.log(props.reservation)
  const res = props.reservation.delete()
  console.log(res)
}
</script>

<template>
  <div v-if="isLoading" class="loading-container"></div>
  <div v-else-if="!props.reservation" class="error-container">error lors de l'affichage</div>
  <div v-else>
    <div class="information-car">
      <div class="header-car">
        <img src="" alt="" />
        <div>
          <h3 class="name-car">{{ props.reservation.car.brand }}</h3>
          <p>
            price of the reservation : {{ props.reservation.price }} for
            {{ props.reservation.totalDays }} days
          </p>
        </div>

        <div class="dates-car">
          <p>{{ new Date(props.reservation.start).toLocaleDateString() }}</p>
          <p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
              />
            </svg>
          </p>
          <p>{{ new Date(props.reservation.end).toLocaleDateString() }}</p>
        </div>
      </div>

      <div class="option-menu-container">
        <button class="card-information-car">
          <router-link :to="{ name: 'Announce', query: { id: props.reservation.car.id } }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-card-list"
              viewBox="0 0 16 16"
            >
              <path
                d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"
              />
              <path
                d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
              />
            </svg>
          </router-link>
        </button>

        <button class="settings-history-car" @click="settingsCarMenu = !settingsCarMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            class="bi bi-three-dots"
            viewBox="0 0 16 16"
          >
            <path
              d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
            />
          </svg>
        </button>

        <div v-if="settingsCarMenu" class="settings-car-menu">
          <ul>
            <li>
              <button @click="handleDelete" class="delete-reservation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  class="bi bi-trash-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                  />
                </svg>
                delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.information-car {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.5rem 0;
  background-color: #f4f4f4;
  border-radius: 10px;
}

.header-car {
  display: flex;
  flex-direction: column;
  margin: 0 0.5rem;
  .dates-car {
    display: flex;
    flex-direction: row;
    p {
      margin: 0 0.5rem;
    }
  }
}

.name-car {
  font-size: 1.5rem;
  font-weight: bold;
}

.option-menu-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  svg {
    fill: #000000;
  }
}
.settings-car-menu {
  background-color: #f4f4f4;
  border-radius: 10px;
}
</style>
