<template>
  <section class="screen player-screen">
    <!-- Custom Header -->
    <header class="player-header">
      <button class="back-btn-white" @click="$router.push('/exercises')">
        <q-icon name="arrow_back" size="18px" color="black" />
      </button>
      <div class="header-content">
        <div class="header-title">{{ ex.name }}</div>
        <div class="header-sub">Guided exercise mode</div>
      </div>
    </header>

    <!-- Unified Exercise Card -->
    <div class="section">
      <div class="exercise-player-card">
        <!-- Top Half: Info & Focus -->
        <div class="player-card-top">
          <div class="info-topline">
            <div class="eyebrow-text">EXERCISE {{ currentNumber }} OF {{ total }}</div>
            <span class="badge" :class="statusBadge(ex.status)">{{ statusLabel(ex.status) }}</span>
          </div>
          <h5 class="ex-player-name">{{ ex.name }}</h5>
          <p class="ex-player-subtitle">{{ ex.subtitle || ex.instruction }}</p>

          <div class="exercise-player-focus-grid">
            <div class="focus-box">
              <div class="focus-label">GOAL</div>
              <div class="focus-value">{{ ex.goal || 'Build shoulder stability' }}</div>
            </div>
            <div class="focus-box">
              <div class="focus-label">PRESCRIPTION</div>
              <div class="focus-value">{{ ex.reps }} reps • {{ ex.sets }} sets</div>
            </div>
            <div class="focus-box">
              <div class="focus-label">EQUIPMENT</div>
              <div class="focus-value">{{ ex.equipment || 'No Equipment' }}</div>
            </div>
          </div>
        </div>

        <div class="player-divider"></div>

        <!-- Bottom Half: Visual Content -->
        <div class="player-card-bottom">
          <div class="visual-card">
            <div class="visual-thumb">{{ ex.icon }}</div>
            <div class="visual-name">{{ ex.name }}</div>
            <div class="visual-instruction">{{ ex.instruction }}</div>
            <div class="visual-chips">
              <span class="v-chip">{{ ex.frequency }}</span>
              <span class="v-chip">{{ ex.duration }}</span>
              <span class="v-chip">{{ ex.focus || 'Upper Body Activation' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Card -->
    <div class="section">
      <div class="card progress-card-player">
        <div class="split">
          <div>
            <div class="title">Current progress</div>
            <div class="muted">Continue from where you left off.</div>
          </div>
          <span class="badge brand">{{ progressPercent }}%</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-rail">
            <div class="progress-fill" :style="`width:${progressPercent}%`"></div>
          </div>
        </div>
        <div class="split progress-labels">
          <div class="muted">
            Set {{ ex.progress.set }} of {{ ex.progress.totalSets }} completed
          </div>
          <strong class="sets-left-text">{{ ex.progress.totalSets - ex.progress.set }} left</strong>
        </div>
        <div class="progress-actions">
          <button class="btn primary full-btn" @click="cycleExerciseProgress()">
            {{ ex.progress.set === ex.progress.totalSets ? 'Reset Progress' : 'Complete Next Set' }}
          </button>
          <button class="btn ghost full-btn" @click="$router.push('/support')">Need Help?</button>
        </div>
      </div>
    </div>

    <!-- Tip Card -->
    <div class="section">
      <div class="card tip-card">
        <div class="title q-mb-xs">Technique tip</div>
        <div class="muted tip-text">{{ ex.tips }}</div>
      </div>
    </div>

    <!-- Sticky Footer Nav -->
    <div class="player-footer-spacer"></div>
    <div class="exercise-sticky-nav">
      <button class="nav-btn-grey" :disabled="currentNumber === 1" @click="goToPrevExercise">
        Previous
      </button>
      <div class="nav-center-text">Exercise {{ currentNumber }} of {{ total }}</div>
      <button class="nav-btn-primary" @click="goToNextExercise">
        {{ currentNumber === total ? 'Finish' : 'Next' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExerciseStore } from 'src/stores/exerciseStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const store = useExerciseStore()
const { exercises } = storeToRefs(store)

const ex = computed(() => getSelectedExercise())
const currentNumber = computed(() => exercises.value.findIndex((x) => x.id === ex.value.id) + 1)
const total = computed(() => exercises.value.length)

function getSelectedExercise() {
  const id = Number(route.params.exercise_id)
  return exercises.value.find((x) => x.id === id) || exercises.value[0]
}

const progressPercent = computed(() => {
  const e = ex.value
  return Math.round((e.progress.set / e.progress.totalSets) * 100)
})

function cycleExerciseProgress() {
  store.updateProgress(ex.value.id)
}

function goToPrevExercise() {
  const idx = exercises.value.findIndex((x) => x.id === ex.value.id)
  if (idx > 0) {
    router.push(`/exercise-player/${exercises.value[idx - 1].id}`)
  }
}

function goToNextExercise() {
  const idx = exercises.value.findIndex((x) => x.id === ex.value.id)
  if (idx < exercises.value.length - 1) {
    router.push(`/exercise-player/${exercises.value[idx + 1].id}`)
  } else {
    router.push('/exercises')
  }
}

function statusBadge(status) {
  return status === 'done' ? 'success' : status === 'in-progress' ? 'brand' : 'upcoming'
}

function statusLabel(status) {
  return status === 'done' ? 'Completed' : status === 'in-progress' ? 'Active' : 'Upcoming'
}
</script>

<style scoped>
.player-screen {
  padding-bottom: 120px;
}

.player-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px 16px;
}

.back-btn-white {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eef0f2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.header-title {
  font-size: 20px;
  font-weight: 850;
  color: #1a3333;
}

.header-sub {
  font-size: 13px;
  color: #6a8585;
}

.exercise-player-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(180deg, #fcfefe 0%, #f4f9f9 100%);
  border: 1px solid #dce7ea;
  box-shadow: 0 14px 30px rgba(16, 33, 42, 0.06);
}

.player-card-top {
  padding: 18px;
  border-bottom: 1px solid rgba(220, 231, 234, 0.85);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(247, 251, 251, 0.9) 100%);
}

.player-divider {
  height: 1px;
  background: #eef1f2;
  width: 100%;
}

.player-card-bottom {
  padding: 16px 16px 24px;
}

.info-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow-text {
  font-size: 11px;
  font-weight: 800;
  color: #7a9494;
  letter-spacing: 0.05em;
}

.ex-player-name {
  font-size: 20px;
  font-weight: 850;
  color: #1a3333;
  margin: 0;
}

.ex-player-subtitle {
  font-size: 14px;
  color: #6a8585;
  margin: 6px 0 20px;
}

.exercise-player-focus-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.focus-box {
  background: white;
  border: 1px solid #f0f4f4;
  border-radius: 18px;
  padding: 14px 10px;
  text-align: left;
}

.focus-label {
  font-size: 10px;
  font-weight: 850;
  color: #1a3333;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.focus-value {
  font-size: 13px;
  font-weight: 750;
  color: #1a3333;
  line-height: 1.4;
}

.visual-card {
  background: var(--grad-soft);
  border: 1px solid #e1eded;
  border-radius: 24px;
  text-align: center;
  padding: 34px 20px;
}

.visual-thumb {
  font-size: 48px;
  margin-bottom: 20px;
}

.visual-name {
  font-size: 20px;
  font-weight: 850;
  color: #1a3333;
}

.visual-instruction {
  font-size: 14px;
  color: #6a8585;
  margin: 10px 0 20px;
  line-height: 1.5;
}

.visual-chips {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.v-chip {
  padding: 6px 14px;
  background: #f0f6f6;
  border: 1px solid var(--line);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  color: #557070;
}

.progress-card-player {
  padding: 24px;
  background: white;
  border-radius: 24px;
  border: 1px solid #f0f4f4;
  box-shadow: 0 4px 15px rgba(16, 33, 42, 0.03);
}

.progress-labels {
  margin-top: 14px;
}

.sets-left-text {
  font-size: 16px;
  font-weight: 850;
}

.progress-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.full-btn {
  flex: 1;
  height: 52px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
}

.btn.primary {
  background: #1aa88a;
}

.btn.ghost {
  border: 1px solid #eef0f2;
}

.tip-card {
  background: #f8fbfb;
  border-radius: 20px;
  border: none;
  padding: 20px;
}

.tip-card .title {
  font-size: 17px;
  font-weight: 850;
}

.tip-text {
  font-size: 14px;
  line-height: 1.6;
}

.player-footer-spacer {
  height: 40px;
}

.exercise-sticky-nav {
  position: fixed;
  left: 50%;
  bottom: 78px;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 428px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(220, 231, 234, 0.92);
  box-shadow: 0 16px 30px rgba(16, 33, 42, 0.14);
  backdrop-filter: blur(14px);
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  z-index: 24;
}

.nav-btn-grey {
  height: 48px;
  padding: 0 24px;
  background: #f0f4f4;
  color: #1a3333;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  font-size: 14px;
}

.nav-btn-grey:disabled {
  opacity: 0.5;
}

.nav-btn-primary {
  height: 48px;
  padding: 0 32px;
  background: #1aa88a;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  font-size: 14px;
}

.nav-center-text {
  font-size: 13px;
  font-weight: 750;
  color: #557070;
}

.badge.brand {
  background: #e6f7f4;
  color: #168a7a;
}

.badge.upcoming {
  background: #e6f7f4;
  color: #168a7a;
}
</style>
