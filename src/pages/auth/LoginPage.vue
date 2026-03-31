<template>
  <q-page class="login-wrapper flex flex-center">
    <div class="login-container">
      <!-- Header Section -->
      <div class="login-header text-center q-mb-xl">
        <div class="logo-container q-mx-auto q-mb-md">
          <q-icon name="healing" size="48px" color="white" />
        </div>
        <h1 class="text-h4 text-weight-bold q-ma-none title-text">Active PT</h1>
        <p class="text-subtitle1 text-grey-6 q-mt-sm">Your daily physiotherapy guide</p>
      </div>

      <!-- Form Section -->
      <q-form @submit.prevent="handleFormSubmit" class="login-form q-gutter-y-md">
        
        <!-- Standard Login / OTP Step -->
        <template v-if="!authStore.requiresPasswordReset">
          <q-input
            v-model="authStore.loginData.username"
            filled
            type="text"
            label="Phone Number"
            class="custom-input"
            lazy-rules
            :rules="[(val) => !!val || 'Phone Number is required']"
          >
            <template v-slot:prepend>
              <q-icon name="phone_android" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="authStore.loginData.password"
            filled
            :type="isPasswordVisible ? 'text' : 'password'"
            label="Password or OTP"
            class="custom-input q-mt-md"
            lazy-rules
            :rules="[(val) => !!val || 'Password or OTP is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-5"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>
        </template>

        <!-- Set Permanent Password Step -->
        <template v-else>
          <div class="text-subtitle1 text-center text-dark text-weight-bold q-mb-md">Set Your Permanent Password</div>
          
          <q-input
            v-model="newPassword"
            filled
            :type="isPasswordVisible ? 'text' : 'password'"
            label="New Password"
            class="custom-input"
            lazy-rules
            :rules="[(val) => !!val || 'Password is required', (val) => val.length >= 6 || 'Minimum 6 characters']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-5"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            filled
            type="password"
            label="Confirm New Password"
            class="custom-input"
            lazy-rules
            :rules="[
              (val) => !!val || 'Please confirm your password',
              (val) => val === newPassword || 'Passwords do not match'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="check_circle" color="primary" />
            </template>
          </q-input>
        </template>

        <q-btn
          unelevated
          rounded
          color="primary"
          size="lg"
          class="full-width q-mt-lg login-btn text-weight-bold"
          :label="authStore.requiresPasswordReset ? 'Set Password' : 'Sign In'"
          type="submit"
        />

        <div class="text-center q-mt-xl">
          <span class="text-grey-7 text-body2">Facing issue in login? </span>
          <a href="tel:01142249910" class="signup-link text-primary text-weight-bold"> Contact </a>
          <span class="text-grey-7 text-body2"> our support team for assistance</span>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const isPasswordVisible = ref(false)

const newPassword = ref('')
const confirmPassword = ref('')

const handleFormSubmit = () => {
  authStore.router = router
  
  if (authStore.requiresPasswordReset) {
    if (newPassword.value !== confirmPassword.value) {
      Notify.create({ type: 'negative', message: 'Passwords do not match' })
      return
    }
    authStore.resetPassword(newPassword.value)
  } else {
    authStore.login()
  }
}
</script>

<style scoped src="src/css/login.css"></style>
