import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExerciseStore = defineStore('exercise', () => {
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
      goal: 'Reduce stiffness and pain guarding',
      equipment: 'No Equipment',
      instruction: 'Gentle shoulder unloading',
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
      goal: 'Improve shoulder elevation pattern',
      equipment: 'Wall Support',
      instruction: 'Supported overhead mobility',
      tips: 'Move only within comfortable range and keep the ribs quiet.',
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
      goal: 'Build shoulder stability',
      equipment: 'Resistance Band',
      instruction: 'Rotator cuff control',
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
      goal: 'Improve scapular stability',
      equipment: 'No Equipment',
      instruction: 'Shoulder blade positioning',
      tips: 'Gently squeeze shoulder blades back and down without arching your back.',
      progress: { set: 3, totalSets: 3 },
    },
  ])

  function getExStatus(ex) {
    if (ex.progress.set === ex.progress.totalSets) return 'done'
    return ex.status
  }

  const completedCount = computed(() => exercises.value.filter((ex) => getExStatus(ex) === 'done').length)
  const pendingCount = computed(() => exercises.value.filter((ex) => getExStatus(ex) !== 'done').length)

  function updateProgress(id) {
    const ex = exercises.value.find((x) => x.id === id)
    if (!ex) return
    if (ex.progress.set < ex.progress.totalSets) {
      ex.progress.set += 1
      ex.status = ex.progress.set === ex.progress.totalSets ? 'done' : 'in-progress'
    } else {
      ex.progress.set = 0
      ex.status = 'pending'
    }
  }

  return {
    exercises,
    getExStatus,
    completedCount,
    pendingCount,
    updateProgress,
  }
})
