<template>
  <section class="screen">
    <ScreenHeader title="Reset PIN" sub="Create a new personal PIN to securely access your app." />
    <div class="section">
      <div class="card">
        <SetPin
          icon="🔑"
          title="Reset Personal PIN"
          subtitle="Create a new personal PIN to securely access your app."
          :show-success-screen="true"
          :submit-function="handlePinSubmit"
          successButtonText="Go to Home"
          successSubtitle="Your PIN has been updated successfully"
          @success-action="goToDashboard"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import SetPin from 'src/components/SetPin.vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const router = useRouter()
const authStore = useAuthStore()

const handlePinSubmit = async (pin) => {
  try {
    const userEmail = authStore.user?.email || authStore.loginData.username
    const response = await api.post('resetPassword', {
      username: userEmail,
      password: pin,
    })

    if (response.data?.status === 'success') {
      Notify.create({
        type: 'positive',
        message: 'PIN reset successfully!',
        position: 'top',
        icon: 'check_circle',
      })
      return { success: true }
    } else {
      return { success: false, message: response.data?.message || 'Reset failed. Try again.' }
    }
  } catch (e) {
    return {
      success: false,
      message: e.response?.data?.message || e.message || 'Failed to reset PIN. Try again.',
    }
  }
}

const goToDashboard = () => {
  router.replace('/')
}
</script>

<style scoped>
.action-btn {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
}
</style>
