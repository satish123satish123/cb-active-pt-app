<template>
  <q-page class="q-pa-md q-pb-xl">
    <!-- Header Greeting -->
    <div class="row justify-between items-center q-mb-md q-mt-sm scale-in">
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

    <!-- Development Toggle -->
    <div class="row justify-end q-mb-lg scale-in">
      <q-toggle v-model="hasExercises" label="Toggle Exercise View (Dev)" color="secondary" dense />
    </div>

    <!-- ============================================================ -->
    <!-- IF: Exercises available → Show full exercise dashboard       -->
    <!-- ============================================================ -->
    <template v-if="hasExercises">
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
      <q-btn
        unelevated
        class="full-width start-btn q-mb-xl scale-in-delay-2"
        no-caps
        to="/session"
      >
        <div class="row items-center justify-center full-width">
          <div class="btn-icon-wrapper q-mr-md">
            <q-icon name="play_arrow" size="24px" color="dark" />
          </div>
          <span class="text-weight-bold text-white text-h6 tracking-tight">
            Start Today's Session
          </span>
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
    </template>

    <!-- ============================================================ -->
    <!-- ELSE: No exercises → Show empty/onboarding dashboard         -->
    <!-- ============================================================ -->
    <template v-else>
      <div class="empty-dashboard scale-in-delay-1">

        <!-- Welcome Banner -->
        <div class="welcome-banner q-mb-lg">
          Welcome! {{ authStore.user?.username || 'Guest' }}
        </div>

        <!-- Program Card -->
        <div class="program-card q-mb-xl">
          <!-- Hero Image with title overlay -->
          <div class="program-image-wrapper">
            <img :src="physioHeroImg" class="program-hero-img" alt="Physiotherapy" />
            <div class="program-title-overlay">
              <div class="program-title">GET YOUR PERSONALISED CURATED PROGRAM</div>
            </div>
          </div>

          <!-- Feature Icons Row -->
          <div class="program-features-row row justify-around items-center q-pa-md q-pt-lg">
            <div class="feature-item text-center">
              <q-icon name="settings" color="primary" size="28px" />
              <div class="feature-text">CUSTOMIZED</div>
            </div>
            <div class="feature-divider"></div>
            <div class="feature-item text-center">
              <q-icon name="my_location" color="primary" size="28px" />
              <div class="feature-text">TARGETED</div>
            </div>
            <div class="feature-divider"></div>
            <div class="feature-item text-center">
              <q-icon name="check" color="primary" size="28px" />
              <div class="feature-text">EFFECTIVE</div>
            </div>
          </div>
        </div>

        <!-- Package Cards -->
        <div
          v-for="(pkg, index) in packages"
          :key="index"
          class="package-card q-mb-md"
        >
          <div class="row items-center no-wrap">
            <!-- Package Thumbnail -->
            <div class="package-thumb q-mr-md flex-shrink-0">
              <img :src="packageImg" class="package-thumb-img" :alt="pkg.title" />
            </div>

            <!-- Package Info -->
            <div class="col">
              <div class="text-weight-bold text-dark package-name">{{ pkg.title }}</div>
              <div class="old-price" v-if="pkg.oldPrice > 0">₹ {{ pkg.oldPrice }}</div>
              <div class="old-price strikethrough-zero" v-else>₹ 0</div>
              <div class="new-price">₹ {{ pkg.price }}</div>
              <div class="view-details">View Details</div>
            </div>
          </div>

          <div class="package-days">{{ pkg.duration }}</div>
        </div>

      </div>
    </template>

    <div style="height: 100px"></div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import physioHeroImg from 'src/assets/physio_hero.png'
import packageImg from 'src/assets/package_illustration.png'

const authStore = useAuthStore()

const avatarUrl = computed(() => {
  const name = authStore.user?.username || 'Guest'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`
})

// ---------------------------------------------------------------
// Toggle this to test both states:
//   true  → shows exercise dashboard
//   false → shows empty/onboarding dashboard
// ---------------------------------------------------------------
const hasExercises = ref(false)

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

const packages = ref([
  {
    title: 'Activ PT (Package)',
    oldPrice: 0,
    price: 0,
    duration: 'FOR __ DAYS',
  },
  {
    title: 'Activ PT (1 Month)',
    oldPrice: 800,
    price: 800,
    duration: 'FOR 30 DAYS',
  },
  {
    title: 'Activ PT (3 Months)',
    oldPrice: 2000,
    price: 2000,
    duration: 'FOR 90 DAYS',
  },
])
</script>

<style scoped src="../css/dashboard.css"></style>

<style scoped>
/* ── Empty Dashboard Wrapper ── */
.empty-dashboard {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Welcome Banner ── */
.welcome-banner {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px 20px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1697e6;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* ── Program Card ── */
.program-card {
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.program-image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.program-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.program-title-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(22, 151, 230, 0.72) 0%, rgba(0,0,0,0.08) 100%);
  display: flex;
  align-items: flex-start;
  padding: 20px 18px;
}

.program-title {
  color: #ffffff;
  font-size: 1.45rem;
  line-height: 1.2;
  font-weight: 900;
  max-width: 200px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  letter-spacing: -0.3px;
}

/* ── Feature Row ── */
.program-features-row {
  border-top: 1px solid #f0f4f8;
}

.feature-item {
  flex: 1;
}

.feature-text {
  margin-top: 6px;
  font-size: 0.78rem;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: 0.5px;
}

.feature-divider {
  width: 1px;
  height: 40px;
  background: #e0e7ef;
  align-self: center;
}

/* ── Package Card ── */
.package-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.package-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.package-thumb {
  width: 90px;
  height: 90px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f9ff, #e8faf4);
  flex-shrink: 0;
}

.package-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.package-name {
  font-size: 1.05rem;
  margin-bottom: 2px;
}

.old-price {
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 0.95rem;
  margin-top: 4px;
}

.new-price {
  color: #1697e6;
  font-size: 1.3rem;
  font-weight: 700;
  margin-top: 2px;
}

.view-details {
  color: #35d0c4;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 4px;
  cursor: pointer;
}

.package-days {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-top: 14px;
  border-top: 1px solid #eceff3;
  padding-top: 12px;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .welcome-banner { font-size: 1.1rem; }
  .program-title  { font-size: 1.15rem; max-width: 160px; }
  .program-image-wrapper { height: 180px; }
  .package-thumb  { width: 72px; height: 72px; }
  .new-price      { font-size: 1.1rem; }
}
</style>
