<template>
  <!-- <q-layout view="lHh lpr lFf" class="premium-layout desktop-constrained" container> -->
  <!-- <q-page-container> -->
  <router-view />
  <!-- </q-page-container> -->

  <nav class="bottom-nav" v-if="!$route.path.startsWith('/exercise-player')">
    <!-- 🟢 Therapist Navigation (if on a therapist route starting with /physio) -->
    <template v-if="$route.path.startsWith('/physio')">
      <button
        class="nav-btn"
        :class="{ active: $route.path === '/physio' }"
        @click="$router.push('/physio')"
      >
        <span class="ni">🏠</span>
        <span class="nl">Home</span>
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
        :class="{ active: $route.path.startsWith('/physio/appointments') }"
        @click="$router.push('/physio/appointments')"
      >
        <span class="ni">📅</span>
        <span class="nl">Visits</span>
      </button>

      <button
        class="nav-btn"
        :class="{ active: $route.path.startsWith('/physio/profile') }"
        @click="$router.push('/physio/profile')"
      >
        <span class="ni">👤</span>
        <span class="nl">Profile</span>
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

<script setup></script>
