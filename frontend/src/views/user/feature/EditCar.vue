<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Car } from '@/services/Car.js'
const isLoading = ref(true)

const props = defineProps({
  id: String,
})

const fileInput = ref<HTMLInputElement | null>(null)

const car = ref()
car.value = new Car()

const removeImage = (index: number) => {
  car.value.images.splice(index, 1)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        car.value.images.push(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }
  console.log(car.value.images)
}

onBeforeMount(async () => {
  try {
    car.value.initById(props.id)
    await car.value.fetchCarById()
    await car.value.fetchCarImages()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to fetch car details:', error)
  }
})
</script>

<template>
  <div v-if="isLoading">Loading Car details ...</div>
  <div v-else>
    <h2>Edit Car Details</h2>
    <button>Cancel</button>

    <div>
      <h3>Car Photos</h3>
      <div class="car-image-container">
        <div v-for="(image, index) in car.images" :key="index" class="car-image">
          <img :src="image" alt="Car Image" />
          <svg
            @click="removeImage(index)"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
            />
          </svg>
        </div>
        <div class="car-image add-image" @click="triggerFileInput">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-camera-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path
              d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"
            />
          </svg>
          <p>Add Photo</p>
        </div>
      </div>
    </div>

    <div>
      <h3>Car Details</h3>

      <div class="information-car-details">
        <div class="car-details-input">
          <label for="brand">Brand:</label>
          <input type="text" id="brand" v-model="car.brand" />
        </div>
        <div class="car-details-input">
          <label for="model">Model:</label>
          <input type="text" id="model" v-model="car.model" />
        </div>
      </div>

      <div class="information-car-details">
        <div class="car-details-input">
          <label for="year">Year:</label>
          <input type="text" id="year" v-model="car.year" />
        </div>
        <div class="car-details-input">
          <label for="mileage">Mileage:</label>
          <input type="text" id="mileage" v-model="car.mileage" />
        </div>
      </div>

      <div class="car-details-input">
        <label for="licensePlate"> License Plate</label>
        <input type="text" id="licensePlate" v-model="car.licensePlate" />
      </div>
    </div>

    <div>
      <h3>Rental Information</h3>
      <div class="car-details-input">
        <label for="pricePerDay">Rental Price </label>
        <div class="rental-price-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-currency-pound"
            viewBox="0 0 16 16"
          >
            <path
              d="M4 8.585h1.969c.115.465.186.939.186 1.43 0 1.385-.736 2.496-2.075 2.771V14H12v-1.24H6.492v-.129c.825-.525 1.135-1.446 1.135-2.694 0-.465-.07-.913-.168-1.352h3.29v-.972H7.22c-.186-.723-.372-1.455-.372-2.247 0-1.274 1.047-2.066 2.58-2.066a5.3 5.3 0 0 1 2.103.465V2.456A5.6 5.6 0 0 0 9.348 2C6.865 2 5.322 3.291 5.322 5.366c0 .775.195 1.515.399 2.247H4z"
            />
          </svg>
          <input type="text" id="pricePerDay" v-model="car.pricePerDay" />
          <p>/day</p>
        </div>
      </div>
      <div>
        <p>Availability Status</p>

        <div>
          <div class="car-details-input available-container">
            <label for="available">Available for Rent</label>
            <div class="availability-container">
              <label class="switch">
                <input type="checkbox" id="available" v-model="car.status" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button class="save-Button">Save Changes</button>
</template>

<style scoped>
.car-image-container {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
}

.car-image {
  img {
    width: 100%;
    border-radius: 15px;
  }

  svg {
    position: relative;
    left: 80%;
    bottom: 20%;
    cursor: pointer;
    fill: red;
  }
  width: 200px;
  height: 150px;
}
.information-car-details {
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 1rem;
}

.car-details-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rental-price-container {
  display: flex;
  flex-direction: row;
  align-items: center;

  border: 1px solid #ccc;
  input {
    border: none;
  }
}
.add-image {
  border: 2px dashed #ccc;
  padding-top: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #6f6f6f;
  width: 150px;
  height: 100px;
  svg {
    fill: black;
    position: static;
  }
}

input {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}

.save-Button {
  background-color: #216c37;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.available-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3; /* Or your primary theme color like #00bcd4 */
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
