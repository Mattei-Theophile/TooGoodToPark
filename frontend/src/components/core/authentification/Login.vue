<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const router = useRouter()

const formRef = ref()
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref<string | null>(null)

const form = reactive({
  email: '',
  password: '',
})

// Vuetify Validation Rules
const emailRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
]

async function onSubmit() {
  errorMessage.value = null

  // Validate form before submitting
  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  loading.value = true

  try {
    const credentials = JSON.stringify({
      email: form.email,
      password: form.password,
    })

    const res = await userStore.login(credentials)

    if (!res.success) {
      throw new Error(res?.message || `Login failed (${res?.status})`)
    }

    await router.push('/account')
  } catch (err: any) {
    errorMessage.value = err?.message || 'Unexpected error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="onSubmit">
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="errorMessage = null"
    >
      {{ errorMessage }}
    </v-alert>

    <v-text-field
      v-model="form.email"
      label="Email Address"
      placeholder="hello@example.com"
      type="email"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      :rules="emailRules"
      required
      class="mb-2"
    />

    <v-text-field
      v-model="form.password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      variant="outlined"
      :rules="passwordRules"
      required
    />

    <div class="d-flex justify-end mb-4">
      <a href="#" class="text-caption text-decoration-none text-primary"> Forgot password? </a>
    </div>

    <v-btn
      block
      color="success"
      size="large"
      type="submit"
      :loading="loading"
      :disabled="!valid"
      variant="elevated"
    >
      Sign In
    </v-btn>
  </v-form>
</template>
