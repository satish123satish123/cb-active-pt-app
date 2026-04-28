<template>
  <section class="screen">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-row">
        <div>
          <div class="subtle">Welcome back,</div>
          <h5 class="q-ma-none text-weight-bold">{{ authStore.user.username }}</h5>
        </div>
        <button class="icon-btn" @click="$router.push('/support')">
          🔔<span class="pill-count">3</span>
        </button>
      </div>
    </div>

    <div class="stack">
      <!-- Today's Tasks -->
      <div class="section">
        <div class="card">
          <div class="title-row">
            <div>
              <div class="eyebrow">Today</div>
              <div class="title">Your recovery tasks</div>
              <div class="muted">Keep today simple. Focus on the next right step.</div>
            </div>
            <span class="badge brand">On Track</span>
          </div>
          <div class="today-main">
            <div v-if="exercises_data?.has_exercises" class="todo-item">
              <div class="todo-left">
                <div class="todo-icon">💪</div>
                <div>
                  <div class="todo-label">{{ exercises_data.pending_count || 0 }} exercises pending</div>
                  <div class="todo-sub">
                    Approx. {{ exercises_data.pending_exercises_time || 0 }} minutes left for today
                  </div>
                </div>
              </div>
              <button class="btn primary small" @click="$router.push('/exercises')">View</button>
            </div>
            <div v-else class="todo-item">
              <div class="todo-left">
                <div class="todo-icon">💪</div>
                <div>
                  <div class="todo-label">Get Started with exercises</div>
                  <div class="todo-sub">Connect with your therapist to get started</div>
                </div>
              </div>
              <button class="btn primary small" @click="$router.push('/support')">Connect</button>
            </div>

            <div v-if="session_timeline?.total_sessions > 0" class="todo-item">
              <div class="todo-left">
                <div class="todo-icon">📅</div>
                <div>
                  <div class="todo-label">Session timeline</div>
                  <div class="todo-sub">
                    {{ session_timeline?.treated_sessions || 0 }}/{{
                      session_timeline?.total_sessions || 0
                    }}
                    Sessions Done.
                    <span v-if="session_timeline?.next_appointment">
                      Next Appointment
                      {{ session_timeline?.next_appointment?.date }},
                      {{ session_timeline?.next_appointment?.s_time }}
                    </span>
                  </div>
                </div>
              </div>
              <button class="btn secondary small" @click="$router.push('/session-timeline')">
                View
              </button>
            </div>
            <div v-else class="todo-item">
              <div class="todo-left">
                <div class="todo-icon">📅</div>
                <div>
                  <div class="todo-label">Get Started with sessions</div>
                  <div class="todo-sub">Connect with your therapist to get started</div>
                </div>
              </div>
              <button class="btn primary small" @click="$router.push('/support')">Connect</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Appointment -->
      <div v-if="session_timeline?.next_appointment" class="section">
        <div class="card appointment">
          <div class="title-row">
            <div>
              <div class="eyebrow" style="color: rgba(255, 255, 255, 0.72)">Next Appointment</div>
              <div class="title" style="color: #fff; font-size: 24px">Tomorrow, 10:30 AM</div>
              <div class="muted">April 10, 2026 With Dr. Sharma</div>
            </div>
            <span class="badge" style="background: rgba(255, 255, 255, 0.16); color: #fff"
              >CB Physiotherapy - GK II</span
            >
          </div>
          <div>
            <div class="appt-box">
              <div class="label">Treatment Planned</div>
              <div class="value">
                • TENS • SOFT TISSUE MOBILISATION • JOINT MOBILISATION • MAITLAND
              </div>
            </div>
          </div>
          <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <button
              class="btn"
              style="background: #fff; color: var(--brand)"
              @click="$router.push('/support')"
            >
              Request Reschedule
            </button>
          </div>
        </div>
      </div>

      <!-- Recovery Progress -->
      <div v-if="loadingProgress || recovery_progress_data?.total_sessions > 0" class="section">
        <ProgressCardSkeleton v-if="loadingProgress" cardClass="soft" />
        <div v-else class="card soft">
          <div class="title-row">
            <div>
              <div class="title">Recovery progress</div>
              <div class="muted">
                {{ recovery_progress_data?.treated_sessions || 0 }}/{{
                  recovery_progress_data?.total_sessions || 0
                }}
                Sessions Completed •
                {{ recovery_progress_data?.overall_milestones_progress_percentage || 0 }}% Recovery
              </div>
            </div>
            <span
              class="badge"
              :class="recovery_progress_data?.milestones_status === 'Needs Attention' ? 'upcoming' : 'success'"
            >
              {{ recovery_progress_data?.milestones_status || 'Doing Well' }}
            </span>
          </div>
          <div class="progress-wrap">
            <div class="split">
              <span class="muted">Milestones completed</span>
              <strong
                >{{ recovery_progress_data?.completed_milestones_count || 0 }}/{{
                  recovery_progress_data?.unique_milestones_count || 0
                }}</strong
              >
            </div>
            <div class="progress-rail" style="margin-top: 8px">
              <div
                class="progress-fill"
                :style="`width:${recovery_progress_data?.overall_milestones_progress_percentage || 0}%`"
              ></div>
            </div>
          </div>
          <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <button class="btn secondary" @click="$router.push('/progress')">View Progress</button>
            <button class="btn ghost" @click="$router.push('/treatment-plan')">View Plan</button>
          </div>
        </div>
      </div>

      <!-- Home Exercise Progress -->
      <div class="section" v-if="loadingHomeExerciseCard || home_exercise_card_data">
        <ProgressCardSkeleton v-if="loadingHomeExerciseCard" />
        <div v-else class="card">
          <div class="title-row">
            <div>
              <div class="title">Home exercise progress</div>
              <div class="muted">
                Track previous days, completion history, and overall adherence.
              </div>
            </div>
            <span class="badge brand">{{ home_exercise_card_data?.days_adherence_percentage || 0 }}% Done</span>
          </div>
          <div class="progress-wrap">
            <div class="split">
              <span class="muted">Program adherence</span>
              <strong v-if="home_exercise_card_data?.total_days > 0"
                >{{ home_exercise_card_data?.days_completed || 0 }}/{{ home_exercise_card_data?.total_days }} days
                completed</strong
              >
              <strong v-else>No plan data</strong>
            </div>
            <div class="progress-rail" style="margin-top: 8px">
              <div
                class="progress-fill"
                :style="`width:${home_exercise_card_data?.days_adherence_percentage || 0}%`"
              ></div>
            </div>
          </div>
          <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <button class="btn secondary" @click="$router.push('/exercise-history')">
              View Exercise History
            </button>
            <button class="btn ghost" @click="$router.push('/exercises')">Open Exercises</button>
          </div>
        </div>
      </div>

      <!-- Quick Tiles -->
      <div class="section">
        <div class="grid-2">
          <button class="tile" @click="$router.push('/payments-packages')">
            <div class="tile-icon">📝</div>
            <div class="tile-title">{{ financeText }}</div>
            <div class="tile-sub">Manage your Payments/packages</div>
          </button>
          <button class="tile" @click="$router.push('/education')">
            <div class="tile-icon">📝</div>
            <div class="tile-title">Recovery Guide</div>
            <div class="tile-sub">Condition-based care guidance for each recovery phase</div>
          </button>
        </div>
      </div>

      <div class="foot-gap"></div>
    </div>
  </section>
</template>
<script setup>
import { useAuthStore } from 'src/stores/authStore'
import { useExerciseStore } from 'src/stores/exerciseStore'
import ProgressCardSkeleton from 'src/components/ProgressCardSkeleton.vue'
import { api } from 'src/boot/axios'
import { ref, onMounted, computed } from 'vue'

const authStore = useAuthStore()
const exerciseStore = useExerciseStore()

const exercises_data = ref(null)
const session_timeline = ref(null)
const recovery_progress_data = ref(null)
const loadingProgress = ref(true)

const home_exercise_card_data = ref(null)
const loadingHomeExerciseCard = ref(true)

const fetchHomeExerciseCardData = async () => {
  loadingHomeExerciseCard.value = true
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getHomeExerciseCardData', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (response.data?.status === 'success') {
      home_exercise_card_data.value = response.data.card_data
    } else {
      home_exercise_card_data.value = null
    }
  } catch (e) {
    home_exercise_card_data.value = null
    console.error(e)
  } finally {
    loadingHomeExerciseCard.value = false
  }
}

const financeData = ref(null)

const fetchFinanceData = async () => {
  try {
    const patientId = authStore.user?.patient

    const response = await api.post('getPatientDueAdvance', {
      patient_id: patientId,
    })

    if (response.data?.status === 'success') {
      financeData.value = response.data.due_advance
    }
  } catch (e) {
    console.error(e)
  }
}

const financeText = computed(() => {
  if (financeData.value === null) return 'Loading...'
  const amount = Number(financeData.value)
  const absAmount = Math.round(Math.abs(amount)).toLocaleString('en-IN')
  if (amount > 0) return `Due ₹${absAmount}`
  if (amount < 0) return `Advance ₹${absAmount}`
  return `Due ₹0`
})

const getRecoveryTasks = async () => {
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('get_recovery_tasks', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (response.data?.status === 'success') {
      exercises_data.value = response.data.exercises_data
      session_timeline.value = response.data.session_timeline
    } else {
      exercises_data.value = null
      session_timeline.value = null
    }
  } catch (e) {
    exercises_data.value = null
    session_timeline.value = null
    console.error(e)
  }
}

const getRecoveryProgress = async () => {
  loadingProgress.value = true
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getRecoveryProgressCardData', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (response.data?.status === 'success') {
      recovery_progress_data.value = response.data.card_data
    } else {
      recovery_progress_data.value = null
    }
  } catch (e) {
    recovery_progress_data.value = null
    console.error(e)
  } finally {
    loadingProgress.value = false
  }
}

onMounted(() => {
  getRecoveryTasks()
  getRecoveryProgress()
  fetchHomeExerciseCardData()
  fetchFinanceData()
  const patientId = authStore.user?.patient
  const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''
  exerciseStore.fetchExercises(patientId, hospitalId)
})
</script>
