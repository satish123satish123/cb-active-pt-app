<template>
  <div class="section">
    <button class="btn full signout-btn" @click="onLogout">↪ Sign Out</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const onLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.signout-btn {
  background: #fff;
  color: #d63f1e;
  border: 1.5px solid #f0c3ba;
  font-size: 16px;
  font-weight: 800;
}
</style>
