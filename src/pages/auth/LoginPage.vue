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
      <q-form @submit.prevent="onSubmit" class="login-form q-gutter-y-md">
        <q-input
          v-model="authStore.loginData.username"
          filled
          type="text"
          label="Username"
          class="custom-input"
          lazy-rules
          :rules="[(val) => !!val || 'Username is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="authStore.loginData.password"
          filled
          :type="isPasswordVisible ? 'text' : 'password'"
          label="Password"
          class="custom-input q-mt-md"
          lazy-rules
          :rules="[(val) => !!val || 'Password is required']"
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

        <!-- <div class="row justify-end q-mt-sm">
          <a href="#" class="forgot-link text-primary text-weight-medium">Forgot Password?</a>
        </div> -->

        <q-btn
          unelevated
          rounded
          color="primary"
          size="lg"
          class="full-width q-mt-xl login-btn text-weight-bold"
          label="Sign In"
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

const router = useRouter()
const authStore = useAuthStore()
const isPasswordVisible = ref(false)

const onSubmit = () => {
  authStore.router = router
  authStore.login()
}
</script>

<style scoped src="src/css/login.css"></style>
