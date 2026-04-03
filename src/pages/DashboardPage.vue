<template>
  <q-page class="dashboard-page q-pb-xl">

    <!-- ── Sticky Top Bar ── -->
    

    <!-- Dev toggle -->
    <div class="row justify-center q-px-md q-mb-sm">
      <q-toggle v-model="hasExercises" label="Toggle Exercise View (Dev)" color="secondary" dense />
    </div>

    <!-- ============================================================ -->
    <!-- IF: hasExercises → Exercise Dashboard                        -->
    <!-- ============================================================ -->
    <template v-if="hasExercises">
      <div class="q-px-md">
        <div class="row justify-between items-center q-mb-md scale-in">
          <div>
            <div class="text-caption text-uppercase text-grey-6 text-weight-bold" style="letter-spacing:1.5px">Welcome Back</div>
            <div class="text-h4 text-weight-bolder text-dark q-mt-xs" style="letter-spacing:-0.5px">{{ authStore.user?.username || 'Guest' }}</div>
          </div>
          <q-avatar size="64px" style="box-shadow:0 10px 25px rgba(13,138,188,0.3);border:3px solid rgba(255,255,255,0.8);">
            <img :src="avatarUrl" />
          </q-avatar>
        </div>

        <!-- Hero Progress Card -->
        <div class="hero-card q-mb-xl scale-in-delay-1">
          <div class="hero-bg-shapes"></div>
          <div class="relative-position q-pa-lg">
            <div class="row justify-between items-center q-mb-lg">
              <div>
                <div class="text-white text-weight-medium text-uppercase text-caption" style="letter-spacing:1.5px;opacity:0.85">Current Program</div>
                <div class="text-white text-h5 text-weight-bold q-mt-xs" style="letter-spacing:-0.5px">Shoulder Rehab</div>
              </div>
              <q-circular-progress show-value class="text-white" :value="75" size="84px" :thickness="0.18" color="white" track-color="transparent"
                style="background:rgba(255,255,255,0.15);border-radius:50%;box-shadow:0 10px 25px rgba(0,0,0,0.1),inset 0 2px 6px rgba(255,255,255,0.3);backdrop-filter:blur(12px);">
                <div class="column flex-center" style="width:100%;height:100%">
                  <span class="text-weight-bolder" style="font-size:1.4rem;line-height:1;text-shadow:0 4px 10px rgba(0,0,0,0.25)">75%</span>
                  <span class="text-uppercase text-weight-bolder" style="font-size:0.55rem;letter-spacing:1.5px;opacity:0.95;margin-top:4px">Done</span>
                </div>
              </q-circular-progress>
            </div>
            <div class="row justify-between q-pa-md rounded-borders" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.25);border-radius:20px;">
              <div class="text-center">
                <div class="text-white text-weight-bolder text-h5">8</div>
                <div class="text-white text-caption text-uppercase text-weight-medium" style="font-size:0.65rem;opacity:0.85">Exercises</div>
              </div>
              <div class="text-center q-px-md" style="border-left:1px solid rgba(255,255,255,0.2);border-right:1px solid rgba(255,255,255,0.2);">
                <div class="text-white text-weight-bolder text-h5">1</div>
                <div class="text-white text-caption text-uppercase text-weight-medium" style="font-size:0.65rem;opacity:0.85">Session</div>
              </div>
              <div class="text-center">
                <div class="text-white text-weight-bolder text-h5">11</div>
                <div class="text-white text-caption text-uppercase text-weight-medium" style="font-size:0.65rem;opacity:0.85">Mins</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Start Session Button -->
        <q-btn unelevated no-caps to="/session"
          class="full-width q-mb-xl"
          style="border-radius:24px;background:#0f172a!important;height:72px;box-shadow:0 15px 35px rgba(15,23,42,0.25);">
          <div class="row items-center justify-center full-width">
            <div class="flex flex-center q-mr-md" style="background:white;border-radius:14px;width:40px;height:40px;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
              <q-icon name="play_arrow" size="24px" color="dark" />
            </div>
            <span class="text-weight-bold text-white text-h6" style="letter-spacing:-0.5px">Start Today's Session</span>
          </div>
        </q-btn>

        <!-- Exercise List -->
        <div class="row justify-between items-end q-mb-lg">
          <div class="text-h6 text-weight-bolder text-dark" style="letter-spacing:-0.5px">Today's Exercises</div>
          <q-btn flat dense color="primary" label="See All" class="text-weight-bold" no-caps />
        </div>
        <div v-for="(ex, index) in exercises" :key="index"
          class="row items-center q-pa-md q-mb-md"
          style="background:rgba(255,255,255,0.85);backdrop-filter:blur(16px);border-radius:24px;box-shadow:0 8px 25px rgba(0,0,0,0.04);border:1px solid rgba(255,255,255,1);">
          <div class="q-mr-md" style="position:relative;">
            <div class="bg-blue-grey-1 flex flex-center" style="width:68px;height:68px;border-radius:18px;overflow:hidden;">
              <q-icon :name="ex.thumbIcon" size="32px" color="primary" />
            </div>
          </div>
          <div class="col">
            <div class="text-weight-bold text-dark q-mb-xs" style="font-size:1.05rem">{{ ex.name }}</div>
            <div class="row items-center text-grey-6 text-caption text-weight-medium">
              <span class="q-mr-sm">{{ ex.reps }} Reps • {{ ex.sets }} Set</span>
              <q-badge color="cyan-1" text-color="cyan-8" class="text-uppercase text-weight-bold" rounded>{{ ex.type }}</q-badge>
            </div>
          </div>
          <div class="col-auto">
            <q-btn v-if="ex.markDone" unelevated no-caps
              style="border-radius:14px;padding:8px 16px;background:linear-gradient(135deg,#0ea5e9,#10b981)!important;box-shadow:0 6px 16px rgba(16,185,129,0.25);"
              class="text-weight-bold text-white">
              <q-icon name="check_circle" size="18px" class="q-mr-xs" />Done
            </q-btn>
            <q-btn v-else round flat color="grey-4" icon="more_vert" />
          </div>
        </div>
      </div>
    </template>

    <!-- ============================================================ -->
    <!-- ELSE: No exercises → Plans / Onboarding screen               -->
    <!-- ============================================================ -->
    <template v-else>

      <!-- ── Hero Section ── -->
      <section class="hero q-mx-md q-mb-sm">
        <div class="hero-deco" style="top:-40px;right:-40px;width:160px;height:160px;background:rgba(255,255,255,0.06);"></div>
        <div class="hero-deco" style="bottom:-30px;right:40px;width:100px;height:100px;background:rgba(255,255,255,0.05);"></div>
        <div class="hero-deco" style="top:20px;right:20px;width:50px;height:50px;background:rgba(255,255,255,0.08);"></div>

        <div class="hero-inner">
          <!-- Status Pill -->
          <div class="status-pill row items-center q-mb-sm" style="gap:6px;">
            <span class="status-dot"></span>
            <span class="status-text">No Active Program</span>
          </div>

          <div class="hero-title q-mb-xs">Start Your Recovery<br>Journey Today</div>
          <p class="hero-sub q-mb-lg">Choose a plan and get a personalised physiotherapy program curated just for you.</p>

          <!-- 5 Chips: row-of-3 + row-of-2 -->
          <div class="chips-grid">
            <div class="chips-row">
              <div class="chip" v-for="chip in chipsRow1" :key="chip.label">
                <span v-html="chip.svg"></span>
                <span class="chip-label">{{ chip.label }}</span>
                <span class="chip-sub">{{ chip.sub }}</span>
              </div>
            </div>
            <div class="chips-row">
              <div class="chip" v-for="chip in chipsRow2" :key="chip.label">
                <span v-html="chip.svg"></span>
                <span class="chip-label">{{ chip.label }}</span>
                <span class="chip-sub">{{ chip.sub }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Section Header ── -->
      <div class="section-header row justify-between items-center q-px-md q-pt-lg q-pb-sm">
        <div>
          <div class="section-title">Available Plans</div>
          <div class="section-sub">Tap a card to explore features</div>
        </div>
        <div class="plans-count-badge">
          <template v-if="plansLoading">...</template>
          <template v-else>{{ plans.length }} Plans</template>
        </div>
      </div>

      <!-- ── Loading Skeleton ── -->
      <div v-if="plansLoading" class="plans-list q-px-md">
        <div v-for="n in 3" :key="n" class="plan-card-skeleton q-mb-md">
          <div class="skeleton-line" style="width:40%;height:14px;margin-bottom:10px;"></div>
          <div class="skeleton-line" style="width:65%;height:10px;margin-bottom:14px;"></div>
          <div class="skeleton-line" style="width:30%;height:20px;"></div>
        </div>
      </div>

      <!-- ── Error State ── -->
      <div v-else-if="plansError" class="q-px-md q-py-lg text-center">
        <q-icon name="wifi_off" size="40px" color="grey-4" />
        <div class="q-mt-sm text-grey-6 text-body2">{{ plansError }}</div>
        <q-btn flat no-caps color="primary" label="Retry" class="q-mt-sm text-weight-bold" @click="fetchPlans" />
      </div>

      <!-- ── Plan Cards ── -->
      <div v-else class="plans-list q-px-md">
        <div v-for="plan in plans" :key="plan.id" class="plan-card-wrap">
          <div class="plan-card" :style="cardStyle(plan)" @click="toggleExpand(plan.id)">
            <!-- Shimmer bar for recommended -->
            <div v-if="plan.recommended" class="shimmer-bar"></div>
            <!-- Badge -->
            <span v-if="plan.badge" class="plan-badge">★ {{ plan.badge }}</span>

            <div class="plan-card-body">
              <div class="plan-header" style="display:flex;align-items:flex-start;gap:14px;">
                <!-- Duration Box -->
                <div class="duration-box flex flex-center flex-column" :class="plan.recommended ? 'is-recommended' : 'is-normal'">
                  <template v-if="plan.days">
                    <span class="duration-num" :style="{ color: plan.recommended ? 'white' : '#0A7E6E' }">{{ plan.days }}</span>
                    <span class="duration-unit" :style="{ color: plan.recommended ? 'rgba(255,255,255,0.75)' : '#6aada0' }">days</span>
                  </template>
                  <span v-else class="duration-star" :style="{ color: plan.recommended ? 'white' : '#0A7E6E' }">✦</span>
                </div>

                <!-- Plan Info -->
                <div class="col" :style="{ paddingRight: plan.badge ? '80px' : '0' }">
                  <div class="plan-name">{{ plan.name }}</div>
                  <div class="plan-tagline">{{ plan.tagline }}</div>
                  <div class="price-row row items-baseline" style="gap:6px;margin-top:8px;">
                    <span v-if="plan.free" class="price-free">Free</span>
                    <template v-else>
                      <span class="price-main" :style="{ color: plan.recommended ? '#0A7E6E' : '#0d2922' }">
                        ₹{{ plan.price.toLocaleString() }}
                      </span>
                      <span v-if="plan.originalPrice > plan.price" class="price-strike">₹{{ plan.originalPrice.toLocaleString() }}</span>
                      <span v-if="plan.originalPrice > plan.price" class="price-save">Save ₹{{ (plan.originalPrice - plan.price).toLocaleString() }}</span>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Collapsed hint -->
              <div v-if="!expandedIds.includes(plan.id)" class="expand-hint row justify-between items-center q-mt-sm">
                <div class="expand-dots row" style="gap:4px;">
                  <span v-for="n in 3" :key="n" class="expand-dot"></span>
                </div>
                <span class="expand-text">View details ↓</span>
              </div>

              <!-- Expanded: features + CTA -->
              <div v-if="expandedIds.includes(plan.id)" class="features-list">
                <div v-for="(feat, fi) in plan.features" :key="fi" class="feature-row row items-center" style="gap:9px;">
                  <div class="feature-icon flex flex-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span class="feature-text">{{ feat }}</span>
                </div>
                <button class="cta-btn full-width" :class="plan.recommended ? 'is-recommended' : 'is-normal'" @click.stop="selectPlan(plan)">
                  {{ plan.free ? 'View My Plan' : 'Get ' + plan.name }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Footer Note ── -->
      <div class="footer-note q-mx-md q-mt-lg row items-start" style="gap:10px;">
        <span style="font-size:16px; flex-shrink:0;">💬</span>
        <div>
          <div class="footer-title">Not sure which plan?</div>
          <div class="footer-body">Contact your physiotherapist — they can assign a plan directly from their end.</div>
        </div>
      </div>

      <!-- ── Toast ── -->
      <transition name="toast-fade">
        <div v-if="toastPlan" class="toast row items-center" style="gap:12px;">
          <div class="toast-icon flex flex-center">✓</div>
          <span>Selected: <strong>{{ toastPlan.name }}</strong></span>
          <button class="toast-close" @click="toastPlan = null">×</button>
        </div>
      </transition>

    </template>

    <div style="height: 100px"></div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()

const avatarUrl = computed(() => {
  const name = authStore.user?.username || 'Guest'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`
})

// Dev toggle
const hasExercises = ref(false)

// ── Exercise data ──
const exercises = ref([
  { name: 'Shoulder Shrugs',         type: 'Chair',  reps: 10, sets: 1, thumbIcon: 'airline_seat_recline_normal', markDone: true },
  { name: 'Row Scapular Retraction', type: 'Chair',  reps: 10, sets: 1, thumbIcon: 'accessibility_new',           markDone: false },
  { name: 'Facial Eyebrows Raise',   type: 'Mirror', reps: 10, sets: 1, thumbIcon: 'face',                        markDone: false },
  { name: 'Neck Stretches',          type: 'Chair',  reps: 5,  sets: 2, thumbIcon: 'self_improvement',            markDone: false },
])

// ── Hero chips ──
const svgSettings = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
const svgTarget  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
const svgCheck   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const svgCal     = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`
const svgUser    = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`

const chipsRow1 = ref([
  { svg: svgSettings, label: 'Customized',  sub: 'Built for you' },
  { svg: svgTarget,   label: 'Targeted',    sub: 'Precision care' },
  { svg: svgCheck,    label: 'Effective',   sub: 'Proven results' },
])
const chipsRow2 = ref([
  { svg: svgCal,  label: 'Weekly Check-ins',    sub: 'Reassessments' },
  { svg: svgUser, label: 'Physio Supervised',   sub: 'Expert oversight' },
])

// ── Plans data (loaded from API) ──
const plans      = ref([])
const plansLoading = ref(true)
const plansError   = ref('')

// Features map by duration (days) — shown when card is expanded
const featuresByDuration = {
  30: [
    'Personalised exercise program',
    'Daily exercise sessions',
    'Progress tracking & reports',
    'In-app physio support',
  ],
  90: [
    'Everything in 1 Month',
    'Priority support access',
    'Reassessment check-ins',
    'Downloadable progress report',
  ],
}

// Map API payload → UI plan object
const mapPlan = (item) => {
  const days  = parseInt(item.duration)
  const price = parseInt(item.c_price)
  // Mark longest plan as recommended
  const isRecommended = days >= 90

  return {
    id:            item.id,
    name:          item.category,
    tagline:       item.description,
    days,
    price,
    originalPrice: isRecommended ? Math.round(price * 1.2) : price, // 20% markup shown as strikethrough
    free:          false,
    recommended:   isRecommended,
    badge:         isRecommended ? 'Best Value' : null,
    features:      featuresByDuration[days] || [
      'Personalised exercise program',
      'In-app physio guidance',
      'Track your progress',
    ],
  }
}

// Starter Package — always prepended (assigned by physio, no API entry)
const starterPlan = {
  id:            'starter',
  name:          'Starter Package',
  tagline:       'Assigned by your physiotherapist',
  days:          null,
  price:         0,
  originalPrice: 0,
  free:          true,
  recommended:   false,
  badge:         null,
  features: [
    'Access to basic exercises',
    'Guided by your physio',
    'Track your progress',
    'In-app support chat',
  ],
}

const fetchPlans = async () => {
  plansLoading.value = true
  plansError.value   = ''
  try {
    const response = await api.get('getPhysioGymPackagePlans')
    if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
      // Sort by duration ascending (30 days first, 90 days last)
      const sorted = [...response.data.data].sort(
        (a, b) => parseInt(a.duration) - parseInt(b.duration)
      )
      plans.value = [starterPlan, ...sorted.map(mapPlan)]
    } else {
      plansError.value = response.data?.message || 'Failed to load plans.'
    }
  } catch (e) {
    plansError.value = e.response?.data?.message || 'Network error. Please try again.'
  } finally {
    plansLoading.value = false
  }
}

onMounted(() => {
  fetchPlans()
})

// ── Expand / collapse ──
const expandedIds = ref([])
const toggleExpand = (id) => {
  const idx = expandedIds.value.indexOf(id)
  if (idx === -1) expandedIds.value.push(id)
  else expandedIds.value.splice(idx, 1)
}

// ── Card style ──
const cardStyle = (plan) => {
  if (!plan.recommended) return {
    background: 'white',
    border: '1.5px solid rgba(10,126,110,0.08)',
    boxShadow: '0 2px 16px rgba(10,126,110,0.05)',
  }
  return {
    background: 'white',
    border: '2px solid rgba(10,126,110,0.12)',
    boxShadow: '0 6px 24px rgba(10,126,110,0.12)',
  }
}

// ── Toast ──
const toastPlan = ref(null)
let toastTimer = null
const selectPlan = (plan) => {
  toastPlan.value = plan
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastPlan.value = null }, 3000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; }
button { font-family: 'Sora', sans-serif; cursor: pointer; border: none; outline: none; }

/* ── Animations ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}
@keyframes badgePop {
  0%   { transform: scale(0.8) rotate(-3deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(1deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg);   opacity: 1; }
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* ── Page ── */
.dashboard-page {
  font-family: 'Sora', sans-serif;
  background: linear-gradient(175deg, #e8f8f3 0%, #f2faf7 40%, #edf8f5 100%);
  min-height: 100vh;
}

/* ── Top Header ── */
.top-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(232,248,243,0.92);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(10,126,110,0.07);
}
.logo-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(145deg, #0c9b80, #0A7E6E);
  box-shadow: 0 3px 10px rgba(10,126,110,0.3); flex-shrink: 0;
}
.logo-label { font-size: 16px; font-weight: 700; color: #0d2922; letter-spacing: -0.2px; }
.bell-btn {
  width: 38px; height: 38px; border-radius: 11px;
  background: rgba(255,255,255,0.8); border: 1px solid rgba(10,126,110,0.1);
  cursor: pointer;
}
.bell-dot {
  position: absolute; top: 6px; right: 6px;
  width: 8px; height: 8px; border-radius: 50%;
  background: #e74c3c; border: 1.5px solid #e8f8f3;
}

/* ── Hero ── */
.hero {
  border-radius: 22px;
  background: linear-gradient(145deg, #0c9b80 0%, #0A7E6E 60%, #087a68 100%);
  padding: 24px 22px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(10,126,110,0.25);
  animation: fadeUp 0.35s cubic-bezier(.25,.8,.25,1) both;
}
.hero-deco { position: absolute; border-radius: 50%; pointer-events: none; }
.hero-inner { position: relative; }

.status-pill {
  display: inline-flex; align-items: center;
  background: rgba(255,255,255,0.15); border-radius: 20px; padding: 5px 12px;
}
.status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #7dffd0; animation: pulse 2s ease infinite;
}
.status-text {
  font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.9);
  letter-spacing: 0.5px; text-transform: uppercase; font-family: 'DM Sans', sans-serif;
  margin-left: 6px;
}
.hero-title {
  font-size: 22px; font-weight: 800; color: white;
  line-height: 1.25; letter-spacing: -0.4px;
}
.hero-sub {
  font-size: 13px; color: rgba(255,255,255,0.72);
  font-family: 'DM Sans', sans-serif; line-height: 1.5;
}

/* Chips */
.chips-grid { display: flex; flex-direction: column; gap: 7px; }
.chips-row  { display: flex; gap: 7px; }
.chip {
  flex: 1; min-width: 0;
  background: rgba(255,255,255,0.13);
  border-radius: 11px; padding: 9px 7px 8px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(4px);
}
.chip-label {
  font-size: 10px; font-weight: 700; color: white;
  font-family: 'DM Sans', sans-serif; text-align: center; line-height: 1.2;
}
.chip-sub {
  font-size: 9px; color: rgba(255,255,255,0.55);
  font-family: 'DM Sans', sans-serif; text-align: center; line-height: 1.1;
}

/* ── Section Header ── */
.section-title { font-size: 17px; font-weight: 700; color: #0d2922; letter-spacing: -0.2px; font-family: 'Sora', sans-serif; }
.section-sub   { font-size: 12.5px; color: #8ab5ae; font-family: 'DM Sans', sans-serif; margin-top: 2px; }
.plans-count-badge {
  background: rgba(10,126,110,0.08); border-radius: 10px;
  padding: 5px 10px; font-size: 11.5px; font-weight: 600;
  color: #0A7E6E; font-family: 'DM Sans', sans-serif;
}

/* ── Plans List ── */
.plans-list { display: flex; flex-direction: column; gap: 12px; }
.plan-card-wrap:nth-child(1) { animation: fadeUp 0.4s 0.10s cubic-bezier(.25,.8,.25,1) both; }
.plan-card-wrap:nth-child(2) { animation: fadeUp 0.4s 0.20s cubic-bezier(.25,.8,.25,1) both; }
.plan-card-wrap:nth-child(3) { animation: fadeUp 0.4s 0.30s cubic-bezier(.25,.8,.25,1) both; }

/* ── Plan Card ── */
.plan-card {
  position: relative; border-radius: 20px; overflow: hidden; cursor: pointer;
  transition: transform 0.2s cubic-bezier(.25,.8,.25,1), box-shadow 0.2s ease;
}
.plan-card:active { transform: scale(0.98); }
.plan-card-body  { padding: 18px 18px 16px; }

/* Shimmer */
.shimmer-bar {
  height: 3px;
  background: linear-gradient(90deg, #0A7E6E, #3dba8a, #0A7E6E);
  background-size: 200% auto; animation: shimmer 2.5s linear infinite;
}

/* Badge */
.plan-badge {
  position: absolute; top: 18px; right: 16px;
  background: linear-gradient(135deg, #0A7E6E, #3dba8a);
  color: white; font-size: 10.5px; font-weight: 700;
  font-family: 'Sora', sans-serif; letter-spacing: 0.5px;
  padding: 4px 10px; border-radius: 20px;
  box-shadow: 0 3px 10px rgba(10,126,110,0.3);
  animation: badgePop 0.4s 0.4s cubic-bezier(.34,1.56,.64,1) both;
}

/* Duration Box */
.duration-box {
  flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px;
}
.duration-box.is-recommended {
  background: linear-gradient(145deg, #0c9b80, #0A7E6E);
  box-shadow: 0 4px 14px rgba(10,126,110,0.3);
}
.duration-box.is-normal { background: rgba(10,126,110,0.09); }
.duration-num  { font-size: 16px; font-weight: 800; line-height: 1; font-family: 'Sora', sans-serif; }
.duration-unit { font-size: 9px; font-weight: 600; letter-spacing: 0.3px; font-family: 'DM Sans', sans-serif; text-transform: uppercase; }
.duration-star { font-size: 20px; }

/* Plan Info */
.plan-name    { font-size: 15.5px; font-weight: 700; color: #0d2922; font-family: 'Sora', sans-serif; line-height: 1.2; }
.plan-tagline { font-size: 12px; color: #7aada5; font-family: 'DM Sans', sans-serif; margin-top: 3px; }
.price-free   {
  font-size: 18px; font-weight: 800; font-family: 'Sora', sans-serif;
  background: linear-gradient(135deg, #0A7E6E, #3dba8a);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.price-main   { font-size: 21px; font-weight: 800; font-family: 'Sora', sans-serif; }
.price-strike { font-size: 12px; color: #aaa; text-decoration: line-through; font-family: 'DM Sans', sans-serif; }
.price-save   { font-size: 11px; font-weight: 600; color: #3dba8a; font-family: 'DM Sans', sans-serif; }

/* Expand hint */
.expand-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(10,126,110,0.2); }
.expand-text { font-size: 11.5px; color: #0A7E6E; font-weight: 600; font-family: 'DM Sans', sans-serif; }

/* Features */
.features-list {
  margin-top: 14px; padding-top: 14px;
  border-top: 1px solid rgba(10,126,110,0.08);
  display: flex; flex-direction: column; gap: 8px;
}
.feature-icon {
  width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
  background: rgba(10,126,110,0.1);
}
.feature-text { font-size: 13px; color: #3a6b62; font-family: 'DM Sans', sans-serif; font-weight: 500; }

/* CTA Button */
.cta-btn {
  margin-top: 14px; height: 46px; border-radius: 13px;
  font-size: 14px; font-weight: 600; font-family: 'Sora', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  width: 100%;
}
.cta-btn:active { transform: scale(0.96); }
.cta-btn.is-recommended {
  background: linear-gradient(145deg, #0c9b80, #0A7E6E);
  color: white; box-shadow: 0 4px 16px rgba(10,126,110,0.28);
}
.cta-btn.is-normal { background: rgba(10,126,110,0.08); color: #0A7E6E; }

/* Footer Note */
.footer-note {
  padding: 14px 16px;
  background: rgba(255,255,255,0.6); border: 1px solid rgba(10,126,110,0.1);
  border-radius: 14px;
  animation: fadeUp 0.4s 0.35s cubic-bezier(.25,.8,.25,1) both;
}
.footer-title { font-size: 13px; font-weight: 600; color: #0d2922; font-family: 'Sora', sans-serif; }
.footer-body  { font-size: 12px; color: #7aada5; font-family: 'DM Sans', sans-serif; margin-top: 2px; line-height: 1.5; }

/* Toast */
.toast {
  position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
  background: #0d2922; color: white; padding: 14px 20px; border-radius: 16px;
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  white-space: nowrap; z-index: 200; animation: toastIn 0.3s ease;
}
.toast-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(10,126,110,0.3); font-size: 14px;
}
.toast-close { background: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; padding: 0 0 0 4px; line-height: 1; }

/* Toast transition */
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(12px); }
.toast-fade-leave-to  { opacity: 0; transform: translateX(-50%) translateY(12px); }

/* Hero card (exercise dashboard) */
.hero-card {
  border-radius: 32px;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  box-shadow: 0 24px 48px rgba(16,185,129,0.25);
  position: relative; overflow: hidden;
}
.hero-bg-shapes {
  position: absolute; top:0; left:0; right:0; bottom:0;
  background-image: radial-gradient(circle at 90% -10%, rgba(255,255,255,0.2) 0%, transparent 50%),
                    radial-gradient(circle at 10% 110%, rgba(255,255,255,0.15) 0%, transparent 50%);
  pointer-events: none;
}

/* ── Skeleton Loader ── */
@keyframes skeletonShimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.plan-card-skeleton {
  background: white;
  border-radius: 20px;
  padding: 20px 18px;
  border: 1.5px solid rgba(10,126,110,0.08);
  box-shadow: 0 2px 16px rgba(10,126,110,0.05);
}
.skeleton-line {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: skeletonShimmer 1.4s ease infinite;
}
</style>
