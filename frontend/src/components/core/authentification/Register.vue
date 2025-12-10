<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const router = useRouter()
const formRef = ref()
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const userStore = useUserStore()

const form = reactive({
  email: '',
  password: '',
  surname: '',
  name: '',
  phoneNumber: '',
})

// Validation Rules
const requiredRule = (v: string) => !!v || 'This field is required'

const emailRules = [
  requiredRule,
  (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address',
]

const phoneRules = [
  requiredRule,
  (v: string) => {
    // Check if it contains mostly digits (allow spaces for formatting)
    const clean = v.replace(/\D/g, '')
    return clean.length >= 9 || 'Phone number seems too short'
  },
]

async function onSubmit() {
  errorMessage.value = null
  successMessage.value = null

  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  // Format phone number for API (+33 format)
  const formattedPhone = '+33' + form.phoneNumber.replace(/\D/g, '')
  const phoneRegex = /^\+33[0-9]{10}$/ // Strict check before sending

  let rawPhone = form.phoneNumber.replace(/\D/g, '')
  if (rawPhone.startsWith('0')) rawPhone = rawPhone.substring(1)

  const finalPhone = '+33' + rawPhone

  loading.value = true

  try {
    const res = await userStore.register({
      email: form.email,
      password: form.password,
      lastname: form.surname,
      firstname: form.name,
      phonenumber: finalPhone,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.message || data?.error || `Registration failed (${res.status})`)
    }

    successMessage.value = 'Registration successful! Redirecting...'

    // Reset form
    formRef.value.reset()

    setTimeout(() => {
      router.push({ name: 'Login' }).catch(() => {})
    }, 2000)
  } catch (err: any) {
    errorMessage.value = err?.message || 'Unexpected error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="onSubmit">
    <v-expand-transition>
      <div v-if="errorMessage || successMessage">
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="errorMessage"
        />
        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          class="mb-4"
          :text="successMessage"
        />
      </div>
    </v-expand-transition>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.name"
          label="First Name"
          :rules="[requiredRule]"
          variant="outlined"
          required
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="form.surname"
          label="Surname"
          :rules="[requiredRule]"
          variant="outlined"
          required
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      :rules="emailRules"
      required
    />

    <v-text-field
      v-model="form.phoneNumber"
      label="Phone Number"
      hint="Format: 06 12 34 56 78"
      persistent-hint
      prepend-inner-icon="mdi-phone"
      variant="outlined"
      :rules="phoneRules"
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
      :rules="[requiredRule, (v) => v.length >= 8 || 'Min 8 characters']"
      required
    />

    <v-btn
      block
      color="success"
      size="large"
      type="submit"
      class="mt-4"
      :loading="loading"
      :disabled="!valid"
    >
      Sign Up
    </v-btn>
  </v-form>
</template>
