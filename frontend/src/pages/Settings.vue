<script setup>
import {useSettings} from '@/services/settings/SettingsService.js'
import {onMounted} from 'vue'

const {
  settings,
  isLoading,
  error,
  loadSettings,
  updateSetting,
  resetSettings
} = useSettings()

onMounted(() => {
  loadSettings()
})

const themes = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'auto', label: 'Automatique' }
]

const imageQualities = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'ultra', label: 'Ultra' }
]

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' }
]

const fontSizes = [
  { value: 'small', label: 'Petite' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'large', label: 'Grande' }
]
</script>

<template>
  <section class="main-content">
    <h2>Mes paramètres</h2>

    <div v-if="isLoading" class="loading">
      Chargement des paramètres...
    </div>

    <div v-if="error" class="error">
      Erreur : {{ error }}
    </div>

    <div v-if="!isLoading && settings">
      <!-- Apparence -->
      <section class="settings-section">
        <h3>Apparence</h3>

        <div class="setting-item">
          <label>Thème</label>
          <select
              :value="settings.theme"
              @change="updateSetting('theme', $event.target.value)"
          >
            <option
                v-for="theme in themes"
                :key="theme.value"
                :value="theme.value"
            >
              {{ theme.label }}
            </option>
          </select>
        </div>

        <div class="setting-item">
          <label>Langue</label>
          <select
              :value="settings.language"
              @change="updateSetting('language', $event.target.value)"
          >
            <option
                v-for="lang in languages"
                :key="lang.value"
                :value="lang.value"
            >
              {{ lang.label }}
            </option>
          </select>
        </div>

        <div class="setting-item">
          <label>Taille de police</label>
          <select
              :value="settings.fontSize"
              @change="updateSetting('fontSize', $event.target.value)"
          >
            <option
                v-for="size in fontSizes"
                :key="size.value"
                :value="size.value"
            >
              {{ size.label }}
            </option>
          </select>
        </div>
      </section>

      <!-- Image/Caméra -->
      <section class="settings-section">
        <h3>Image et Caméra</h3>

        <div class="setting-item">
          <label>Qualité de l'image</label>
          <select
              :value="settings.imageQuality"
              @change="updateSetting('imageQuality', $event.target.value)"
          >
            <option
                v-for="quality in imageQualities"
                :key="quality.value"
                :value="quality.value"
            >
              {{ quality.label }}
            </option>
          </select>
        </div>

        <div class="setting-item">
          <label>Niveau de compression</label>
          <input
              type="range"
              min="10"
              max="100"
              step="10"
              :value="settings.compressionLevel"
              @input="updateSetting('compressionLevel', parseInt($event.target.value))"
          >
          <span>{{ settings.compressionLevel }}%</span>
        </div>

        <div class="setting-item">
          <label>
            <input
                type="checkbox"
                :checked="settings.autoSave"
                @change="updateSetting('autoSave', $event.target.checked)"
            >
            Sauvegarde automatique
          </label>
        </div>
      </section>

      <!-- Notifications -->
      <section class="settings-section">
        <h3>Notifications</h3>

        <div class="setting-item">
          <label>
            <input
                type="checkbox"
                :checked="settings.notifications.email"
                @change="updateSetting('notifications.email', $event.target.checked)"
            >
            Notifications par email
          </label>
        </div>

        <div class="setting-item">
          <label>
            <input
                type="checkbox"
                :checked="settings.notifications.push"
                @change="updateSetting('notifications.push', $event.target.checked)"
            >
            Notifications push
          </label>
        </div>

        <div class="setting-item">
          <label>
            <input
                type="checkbox"
                :checked="settings.notifications.sound"
                @change="updateSetting('notifications.sound', $event.target.checked)"
            >
            Sons de notification
          </label>
        </div>
      </section>

      <!-- Sécurité -->
      <section class="settings-section">
        <h3>Sécurité</h3>

        <div class="setting-item">
          <label>
            <input
                type="checkbox"
                :checked="settings.twoFactorAuth"
                @change="updateSetting('twoFactorAuth', $event.target.checked)"
            >
            Authentification à deux facteurs
          </label>
        </div>

        <div class="setting-item">
          <label>
            <input
                type="checkbox"
                :checked="settings.autoLogout"
                @change="updateSetting('autoLogout', $event.target.checked)"
            >
            Déconnexion automatique
          </label>
        </div>

        <div class="setting-item" v-if="settings.autoLogout">
          <label>Délai de session (minutes)</label>
          <input
              type="number"
              min="5"
              max="120"
              :value="settings.sessionTimeout"
              @input="updateSetting('sessionTimeout', parseInt($event.target.value))"
          >
        </div>
      </section>

      <!-- Actions -->
      <section class="settings-section">
        <div class="setting-actions">
          <button @click="resetSettings" class="reset-btn">
            Réinitialiser les paramètres
          </button>
        </div>
      </section>
    </div>

    <!-- Existing problem container -->
    <section class="problem-container">
      <button>Contacter le support</button>
      <button>Déconnecter les appareils</button>
      <button>Supprimer mon compte</button>
    </section>
  </section>
</template>

<style scoped>
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
}

.error {
  color: #e74c3c;
  background: #fdf2f2;
  border: 1px solid #e74c3c;
  border-radius: 4px;
}

.settings-section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.settings-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.setting-item {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-item label {
  min-width: 200px;
  font-weight: 500;
}

.setting-item select,
.setting-item input[type="number"],
.setting-item input[type="range"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 150px;
}

.setting-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.setting-actions {
  text-align: center;
  padding: 1rem 0;
}

.reset-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.reset-btn:hover {
  background: #e67e22;
}

.problem-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.problem-container button {
  border: none;
  border-radius: 15px;
  padding: 0.5rem;
  width: 15rem;
  cursor: pointer;
}
</style>
