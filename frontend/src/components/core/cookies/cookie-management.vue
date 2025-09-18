<script setup>
import {onMounted, ref} from 'vue'
import cookieService from "@/services/settings/CookieService.js";

const consentTypes = ref({
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false
})

const consentDate = ref(null)

onMounted(() => {
  const consent = cookieService.getConsent()
  if (consent) {
    consentTypes.value = { ...consentTypes.value, ...consent }
  }

  const date = localStorage.getItem('cookie-consent-date')
  if (date) {
    consentDate.value = new Date(date).toLocaleDateString()
  }
})

const updateConsent = () => {
  cookieService.setConsent(consentTypes.value)
  alert('Cookie preferences updated successfully!')
}

const clearAllCookies = () => {
  if (confirm('Are you sure you want to clear all cookie preferences?')) {
    cookieService.clearConsent()
    consentTypes.value = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    consentDate.value = null
  }
}
</script>

<template>
  <div class="cookie-settings">
    <div class="container">
      <h1>Cookie Settings</h1>

      <div v-if="consentDate" class="consent-info">
        <p><strong>Last updated:</strong> {{ consentDate }}</p>
      </div>

      <div class="cookie-categories">
        <div class="cookie-category">
          <label class="cookie-category__label">
            <input
                type="checkbox"
                v-model="consentTypes.necessary"
                disabled
            >
            <div>
              <strong>Necessary Cookies</strong>
              <span class="required">(Required)</span>
              <p>Essential for the website to function properly. These cannot be disabled.</p>
            </div>
          </label>
        </div>

        <div class="cookie-category">
          <label class="cookie-category__label">
            <input
                type="checkbox"
                v-model="consentTypes.functional"
            >
            <div>
              <strong>Functional Cookies</strong>
              <p>Remember your preferences and settings to enhance your experience.</p>
            </div>
          </label>
        </div>

        <div class="cookie-category">
          <label class="cookie-category__label">
            <input
                type="checkbox"
                v-model="consentTypes.analytics"
            >
            <div>
              <strong>Analytics Cookies</strong>
              <p>Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
            </div>
          </label>
        </div>

        <div class="cookie-category">
          <label class="cookie-category__label">
            <input
                type="checkbox"
                v-model="consentTypes.marketing"
            >
            <div>
              <strong>Marketing Cookies</strong>
              <p>Used to deliver relevant advertisements and track the effectiveness of advertising campaigns.</p>
            </div>
          </label>
        </div>
      </div>

      <div class="actions">
        <button @click="updateConsent" class="btn btn--primary">
          Save Preferences
        </button>
        <button @click="clearAllCookies" class="btn btn--danger">
          Clear All Preferences
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cookie-settings {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.container h1 {
  margin-bottom: 30px;
  color: #333;
}

.consent-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.consent-info p {
  margin: 0;
  color: #666;
}

.cookie-categories {
  margin-bottom: 30px;
}

.cookie-category {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.cookie-category__label {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  cursor: pointer;
}

.cookie-category__label input[type="checkbox"] {
  margin-top: 2px;
  flex-shrink: 0;
}

.cookie-category__label div {
  flex: 1;
}

.cookie-category__label strong {
  color: #333;
}

.required {
  color: #666;
  font-size: 0.9em;
  font-weight: normal;
  margin-left: 8px;
}

.cookie-category__label p {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 0.9em;
  line-height: 1.4;
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn--primary {
  background: #007bff;
  color: white;
}

.btn--primary:hover {
  background: #0056b3;
}

.btn--danger {
  background: #dc3545;
  color: white;
}

.btn--danger:hover {
  background: #c82333;
}
</style>