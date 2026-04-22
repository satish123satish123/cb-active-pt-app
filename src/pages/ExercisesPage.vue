<template>
  <section class="screen">
    <div class="hero">
      <div class="hero-row">
        <div>
          <div class="subtle header-top">
            <button class="back-btn-white" @click="$router.back()">
              <q-icon name="arrow_back" size="18px" color="black" />
            </button>
            <span>My Exercises</span>
          </div>
          <h5 class="q-ma-none text-weight-bold">{{ currentDayLabel || `Day ${daysCompleted}` }} of {{ totalDays }}</h5>
          <div class="subtle adherence-text">{{ adherencePercentage }}% adherence • Your guided home recovery plan</div>
        </div>
      </div>
    </div>

    <div class="stack">
      <div class="section">
        <div class="card soft summary-card">
          <div class="exercise-topline">
            <div style="min-width: 0; flex: 1">
              <div class="title muted uppercase-title">TODAY's EXERCISES</div>
              <div class="muted status-subtitle">
                {{ completedCount }} completed · {{ pendingCount }} still pending
              </div>
            </div>
          </div>

          <div class="split progress-row">
            <div class="progress-dots-wrap">
              <span
                v-for="(ex, idx) in exercises"
                :key="idx"
                class="progress-dot"
                :class="getExStatus(ex)"
              ></span>
            </div>
            <strong class="completion-text"
              >{{ completedCount }}/{{ exercises.length }} Completed</strong
            >
          </div>

          <div class="summary-actions">
            <button class="btn secondary small" @click="$router.push('/exercise-history')">
              Previous Days
            </button>
            <button class="btn ghost small" @click="$router.push('/progress')">
              Overall Progress
            </button>
          </div>

          <button class="exercise-main-cta" @click="handleMainCTA">
            <q-icon name="play_arrow" size="20px" class="q-mr-xs" />
            {{ mainCTALabel }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filter segment -->
    <div class="section filter-section">
      <div class="segment">
        <button :class="{ active: exerciseFilter === 'today' }" @click="setExerciseFilter('today')">
          All
        </button>
        <button
          :class="{ active: exerciseFilter === 'pending' }"
          @click="setExerciseFilter('pending')"
        >
          Pending
        </button>
        <button :class="{ active: exerciseFilter === 'done' }" @click="setExerciseFilter('done')">
          Completed
        </button>
      </div>
    </div>

    <!-- Exercise list -->
    <div class="section">
      <div class="list">
        <template v-if="filteredExercises.length">
          <div
            v-for="ex in filteredExercises"
            :key="ex.id"
            class="exercise-card"
            :class="{
              done: getExStatus(ex) === 'done',
              active: getExStatus(ex) === 'in-progress',
            }"
            @click="openExercise(ex.id)"
          >
            <div class="exercise-card-head">
              <span
                class="exercise-status-icon"
                :class="{
                  done: getExStatus(ex) === 'done',
                  active: getExStatus(ex) === 'in-progress',
                }"
              >
                <q-icon v-if="getExStatus(ex) === 'done'" name="check" size="14px" />
                <q-icon
                  v-else-if="getExStatus(ex) === 'in-progress'"
                  name="play_arrow"
                  size="14px"
                />
                <q-icon v-else name="panorama_fish_eye" size="14px" />
              </span>
              <div class="exercise-info">
                <div class="exercise-card-title">{{ ex.name }}</div>
                <div class="exercise-card-subtitle">{{ ex.instruction }}</div>
                <div class="exercise-card-goal">
                  Goal: {{ ex.goal || 'Build shoulder stability' }}
                </div>
              </div>
              <span class="badge" :class="statusBadge(getExStatus(ex))">{{
                statusLabel(getExStatus(ex))
              }}</span>
            </div>

            <div class="exercise-card-meta">
              <span class="exercise-mini-chip">{{ ex.equipment || 'No Equipment' }}</span>
              <span class="exercise-mini-chip">{{ ex.duration }}</span>
              <span class="exercise-mini-chip"
                >Set {{ ex.progress.set }}/{{ ex.progress.totalSets }}</span
              >
            </div>

            <div class="exercise-card-actions">
              <div>
                <div class="exercise-card-reps">{{ ex.reps }} reps • {{ ex.sets }} sets</div>
                <div class="exercise-card-step">
                  {{ stepLabel(getExStatus(ex)) }}
                </div>
              </div>
              <button class="exercise-inline-btn" :class="getExStatus(ex)">
                {{ actionLabel(getExStatus(ex)) }}
              </button>
            </div>
          </div>
        </template>
        <div v-else class="card empty">
          <div class="big">✅</div>
          <div>Nothing here right now.</div>
        </div>
      </div>
    </div>

    <!-- Guidance -->
    <div class="section guidance-section">
      <div class="card guidance-card">
        <div class="title q-mb-sm">Important exercise guidance</div>
        <div class="muted">
          Move slowly, stay within comfort, and stop if pain becomes sharp. Use WhatsApp support if
          something feels unusual during exercise.
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExerciseStore } from 'src/stores/exerciseStore'
import { useAuthStore } from 'src/stores/authStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const store = useExerciseStore()
const { exercises, completedCount, pendingCount, daysCompleted, totalDays, adherencePercentage, currentDayLabel } = storeToRefs(store)
const getExStatus = store.getExStatus

const exerciseFilter = ref('today')

onMounted(() => {
  const patientId = authStore.user?.patient
  const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''
  store.fetchExercises(patientId, hospitalId)
})

const filteredExercises = computed(() => {
  if (exerciseFilter.value === 'today') return exercises.value
  if (exerciseFilter.value === 'pending')
    return exercises.value.filter((x) => store.getExStatus(x) !== 'done')
  return exercises.value.filter((x) => store.getExStatus(x) === 'done')
})

const mainCTALabel = computed(() => {
  if (completedCount.value === exercises.value.length) return 'Review Session'
  const active = exercises.value.find((ex) => store.getExStatus(ex) === 'in-progress')
  if (active) return `Resume Session (22 mins)`
  return 'Start Session (22 mins)'
})

function setExerciseFilter(filter) {
  exerciseFilter.value = filter
}

function openExercise(id) {
  router.push(`/exercise-player/${id}`)
}

function handleMainCTA() {
  if (completedCount.value === exercises.value.length) {
    router.push('/exercise-history')
  } else {
    const active =
      exercises.value.find((ex) => store.getExStatus(ex) === 'in-progress') ||
      exercises.value.find((ex) => store.getExStatus(ex) === 'pending')
    if (active) openExercise(active.id)
  }
}

function statusBadge(status) {
  if (status === 'done') return 'success'
  if (status === 'in-progress') return 'brand'
  if (status === 'pending') return 'upcoming'
  return 'low-priority'
}

function statusLabel(status) {
  if (status === 'done') return 'Completed'
  if (status === 'in-progress') return 'Active'
  if (status === 'pending') return 'Due Today'
  return 'Upcoming'
}

function actionLabel(status) {
  return status === 'done' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'
}

function stepLabel(status) {
  if (status === 'done') return 'Session completed'
  if (status === 'in-progress') return 'Continue from your current set'
  return 'Tap to start this exercise'
}
</script>

<style scoped>
.hero {
  background: var(--grad);
  padding: 24px 20px 80px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.back-btn-white {
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.hero h5 {
  color: white;
  font-size: 32px;
  font-weight: 850;
  margin: 0;
  letter-spacing: -0.02em;
}

.adherence-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
}

.stack {
  margin-top: -60px;
  position: relative;
  z-index: 5;
}

.summary-card {
  padding: 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(16, 33, 42, 0.08);
}

.uppercase-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #7a9494;
  margin-bottom: 4px;
}

.status-subtitle {
  font-size: 13px;
  color: #557070;
}

.progress-row {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-dots-wrap {
  display: flex;
  gap: 6px;
}

.progress-dots-wrap .progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dfe8e8;
  transition: all 0.3s ease;
}

.progress-dots-wrap .progress-dot.done {
  background: var(--brand);
}

@keyframes blinkScale {
  0% { opacity: 1; box-shadow: 0 0 0 2px rgba(26, 168, 138, 0.4); transform: scale(1.1); }
  50% { opacity: 0.65; box-shadow: 0 0 0 6px rgba(26, 168, 138, 0.1); transform: scale(1.1); }
  100% { opacity: 1; box-shadow: 0 0 0 2px rgba(26, 168, 138, 0.4); transform: scale(1.1); }
}

.progress-dots-wrap .progress-dot.in-progress {
  background: #1aa88a;
  animation: blinkScale 1.8s infinite ease-in-out;
}

.progress-dots-wrap .progress-dot.pending {
  background: #cfdada;
}

.progress-dots-wrap .progress-dot.missed {
  background: #ffcbd1;
}

.progress-dots-wrap .progress-dot.partial {
  background: #ffd5a1;
}

.completion-text {
  font-size: 14px;
  font-weight: 800;
  color: #1a3333;
}

.summary-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.summary-actions .btn {
  flex: 1;
}

.btn.secondary {
  background: #e6f5f3;
  color: #168a7a;
}

.exercise-main-cta {
  margin-top: 16px;
  width: 100%;
  height: 54px;
  background: #4d6661;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.exercise-main-cta:active {
  opacity: 0.9;
}

.filter-section {
  margin-top: 24px;
}

.segment {
  background: #f0f4f4;
  padding: 4px;
  border-radius: 12px;
}

.segment button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
}

.exercise-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfb 100%);
  border: 1px solid #dbe7ea;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.exercise-card.active {
  border-color: rgba(10, 126, 110, 0.28);
  background: linear-gradient(180deg, #f5fcfa 0%, #eef8f5 100%);
  box-shadow: 0 16px 30px rgba(10, 126, 110, 0.12);
  transform: scale(0.98);
}

.exercise-card.done {
  border-color: rgba(31, 138, 77, 0.18);
  background: linear-gradient(180deg, #f8fdf9 0%, #f1faf4 100%);
}

.exercise-card-head {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 12px;
  align-items: flex-start;
}

.exercise-status-icon {
  width: 24px;
  height: 24px;
  border: 1.5px solid #d4e0de;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4e0de;
  margin-top: 2px;
}

.exercise-status-icon.done {
  background: #e6f7f4;
  border-color: #1aa88a;
  color: #1aa88a;
}

.exercise-status-icon.active {
  background: #f0fbfc;
  border-color: #1aa88a;
  color: #1aa88a;
}

.exercise-card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1a3333;
}

.exercise-card-subtitle {
  font-size: 13px;
  color: #6a8585;
  margin-top: 2px;
  font-weight: bold;
}

.exercise-card-goal {
  font-size: 12px;
  font-weight: bold;
  color: #0d8a7a;
  margin-top: 6px;
}

.badge.upcoming {
  background: #fff3e6;
  color: #d48a20;
}

.badge.low-priority {
  background: #f0f4f4;
  color: #6a8585;
}

.badge.brand {
  background: #e6f7f4;
  color: #168a7a;
}

.badge.success {
  background: #e6f7ed;
  color: #1aa88a;
}

.exercise-card-meta {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.exercise-mini-chip {
  padding: 6px 10px;
  background: #f4f8f8;
  border-radius: 99px;
  font-size: 12px;
  font-weight: bold;
  color: #557070;
  border: 1px solid #eef0f2;
}

.exercise-card-actions {
  margin-top: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.exercise-card-reps {
  font-size: 14px;
  font-weight: 800;
  color: #1a3333;
}

.exercise-card-step {
  font-size: 12px;
  color: #6a8585;
  margin-top: 2px;
  font-weight: bold;
}

.exercise-inline-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  background: #eef4f4;
  color: #557070;
}

.exercise-inline-btn.pending {
  background: #e6f7f4;
  color: #168a7a;
}

.exercise-inline-btn.in-progress {
  background: #e6f7f4;
  color: #168a7a;
}

.exercise-inline-btn.done {
  background: #f0f4f4;
  color: #557070;
}

.guidance-section {
  margin-top: 24px;
  margin-bottom: 20px;
}

.guidance-card {
  background: #eaf6f7;
  border-radius: 22px;
  padding: 20px;
  border: none;
}

.guidance-card .title {
  font-size: 16px;
  font-weight: 850;
  color: #1a3333;
}

.guidance-card .muted {
  font-size: 13px;
  line-height: 1.5;
  color: #557070;
}

.bottom-nav {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.nav-btn {
  transition: color 0.2s;
}

.nav-btn.active {
  color: #168a7a;
  background: #f0fbfc;
}
</style>


