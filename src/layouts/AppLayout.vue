<template>
  <q-layout view="lHh lpr lFf" class="premium-layout desktop-constrained" container>
    <!-- STATIC HEADER -->
    <q-header class="top-header no-shadow">
      <div class="hdr-left">
        <div class="logo-icon">
          <svg width="18" height="18" viewBox="0 0 34 34" fill="none">
            <rect x="4" y="15" width="26" height="4" rx="2" fill="white" />
            <rect x="15" y="4" width="4" height="26" rx="2" fill="white" />
          </svg>
        </div>
        <span class="logo-text">Activ PT</span>
      </div>
      <div class="hdr-right">
        <!-- Interactive Bell Button -->
        <div class="bell-btn cursor-pointer">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0d2922"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="bell-dot"></span>

          <!-- Dropdown Notification Menu -->
          <AppNotifications />
        </div>

        <div class="avatar cursor-pointer" @click="goTo('/profile')">
          {{ userInitials }}
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Floating Bottom Nav -->
    <q-footer class="transparent no-shadow safe-bottom q-px-sm" style="pointer-events: none">
      <nav class="bottom-nav" style="pointer-events: auto">
        <button class="nav-item" @click="goTo('/')">
          <div v-if="$route.path === '/'" class="nav-bar"></div>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="$route.path === '/' ? '#0A7E6E' : '#9bb8b3'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span
            class="nav-label"
            :style="{
              color: $route.path === '/' ? '#0A7E6E' : '#9bb8b3',
              fontWeight: $route.path === '/' ? 600 : 400,
            }"
            >Home</span
          >
        </button>

        <button class="nav-item" @click="goTo('/report')">
          <div v-if="$route.path === '/report'" class="nav-bar"></div>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="$route.path === '/report' ? '#0A7E6E' : '#9bb8b3'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span
            class="nav-label"
            :style="{
              color: $route.path === '/report' ? '#0A7E6E' : '#9bb8b3',
              fontWeight: $route.path === '/report' ? 600 : 400,
            }"
            >My Plan</span
          >
        </button>

        <button class="nav-play" @click="goTo('/session')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </button>

        <button class="nav-item" @click="goTo('/appointments')">
          <div v-if="$route.path === '/appointments'" class="nav-bar"></div>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="$route.path === '/appointments' ? '#0A7E6E' : '#9bb8b3'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            class="nav-label"
            :style="{
              color: $route.path === '/appointments' ? '#0A7E6E' : '#9bb8b3',
              fontWeight: $route.path === '/appointments' ? 600 : 400,
            }"
            >Schedule</span
          >
        </button>

        <button class="nav-item" @click="goTo('/profile')">
          <div v-if="$route.path === '/profile'" class="nav-bar"></div>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="$route.path === '/profile' ? '#0A7E6E' : '#9bb8b3'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span
            class="nav-label"
            :style="{
              color: $route.path === '/profile' ? '#0A7E6E' : '#9bb8b3',
              fontWeight: $route.path === '/profile' ? 600 : 400,
            }"
            >Profile</span
          >
        </button>
      </nav>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import AppNotifications from 'src/components/AppNotifications.vue'

const router = useRouter()
const authStore = useAuthStore()

function goTo(path) {
  router.push(path)
}

const userInitials = computed(() => {
  const name = authStore.user?.username || 'Guest'
  const parts = name.trim().split(/\s+/)
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

.premium-layout {
  background: radial-gradient(circle at top left, #f0fdf4 0%, #e0f2fe 100%);
  min-height: 100vh;
  min-height: 100dvh;
}

.safe-bottom {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

/* ── Header ── */
.top-header {
  padding: 16px 20px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(234, 248, 243, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(10, 126, 110, 0.07);
}
.hdr-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(145deg, #0c9b80, #0a7e6e);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(10, 126, 110, 0.3);
  flex-shrink: 0;
}
.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #0d2922;
  letter-spacing: -0.2px;
  font-family: 'Sora', sans-serif;
}
.hdr-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bell-btn {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(10, 126, 110, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.bell-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e74c3c;
  border: 1.5px solid #eaf8f3;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(145deg, #0c9b80, #0a7e6e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(10, 126, 110, 0.25);
  font-family: 'Sora', sans-serif;
}

/* ── Bottom nav ── */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  outline: none;
}
@keyframes floatBtn {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.bottom-nav {
  position: relative;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(10, 126, 110, 0.08); /* changed from border-top to full border to match rounded corners */
  border-radius: 24px;
  padding: 10px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  z-index: 100;
  margin-bottom: 4px;
}
.nav-item {
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  cursor: pointer;
  position: relative;
}
.nav-bar {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #0a7e6e, #3dba8a);
}
.nav-label {
  font-size: 10px;
  font-family: 'DM Sans', sans-serif;
}
.nav-play {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(145deg, #0c9b80, #0a7e6e);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(10, 126, 110, 0.4);
  margin-top: -24px;
  animation: floatBtn 3s ease-in-out infinite;
  transition: transform 0.15s ease;
}
.nav-play:active {
  transform: scale(0.9) !important;
}
</style>
