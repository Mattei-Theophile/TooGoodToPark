<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter();
// Simple reactive form model
const form = reactive({
  email: '',
  password: '',
  nom: '',
  prenom: '',
  numeroTelephone: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Optional: read base URL from Vite env (fallback to same-origin)
const API_BASE = 'http://localhost:3000'



async function onSubmit() {
  errorMessage.value = null
  successMessage.value = null

  // Basic front-end validation
  if (!form.email || !form.password || !form.nom || !form.prenom || !form.numeroTelephone) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errorMessage.value = 'Veuillez entrer une adresse email valide.'
    return
  }

  // Phone number validation (basic French format)
  const phoneRegex = /^\+33[0-9]{10}$/
  form.numeroTelephone = '+33' + form.numeroTelephone.replace(/\D/g, '')
  console.log(form.numeroTelephone)
  if (!phoneRegex.test(form.numeroTelephone)) {
    errorMessage.value = 'Veuillez entrer un numéro de téléphone valide.'
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        nom: form.nom,
        prenom: form.prenom,
        numeroTelephone: form.numeroTelephone,
      }),
      credentials: 'include',
    })

    if (!res.ok) {
      // Try to read error details from backend
      let details = ''
      try {
        const data = await res.json()
        console.log(data)
        details = data?.message || data?.error || ''
      } catch {
        // ignore parse errors
      }
      throw new Error(details || `Registration failed (${res.status})`)
    }

    const data = await res.json()
    successMessage.value = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'

    // Clear form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })

    // Redirect to login after a delay
    setTimeout(() => {
      router.push({ name: 'Login' }).catch(() => {})
    }, 2000)

  } catch (err: any) {
    errorMessage.value = err?.message || 'Erreur inattendue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="RegisterMenu">
    <div class="inscription">
      <form class="register-form" @submit.prevent="onSubmit">

        <div class="field">
          <label for="prenom-register">Prénom</label>
          <input
              type="text"
              id="prenom-register"
              name="prenom"
              class="information"
              placeholder="Prénom"
              v-model="form.prenom"
              :disabled="loading"
              required
          />
        </div>

        <div class="field">
          <label for="nom-register">Nom</label>
          <input
              type="text"
              id="nom-register"
              name="nom"
              class="information"
              placeholder="Nom de famille"
              v-model="form.nom"
              :disabled="loading"
              required
          />
        </div>

        <div class="field">
          <label for="email-register">Email</label>
          <input
              type="email"
              id="email-register"
              name="email"
              class="information"
              placeholder="Adresse email"
              v-model="form.email"
              :disabled="loading"
              required
          />
        </div>

        <div class="field">
          <label for="phone-register">Numéro de téléphone</label>
          <input
              type="tel"
              id="phone-register"
              name="numeroTelephone"
              class="information"
              placeholder="01 23 45 67 89"
              v-model="form.numeroTelephone"
              :disabled="loading"
              required
          />
        </div>

        <div class="field">
          <label for="password-register">Mot de passe</label>
          <input
              type="password"
              id="password-register"
              name="password"
              class="information"
              placeholder="Mot de passe"
              minlength="8"
              v-model="form.password"
              :disabled="loading"
              required
          />
        </div>

        <button class="button" type="submit" :disabled="loading">
          {{ loading ? 'Inscription en cours…' : 'S\'inscrire' }}
        </button>

        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-form {
  display: grid;
  gap: 0.5rem;
  max-width: 320px;
}

.error {
  color: var(--danger-color, #c0392b);
  margin-top: 0.5rem;
}

.success {
  color: var(--success-color, #27ae60);
  margin-top: 0.5rem;
}

.RegisterMenu {
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

.inscription {
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
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  background-color: #FFFFFF;
  color: #767676;
  box-sizing: border-box;
}

.field {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 0.5em;
  width: 100%;
}

.field label {
  font-weight: 500;
  color: #333;
}

.button {
  border-radius: 0.5rem;
  height: 2.5rem;
  width: 100%;
  margin-top: 1.5rem;
  color: #F5F5F5;
  background-color: #09091A;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #1a1a2e;
}

.button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .RegisterMenu {
    margin: 0 1rem;
    padding: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  .RegisterMenu {
    margin: 0 0.5rem;
    padding: 1rem;
  }

  .button {
    height: 3rem;
  }
}
</style>