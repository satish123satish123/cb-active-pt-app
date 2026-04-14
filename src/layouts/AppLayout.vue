<template>
  <!-- <q-layout view="lHh lpr lFf" class="premium-layout desktop-constrained" container> -->
  <!-- <q-page-container> -->
  <router-view />
  <!-- </q-page-container> -->

  <nav class="bottom-nav" v-if="!$route.path.startsWith('/exercise-player')">
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
  </nav>
  <!-- </q-layout> -->
</template>

<script setup></script>
