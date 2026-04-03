<template>
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
          <q-item-label class="text-weight-bold text-dark text-body2">
            Time for your session! ⏱
          </q-item-label>
          <q-item-label
            caption
            lines="2"
            class="text-grey-8 q-mt-xs"
            style="line-height: 1.3"
          >
            Your afternoon shoulder rehab session is scheduled for 3:00 PM. Tap to start.
          </q-item-label>
          <q-item-label caption class="text-primary text-weight-bold q-mt-sm">
            Just now
          </q-item-label>
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
          <q-item-label class="text-weight-bold text-dark text-body2">
            Dr. Saulihal reviewed
          </q-item-label>
          <q-item-label
            caption
            lines="2"
            class="text-grey-8 q-mt-xs"
            style="line-height: 1.3"
          >
            Your physical therapist reviewed your recent session and added some notes.
          </q-item-label>
          <q-item-label caption class="text-primary text-weight-bold q-mt-sm">
            2 hours ago
          </q-item-label>
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
          <q-item-label class="text-weight-bold text-dark text-body2">
            4-Day Streak! 🔥
          </q-item-label>
          <q-item-label
            caption
            lines="2"
            class="text-grey-7 q-mt-xs"
            style="line-height: 1.3"
          >
            Awesome work! You've successfully completed 4 days of rehab in a row. Keep it up!
          </q-item-label>
          <q-item-label caption class="text-grey-5 text-weight-medium q-mt-sm">
            Yesterday
          </q-item-label>
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
</template>

<script setup>
// Interactive notification menu component
</script>
