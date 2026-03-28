<template>
  <q-page class="q-pa-md q-pb-xl">
    <!-- Header Greeting -->
    <div class="row justify-between items-center q-mb-xl q-mt-sm scale-in">
      <div>
        <div
          class="text-caption text-uppercase text-grey-6 text-weight-bold"
          style="letter-spacing: 1.5px"
        >
          Welcome Back
        </div>
        <div class="text-h4 text-weight-bolder text-dark tracking-tight q-mt-xs">
          {{ authStore.user?.username || 'Guest' }}
        </div>
      </div>
      <q-avatar size="64px" class="avatar-glow cursor-pointer">
        <img :src="avatarUrl" />
      </q-avatar>
    </div>

    <!-- Hero Progress Card -->
    <div class="hero-card q-mb-xl scale-in-delay-1">
      <div class="hero-bg-shapes"></div>
      <div class="relative-position q-pa-lg">
        <div class="row justify-between items-center q-mb-lg">
          <div>
            <div
              class="text-white text-opacity-8 text-weight-medium text-uppercase text-caption"
              style="letter-spacing: 1.5px"
            >
              Current Program
            </div>
            <div class="text-white text-h5 text-weight-bold q-mt-xs tracking-tight">
              Shoulder Rehab
            </div>
          </div>
          <q-circular-progress
            show-value
            class="text-white"
            :value="75"
            size="84px"
            :thickness="0.18"
            color="white"
            track-color="transparent"
            style="
              background: rgba(255, 255, 255, 0.15);
              border-radius: 50%;
              box-shadow:
                0 10px 25px rgba(0, 0, 0, 0.1),
                inset 0 2px 6px rgba(255, 255, 255, 0.3);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            "
          >
            <div class="column flex-center" style="width: 100%; height: 100%">
              <span
                class="text-weight-bolder"
                style="
                  font-size: 1.4rem;
                  line-height: 1;
                  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
                "
                >75%</span
              >
              <span
                class="text-uppercase text-weight-bolder"
                style="font-size: 0.55rem; letter-spacing: 1.5px; opacity: 0.95; margin-top: 4px"
                >Done</span
              >
            </div>
          </q-circular-progress>
        </div>

        <div class="hero-stats-row row justify-between q-pa-md rounded-borders glass-panel">
          <div class="text-center">
            <div class="text-white text-weight-bolder text-h5">8</div>
            <div
              class="text-white text-opacity-8 text-caption text-uppercase text-weight-medium"
              style="font-size: 0.65rem"
            >
              Exercises
            </div>
          </div>
          <div class="text-center border-sides q-px-md">
            <div class="text-white text-weight-bolder text-h5">1</div>
            <div
              class="text-white text-opacity-8 text-caption text-uppercase text-weight-medium"
              style="font-size: 0.65rem"
            >
              Session
            </div>
          </div>
          <div class="text-center">
            <div class="text-white text-weight-bolder text-h5">11</div>
            <div
              class="text-white text-opacity-8 text-caption text-uppercase text-weight-medium"
              style="font-size: 0.65rem"
            >
              Mins
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Start Button -->
    <q-btn unelevated class="full-width start-btn q-mb-xl scale-in-delay-2" no-caps>
      <div class="row items-center justify-center full-width">
        <div class="btn-icon-wrapper q-mr-md">
          <q-icon name="play_arrow" size="24px" color="dark" />
        </div>
        <span class="text-weight-bold text-white text-h6 tracking-tight"
          >Start Today's Session</span
        >
      </div>
    </q-btn>

    <!-- Daily Exercises Header -->
    <div class="row justify-between items-end q-mb-lg scale-in-delay-3">
      <div class="text-h6 text-weight-bolder text-dark tracking-tight">Today's Exercises</div>
      <q-btn flat dense color="primary" label="See All" class="text-weight-bold" no-caps />
    </div>

    <!-- Exercises List -->
    <div class="exercises-container scale-in-delay-3">
      <div
        v-for="(ex, index) in exercises"
        :key="index"
        class="exercise-card row items-center q-pa-md q-mb-md"
      >
        <!-- Image/Thumb -->
        <div class="exercise-thumb-wrapper q-mr-md">
          <div class="exercise-thumb bg-blue-grey-1 flex flex-center">
            <q-icon :name="ex.thumbIcon" size="32px" color="primary" />
          </div>
          <div class="exercise-play-overlay flex flex-center" v-if="!ex.markDone">
            <div class="mini-play shadow-2">
              <q-icon name="play_arrow" color="white" size="14px" />
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="col">
          <div class="text-weight-bold text-dark q-mb-xs" style="font-size: 1.05rem">
            {{ ex.name }}
          </div>
          <div class="row items-center text-grey-6 text-caption text-weight-medium">
            <span class="q-mr-sm">{{ ex.reps }} Reps • {{ ex.sets }} Set</span>
            <q-badge
              color="cyan-1"
              text-color="cyan-8"
              class="text-uppercase text-weight-bold"
              rounded
            >
              {{ ex.type }}
            </q-badge>
          </div>
        </div>

        <!-- Action -->
        <div class="col-auto">
          <q-btn
            v-if="ex.markDone"
            unelevated
            class="mark-done-btn text-weight-bold text-white"
            no-caps
          >
            <q-icon name="check_circle" size="18px" class="q-mr-xs" />
            Done
          </q-btn>
          <q-btn v-else round flat color="grey-4" icon="more_vert" />
        </div>
      </div>
    </div>

    <!-- Bottom Spacing for Nav -->
    <div style="height: 100px"></div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()

const avatarUrl = computed(() => {
  const name = authStore.user?.username || 'Guest'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`
})

const exercises = ref([
  {
    name: 'Shoulder Shrugs',
    type: 'Chair',
    reps: 10,
    sets: 1,
    thumbIcon: 'airline_seat_recline_normal',
    markDone: true,
  },
  {
    name: 'Row Scapular Retraction',
    type: 'Chair',
    reps: 10,
    sets: 1,
    thumbIcon: 'accessibility_new',
    markDone: false,
  },
  {
    name: 'Facial Eyebrows Raise',
    type: 'Mirror',
    reps: 10,
    sets: 1,
    thumbIcon: 'face',
    markDone: false,
  },
  {
    name: 'Neck Stretches',
    type: 'Chair',
    reps: 5,
    sets: 2,
    thumbIcon: 'self_improvement',
    markDone: false,
  },
])
</script>

<style scoped src="../css/dashboard.css"></style>
