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
            Active PT
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
            Enter your phone number to continue
          </div>
        </div>

        <q-input
          v-model="authStore.loginData.username"
          type="tel"
          placeholder="Phone Number"
          class="custom-phone-input font-sora q-mb-xl"
          filled
          :rules="[(val) => !!val || 'Required']"
        >
          <template v-slot:prepend>
            <div class="text-weight-bold text-dark q-ml-sm">+91</div>
            <div
              class="q-ml-sm q-mr-xs"
              style="width: 1px; height: 24px; background: rgba(10, 126, 110, 0.2)"
            ></div>
          </template>
        </q-input>

        <button
          @click="submitPhone"
          class="primary-btn q-mt-md"
          :disabled="!authStore.loginData.username"
        >
          Continue
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
              +91 {{ formatPhone(authStore.loginData.username) }}
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
              :class="i <= activePin.length ? 'filled' : 'empty'"
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

      <!-- Step 3: Set PIN (New & Confirm) -->
      <div v-if="step.startsWith('setpin')" class="full-width flex column">
        <!-- Info banner -->
        <div
          class="flex"
          style="
            gap: 11px;
            align-items: flex-start;
            background: linear-gradient(135deg, rgba(10, 126, 110, 0.07), rgba(10, 126, 110, 0.04));
            border: 1px solid rgba(10, 126, 110, 0.14);
            border-radius: 14px;
            padding: 13px 15px;
            margin-bottom: 28px;
          "
        >
          <div
            style="
              width: 34px;
              height: 34px;
              border-radius: 9px;
              flex-shrink: 0;
              background: rgba(10, 126, 110, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
            "
          >
            👋
          </div>
          <div>
            <div class="font-sora text-weight-bold" style="font-size: 13.5px; color: #0d2922">
              Set Permanent PIN
            </div>
            <div
              class="font-inter"
              style="font-size: 12.5px; color: #5a9e93; margin-top: 3px; line-height: 1.5"
            >
              Create a personal PIN to replace your temporary access PIN.
            </div>
          </div>
        </div>

        <div class="flex items-center q-mb-lg" style="gap: 0">
          <div class="flex items-center" style="flex: 1">
            <div class="flex items-center" style="gap: 7px">
              <div
                :style="getSetPinStepStyle(0)"
                style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  font-size: 11px;
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.25s;
                "
              >
                {{ isConfirmStep ? '✓' : '1' }}
              </div>
              <span class="font-inter" :style="getSetPinTextStyle(0)">Set PIN</span>
            </div>
            <div
              style="
                flex: 1;
                height: 2px;
                margin: 0 10px;
                border-radius: 2px;
                transition: background 0.25s;
              "
              :style="{ background: isConfirmStep ? '#0A7E6E' : 'rgba(0,0,0,0.08)' }"
            ></div>
          </div>
          <div class="flex items-center" style="flex: none">
            <div class="flex items-center" style="gap: 7px">
              <div
                :style="getSetPinStepStyle(1)"
                style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  font-size: 11px;
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.25s;
                "
              >
                2
              </div>
              <span class="font-inter" :style="getSetPinTextStyle(1)">Confirm PIN</span>
            </div>
          </div>
        </div>

        <div class="flex column items-center q-mb-lg" style="gap: 14px">
          <div class="text-center">
            <div class="font-sora text-weight-bold" style="font-size: 15px; color: #0d2922">
              {{ isConfirmStep ? 'Confirm your new PIN' : 'Choose your new PIN' }}
            </div>
            <div
              class="font-inter"
              :style="{ color: errorText ? '#d95858' : '#9dbdb8' }"
              style="font-size: 12.5px; margin-top: 4px; transition: color 0.2s"
            >
              {{
                errorText ||
                (isConfirmStep
                  ? 'Enter the same PIN again'
                  : "Pick 4 digits you'll easily remember")
              }}
            </div>
          </div>
          <div class="flex justify-center" :class="{ 'shake-anim': shake }" style="gap: 14px">
            <div
              v-for="i in 4"
              :key="i"
              class="pin-dot"
              :class="i <= activePin.length ? 'filled' : 'empty'"
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

const router = useRouter()
const authStore = useAuthStore()

const step = ref('phone') // phone, pin, setpin-new, setpin-confirm
const loading = ref(false)
const errorText = ref('')
const shake = ref(false)

const loginPin = ref('')
const newPin = ref('')
const confirmPin = ref('')

const numKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [null, '0', 'del'],
]

const activePin = computed(() => {
  if (step.value === 'pin') return loginPin.value
  if (step.value === 'setpin-new') return newPin.value
  if (step.value === 'setpin-confirm') return confirmPin.value
  return ''
})

const isConfirmStep = computed(() => step.value === 'setpin-confirm')

// WhatsApp Link
const whatsappLink = computed(() => {
  const phone = authStore.loginData.username || '_______'
  const message = `Hello Support Team, I am facing an issue while trying to log in to the Active PT app. My registered phone number is ${phone}. Kindly assist me.`
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

const submitPhone = () => {
  if (authStore.loginData.username) {
    // Reset any old pin data upon re-entering phone step
    loginPin.value = ''
    newPin.value = ''
    confirmPin.value = ''
    step.value = 'pin'
  }
}

const editPhone = () => {
  step.value = 'phone'
}

const pressKey = (k) => {
  if (activePin.value.length >= 4 || loading.value) return
  errorText.value = ''

  if (step.value === 'pin') {
    loginPin.value += k
    if (loginPin.value.length === 4) handleLogin()
  } else if (step.value === 'setpin-new') {
    newPin.value += k
    if (newPin.value.length === 4) {
      setTimeout(() => {
        step.value = 'setpin-confirm'
      }, 160)
    }
  } else if (step.value === 'setpin-confirm') {
    confirmPin.value += k
    if (confirmPin.value.length === 4) handleConfirmPin()
  }
}

const delKey = () => {
  if (loading.value) return
  errorText.value = ''

  if (step.value === 'pin') {
    loginPin.value = loginPin.value.slice(0, -1)
  } else if (step.value === 'setpin-new') {
    newPin.value = newPin.value.slice(0, -1)
  } else if (step.value === 'setpin-confirm') {
    confirmPin.value = confirmPin.value.slice(0, -1)
  }
}

const handleLogin = () => {
  loading.value = true
  authStore.loginData.password = loginPin.value
  authStore.router = router

  // Custom interception to show error immediately if login fails
  const originalServerError = authStore.serverError

  // Because authStore.login() doesn't return a promise but fires synchronously its catch,
  // we will simply trigger it and wait securely using standard timeouts since we don't own its internals
  authStore.login()

  setTimeout(() => {
    loading.value = false

    // Check if require password reset activated
    if (authStore.requiresPasswordReset) {
      step.value = 'setpin-new'
      return
    }

    // Check for error via authStore's server error
    if (authStore.serverError !== originalServerError && authStore.serverError) {
      errorText.value = 'Incorrect PIN or User not found'
      triggerShake()
      loginPin.value = ''
    } else if (!authStore.token_id) {
      // login failed but maybe not yet captured error fully
      loginPin.value = ''
    }
  }, 1200) // generous timeout to let Store perform API calls and loading hides
}

const handleConfirmPin = () => {
  if (confirmPin.value === newPin.value) {
    loading.value = true
    authStore.router = router
    authStore.resetPassword(newPin.value)

    setTimeout(() => {
      loading.value = false
      if (authStore.serverError) {
        errorText.value = 'Failed to reset PIN. Try again.'
        triggerShake()
        confirmPin.value = ''
      }
    }, 1200)
  } else {
    errorText.value = "PINs don't match. Try again."
    triggerShake()
    confirmPin.value = ''
  }
}

const triggerShake = () => {
  shake.value = true
  setTimeout(() => {
    shake.value = false
  }, 520)
}

const getSetPinStepStyle = (idx) => {
  if (idx === 0) {
    // Set PIN circle
    if (isConfirmStep.value) {
      // done
      return { background: '#0A7E6E', border: '2px solid transparent', color: 'white' }
    } else {
      // active
      return { background: 'rgba(10,126,110,0.12)', border: '2px solid #0A7E6E', color: '#0A7E6E' }
    }
  } else {
    // Confirm PIN circle
    if (isConfirmStep.value) {
      // active
      return { background: 'rgba(10,126,110,0.12)', border: '2px solid #0A7E6E', color: '#0A7E6E' }
    } else {
      // future
      return { background: 'rgba(0,0,0,0.06)', border: '2px solid transparent', color: '#bbb' }
    }
  }
}

const getSetPinTextStyle = (idx) => {
  if (idx === 0) {
    if (isConfirmStep.value) {
      return { fontWeight: 400, color: '#0A7E6E' }
    } else {
      return { fontWeight: 600, color: '#0A7E6E' }
    }
  } else {
    if (isConfirmStep.value) {
      return { fontWeight: 600, color: '#0A7E6E' }
    } else {
      return { fontWeight: 400, color: '#aaa' }
    }
  }
}
</script>

<style scoped src="src/css/login.css"></style>
