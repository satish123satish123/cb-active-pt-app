<template>
  <q-layout view="lHh lpr lFf" class="premium-layout desktop-constrained" container>
    <q-page-container>
      <router-view />
    </q-page-container>

    <nav class="bottom-nav">
      <router-link class="nav-btn" to="/">
        <span class="ni">🏠</span>
        <span class="nl">Home</span>
      </router-link>

      <router-link class="nav-btn" to="/appointments">
        <span class="ni">📅</span>
        <span class="nl">Visits</span>
      </router-link>

      <router-link class="nav-btn" to="/session">
        <span class="ni">📊</span>
        <span class="nl">Progress</span>
      </router-link>

      <router-link class="nav-btn" to="/exercises">
        <span class="ni">💪</span>
        <span class="nl">Exercises</span>
      </router-link>

      <router-link class="nav-btn" to="/profile">
        <span class="ni">👤</span>
        <span class="nl">Profile</span>
        <span class="dot"></span>
      </router-link>
    </nav>
  </q-layout>
</template>

<script setup></script>
