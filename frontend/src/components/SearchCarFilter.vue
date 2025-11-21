<script setup lang="ts">
import { computed, ref, reactive, watch, PropType } from 'vue'
// Assuming filterFunctions is imported and has the functions from your previous prompt
// (e.g., byPrice, byKilometers, byRating, etc.)
import { filterFunctions } from '@/services/filter/filterPipeline.js'
import { Car } from '@/services/Car'
// --- Props ---
const props = defineProps({
  cars: {
    type: Array as PropType<Car[]>,
    required: true,
  },
})

const emit = defineEmits(['update:filteredCars'])

// --- UI State ---
const activeFilterMenu = ref(false)

// --- Filter Selection ---
// This list MUST match the keys in your filterFunctions object
const allFilterNames = ref([
  'byPrice',
  'byMileage', // Changed from byMileage
  'byRating',
  'byBrand',
  'byModel',
  'byYearOfCreation',
  // 'byLocation' could be added if it exists in your service
])

const isTextFilter = computed(() =>
  ['byBrand', 'byModel', 'byLocation'].includes(selectedFilter.value),
)
const isSortFilter = computed(() =>
  ['byPrice', 'byMileage', 'byRating', 'byYearOfCreation'].includes(selectedFilter.value),
)
const selectedFilter = ref(allFilterNames.value[0]) // e.g., 'byPrice'

// --- Reactive Filter Options ---
// This object holds the inputs for ALL filter types.
// The UI will use v-if to show the correct inputs.
const options = reactive({
  min: null as number | null,
  max: null as number | null,
  order: 'asc' as 'asc' | 'desc',
  textValue: '' as string,
})

// --- Watcher ---
// When the user picks a new filter (e.g., from 'byPrice' to 'byMarque'),
// reset the options to avoid using old values.
watch(selectedFilter, () => {
  options.min = null
  options.max = null
  options.order = 'asc'
  options.textValue = ''
  activeFilterMenu.value = false // Close the dropdown
})

// --- The Refactored Computed Property (The "Pipeline") ---
const filteredCars = computed(() => {
  const filterName = selectedFilter.value
  // Get the actual function from the imported object
  const filterFn = filterFunctions[filterName]

  // Create a shallow copy of the cars array.
  // This ensures we don't mutate the prop and guarantees a NEW array reference
  // is returned, which triggers the reactivity updates immediately.
  const carsCopy = [...props.cars]

  // Guard clause: if function doesn't exist, return all cars
  if (typeof filterFn !== 'function') {
    console.warn(`Filter function "${filterName}" not found.`)
    return carsCopy
  }
  console.log('sort')

  // Call the correct function with the correct arguments
  // based on the filter name
  try {
    switch (filterName) {
      case 'byPrice':
        return filterFn(carsCopy, options.order)
      case 'byMileage':
        return filterFn(carsCopy, options.order)

      case 'byRating':
        return filterFn(carsCopy, options.order)
      case 'byYearOfCreation':
        // Assuming these functions take (cars, order)
        return filterFn(carsCopy, options.order)

      case 'byBrand':
        return filterFn(carsCopy, options.textValue)
      case 'byModel':
      case 'byLocation':
        return filterFn(carsCopy, options.textValue)

      default:
        return carsCopy
    }
  } catch (error) {
    console.error(`Error applying filter ${filterName}:`, error)
    return carsCopy // Fallback on error
  }
})

// Watch for changes in filteredCars and emit the result to parent
watch(
  filteredCars,
  (newVal) => {
    console.log('Filtered cars updated:', filteredCars.value)
    emit('update:filteredCars', newVal)
  },
  { immediate: true },
)

// Helper to select a filter from the dropdown
function selectFilter(filterName: string) {
  selectedFilter.value = filterName
}

function toggleSortOrder() {
  options.order = options.order === 'asc' ? 'desc' : 'asc'
}
</script>

<template>
  <div class="filter-system">
    <!-- Filter Selector Dropdown -->
    <div class="filter-selector">
      <div class="dropdown">
        <button class="dropdown-toggle" @click="activeFilterMenu = !activeFilterMenu">
          <span>{{ selectedFilter }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
        <ul v-if="activeFilterMenu" class="dropdown-menu">
          <li
            v-for="filterName in allFilterNames"
            :key="filterName"
            @click="selectFilter(filterName)"
          >
            {{ filterName }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Conditional Filter Options -->
    <div class="filter-options">
      <!-- Text Input (for Marque, Model, Location) -->
      <template v-if="isTextFilter">
        <input
          type="text"
          v-model="options.textValue"
          placeholder="Enter text..."
          class="filter-input"
        />
      </template>

      <!-- Order Select (for sorting filters) -->
      <button
        v-if="isSortFilter"
        class="filter-input"
        @click="toggleSortOrder"
        :title="options.order === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
      >
        <svg
          v-if="options.order === 'desc'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-sort-down"
          viewBox="0 0 16 16"
        >
          <path
            d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"
          />
        </svg>

        <svg
          v-if="options.order === 'asc'"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-sort-down-alt"
          viewBox="0 0 16 16"
        >
          <path
            d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* A cleaner, more modern style for the filter component */
.filter-system {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  margin: 1rem 0;
}

.filter-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px 12px;
  min-width: 180px;
  cursor: pointer;
  font-weight: 500;
}

.dropdown-toggle svg {
  margin-left: 8px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-menu li {
  padding: 10px 12px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.filter-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.filter-input::placeholder {
  color: #999;
}
</style>
