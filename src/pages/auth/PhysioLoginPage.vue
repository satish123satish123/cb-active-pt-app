<template>
  <q-page class="ph-login">
    <!-- Hero -->
    <div class="ph-hero">
      <div class="ph-hero-icon">🩺</div>
      <h1 class="ph-hero-title font-sora">Activ PT</h1>
      <p class="ph-hero-sub font-inter">Physiotherapist workspace</p>
    </div>

    <!-- Floating card -->
    <div class="ph-stack">
      <div class="ph-card">
        <p class="ph-field-label font-inter">Registered phone / ID</p>
        <input
          v-model="username"
          class="ph-input font-inter"
          type="text"
          autocomplete="username"
          :disabled="loading"
          @keyup.enter="focusPin"
        />

        <p class="ph-field-label font-inter" style="margin-top: 14px">PIN</p>
        <input
          ref="pinRef"
          v-model="pin"
          class="ph-input font-inter"
          type="password"
          inputmode="numeric"
          autocomplete="current-password"
          :disabled="loading"
          @keyup.enter="submit"
        />

        <p v-if="formError" class="ph-error font-inter">{{ formError }}</p>

        <button class="ph-btn-primary font-sora" :disabled="loading" @click="submit">
          {{ loading ? 'Logging in…' : 'Log in' }}
        </button>

        <p class="ph-tiny font-inter">
          Patient?
          <router-link to="/login" class="ph-tiny-link">Log in here</router-link>
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()

const username = ref('')
const pin = ref('')
const formError = ref('')
const loading = ref(false)
const pinRef = ref(null)

function focusPin() {
  pinRef.value?.focus()
}

async function submit() {
  formError.value = ''
  if (!username.value) {
    formError.value = 'Please enter your registered phone / ID'
    return
  }
  if (!pin.value) {
    formError.value = 'Please enter your PIN'
    return
  }
  loading.value = true
  try {
    authStore.loginData.username = username.value
    authStore.loginData.password = pin.value
    await authStore.login()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ph-login {
  --bg: #f4f8f8;
  --card: #ffffff;
  --text: #10212a;
  --text-2: #5a6c76;
  --text-3: #8da0aa;
  --line: #dce7ea;
  --brand: #0a7e6e;
  --brand-2: #0f9886;
  --danger: #d9485f;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
  --shadow-md: 0 14px 34px rgba(16, 33, 42, 0.1);
  --grad: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);

  background: var(--bg);
  max-width: 460px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}

.ph-hero {
  background: var(--grad);
  color: #fff;
  padding: 64px 24px 80px;
  border-radius: 0 0 34px 34px;
  box-shadow: var(--shadow-md);
  position: relative;
  flex: none;
}
.ph-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at left 30% bottom 20%, rgba(255, 255, 255, 0.1), transparent 22%);
  pointer-events: none;
  border-radius: 0 0 34px 34px;
}
.ph-hero-icon {
  font-size: 30px;
  position: relative;
  z-index: 1;
}
.ph-hero-title {
  margin: 14px 0 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
}
.ph-hero-sub {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
  position: relative;
  z-index: 1;
}

.ph-stack {
  margin-top: -44px;
  padding: 0 16px;
  position: relative;
  z-index: 4;
  flex: 1;
}
.ph-card {
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}

.ph-field-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-2);
  margin: 0 0 6px 2px;
  letter-spacing: 0.01em;
}
.ph-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 11px 12px;
  background: #fff;
  color: var(--text);
  outline: none;
  font-size: 15px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ph-input:focus {
  border-color: var(--brand-2);
  box-shadow: 0 0 0 3px rgba(15, 152, 134, 0.12);
}
.ph-input:disabled {
  opacity: 0.6;
}

.ph-error {
  margin: 10px 2px 0;
  color: var(--danger);
  font-size: 12.5px;
  font-weight: 600;
}

.ph-btn-primary {
  width: 100%;
  border: none;
  cursor: pointer;
  border-radius: 14px;
  min-height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: -0.01em;
  background: var(--grad);
  color: #fff;
  box-shadow: var(--shadow-sm);
  margin-top: 18px;
  transition: transform 0.18s ease;
}
.ph-btn-primary:active {
  transform: scale(0.985);
}
.ph-btn-primary:disabled {
  opacity: 0.65;
  cursor: default;
}

.ph-tiny {
  text-align: center;
  margin: 14px 0 0;
  color: var(--text-3);
  font-size: 12px;
}
.ph-tiny-link {
  color: var(--brand);
  font-weight: 700;
  text-decoration: none;
}
</style>