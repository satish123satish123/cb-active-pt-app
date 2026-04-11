<template>
  <section class="screen">
    <ScreenHeader title="My Exercises" sub="Your guided home recovery plan" />

    <!-- Completion summary -->
    <div class="section">
      <div class="card soft">
        <div class="split" style="align-items: flex-start; gap: 12px">
          <div>
            <div class="title">Today's completion</div>
            <div class="muted">3 of 4 exercises still need attention today.</div>
          </div>
          <span class="badge warn">68% Compliance</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-rail"><div class="progress-fill" style="width: 68%"></div></div>
        </div>
        <div style="margin-top: 12px; display: flex; gap: 10px">
          <button class="btn secondary small" @click="$router.push('/exercise-history')">
            Previous Days
          </button>
          <button class="btn ghost small" @click="$router.push('/progress')">
            Overall Progress
          </button>
        </div>
      </div>
    </div>

    <!-- Filter segment -->
    <div class="section">
      <div class="segment">
        <button :class="{ active: exerciseFilter === 'today' }" @click="setExerciseFilter('today')">
          Today
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
        <template v-if="exerciseList.length">
          <div
            v-for="ex in exerciseList"
            :key="ex.id"
            class="list-item press"
            @click="$router.push(`/exercise-player/${ex.id}`)"
          >
            <div class="exercise-row">
              <div class="thumb">{{ ex.icon }}</div>
              <div>
                <div class="split" style="align-items: flex-start">
                  <div>
                    <div class="exercise-name">{{ ex.name }}</div>
                    <div class="exercise-meta">
                      {{ ex.sets }} sets × {{ ex.reps }} reps • {{ ex.frequency }}
                    </div>
                  </div>
                  <span class="badge" :class="statusBadge(ex.status)">{{
                    statusLabel(ex.status)
                  }}</span>
                </div>
                <div class="chips">
                  <span class="chip">{{ ex.duration }}</span>
                  <span class="chip">Set {{ ex.progress.set }}/{{ ex.progress.totalSets }}</span>
                </div>
                <div style="margin-top: 12px; display: flex; gap: 10px">
                  <button class="btn primary small">{{ actionLabel(ex.status) }}</button>
                  <button class="btn ghost small" @click.stop>Instructions</button>
                </div>
              </div>
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
    <div class="section">
      <div class="card grad">
        <div class="title">Important exercise guidance</div>
        <div class="muted" style="margin-top: 8px">
          Move slowly, stay within comfort, and stop if pain becomes sharp. Use WhatsApp support if
          something feels unusual during exercise.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const exerciseList = computed(() => getExerciseList())
const exerciseFilter = ref('today')
const exercises = ref([
  {
    id: 1,
    icon: '⏱️',
    name: 'Pendulum Swings',
    sets: 3,
    reps: 20,
    frequency: '2x daily',
    duration: '5 min',
    status: 'pending',
    instruction: 'Relax your shoulder and gently swing your arm forward, backward, and in circles.',
    tips: 'Keep the movement light and controlled. Stop if pain becomes sharp.',
    progress: { set: 0, totalSets: 3 },
  },
  {
    id: 2,
    icon: '🧱',
    name: 'Wall Slides',
    sets: 3,
    reps: 15,
    frequency: '2x daily',
    duration: '6 min',
    status: 'in-progress',
    instruction: 'Slide both arms upward on the wall without shrugging the shoulder.',
    tips: 'Move only within comfortable range.',
    progress: { set: 1, totalSets: 3 },
  },
  {
    id: 3,
    icon: '🎯',
    name: 'Band External Rotation',
    sets: 3,
    reps: 12,
    frequency: 'Daily',
    duration: '7 min',
    status: 'pending',
    instruction: 'Keep elbow by your side and rotate forearm outward against the band.',
    tips: 'Avoid twisting the body.',
    progress: { set: 0, totalSets: 3 },
  },
  {
    id: 4,
    icon: '💪',
    name: 'Scapular Retraction',
    sets: 3,
    reps: 15,
    frequency: 'Daily',
    duration: '4 min',
    status: 'done',
    instruction: 'Gently squeeze shoulder blades back and down.',
    tips: 'Do not arch your lower back.',
    progress: { set: 3, totalSets: 3 },
  },
])

function setExerciseFilter(filter) {
  exerciseFilter.value = filter
}

function getExerciseList() {
  if (exerciseFilter.value === 'today') return exercises.value
  if (exerciseFilter.value === 'pending') return exercises.value.filter((x) => x.status !== 'done')
  return exercises.value.filter((x) => x.status === 'done')
}

function statusBadge(status) {
  return status === 'done' ? 'success' : status === 'in-progress' ? 'brand' : 'warn'
}
function statusLabel(status) {
  return status === 'done' ? 'Done' : status === 'in-progress' ? 'In Progress' : 'Pending'
}
function actionLabel(status) {
  return status === 'done' ? 'Review' : status === 'in-progress' ? 'Resume' : 'Start'
}
</script>
