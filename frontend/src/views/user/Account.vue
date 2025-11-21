<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

const activeSidebar = ref(false)
const sidebarRef = useTemplateRef('sidebarRef')
const buttonRef = useTemplateRef('buttonRef')

const toggleSidebar = () => {
  activeSidebar.value = !activeSidebar.value
}

// Setup click outside detection to close the sidebar when clicking outside
onClickOutside(
  sidebarRef,
  (event) => {
    if (activeSidebar.value) {
      activeSidebar.value = false
    }
  },
  {
    ignore: [buttonRef], // Ignore clicks on the button
  },
)
</script>

<template>
  <div class="sidebar-container">
    <button
      ref="buttonRef"
      @click="toggleSidebar"
      class="sidebar-button"
      :class="{ 'button-active': activeSidebar }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        fill="currentColor"
        class="bi bi-justify"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
        />
      </svg>
    </button>

    <aside ref="sidebarRef" class="sidebar" :class="{ 'sidebar-active': activeSidebar }">
      <div class="sidebar-content">
        <div class="user-profil">
          <router-link to="/account">
            <div>
              <p>My account</p>
            </div>
          </router-link>

          <router-link to="/account/reservations">
            <div>
              <p>My reservations</p>
            </div>
          </router-link>

          <router-link to="/account/cars">
            <div>
              <p>My cars</p>
            </div>
          </router-link>
        </div>

        <div class="sidebar-links">
          <ul>
            <li>
              <router-link to="/account/settings">
                <div class="SBitemContainer">
                  <span>Settings</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>

  <router-view />
</template>

<style scoped>
a {
  text-decoration: none;
  color: var(--color-background);
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  font-weight: 500;
}

a:hover {
  background-color: rgba(var(--color-text-rgb), 0.1);
}

.sidebar-container {
  display: flex;
  position: relative;
  z-index: 300;
}

.sidebar-button {
  background: var(--color-heading);
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-background);
  box-shadow: 0 2px 8px rgba(var(--color-text-rgb), 0.3);
  width: 50px;
  height: 50px;
  position: fixed;
  top: 20px;
  left: 20px;
  transition: transform 0.3s ease;
  z-index: 350;
}

.button-active {
  transform: translateX(15rem);
}

.sidebar {
  position: fixed;
  top: 0;
  left: -15rem;
  width: 15rem;
  height: 100vh;
  background: var(--color-heading);
  border-radius: 0 15px 15px 0;
  transition: transform 0.3s ease;
  z-index: 250;
  box-shadow: 3px 0 15px rgba(var(--color-text-rgb), 0.4);
}

.sidebar-active {
  transform: translateX(15rem);
}

.sidebar-content {
  padding: 1.5rem;
  padding-top: 5rem;
  height: 100%;
  color: var(--color-background);
  overflow-y: auto;
}

.user-profil {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(var(--color-background-rgb), 0.2);
}

.user-profil-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(var(--color-background-rgb), 0.08);
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.user-profil-container:hover {
  background: rgba(var(--color-background-rgb), 0.15);
}

.user-profil-container span {
  font-weight: 600;
  font-size: 1.1rem;
}

.sidebar-links ul {
  padding: 0;
  margin: 0;
}

.SBitemContainer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.sidebar-links li:last-child a {
  background: rgba(var(--color-background-rgb), 0.1);
  border: 1px solid rgba(var(--color-background-rgb), 0.2);
  font-weight: 600;
}

.sidebar-links li:last-child a:hover {
  background: rgba(var(--color-background-rgb), 0.2);
}

.sidebar-content > .SBitemContainer {
  padding: 0.75rem 1rem;
  color: #e74c3c;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border-top: 1px solid rgba(236, 240, 241, 0.2);
}

.sidebar-content > .SBitemContainer:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.sidebar-content > .SBitemContainer span {
  font-weight: 500;
}
</style>
