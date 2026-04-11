<template>
  <section class="screen">
    <ScreenHeader :title="ex.name" sub="Guided exercise mode" />

    <!-- Exercise card -->
    <div class="section">
      <div class="card grad" style="text-align: center">
        <div class="thumb" style="width: 96px; height: 96px; margin: 0 auto 14px; font-size: 38px">
          {{ ex.icon }}
        </div>
        <div class="title">{{ ex.name }}</div>
        <div class="muted" style="margin-top: 8px">{{ ex.instruction }}</div>
        <div class="chips" style="justify-content: center; margin-top: 14px">
          <span class="chip">{{ ex.sets }} sets × {{ ex.reps }} reps</span>
          <span class="chip">{{ ex.frequency }}</span>
          <span class="chip">{{ ex.duration }}</span>
        </div>
      </div>
    </div>

    <!-- Progress -->
    <div class="section">
      <div class="card">
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
        <div class="split" style="margin-top: 12px">
          <div class="muted">
            Set {{ ex.progress.set }} of {{ ex.progress.totalSets }} completed
          </div>
          <strong>{{ ex.progress.totalSets - ex.progress.set }} left</strong>
        </div>
        <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
          <button class="btn primary" @click="cycleExerciseProgress()">
            {{ ex.progress.set === ex.progress.totalSets ? 'Reset Progress' : 'Complete Next Set' }}
          </button>
          <button class="btn ghost" @click="$router.push('/support')">Need Help?</button>
        </div>
      </div>
    </div>

    <!-- Tip -->
    <div class="section">
      <div class="card soft">
        <div class="title">Technique tip</div>
        <div class="muted" style="margin-top: 8px">{{ ex.tips }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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

const ex = computed(() => getSelectedExercise())

function getSelectedExercise() {
  return exercises.value.find((x) => x.id === Number(route.params.exercise_id)) || exercises.value[0]
}

const progressPercent = computed(() => {
  const e = ex.value
  return Math.round((e.progress.set / e.progress.totalSets) * 100)
})

function cycleExerciseProgress() {
  const ex = exercises.value.find((x) => x.id === Number(route.params.exercise_id))
  if (!ex) return
  if (ex.progress.set < ex.progress.totalSets) {
    ex.progress.set += 1
    ex.status = ex.progress.set === ex.progress.totalSets ? 'done' : 'in-progress'
  } else {
    ex.progress.set = 0
    ex.status = 'pending'
  }
}
</script>
