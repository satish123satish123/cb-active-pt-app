<template>
  <q-layout view="lHh lpr lFf" class="premium-layout desktop-constrained" container>
    <!-- Blurry Premium Header -->
    <q-header class="glass-header text-dark q-py-sm q-px-sm">
      <q-toolbar>
        <div class="row items-center cursor-pointer">
          <div class="logo-box q-mr-md">
            <!-- Swapped to a standard icon that is guaranteed to render -->
            <q-icon name="fitness_center" color="white" size="22px" />
          </div>
          <div class="text-h6 text-weight-bolder tracking-tight logo-text">Active PT</div>
        </div>
        <q-space />

        <!-- Notifications Button with Interactive Dropdown -->
        <q-btn round dense unelevated color="blue-8" class="action-btn text-dark q-mr-sm">
          <q-icon name="notifications" size="20px" />
          <q-badge color="negative" floating rounded class="shadow-1 text-weight-bold">2</q-badge>

          <!-- Dropdown Notification Menu -->
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            :offset="[0, 10]"
            class="notification-menu glass-panel no-shadow"
            style="
              border-radius: 20px;
              width: 340px;
              max-width: 90vw;
              border: 1px solid rgba(0, 0, 0, 0.05);
            "
          >
            <!-- Header of Dropdown -->
            <div
              class="q-pa-md row items-center justify-between bg-white text-dark"
              style="border-radius: 20px 20px 0 0"
            >
              <div class="text-h6 text-weight-bolder tracking-tight" style="font-size: 1.1rem">
                Notifications
              </div>
              <q-btn flat round dense icon="close" size="sm" color="grey-7" v-close-popup />
            </div>

            <q-separator />

            <!-- List of Notifications -->
            <q-list class="bg-white" style="border-radius: 0 0 20px 20px; overflow: hidden">
              <!-- Unread Notification 1 -->
              <q-item clickable v-ripple class="q-pa-md bg-blue-1">
                <q-item-section avatar top>
                  <q-avatar color="white" text-color="primary" icon="assignment" class="shadow-1" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark text-body2"
                    >Time for your session! ⏱</q-item-label
                  >
                  <q-item-label
                    caption
                    lines="2"
                    class="text-grey-8 q-mt-xs"
                    style="line-height: 1.3"
                  >
                    Your afternoon shoulder rehab session is scheduled for 3:00 PM. Tap to start.
                  </q-item-label>
                  <q-item-label caption class="text-primary text-weight-bold q-mt-sm"
                    >Just now</q-item-label
                  >
                </q-item-section>
                <q-item-section side top>
                  <q-badge
                    color="primary"
                    rounded
                    class="q-mt-sm"
                    style="width: 8px; height: 8px"
                  />
                </q-item-section>
              </q-item>

              <q-separator inset />

              <!-- Unread Notification 2 -->
              <q-item clickable v-ripple class="q-pa-md bg-blue-1">
                <q-item-section avatar top>
                  <q-avatar
                    color="white"
                    text-color="orange"
                    icon="medical_services"
                    class="shadow-1"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark text-body2"
                    >Dr. Saulihal reviewed</q-item-label
                  >
                  <q-item-label
                    caption
                    lines="2"
                    class="text-grey-8 q-mt-xs"
                    style="line-height: 1.3"
                  >
                    Your physical therapist reviewed your recent session and added some notes.
                  </q-item-label>
                  <q-item-label caption class="text-primary text-weight-bold q-mt-sm"
                    >2 hours ago</q-item-label
                  >
                </q-item-section>
                <q-item-section side top>
                  <q-badge
                    color="primary"
                    rounded
                    class="q-mt-sm"
                    style="width: 8px; height: 8px"
                  />
                </q-item-section>
              </q-item>

              <q-separator inset />

              <!-- Read Notification -->
              <q-item clickable v-ripple class="q-pa-md">
                <q-item-section avatar top>
                  <q-avatar
                    color="green-1"
                    text-color="positive"
                    icon="emoji_events"
                    class="shadow-1"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark text-body2"
                    >4-Day Streak! 🔥</q-item-label
                  >
                  <q-item-label
                    caption
                    lines="2"
                    class="text-grey-7 q-mt-xs"
                    style="line-height: 1.3"
                  >
                    Awesome work! You've successfully completed 4 days of rehab in a row. Keep it
                    up!
                  </q-item-label>
                  <q-item-label caption class="text-grey-5 text-weight-medium q-mt-sm"
                    >Yesterday</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- Footer Action -->
              <div class="q-pa-sm text-center bg-grey-1">
                <q-btn
                  flat
                  color="grey-7"
                  label="Mark all as read"
                  class="text-weight-bold text-caption full-width"
                  no-caps
                />
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Floating Glass Bottom Nav -->
    <q-footer class="transparent q-px-md safe-bottom">
      <div class="glass-nav row items-center justify-around">
        <q-btn
          flat
          round
          dense
          icon="home"
          :color="$route.path === '/' ? 'primary' : 'grey-5'"
          :class="['nav-btn', { 'active-nav': $route.path === '/' }]"
          size="md"
          to="/"
        />
        <q-btn
          flat
          round
          dense
          icon="description"
          :color="$route.path === '/report' ? 'primary' : 'grey-5'"
          :class="['nav-btn', { 'active-nav': $route.path === '/report' }]"
          size="md"
          to="/report"
        />

        <div class="center-play-wrapper">
          <q-btn round color="primary" class="center-play-btn shadow-vibrant" to="/session">
            <q-icon name="play_arrow" size="32px" />
          </q-btn>
        </div>

        <q-btn flat round dense icon="calendar_month" color="grey-5" class="nav-btn" size="md" />
        <q-btn
          flat
          round
          dense
          icon="person_outline"
          :color="$route.path === '/profile' ? 'primary' : 'grey-5'"
          :class="['nav-btn', { 'active-nav': $route.path === '/profile' }]"
          size="md"
          to="/profile"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup></script>

<style scoped>
.safe-bottom {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

.premium-layout {
  background: radial-gradient(circle at top left, #f0fdf4 0%, #e0f2fe 100%);
  min-height: 100vh;
  min-height: 100dvh;
}

.glass-header {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.logo-box {
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
}

.logo-text {
  background: linear-gradient(135deg, #0f172a, #334155);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.action-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.glass-nav {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  height: 68px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 1);
  padding: 0 16px;
}

.nav-btn {
  transition: all 0.3s ease;
}

.active-nav {
  background: rgba(14, 165, 233, 0.1);
  transform: translateY(-2px);
  color: #0ea5e9 !important;
}

.center-play-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
}

.center-play-btn {
  position: absolute;
  top: -28px;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0ea5e9, #10b981) !important;
  color: white !important;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.center-play-btn:active {
  transform: scale(0.9);
}

.shadow-vibrant {
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.45) !important;
}
</style>
