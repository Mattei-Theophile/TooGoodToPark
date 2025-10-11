<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import {useRouter} from "vue-router";
import {onClickOutside} from "@vueuse/core";


const router = useRouter();
const target = useTemplateRef<HTMLElement>('search-form');
onClickOutside(target, event => {research.value = false})

let research = ref(false);
let researchForm = ref({
  "city" : "",
  "startDate" : "",
  "endDate" : "",
});



</script>

<template>
    <div class="search-bar">
      <button @click="research = !research" >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
          Search for an ad
      </button>
    </div>

    <div ref="search-form" class="search-form-container" v-if=" research" >
      <h2 class="form-research-title"> Search for an ad</h2>
      <form>
        <div class="city-form-research">
          <label> CITY</label>
          <input required type="text" v-model.lazy="researchForm.city">
        </div>


        <div class="dates-form-research">
          <label>DATES</label>
          <div class="dates-selectors-form-research">
            <div class="date-pickers-form-research">
              <label> Departure </label>
              <input required type="date" v-model.lazy="researchForm.startDate">
            </div>

            <div class="date-pickers-form-research">
              <label> Return</label>
              <input required type="date" v-model.lazy="researchForm.endDate">
            </div>
          </div>
        </div>

        <button type="submit" @click="router.push({name: 'Search', query: {city: researchForm.city, startDate: researchForm.startDate, endDate: researchForm.endDate}})">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
          Start search
        </button>
      </form>

    </div>


</template>

<style scoped>

.search-bar{

  position: sticky;
  bottom: 0;
  margin-top: 2rem;

  button{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 5rem;
    background-color: #216C37;
    color: #FFFFFF;
    fill: #FFFFFF;
    border-radius: 10px;
    font-size: 1.25rem;
    font-weight: 600;

    svg{
      padding-right: 1rem;
    }
  }
}

.search-form-container{
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 1rem 0;
  position: sticky;
  bottom: 0;
  left: 50%;
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

form{
  display: flex;
  flex-direction: column;
}

.city-form-research{
  display: flex;
  flex-direction: column;
  margin: 1rem;
  input{
    margin-top: 1rem;
    padding: 1rem;
  }
}

.dates-form-research{

  display: flex;
  flex-direction: column;
  margin: 1rem;
  .dates-selectors-form-research{
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
    .date-pickers-form-research{
      display: flex;
      flex-direction: column;
      margin: 0 0.5rem;
    }

  }
}




</style>
