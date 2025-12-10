<script setup lang="ts">
import { ref } from 'vue'

const showCurrent = ref(false)
const showNew = ref(false)

const passwordMethod = ref({
  currentPassword: '', // Added field for current password usually required
  newPassword: '',
  confirmNewPassword: '',
})

const passwordSnackBar = ref(false)
const timeoutSnackbar = ref<number>(2000)
const confirmationPassword = ref('')

const handleSavePassword = () => {
  passwordSnackBar.value = true
  if (passwordMethod.value.newPassword !== passwordMethod.value.confirmNewPassword) {
    confirmationPassword.value = 'Passwords do not match!'
    return
  }

  if (!passwordMethod.value.newPassword) {
    confirmationPassword.value = 'Please enter a new password'
    return
  }

  confirmationPassword.value = 'Password changed successfully!'
}
</script>

<template>
  <v-form @submit.prevent="handleSavePassword">
    <v-container class="pa-0">
      <h4 class="text-subtitle-1 mb-4 text-medium-emphasis">Change your password</h4>

      <v-text-field
        v-model="passwordMethod.newPassword"
        :type="showCurrent ? 'text' : 'password'"
        label="New Password"
        variant="outlined"
        color="#216c37"
        :append-inner-icon="showCurrent ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showCurrent = !showCurrent"
        class="mb-2"
      ></v-text-field>

      <v-text-field
        v-model="passwordMethod.confirmNewPassword"
        :type="showNew ? 'text' : 'password'"
        label="Confirm New Password"
        variant="outlined"
        color="#216c37"
        :append-inner-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showNew = !showNew"
        :error="
          passwordMethod.newPassword !== passwordMethod.confirmNewPassword &&
          passwordMethod.confirmNewPassword.length > 0
        "
        error-messages="Passwords must match"
      ></v-text-field>

      <v-btn
        block
        color="#216c37"
        theme="dark"
        size="large"
        type="submit"
        class="mt-4"
        elevation="2"
      >
        Update Password
      </v-btn>

      <v-snackbar v-model="passwordSnackBar" :timeout="timeoutSnackbar" color="#216c37">
        {{ confirmationPassword }}
        <template v-slot:actions>
          <v-btn color="" variant="text" @click="passwordSnackBar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-form>
</template>
