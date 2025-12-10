<script setup>
import { ref, watch } from 'vue'
import { DatePicker } from 'v-calendar'

const props = defineProps({
  ID_Car: {
    type: String,
    required: true,
  },
  rangeDate: {
    start: String,
    end: String,
    type: Object,
    default: () => ({
      start: null,
      end: null,
    }),
  },
})
const emit = defineEmits(['dateSelected'])

let calendarShow = ref(false)
let calendarRangeData = ref({
  start: props.rangeDate.start || new Date().toLocaleDateString(),
  end: props.rangeDate.end || new Date().toLocaleDateString(),
})

const disableDates = ref(null)

// Watch for changes in calendar data and emit the selected dates
watch(
  calendarRangeData,
  (newValue) => {
    newValue.start = new Date(newValue.start).toLocaleDateString()
    newValue.end = new Date(newValue.end).toLocaleDateString()
    emit('dateSelected', newValue)
  },
  { deep: true },
)
</script>

<template>
  <div class="calendar-container">
    <div class="date-container" v-if="calendarShow">
      <DatePicker v-model.range="calendarRangeData" />
    </div>
    <button class="calender-button" @click="calendarShow = !calendarShow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        class="bi bi-calendar3"
        viewBox="0 0 16 16"
      >
        <path
          d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z"
        />
        <path
          d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.calendar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 1rem;
}
.calender-button {
  padding: 1rem;
  background-color: #216c37;
  border-radius: 10px;
  color: #fff;
}

.date-container {
  position: absolute;
  bottom: 100%;
  z-index: 1000;
}
</style>
