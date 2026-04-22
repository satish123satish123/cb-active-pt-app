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
            <div v-if="exercises_data.total_exercises > 0" class="todo-item">
              <div class="todo-left">
                <div class="todo-icon">💪</div>
                <div>
                  <div class="todo-label">{{ exercises_data.pending_count }} exercises pending</div>
                  <div class="todo-sub">
                    Approx. {{ exercises_data.pending_exercises_time }} minutes left for today
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

            <div v-if="treatment_sessions_data?.total_sessions > 0" class="todo-item">
              <div class="todo-left">
                <div class="todo-icon">📅</div>
                <div>
                  <div class="todo-label">Session timeline</div>
                  <div class="todo-sub">
                    {{ treatment_sessions_data?.treated_sessions }}/{{
                      treatment_sessions_data?.total_sessions
                    }}
                    Sessions Done.
                    <span v-if="treatment_sessions_data?.next_appointment_details">
                      Next Appointment
                      {{ treatment_sessions_data?.next_appointment_details?.date }},
                      {{ treatment_sessions_data?.next_appointment_details?.s_time }}
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
      <div v-if="treatment_sessions_data?.next_appointment_details" class="section">
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
      <div v-if="recovery_progress_data?.total_sessions > 0" class="section">
        <div class="card soft">
          <div class="title-row">
            <div>
              <div class="title">Recovery progress</div>
              <div class="muted">
                {{ recovery_progress_data?.treated_sessions }}/{{
                  recovery_progress_data?.total_sessions
                }}
                Sessions Completed •
                {{ recovery_progress_data?.overall_milestones_progress_percentage }}% Recovery
              </div>
            </div>
            <span class="badge success">Doing Well</span>
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
      <div class="section">
        <div class="card">
          <div class="title-row">
            <div>
              <div class="title">Home exercise progress</div>
              <div class="muted">
                Track previous days, completion history, and overall adherence.
              </div>
            </div>
            <span class="badge brand">{{ exerciseStore.adherencePercentage }}% Done</span>
          </div>
          <div class="progress-wrap">
            <div class="split">
              <span class="muted">Program adherence</span>
              <strong v-if="exerciseStore.totalDays > 0">{{ exerciseStore.daysCompleted }}/{{ exerciseStore.totalDays }} days completed</strong>
              <strong v-else>No plan data</strong>
            </div>
            <div class="progress-rail" style="margin-top: 8px">
              <div class="progress-fill" :style="`width:${exerciseStore.adherencePercentage || 0}%`"></div>
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
            <div class="tile-title">Due || Advance ₹1,000</div>
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
import { api } from 'src/boot/axios'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const exerciseStore = useExerciseStore()

const exercises_data = ref([])
const treatment_sessions_data = ref(null)
const recovery_progress_data = ref(null)

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
      treatment_sessions_data.value = response.data.treatment_sessions_data
    } else {
      exercises_data.value = []
      treatment_sessions_data.value = null
    }
  } catch (e) {
    exercises_data.value = []
    treatment_sessions_data.value = null
    console.error(e)
  }
}

const getRecoveryProgress = async () => {
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getRecoveryProgress', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (response.data?.status === 'success') {
      recovery_progress_data.value = response.data.data
    } else {
      recovery_progress_data.value = null
    }
  } catch (e) {
    recovery_progress_data.value = null
    console.error(e)
  }
}

onMounted(() => {
  getRecoveryTasks()
  getRecoveryProgress()
  const patientId = authStore.user?.patient
  const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''
  exerciseStore.fetchExercises(patientId, hospitalId)
})
</script>
