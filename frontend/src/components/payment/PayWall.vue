<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { PaymentStrategy } from './paymentStrategie.js'
import { PayByCreditCard } from './payByCreditCard.js'
import { PayByPayPal } from './payByPayPal.js'

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
})

const selectedMethod = ref<string | null>(null)
const paymentContext = new PaymentStrategy()
const cardDetails = ref({ cardNumber: '', expiry: '', cvc: '' })
const paypalDetails = ref({ email: '' })
const processing = ref(false)

const emit = defineEmits(['payment-success', 'payment-error'])

function selectMethod(method: string) {
  selectedMethod.value = method
  if (method === 'creditCard') {
    paymentContext.setStrategy(new PayByCreditCard())
  } else if (method === 'paypal') {
    paymentContext.setStrategy(new PayByPayPal())
  }
}

async function processPayment() {
  if (!selectedMethod.value) return

  processing.value = true
  try {
    // let details = selectedMethod.value === 'creditCard' ? cardDetails.value : paypalDetails.value
    // this.paymentContext.register(details);

    const result = await paymentContext.pay(props.amount)
    emit('payment-success', result)
  } catch (error) {
    console.error('Payment failed:', error)
    emit('payment-error', error)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <v-card class="mx-auto pa-4" max-width="600" elevation="2" rounded="lg">
    <h3 class="text-h6 mb-4 font-weight-bold text-center">Select Payment Method</h3>

    <v-row dense class="mb-4">
      <v-col cols="6">
        <v-card
          @click="selectMethod('creditCard')"
          :color="selectedMethod === 'creditCard' ? 'green-lighten-5' : 'surface'"
          :class="[
            'd-flex flex-column align-center justify-center pa-4 cursor-pointer selection-card',
            selectedMethod === 'creditCard' ? 'border-success' : '',
          ]"
          height="110"
          elevation="0"
          border
        >
          <v-icon size="36" :color="selectedMethod === 'creditCard' ? '#216c37' : 'grey'"
            >mdi-credit-card</v-icon
          >
          <div
            class="mt-2 font-weight-medium"
            :class="selectedMethod === 'creditCard' ? 'text-green-darken-2' : 'text-grey-darken-1'"
          >
            Credit Card
          </div>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card
          @click="selectMethod('paypal')"
          :color="selectedMethod === 'paypal' ? 'blue-lighten-5' : 'surface'"
          :class="[
            'd-flex flex-column align-center justify-center pa-4 cursor-pointer selection-card',
            selectedMethod === 'paypal' ? 'border-paypal' : '',
          ]"
          height="110"
          elevation="0"
          border
        >
          <v-icon size="36" :color="selectedMethod === 'paypal' ? '#00457C' : 'grey'"
            >mdi-paypal</v-icon
          >
          <div
            class="mt-2 font-weight-medium"
            :class="selectedMethod === 'paypal' ? 'text-blue-darken-3' : 'text-grey-darken-1'"
          >
            PayPal
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-if="selectedMethod">
        <v-divider class="mb-4"></v-divider>

        <div v-if="selectedMethod === 'creditCard'">
          <v-text-field
            v-model="cardDetails.cardNumber"
            label="Card Number"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-credit-card-outline"
            class="mb-2"
          ></v-text-field>

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="cardDetails.expiry"
                label="MM/YY"
                variant="outlined"
                density="comfortable"
                placeholder="MM/YY"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="cardDetails.cvc"
                label="CVC"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock-outline"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div v-if="selectedMethod === 'paypal'">
          <v-text-field
            v-model="paypalDetails.email"
            label="PayPal Email"
            type="email"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-email-outline"
            hint="You will be redirected to PayPal"
            persistent-hint
          ></v-text-field>
        </div>

        <v-btn
          block
          size="large"
          color="#216c37"
          theme="dark"
          class="mt-6"
          :loading="processing"
          @click="processPayment"
          elevation="2"
        >
          {{ processing ? 'Processing...' : `Pay ${props.amount}€` }}
        </v-btn>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.selection-card {
  transition: all 0.2s ease-in-out;
}
.border-success {
  border: 2px solid #216c37 !important;
}
.border-paypal {
  border: 2px solid #00457c !important;
}
</style>
