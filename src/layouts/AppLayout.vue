<template>
  <!-- <q-layout view="lHh lpr lFf" class="premium-layout desktop-constrained" container> -->
  <!-- <q-page-container> -->
  <router-view />
  <!-- </q-page-container> -->

  <nav
    class="bottom-nav"
    :class="{ 'ph-nav': $route.path.startsWith('/physio') }"
    v-if="!$route.path.startsWith('/exercise-player') && !isPhysioFlow"
  >
    <!-- 🟢 Therapist Navigation (if on a therapist route starting with /physio) -->
    <template v-if="$route.path.startsWith('/physio')">
      <button
        class="nav-btn"
        :class="{ active: $route.path === '/physio' }"
        @click="$router.push('/physio')"
      >
        <span class="ni">🏠</span>
        <span class="nl">Today</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path.startsWith('/physio/roster') }"
        @click="$router.push('/physio/roster')"
      >
        <span class="ni">🗓️</span>
        <span class="nl">Roster</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path.startsWith('/physio/patients') }"
        @click="$router.push('/physio/patients')"
      >
        <span class="ni">👥</span>
        <span class="nl">Patients</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path.startsWith('/physio/profile') }"
        @click="$router.push('/physio/profile')"
      >
        <span class="ni">👤</span>
        <span class="nl">Me</span>
      </button>
    </template>

    <!-- 🔵 Patient Navigation (default) -->
    <template v-else>
      <button class="nav-btn" :class="{ active: $route.path === '/' }" @click="$router.push('/')">
        <span class="ni">🏠</span>
        <span class="nl">Home</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path === '/appointments' }"
        @click="$router.push('/appointments')"
      >
        <span class="ni">📅</span>
        <span class="nl">Visits</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path === '/progress' }"
        @click="$router.push('/progress')"
      >
        <span class="ni">📊</span>
        <span class="nl">Progress</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path === '/exercises' }"
        @click="$router.push('/exercises')"
      >
        <span class="ni">💪</span>
        <span class="nl">Exercises</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path === '/profile' }"
        @click="$router.push('/profile')"
      >
        <span class="ni">👤</span>
        <span class="nl">Profile</span>
        <span class="dot"></span>
      </button>
    </template>
  </nav>
  <!-- </q-layout> -->
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Flow screens (treatment/invoice/followup) have their own sticky footer — no nav
const isPhysioFlow = computed(() =>
  ['/physio/treatment', '/physio/invoice', '/physio/followup'].some((p) =>
    route.path.startsWith(p),
  ),
)
</script>

<style scoped>
/* ============================================================
   PHYSIO-ONLY bottom nav (design system) — .ph-nav class is
   applied only on /physio routes; patient nav is untouched.
   ============================================================ */
nav.bottom-nav.ph-nav {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 460px;
  z-index: 30;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(220, 231, 234, 0.85);
  border-left: none;
  border-right: none;
  border-bottom: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin: 0;
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  box-shadow: 0 -8px 30px rgba(16, 33, 42, 0.08);
  border-radius: 0;
}
@media (min-width: 480px) {
  nav.bottom-nav.ph-nav {
    bottom: 16px;
    border-radius: 22px;
    width: calc(100% - 24px);
    border: 1px solid rgba(220, 231, 234, 0.85);
  }
}
nav.bottom-nav.ph-nav .nav-btn {
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px 4px;
  margin: 0;
  width: auto;
  border-radius: 14px;
  cursor: pointer;
  color: #8da0aa;
}
nav.bottom-nav.ph-nav .nav-btn.active {
  color: #0a7e6e;
  background: rgba(10, 126, 110, 0.08);
}
nav.bottom-nav.ph-nav .nav-btn .ni {
  font-size: 20px;
}
nav.bottom-nav.ph-nav .nav-btn .nl {
  font-size: 11px;
  font-weight: 800;
}
</style>