<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed} from 'vue'

const route = useRoute()

// Determine which tab is active based on current route
const activeTab = computed(() => {
  if (route.name === 'Login') return 'login'
  if (route.name === 'Register') return 'register'
  return 'login'
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>{{ activeTab === 'login' ? 'Connexion' : 'Inscription' }}</h2>
        <p>
          {{ activeTab === 'login'
            ? 'Connectez-vous à votre compte pour accéder à vos services.'
            : 'Créez votre compte pour accéder à nos services.'
          }}
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="auth-tabs">
        <router-link
            to="/login"
            class="tab"
            :class="{ active: activeTab === 'login' }"
        >
          Connexion
        </router-link>
        <router-link
            to="/register"
            class="tab"
            :class="{ active: activeTab === 'register' }"
        >
          Inscription
        </router-link>
      </div>

      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.auth-card {
  max-width: 500px;
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.auth-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.auth-header h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.auth-header p {
  margin: 0;
  color: #666;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  flex: 1;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  background-color: #f5f5f5;
  color: #333;
}

.tab.active {
  color: #09091A;
  border-bottom-color: #09091A;
  background-color: #f9f9f9;
}

/* Remove the container styling from child components */
:deep(.LoggingMenu),
:deep(.RegisterMenu) {
  max-width: none;
  padding: 2rem;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}
</style>