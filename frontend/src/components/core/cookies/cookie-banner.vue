<script setup>
import {onMounted, ref} from 'vue'

const isVisible = ref(false)
const consentTypes = ref({
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false
})

const emit = defineEmits(['consent-given'])

onMounted(() => {
  // Check if user has already given consent
  const consent = localStorage.getItem('cookie-consent')
  if (!consent) {
    isVisible.value = true
  } else {
    // Load saved preferences
    const savedConsent = JSON.parse(consent)
    consentTypes.value = { ...consentTypes.value, ...savedConsent }
  }
})

const acceptAll = () => {
  consentTypes.value = {
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true
  }
  saveConsent()
}

const acceptSelected = () => {
  saveConsent()
}

const rejectAll = () => {
  consentTypes.value = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  }
  saveConsent()
}

const saveConsent = () => {
  localStorage.setItem('cookie-consent', JSON.stringify(consentTypes.value))
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  isVisible.value = false

  // Emit event with consent details
  emit('consent-given', consentTypes.value)
}

const showPreferences = ref(false)
</script>

<template>
  <div v-if="isVisible" class="cookie-banner">
    <div class="cookie-banner__backdrop" @click="isVisible = false"></div>

    <div class="cookie-banner__content">
      <div class="cookie-banner__header">
        <h3>🍪 We use cookies</h3>
        <button
            @click="isVisible = false"
            class="cookie-banner__close"
            aria-label="Close"
        >
          ×
        </button>
      </div>

      <div class="cookie-banner__body">
        <p>
          We use cookies to enhance your experience on our website.
          You can choose which types of cookies you allow.
        </p>

        <div v-if="showPreferences" class="cookie-preferences">
          <div class="cookie-category">
            <label class="cookie-category__label">
              <input
                  type="checkbox"
                  v-model="consentTypes.necessary"
                  disabled
              >
              <strong>Necessary Cookies</strong>
              <span class="required">(Required)</span>
            </label>
            <p class="cookie-category__description">
              Essential for the website to function properly.
            </p>
          </div>

          <div class="cookie-category">
            <label class="cookie-category__label">
              <input
                  type="checkbox"
                  v-model="consentTypes.functional"
              >
              <strong>Functional Cookies</strong>
            </label>
            <p class="cookie-category__description">
              Remember your preferences and settings.
            </p>
          </div>

          <div class="cookie-category">
            <label class="cookie-category__label">
              <input
                  type="checkbox"
                  v-model="consentTypes.analytics"
              >
              <strong>Analytics Cookies</strong>
            </label>
            <p class="cookie-category__description">
              Help us understand how you use our website.
            </p>
          </div>

          <div class="cookie-category">
            <label class="cookie-category__label">
              <input
                  type="checkbox"
                  v-model="consentTypes.marketing"
              >
              <strong>Marketing Cookies</strong>
            </label>
            <p class="cookie-category__description">
              Used to deliver relevant advertisements.
            </p>
          </div>
        </div>
      </div>

      <div class="cookie-banner__footer">
        <div class="cookie-banner__buttons">
          <button
              v-if="!showPreferences"
              @click="showPreferences = true"
              class="btn btn--secondary"
          >
            Customize
          </button>
          <button
              v-if="showPreferences"
              @click="acceptSelected"
              class="btn btn--primary"
          >
            Save Preferences
          </button>
          <button
              v-if="!showPreferences"
              @click="rejectAll"
              class="btn btn--secondary"
          >
            Reject All
          </button>
          <button
              @click="acceptAll"
              class="btn btn--primary"
          >
            Accept All
          </button>
        </div>

        <div class="cookie-banner__links">
          <a href="/privacy-policy" target="_blank">Privacy Policy</a>
          <a href="/cookie-policy" target="_blank">Cookie Policy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.cookie-banner__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.cookie-banner__content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.cookie-banner__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.cookie-banner__header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2em;
}

.cookie-banner__close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.cookie-banner__close:hover {
  background-color: #f0f0f0;
}

.cookie-banner__body {
  padding: 20px;
}

.cookie-banner__body p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.cookie-preferences {
  margin-top: 20px;
}

.cookie-category {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.cookie-category__label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 8px;
}

.cookie-category__label input[type="checkbox"] {
  margin: 0;
}

.required {
  color: #666;
  font-size: 0.9em;
  font-weight: normal;
}

.cookie-category__description {
  color: #666;
  font-size: 0.9em;
  margin: 0;
  margin-left: 30px;
}

.cookie-banner__footer {
  padding: 0 20px 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.cookie-banner__buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
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

.btn--secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn--secondary:hover {
  background: #e2e6ea;
}

.cookie-banner__links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.cookie-banner__links a {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9em;
}

.cookie-banner__links a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .cookie-banner {
    padding: 10px;
    align-items: flex-end;
  }

  .cookie-banner__content {
    max-height: 80vh;
  }

  .cookie-banner__buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>