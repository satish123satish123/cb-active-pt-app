<template>
  <q-page class="q-pa-md q-pb-xl premium-layout" style="background: #ffffff;">

    <!-- Top Header -->
    <div class="row items-center q-mb-xl q-mt-sm">
      <q-btn flat round dense icon="arrow_back_ios_new" color="dark" class="action-btn q-mr-md" to="/profile" />
      <div class="text-h5 font-sora text-weight-bolder tracking-tight" style="color: #0d2922;">Reset PIN</div>
    </div>

    <SetPin
      icon="🔑"
      title="Reset Personal PIN"
      subtitle="Create a new personal PIN to securely access your app."
      :show-success-screen="true"
      :submit-function="handlePinSubmit"
      @success-action="goToLogin"
    />

  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import SetPin from 'src/components/SetPin.vue'

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
        message: response.data.message || 'PIN reset successfully!',
        position: 'top',
        icon: 'check_circle',
      })
      return { success: true }
    } else {
      return { success: false, message: response.data?.message || 'Reset failed. Try again.' }
    }
  } catch (e) {
    return { success: false, message: e.response?.data?.message || e.message || 'Failed to reset PIN. Try again.' }
  }
}

const goToLogin = async () => {
  authStore.loginData.username = authStore.user?.phone || ''
  authStore.loginData.password = null
  await authStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
.action-btn {
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.02);
}
</style>
