<template>
  <q-page class="login-wrapper flex flex-center">
    <div class="bg-circle-1"></div>
    <div class="bg-circle-2"></div>
    <div class="bg-circle-3"></div>

    <div class="login-container">
      <!-- Standard Header / Logo -->
      <div class="flex column items-center q-mb-lg">
        <div class="logo-icon q-mb-md">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect x="4" y="15" width="26" height="4" rx="2" fill="white" />
            <rect x="15" y="4" width="4" height="26" rx="2" fill="white" />
          </svg>
        </div>
        <div class="text-center">
          <div
            class="text-h5 font-sora text-weight-bold"
            style="color: #0d2922; letter-spacing: -0.3px"
          >
            Activ PT
          </div>
          <div class="font-inter" style="color: #6b9e94; font-size: 13px; margin-top: 3px">
            Your daily physiotherapy guide
          </div>
        </div>
      </div>

      <!-- Step 1: Input Phone -->
      <div v-if="step === 'phone'" class="full-width flex column">
        <div class="text-center q-mb-xl">
          <div class="font-sora text-weight-bold" style="font-size: 16px; color: #2d5e56">
            Welcome Back
          </div>
          <div class="font-inter" style="font-size: 13px; color: #9dbdb8; margin-top: 4px">
            Enter your registered number to continue
          </div>
        </div>

        <q-input
          v-model="authStore.loginData.username"
          type="tel"
          placeholder="Phone Number"
          class="custom-phone-input font-sora q-mb-xl"
          filled
          :rules="[(val) => !!val || 'Required']"
          :error="!!phoneError"
          :error-message="phoneError"
          @update:model-value="phoneError = ''"
        >
        </q-input>

        <button
          @click="submitPhone"
          class="primary-btn q-mt-md"
          :disabled="!authStore.loginData.username || loadingPhone"
        >
          {{ loadingPhone ? 'Verifying...' : 'Continue' }}
        </button>
      </div>

      <!-- Step 2: Input Login PIN -->
      <div v-if="step === 'pin'" class="full-width flex column">
        <!-- Phone pill -->
        <div
          class="flex items-center q-mb-lg"
          style="
            background: rgba(10, 126, 110, 0.05);
            border: 1px solid rgba(10, 126, 110, 0.13);
            border-radius: 14px;
            padding: 13px 16px;
            gap: 12px;
          "
        >
          <div
            style="
              width: 36px;
              height: 36px;
              border-radius: 10px;
              background: rgba(10, 126, 110, 0.09);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            "
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A7E6E"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
          </div>
          <div class="column flex-1" style="flex: 1">
            <div
              class="font-inter text-uppercase text-weight-bold"
              style="font-size: 10.5px; color: #7ab5ac; letter-spacing: 0.7px"
            >
              Phone Number
            </div>
            <div
              class="font-sora text-weight-bold"
              style="font-size: 15.5px; color: #0d2922; margin-top: 1px; letter-spacing: 0.3px"
            >
              {{ formatPhone(authStore.loginData.username) }}
            </div>
          </div>
          <q-btn
            flat
            rounded
            dense
            color="primary"
            icon="edit"
            label="Edit"
            no-caps
            class="font-inter text-weight-bold"
            style="
              background: rgba(10, 126, 110, 0.1);
              padding: 4px 12px;
              font-size: 11px;
              flex-shrink: 0;
            "
            @click="editPhone"
          />
        </div>

        <div class="flex column items-center q-mb-lg" style="gap: 14px">
          <div class="text-center">
            <div class="font-sora text-weight-bold" style="font-size: 14.5px; color: #2d5e56">
              {{ loading ? 'Verifying...' : 'Enter your PIN' }}
            </div>
            <div
              v-if="!loading && !errorText"
              class="font-inter"
              style="font-size: 12px; color: #9dbdb8; margin-top: 4px"
            >
              Use your 4-digit access PIN
            </div>
            <div
              v-if="errorText"
              class="font-inter text-weight-medium"
              style="font-size: 12.5px; color: #d95858; margin-top: 4px"
            >
              {{ errorText }}
            </div>
          </div>
          <div class="flex justify-center" :class="{ 'shake-anim': shake }" style="gap: 14px">
            <div
              v-for="i in 4"
              :key="i"
              class="pin-dot"
              :class="i <= loginPin.length ? 'filled' : 'empty-dot'"
            ></div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center q-py-md">
          <div class="spinner"></div>
        </div>
        <div v-else class="column" style="gap: 10px">
          <div v-for="(row, ri) in numKeys" :key="ri" class="flex justify-center" style="gap: 10px">
            <template v-for="(k, ki) in row" :key="ki">
              <div v-if="k === null" style="width: 76px; height: 76px"></div>
              <button v-else-if="k === 'del'" @click="delKey" class="numpad-btn del-btn">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0A7E6E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>
              <button v-else @click="pressKey(k)" class="numpad-btn">{{ k }}</button>
            </template>
          </div>
        </div>
      </div>

      <!-- Step 3: Set PIN (New & Confirm) abstracted via SetPin Component -->
      <SetPin
        v-if="step.startsWith('setpin')"
        icon="👋"
        title="Set Permanent PIN"
        subtitle="Create a personal PIN to replace your temporary access PIN."
        :show-success-screen="false"
        :submit-function="handleSetPinSubmit"
      />

      <!-- Support Footer -->
      <div class="text-center q-mt-xl">
        <span class="font-inter" style="font-size: 12.5px; color: #9dbdb8">Having trouble? </span>
        <a
          :href="whatsappLink"
          target="_blank"
          class="font-inter text-weight-bold"
          style="font-size: 12.5px; color: #0a7e6e; text-decoration: none; cursor: pointer"
          >Contact Support</a
        >
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'
import SetPin from 'src/components/SetPin.vue'

const router = useRouter()
const authStore = useAuthStore()

const step = ref('phone') // phone, pin, setpin-new
const loading = ref(false)
const errorText = ref('')
const shake = ref(false)

const phoneError = ref('')
const loadingPhone = ref(false)

const loginPin = ref('')

const numKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [null, '0', 'del'],
]

// WhatsApp Link
const whatsappLink = computed(() => {
  const phone = authStore.loginData.username || '_______'
  const message = `Hello Support Team, I am facing an issue while trying to log in to the Activ PT app. My registered phone number is ${phone}. Kindly assist me.`
  return `https://wa.me/919797885719?text=${encodeURIComponent(message)}`
})

const formatPhone = (phone) => {
  if (!phone) return ''
  const str = phone.toString()
  if (str.length > 5) {
    return str.slice(0, 5) + ' ' + str.slice(5)
  }
  return str
}

const submitPhone = async () => {
  if (authStore.loginData.username) {
    phoneError.value = ''
    loadingPhone.value = true
    try {
      const response = await api.post('authenticatePhoneNumber', {
        phone: authStore.loginData.username,
      })

      if (response.data && response.data.exists) {
        // Reset any old pin data upon re-entering phone step
        loginPin.value = ''
        step.value = 'pin'
      } else {
        phoneError.value = response.data.message || 'Phone number is not registered with Activ PT.'
      }
    } catch (e) {
      phoneError.value =
        e.response?.data?.message || 'Phone number is not registered with Activ PT.'
    } finally {
      loadingPhone.value = false
    }
  }
}

const editPhone = () => {
  step.value = 'phone'
}

const pressKey = (k) => {
  if (loginPin.value.length >= 4 || loading.value) return
  errorText.value = ''

  if (step.value === 'pin') {
    loginPin.value += k
    if (loginPin.value.length === 4) handleLogin()
  }
}

const delKey = () => {
  if (loading.value) return
  errorText.value = ''

  if (step.value === 'pin') {
    loginPin.value = loginPin.value.slice(0, -1)
  }
}

const handleLogin = () => {
  loading.value = true
  authStore.loginData.password = loginPin.value
  authStore.router = router

  authStore.login()

  setTimeout(() => {
    loading.value = false

    // Check if require password reset activated
    if (authStore.requiresPasswordReset) {
      step.value = 'setpin-new'
      return
    }

    // Check for error via authStore's server error
    if (authStore.serverError || !authStore.token_id) {
      errorText.value = 'Invalid PIN'
      triggerShake()
      loginPin.value = ''
    }
  }, 1200) // generous timeout to let Store perform API calls and loading hides
}

const triggerShake = () => {
  shake.value = true
  setTimeout(() => {
    shake.value = false
  }, 520)
}

const handleSetPinSubmit = (pin) => {
  return new Promise((resolve) => {
    authStore.router = router
    authStore.resetPassword(pin)

    setTimeout(() => {
      if (authStore.serverError) {
        resolve({ success: false, message: 'Failed to reset PIN. Try again.' })
      } else {
        resolve({ success: true })
      }
    }, 1200)
  })
}
</script>

<style scoped src="src/css/login.css"></style>
