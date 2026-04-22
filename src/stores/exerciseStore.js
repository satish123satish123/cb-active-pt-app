import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'

export const useExerciseStore = defineStore('exercise', () => {
  const exercises = ref([])
  const daysCompleted = ref(0)
  const totalDays = ref(0)
  const adherencePercentage = ref(0)
  const currentDayLabel = ref('')

  async function fetchExercises(patientId, hospitalId) {
    try {
      const response = await api.post('getHomeExercisesProgressData', {
        patient_id: patientId,
        hospital_id: hospitalId
      })
      if (response.data?.status === 'success') {
        const data = response.data.exercises_data
        daysCompleted.value = data.days_completed || 0
        totalDays.value = data.total_days || 0
        adherencePercentage.value = data.days_adherence_percentage || 0
        
        let todayExercises = []
        if (data.performance_tracking) {
           const keys = Object.keys(data.performance_tracking)
           if (keys.length > 0) {
             const expectedDay = `Day ${data.days_completed},`
             // Try to find current day by days_completed, or fallback to current date, or fallback to first key
             let latestKey = keys.find(k => k.startsWith(expectedDay))
             if (!latestKey) {
               const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '/')
               latestKey = keys.find(k => k.includes(`Date: ${todayStr}`))
             }
             if (!latestKey) latestKey = keys[0]
             
             currentDayLabel.value = latestKey.split(',')[0]
             const rawExercises = data.performance_tracking[latestKey] || []
             todayExercises = rawExercises.map(ex => {
                const totalSets = parseInt(ex.sets) || 0
                const isDone = ex.status === 'Treated' || ex.status === 'done'
                const isInProgress = ex.status === 'Confirmed' && ex.start_time !== null && ex.end_time === null && ex.is_active === '1'
                
                let localStatus = 'pending'
                if (isDone) localStatus = 'done'
                else if (isInProgress) localStatus = 'in-progress'

                return {
                  id: ex.id,
                  name: ex.selected_exercises,
                  sets: totalSets,
                  reps: parseInt(ex.reps) || 0,
                  duration: ex.hold_time ? ex.hold_time.replace('_', ' ') : '',
                  status: localStatus,
                  goal: 'Follow your recovery plan',
                  equipment: ex.equipment || 'No Equipment',
                  instruction: 'Perform as guided',
                  tips: ex.remarks || '',
                  progress: { set: isDone ? totalSets : 0, totalSets: totalSets }
                }
             })
             // Optionally filter out placeholders like REASSESSMENT
             todayExercises = todayExercises.filter(ex => ex.name !== 'REASSESSMENT' && ex.sets > 0)
           }
        }
        exercises.value = todayExercises
      }
    } catch(err) {
      console.error(err)
    }
  }

  function getExStatus(ex) {
    if (ex.progress.totalSets > 0 && ex.progress.set === ex.progress.totalSets) return 'done'
    if (ex.progress.set > 0) return 'in-progress'
    return ex.status || 'pending'
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
    daysCompleted,
    totalDays,
    adherencePercentage,
    currentDayLabel,
    getExStatus,
    completedCount,
    pendingCount,
    updateProgress,
    fetchExercises
  }
})
