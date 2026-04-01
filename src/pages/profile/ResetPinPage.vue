<template>
  <q-page class="q-pa-md q-pb-xl premium-layout">

    <!-- Top Header -->
    <div class="row items-center q-mb-xl q-mt-sm scale-in">
      <q-btn flat round dense icon="arrow_back_ios_new" color="dark" class="action-btn q-mr-md" to="/profile" />
      <div class="text-h5 text-weight-bolder text-dark tracking-tight">Reset PIN</div>
    </div>

    <!-- ── STEP 1: Set New PIN ── -->
    <template v-if="step === 'newpin'">

      <div class="flex flex-center q-mb-lg scale-in-delay-1">
        <div class="pin-icon-wrapper flex flex-center">
          <q-icon name="lock_open" size="44px" color="white" />
        </div>
      </div>

      <div class="text-center q-mb-xl scale-in-delay-1">
        <div class="text-h6 text-weight-bold text-dark tracking-tight">Set New PIN</div>
        <div class="text-body2 text-grey-6 q-mt-xs">Choose a new 4-digit PIN</div>
      </div>

      <!-- Step Progress -->
      <div class="step-progress row items-center justify-center q-mb-lg">
        <div class="step-dot active"></div>
        <div class="step-line"></div>
        <div class="step-dot"></div>
      </div>

      <div class="flex justify-center q-mb-xl" :class="{ 'shake-anim': shake }">
        <div
          v-for="i in 4"
          :key="i"
          class="pin-dot"
          :class="newPin.length >= i ? 'dot-filled' : 'dot-empty'"
        ></div>
      </div>

      <div class="numpad-grid">
        <div v-for="(row, ri) in numKeys" :key="ri" class="numpad-row">
          <template v-for="(k, ki) in row" :key="ki">
            <div v-if="k === null" class="numpad-spacer"></div>
            <button v-else-if="k === 'del'" @click="delKey('newpin')" class="numpad-btn del-btn">
              <q-icon name="backspace" size="22px" color="primary" />
            </button>
            <button v-else @click="pressKey(k, 'newpin')" class="numpad-btn">{{ k }}</button>
          </template>
        </div>
      </div>

    </template>

    <!-- ── STEP 3: Confirm New PIN ── -->
    <template v-else-if="step === 'confirm'">

      <div class="flex flex-center q-mb-lg scale-in-delay-1">
        <div class="pin-icon-wrapper flex flex-center" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
          <q-icon name="verified" size="44px" color="white" />
        </div>
      </div>

      <div class="text-center q-mb-xl scale-in-delay-1">
        <div class="text-h6 text-weight-bold text-dark tracking-tight">Confirm New PIN</div>
        <div class="text-body2 q-mt-xs" :style="{ color: errorText ? '#ef4444' : '#9ca3af' }">
          {{ errorText || 'Enter the same PIN again' }}
        </div>
      </div>

      <!-- Step Progress -->
      <div class="step-progress row items-center justify-center q-mb-lg">
        <div class="step-dot done"></div>
        <div class="step-line active"></div>
        <div class="step-dot active"></div>
      </div>

      <div class="flex justify-center q-mb-xl" :class="{ 'shake-anim': shake }">
        <div
          v-for="i in 4"
          :key="i"
          class="pin-dot"
          :class="confirmPin.length >= i ? 'dot-filled' : 'dot-empty'"
        ></div>
      </div>

      <div v-if="loading" class="flex justify-center q-py-md">
        <q-circular-progress indeterminate color="primary" size="40px" />
      </div>
      <div v-else class="numpad-grid">
        <div v-for="(row, ri) in numKeys" :key="ri" class="numpad-row">
          <template v-for="(k, ki) in row" :key="ki">
            <div v-if="k === null" class="numpad-spacer"></div>
            <button v-else-if="k === 'del'" @click="delKey('confirm')" class="numpad-btn del-btn">
              <q-icon name="backspace" size="22px" color="primary" />
            </button>
            <button v-else @click="pressKey(k, 'confirm')" class="numpad-btn">{{ k }}</button>
          </template>
        </div>
      </div>

    </template>

    <!-- ── STEP 4: Success ── -->
    <template v-else-if="step === 'success'">
      <div class="flex flex-center column q-mt-xl scale-in-delay-1" style="gap: 20px;">
        <div class="success-icon flex flex-center">
          <q-icon name="check_circle" size="72px" color="white" />
        </div>
        <div class="text-h5 text-weight-bolder text-dark tracking-tight text-center">PIN Reset!</div>
        <div class="text-body2 text-grey-6 text-center">
          Your PIN has been updated successfully.<br>Please log in again with your new PIN.
        </div>
        <q-btn
          unelevated
          class="save-btn full-width q-mt-lg"
          label="Go to Login"
          size="lg"
          no-caps
          @click="goToLogin"
        />
      </div>
    </template>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()

// ── State ──
// Flow: newpin → confirm → success
// No need to verify current PIN — user is already authenticated via token
const step      = ref('newpin')
const loading   = ref(false)
const shake     = ref(false)
const errorText = ref('')

const newPin     = ref('')
const confirmPin = ref('')

// ── Numpad layout ──
const numKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [null, '0', 'del'],
]

// ── Key handlers ──
const pressKey = (k, forStep) => {
  if (loading.value) return
  errorText.value = ''

  if (forStep === 'newpin') {
    if (newPin.value.length >= 4) return
    newPin.value += k
    if (newPin.value.length === 4) setTimeout(() => { step.value = 'confirm' }, 160)

  } else if (forStep === 'confirm') {
    if (confirmPin.value.length >= 4) return
    confirmPin.value += k
    if (confirmPin.value.length === 4) setTimeout(submitResetPin, 160)
  }
}

const delKey = (forStep) => {
  if (loading.value) return
  errorText.value = ''
  if (forStep === 'newpin')  newPin.value     = newPin.value.slice(0, -1)
  if (forStep === 'confirm') confirmPin.value = confirmPin.value.slice(0, -1)
}

const triggerShake = () => {
  shake.value = true
  setTimeout(() => { shake.value = false }, 520)
}

// ── Submit: resetPassword API ──
// username = email stored in authStore.user.email (set during login)
// password = new PIN chosen by user
const submitResetPin = async () => {
  // Client-side confirm check
  if (confirmPin.value !== newPin.value) {
    errorText.value = "PINs don't match. Try again."
    confirmPin.value = ''
    triggerShake()
    return
  }

  loading.value = true

  try {
    const userEmail = authStore.user?.email
    const response = await api.post('resetPassword', {
      username: userEmail,
      password: newPin.value,
    })

    if (response.data?.status === 'success') {
      step.value = 'success'
      Notify.create({
        type: 'positive',
        message: response.data.message || 'PIN reset successfully!',
        position: 'top',
        icon: 'check_circle',
      })
    } else {
      // API returned 200 but with error status
      errorText.value = response.data?.message || 'Reset failed. Try again.'
      confirmPin.value = ''
      triggerShake()
    }
  } catch (e) {
    // Network / 4xx / 5xx error
    errorText.value = e.response?.data?.message || e.message || 'Failed to reset PIN. Try again.'
    confirmPin.value = ''
    triggerShake()
  } finally {
    loading.value = false
  }
}

// ── Go to Login after success ──
const goToLogin = async () => {
  authStore.loginData.username = authStore.user?.phone || ''
  authStore.loginData.password = null
  await authStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
/* Typography */
.tracking-tight { letter-spacing: -0.5px; }

/* Animations */
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
.scale-in         { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.scale-in-delay-1 { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
}
.shake-anim { animation: shake 0.5s ease; }

.premium-layout { min-height: calc(100vh - 80px); }

/* Back Button */
.action-btn {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.02);
}

/* PIN Icon Banner */
.pin-icon-wrapper {
  width: 96px;
  height: 96px;
  border-radius: 30px;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  box-shadow: 0 16px 40px rgba(14, 165, 233, 0.28);
  transition: background 0.4s ease;
}

/* Success Icon */
.success-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 20px 48px rgba(16, 185, 129, 0.35);
}

/* PIN Dots */
.pin-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin: 0 10px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.dot-empty  { background: #e5e7eb; transform: scale(1); }
.dot-filled {
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  transform: scale(1.25);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

/* Step Progress (verify → new) */
.step-progress { gap: 6px; }
.step-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: all 0.3s ease;
}
.step-dot.done   { background: #10b981; }
.step-dot.active { background: #8b5cf6; }
.step-line {
  width: 40px; height: 3px;
  border-radius: 2px;
  background: #e5e7eb;
  transition: background 0.3s ease;
}
.step-line.active { background: linear-gradient(to right, #10b981, #8b5cf6); }

/* Numpad */
.numpad-grid { display: flex; flex-direction: column; gap: 10px; }
.numpad-row  { display: flex; justify-content: center; gap: 10px; }
.numpad-spacer { width: 76px; height: 76px; }

.numpad-btn {
  width: 76px;
  height: 76px;
  border-radius: 22px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
}
.numpad-btn:hover  { background: white; box-shadow: 0 6px 20px rgba(0,0,0,0.1); transform: translateY(-1px); }
.numpad-btn:active { transform: scale(0.94); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.del-btn { background: rgba(14, 165, 233, 0.07); }

/* Save / Reset Button */
.save-btn {
  border-radius: 20px;
  background: linear-gradient(135deg, #0ea5e9, #10b981) !important;
  color: white;
  font-weight: bold;
  letter-spacing: 0.5px;
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}
.save-btn:hover  { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4); }
.save-btn:active { transform: translateY(1px); }

/* Mobile responsive */
@media (max-width: 380px) {
  .numpad-btn { width: 68px; height: 68px; font-size: 1.3rem; border-radius: 18px; }
  .numpad-spacer { width: 68px; height: 68px; }
}
</style>
