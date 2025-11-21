<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

// Simple reactive form model
const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

const router = useRouter()

async function onSubmit() {
  errorMessage.value = null

  // Basic front-end validation
  if (!form.email || !form.password) {
    errorMessage.value = 'Please enter both username and password.'
    return
  }

  loading.value = true
  try {
    const credentials = JSON.stringify({
      email: form.email,
      password: form.password,
    })

    const res = await userStore.login(credentials)

    if (!res.success) {
      // Try to read error details from backend
      let details = ''
      try {
        details = res?.message || ''
      } catch {
        // ignore parse errors
      }
      throw new Error(details || `Login failed (${res?.status})`)
    }

    // Navigate after login (adjust route as needed)
    await router.push('/account')

    console.log('redirecting to user')
  } catch (err: any) {
    errorMessage.value = err?.message || 'Unexpected error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="LoggingMenu">
    <div class="connexion">
      <form class="login-form" @submit.prevent="onSubmit">
        <div class="user">
          <label for="email-login">Email </label>
          <input
            type="text"
            id="email-login"
            name="email"
            class="information"
            placeholder="Adresse mail"
            v-model="form.email"
            :disabled="loading"
            required
          />
        </div>

        <div class="password">
          <label for="password-login">Password:</label>
          <input
            type="password"
            id="password-login"
            name="password"
            class="information"
            placeholder="password"
            minlength="8"
            v-model="form.password"
            :disabled="loading"
            required
          />
        </div>

        <button class="button" type="submit" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>
        <a href="#"><p class="forgot_password">Mot de passe oublié ?</p></a>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 0.5rem;
  max-width: 320px;
}

.error {
  color: var(--danger-color, #c0392b);
  margin-top: 0.5rem;
}

.LoggingMenu {
  max-width: 500px;
  padding: 2rem;
  font-family: 'Roboto Thin', sans-serif;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-weight: bold;
  font-size: 4rem;
  padding-top: 4rem;
  padding-bottom: 2.5rem;
}

.connexion {
  width: 100%;
}

.forms {
  display: flex;
  flex-direction: column;
  row-gap: 1.5em;
  width: 100%;
}

.information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 50px;
  width: 100%;
  min-height: 2rem;
  padding: 1em;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #ffffff;
  color: #767676;
  box-sizing: border-box;
}

.user,
.password {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 0.5em;
  width: 100%;
}

.user label,
.password label {
  font-weight: 500;
  color: #333;
}

.logging {
  padding-top: 2rem;
  border-radius: 8px;
  background-color: #222539;
  color: #f5f5f5;
}

.forgot_password {
  font-size: 0.85em;
  text-align: left;
  color: #555;
  margin-top: 0.5rem;
}

.button {
  border-radius: 0.5rem;
  height: 2.5rem;
  width: 100%;
  margin-top: 1.5rem;
  color: #f5f5f5;
  background-color: #09091a;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #1a1a2e;
}

.signup-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9em;
  color: #555;
}

.signup-link a {
  color: #09091a;
  text-decoration: underline;
  font-weight: bold;
}

.signup-link a:hover {
  color: #1a1a2e;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .LoggingMenu {
    margin: 0 1rem;
    padding: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  .LoggingMenu {
    margin: 0 0.5rem;
    padding: 1rem;
  }

  .button {
    height: 3rem;
  }
}
</style>
