<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import PayWall from '@/components/payment/PayWall.vue'
import { Reservation } from '@/services/reservation.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore.js'

const router = useRouter()
const props = router.currentRoute.value.query
const isLoading = ref(true)
const isPaid = ref(false)
const paymentDialog = ref(false)
const processingPayment = ref(false)

const payment = ref({
  price: 0,
  taxes: 0,
  insurance: 0,
  total: 0,
})

const reservation = new Reservation()
const userStore = useUserStore()

const dateSelected = ref({
  start: props.departure ? new Date(props.departure) : null,
  end: props.return ? new Date(props.return) : null,
})

// Format date for display
const formatDate = (date) => {
  if (!date) return 'Not selected'
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handlePaymentSuccess = async (paymentResult) => {
  console.log('Payment successful:', paymentResult)
  await createReservation()
  processingPayment.value = false
  paymentDialog.value = false
  isPaid.value = true
}

const handlePaymentError = (error) => {
  console.error('Payment failed:', error)
  processingPayment.value = false
}

onBeforeMount(async () => {
  if (userStore.isAuthenticated) {
    reservation.car.initById(props.id)
    await reservation.car.fetchCarImages()
    await reservation.car.fetchCarById()
    reservation.start = new Date(dateSelected.value.start)
    reservation.end = new Date(dateSelected.value.end)
    reservation.totalDays = Math.ceil((reservation.end - reservation.start) / (1000 * 60 * 60 * 24))
    isLoading.value = false
  } else {
    router.push('/login')
  }
})

const createReservation = async () => {
  processingPayment.value = true
  const res = await reservation.create()
  if (res) {
    isPaid.value = true
    processingPayment.value = false
  }
}

const price = computed(() => {
  payment.value.price = reservation.car.price * reservation.totalDays
  payment.value.taxes = Math.round(payment.value.price * 0.15 * 100) / 100
  payment.value.insurance = Math.round(payment.value.price * 0.05 * 100) / 100
  payment.value.total =
    Math.round((payment.value.price + payment.value.taxes + payment.value.insurance) * 100) / 100
  return payment.value
})

const downloadReceipt = () => {
  // TODO: Implement receipt download
  console.log('Downloading receipt...')
}

const viewBookings = () => {
  router.push('/account/reservations')
}
</script>

<template>
  <v-container class="reserve-container">
    <!-- Loading State -->
    <v-row v-if="isLoading" justify="center" align="center" class="loading-state">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="green-darken-3" size="64" />
        <p class="text-center mt-4 text-h6">Loading reservation details...</p>
      </v-col>
    </v-row>

    <!-- Success State -->
    <div v-else-if="isPaid">
      <v-card elevation="8" class="success-card">
        <v-card-text class="text-center pa-8">
          <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
          <h2 class="text-h4 mb-4">Payment Successful! 🎉</h2>
          <p class="text-h6 mb-6 text-grey-darken-1">Your reservation has been confirmed</p>

          <v-divider class="my-6" />

          <div class="booking-reference">
            <p class="text-body-1 text-grey-darken-2">Booking Reference</p>
            <h3 class="text-h5 font-weight-bold">#{{ reservation.id || 'XXXXXX' }}</h3>
          </div>

          <v-row class="mt-6" justify="center">
            <v-col cols="12" sm="6">
              <v-btn
                block
                size="large"
                color="green-darken-3"
                prepend-icon="mdi-download"
                @click="downloadReceipt"
              >
                Download Receipt
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                block
                size="large"
                variant="outlined"
                color="green-darken-3"
                prepend-icon="mdi-calendar-check"
                @click="viewBookings"
              >
                View My Bookings
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Reservation Details -->
    <v-row v-else>
      <!-- Left Column: Car & Dates Info -->
      <v-col cols="12" md="7">
        <!-- Car Information Card -->
        <v-card elevation="4" class="mb-4 car-details-card">
          <v-img :src="reservation.car.images[0]" height="300" cover class="car-hero-image">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="green-darken-3" />
              </v-row>
            </template>
          </v-img>

          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-2">
              <h2 class="text-h4 font-weight-bold">
                {{ reservation.car.brand }} {{ reservation.car.model }}
              </h2>
              <v-chip color="green-darken-3" variant="elevated">
                {{ reservation.car.year }}
              </v-chip>
            </div>

            <v-divider class="my-4" />

            <v-row>
              <v-col cols="6">
                <div class="info-item">
                  <v-icon color="grey-darken-1" class="mr-2">mdi-card-account-details</v-icon>
                  <div>
                    <p class="text-caption text-grey-darken-1">License Plate</p>
                    <p class="text-body-1 font-weight-medium">
                      {{ reservation.car.licensePlate || 'N/A' }}
                    </p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="info-item">
                  <v-icon color="grey-darken-1" class="mr-2">mdi-account-multiple</v-icon>
                  <div>
                    <p class="text-caption text-grey-darken-1">Passengers</p>
                    <p class="text-body-1 font-weight-medium">
                      {{ reservation.car.passenger || 4 }} seats
                    </p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Rental Period Card -->
        <v-card elevation="4" class="rental-period-card">
          <v-card-title class="bg-green-darken-3 text-white pa-4">
            <v-icon class="mr-2">mdi-calendar-range</v-icon>
            Rental Period
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row>
              <!-- Pick-up -->
              <v-col cols="12" sm="6">
                <div class="date-card pickup-card">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="green-darken-3" size="large" class="mr-2">
                      mdi-arrow-up-circle
                    </v-icon>
                    <div>
                      <p class="text-caption text-grey-darken-1">Pick-up</p>
                      <p class="text-h6 font-weight-bold">{{ formatDate(dateSelected.start) }}</p>
                      <p class="text-body-2 text-grey-darken-1">
                        {{ formatTime(dateSelected.start) }}
                      </p>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Drop-off -->
              <v-col cols="12" sm="6">
                <div class="date-card dropoff-card">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="orange-darken-2" size="large" class="mr-2">
                      mdi-arrow-down-circle
                    </v-icon>
                    <div>
                      <p class="text-caption text-grey-darken-1">Drop-off</p>
                      <p class="text-h6 font-weight-bold">{{ formatDate(dateSelected.end) }}</p>
                      <p class="text-body-2 text-grey-darken-1">
                        {{ formatTime(dateSelected.end) }}
                      </p>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-alert type="info" variant="tonal" class="mt-4">
              <template v-slot:prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              Total rental duration: <strong>{{ reservation.totalDays }} days</strong>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column: Payment Summary -->
      <v-col cols="12" md="5">
        <v-card elevation="4" class="summary-card">
          <v-card-title class="bg-green-darken-3 text-white pa-4">
            <v-icon class="mr-2">mdi-receipt-text</v-icon>
            Payment Summary
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Price Breakdown -->
            <v-list class="price-list" density="comfortable">
              <v-list-item>
                <v-list-item-title>
                  Rental Fee ({{ reservation.totalDays }} days)
                </v-list-item-title>
                <template v-slot:append>
                  <span class="text-h6">£{{ price.price.toFixed(2) }}</span>
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Taxes & Fees (15%)</v-list-item-title>
                <template v-slot:append>
                  <span class="text-h6">£{{ price.taxes.toFixed(2) }}</span>
                </template>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Insurance (5%)</v-list-item-title>
                <template v-slot:append>
                  <span class="text-h6">£{{ price.insurance.toFixed(2) }}</span>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-4" />

            <!-- Total -->
            <div class="d-flex justify-space-between align-center mb-6 total-section">
              <span class="text-h5 font-weight-bold">Total Amount</span>
              <span class="text-h4 font-weight-bold text-green-darken-3">
                £{{ price.total.toFixed(2) }}
              </span>
            </div>

            <!-- Payment Button -->
            <v-btn
              block
              size="x-large"
              color="green-darken-3"
              prepend-icon="mdi-credit-card"
              :loading="processingPayment"
              @click="paymentDialog = true"
            >
              Proceed to Payment
            </v-btn>

            <!-- Security Note -->
            <v-alert type="success" variant="tonal" class="mt-4" density="compact">
              <template v-slot:prepend>
                <v-icon>mdi-shield-check</v-icon>
              </template>
              <span class="text-caption">Secure payment powered by SSL encryption</span>
            </v-alert>

            <!-- Cancellation Policy -->
            <v-expansion-panels class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Cancellation Policy
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <ul class="text-body-2">
                    <li>Free cancellation up to 24 hours before pick-up</li>
                    <li>50% refund for cancellations within 24 hours</li>
                    <li>No refund for no-shows</li>
                  </ul>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Dialog -->
    <v-dialog v-model="paymentDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="bg-green-darken-3 text-white pa-4">
          <v-icon class="mr-2">mdi-credit-card</v-icon>
          Complete Payment
        </v-card-title>

        <v-card-text class="pa-6">
          <PayWall
            :amount="price.total"
            @payment-success="handlePaymentSuccess"
            @payment-error="handlePaymentError"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="paymentDialog = false" :disabled="processingPayment">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.reserve-container {
  max-width: 1400px;
  padding: 2rem 1rem;
}

.loading-state {
  min-height: 60vh;
}

.success-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
}

.booking-reference {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.car-details-card,
.rental-period-card,
.summary-card {
  border-radius: 16px !important;
}

.car-hero-image {
  border-radius: 16px 16px 0 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.date-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1rem;
  height: 100%;
}

.pickup-card {
  border-left: 4px solid #2e7d32;
}

.dropoff-card {
  border-left: 4px solid #f57c00;
}

.price-list .v-list-item {
  padding: 0.75rem 0;
}

.total-section {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 12px;
}

/* Mobile Responsiveness */
@media (max-width: 960px) {
  .reserve-container {
    padding: 1rem;
  }
}

/* Animation for success state */
@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-card .v-icon {
  animation: bounceIn 0.6s ease-out;
}
</style>
