<template>
  <div class="full-width flex column">
    <!-- Step 1 & 2: Set PIN & Confirm -->
    <template v-if="localStep.startsWith('setpin')">
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
          {{ icon }}
        </div>
        <div>
          <div class="font-sora text-weight-bold" style="font-size: 13.5px; color: #0d2922">
            {{ title }}
          </div>
          <div
            class="font-inter"
            style="font-size: 12.5px; color: #5a9e93; margin-top: 3px; line-height: 1.5"
          >
            {{ subtitle }}
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
    </template>

    <!-- Step 3: Success -->
    <template v-else-if="localStep === 'success'">
      <div class="flex flex-center column q-mt-xl scale-in-delay-1" style="gap: 20px;">
        <div class="success-icon flex flex-center">
          <q-icon name="check_circle" size="72px" color="white" />
        </div>
        <div class="text-h5 font-sora text-weight-bolder text-dark tracking-tight text-center" style="color: #0d2922;">{{ successTitle }}</div>
        <div class="text-body2 font-inter text-center" style="color: #5a9e93" v-html="successSubtitle"></div>
        <button
          class="primary-btn q-mt-xl"
          @click="$emit('success-action')"
          style="width: 100%; max-width: 300px;"
        >
          {{ successButtonText }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: '🔑' },
  title: { type: String, default: 'Reset Personal PIN' },
  subtitle: { type: String, default: 'Create a new personal PIN to securely access your app.' },
  showSuccessScreen: { type: Boolean, default: true },
  successTitle: { type: String, default: 'PIN Reset!' },
  successSubtitle: { type: String, default: 'Your PIN has been updated successfully.<br>Please log in again with your new PIN.' },
  successButtonText: { type: String, default: 'Go to Login' },
  submitFunction: { type: Function, required: true }
})

defineEmits(['success-action'])

const localStep = ref('setpin-new')
const loading = ref(false)
const errorText = ref('')
const shake = ref(false)

const newPin = ref('')
const confirmPin = ref('')

const numKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [null, '0', 'del'],
]

const activePin = computed(() => {
  if (localStep.value === 'setpin-new') return newPin.value
  if (localStep.value === 'setpin-confirm') return confirmPin.value
  return ''
})

const isConfirmStep = computed(() => localStep.value === 'setpin-confirm')

const pressKey = (k) => {
  if (activePin.value.length >= 4 || loading.value) return
  errorText.value = ''

  if (localStep.value === 'setpin-new') {
    newPin.value += k
    if (newPin.value.length === 4) {
      setTimeout(() => {
        localStep.value = 'setpin-confirm'
      }, 160)
    }
  } else if (localStep.value === 'setpin-confirm') {
    confirmPin.value += k
    if (confirmPin.value.length === 4) handleConfirmPin()
  }
}

const delKey = () => {
  if (loading.value) return
  errorText.value = ''

  if (localStep.value === 'setpin-new') {
    newPin.value = newPin.value.slice(0, -1)
  } else if (localStep.value === 'setpin-confirm') {
    confirmPin.value = confirmPin.value.slice(0, -1)
  }
}

const handleConfirmPin = async () => {
  if (confirmPin.value !== newPin.value) {
    errorText.value = "PINs don't match. Try again."
    triggerShake()
    confirmPin.value = ''
    return
  }

  loading.value = true

  try {
    const result = await props.submitFunction(newPin.value)
    if (result && result.success) {
      if (props.showSuccessScreen) {
        localStep.value = 'success'
      }
    } else {
      errorText.value = (result && result.message) || 'Error handling PIN.'
      confirmPin.value = ''
      triggerShake()
    }
  } catch (err) {
    errorText.value = err.message || 'Error handling PIN.'
    confirmPin.value = ''
    triggerShake()
  } finally {
    loading.value = false
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
    if (isConfirmStep.value) {
      return { background: '#0A7E6E', border: '2px solid transparent', color: 'white' }
    } else {
      return { background: 'rgba(10,126,110,0.12)', border: '2px solid #0A7E6E', color: '#0A7E6E' }
    }
  } else {
    if (isConfirmStep.value) {
      return { background: 'rgba(10,126,110,0.12)', border: '2px solid #0A7E6E', color: '#0A7E6E' }
    } else {
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
<style scoped>
.success-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(10, 126, 110, 0.9), #0A7E6E);
  box-shadow: 0 20px 48px rgba(10, 126, 110, 0.35);
}
.scale-in-delay-1 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
</style>
