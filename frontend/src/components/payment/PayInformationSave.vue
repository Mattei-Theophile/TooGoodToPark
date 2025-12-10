<script setup lang="ts">
import { ref } from 'vue'
import { PaymentStrategy } from '@/components/payment/paymentStrategie.js'
import { PayByCreditCard } from '@/components/payment/payByCreditCard.js'
import { PayByPayPal } from '@/components/payment/payByPayPal.js'

// Payment Strategy Setup
const paymentStrategy = new PaymentStrategy()
const selectedMethod = ref('creditCard')
const creditCardDetails = ref({ cardNumber: '', expiry: '', cvv: '' })
const payPalDetails = ref({ email: '' })

const paymentSnackBar = ref(false)
const timeoutSnackbar = ref<number>(2000)
const confirmationPayment = ref('')

const handleSavePaymentMethod = () => {
  if (selectedMethod.value === 'creditCard') {
    paymentStrategy.setStrategy(new PayByCreditCard())
    paymentStrategy.register(creditCardDetails.value)
    confirmationPayment.value = 'Credit card registered successfully!'
  } else if (selectedMethod.value === 'paypal') {
    paymentStrategy.setStrategy(new PayByPayPal())
    paymentStrategy.register(payPalDetails.value)
    confirmationPayment.value = 'Paypal account registered successfully!'
  }
  paymentSnackBar.value = true
}
</script>

<template>
  <v-container class="pa-0">
    <v-radio-group v-model="selectedMethod" inline class="mb-2" hide-details>
      <v-radio label="Credit Card" value="creditCard" color="#216c37"></v-radio>
      <v-radio label="PayPal" value="paypal" color="#00457C"></v-radio>
    </v-radio-group>

    <v-window v-model="selectedMethod">
      <v-window-item value="creditCard" class="pa-1">
        <v-text-field
          v-model="creditCardDetails.cardNumber"
          label="Card Number"
          prepend-inner-icon="mdi-credit-card"
          variant="outlined"
          density="comfortable"
          color="#216c37"
          class="mb-2"
        ></v-text-field>

        <v-row dense>
          <v-col cols="6">
            <v-text-field
              v-model="creditCardDetails.expiry"
              label="Expiry (MM/YY)"
              placeholder="MM/YY"
              variant="outlined"
              density="comfortable"
              color="#216c37"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="creditCardDetails.cvv"
              label="CVV"
              placeholder="123"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              density="comfortable"
              color="#216c37"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="paypal" class="pa-1">
        <v-text-field
          v-model="payPalDetails.email"
          label="PayPal Email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="comfortable"
          color="#00457C"
        ></v-text-field>
      </v-window-item>
    </v-window>

    <v-btn
      block
      color="#216c37"
      theme="dark"
      size="large"
      class="mt-4"
      elevation="2"
      @click="handleSavePaymentMethod"
    >
      Save Payment Method
    </v-btn>

    <v-snackbar v-model="paymentSnackBar" :timeout="timeoutSnackbar" color="#216c37">
      {{ confirmationPayment }}
      <template v-slot:actions>
        <v-btn color="" variant="text" @click="paymentSnackBar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
