<script setup lang="ts">

import {isLoggedIn, logout} from "@/services/Auth/auth"
import {computed, ref} from "vue";
import {settingsStore} from '@/stores/SettingsStore'

let navMenu = ref(false)

const userLoggedIn = computed(() => {isLoggedIn()})
const settings = settingsStore()
</script>

<template>

  <div class="navbar">
    <div class="logo" @click="$router.push('/')">
      <logo width="70" height="70" />
      <h2> TooGood <br> ToPark </h2>
    </div>

    <div class="nav-links-menu">
      <nav class="nav-links">
        <router-link to="/">Accueil</router-link>
        <router-link to="/shop">Notre projet</router-link>
        <router-link to="/shop">Boutique</router-link>


        <div class="login" @click="navMenu = !navMenu" >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
          </svg>
        </div>

        <div v-if="navMenu" class="nav-account-menu">

          <router-link to="/account"> My account </router-link>
          <router-link v-if="!userLoggedIn" to="/connexion"> se connecter </router-link>
          <router-link v-else to="/" @click="logout()"> se déconnecter </router-link>


        </div>

      </nav>
    </div>
  </div>

  <ThemeSwitcher />
</template>

<style scoped>
.navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  gap: 2rem;
  padding: 0.5rem 1rem;
  background-color: var(--navbar-bg, #ffffff);
  box-shadow: var(--navbar-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  z-index: 100;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.logo {
  display: flex;
  font-size: 1rem;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  font-family: "Roboto Thin", sans-serif;
  text-decoration: none;
  color: var(--text-primary, #000000);
  transition: color 0.3s ease;
}

.logo img {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.logo a {
  text-decoration: none;
  color: var(--text-primary, #000000);
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.logo h1 {
  font-size: 1.2rem;
  margin-left: 0.5rem;
  line-height: 1.2;
}

.nav-links-menu {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  font-size: 1.2rem;
  font-family: "Roboto Thin", sans-serif;
  text-decoration: none;
  color: var(--text-primary, #09091A);
  transition: color 0.3s ease;


}

.nav-account-menu{
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--navbar-bg, #ffffff);
  box-shadow: var(--navbar-shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  padding: 1rem;
  border-radius: 0.5rem;
  top: 100%;
  right: 0;
  z-index: 100;
}
.nav-links a:hover {
  color: var(--link-hover, #4a4ae9);
}

.login {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.login img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.login img:hover {
  transform: scale(1.1);
}
</style>