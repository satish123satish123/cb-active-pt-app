<template>
  <section class="screen">
    <ScreenHeader
      title="Session Timeline"
      sub="A clear record of your assessment, treatment, and progress reviews"
    />

    <!-- Summary block from API -->
    <div class="section q-px-md q-mb-md" v-if="treatment_sessions_data">
      <div class="card soft q-pa-md row items-center justify-between" style="border-radius: 16px;">
        <div>
          <div class="text-weight-bold text-subtitle1">Session Progress</div>
          <div class="text-grey-7 text-caption">
            {{ treatment_sessions_data.treated_sessions || 0 }} / {{ treatment_sessions_data.total_sessions || 0 }} Sessions Completed
          </div>
        </div>
        <q-chip v-if="treatment_sessions_data.next_appointment" class="bg-teal-1 text-teal-9 text-weight-bold" size="sm">
          Next: {{ treatment_sessions_data.next_appointment.date }}
        </q-chip>
      </div>
    </div>

    <q-card class="card soft">
      <q-card-section class="q-pa-none">
        <q-timeline color="teal-8" class="q-pl-sm">
          <q-timeline-entry v-for="(s, index) in sessions" :key="index">
            <q-card flat bordered class="session-card q-mb-md" :class="`border-${s.kind}`">
              <q-card-section>
                <div class="row justify-between items-center q-mb-xs">
                  <div class="text-h6 text-weight-bold">{{ s.number }}</div>

                  <q-chip
                    v-if="s.kind === 'treatment'"
                    class="session-badge q-ma-none text-weight-medium bg-teal-1 text-teal-9"
                    size="sm"
                    square
                  >
                    <div class="row items-center">
                      <span class="q-mr-xs">👐</span> Treatment Session
                    </div>
                  </q-chip>
                  <q-chip
                    v-else-if="s.kind === 'assessment'"
                    class="session-badge q-ma-none text-weight-medium bg-orange-1 text-orange-10"
                    size="sm"
                    square
                  >
                    <div class="row items-center">
                      <span class="q-mr-xs">🧾</span> Assessment Session
                    </div>
                  </q-chip>
                  <q-chip
                    v-else-if="s.kind === 'reassessment'"
                    class="session-badge q-ma-none text-weight-medium bg-teal-1 text-teal-9"
                    size="sm"
                    square
                    style="border-radius: 12px"
                  >
                    <div class="row items-center">
                      <span class="q-mr-xs">🎯</span> Reassessment Session
                    </div>
                  </q-chip>
                </div>

                <div class="text-grey-6 text-subtitle2 q-mb-md">{{ s.date }}</div>

                <div class="meta-line text-grey-8 q-mb-md">
                  <template v-if="s.duration"
                    >⏱ {{ s.duration }} <span class="divider">|</span></template
                  >
                  <template v-if="s.doctor"
                    >👨‍⚕️ {{ s.doctor }} <span class="divider">|</span></template
                  >
                  <template v-if="s.location">📍 {{ s.location }}</template>
                </div>

                <!-- Treatment Session Content -->
                <div v-if="s.kind === 'treatment'" class="content-block">
                  <div class="text-body2 text-grey-9">
                    <span class="text-weight-bold text-blue-grey-8">Modalities Used:</span>
                    <span class="text-weight-medium q-ml-xs">{{ s.modalities?.join(' · ') }}</span>
                  </div>
                </div>

                <!-- Assessment Session Content -->
                <div v-if="s.kind === 'assessment'" class="content-block">
                  <div class="row items-center text-weight-bold text-grey-9 q-mb-md q-pt-sm">
                    <span class="q-mr-sm">📋</span>
                    <span>{{ s.totalSessionsAdvised }} Sessions Advised</span>
                  </div>

                  <div class="q-mb-md">
                    <div
                      class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-xs"
                    >
                      Chief Complaint
                    </div>
                    <div class="text-body2 text-weight-medium text-grey-9">
                      {{ s.chiefComplaint }}
                    </div>
                  </div>

                  <div class="diagnosis-grid q-mt-md" v-if="s.diagnoses && s.diagnoses.length > 0">
                    <div
                      v-for="(d, dIdx) in s.diagnoses"
                      :key="'diag-' + dIdx"
                      class="diagnosis-card"
                    >
                      <div class="text-caption text-weight-bold text-blue-grey-6 text-uppercase">
                        {{ d.label }}
                      </div>
                      <div class="text-subtitle1 text-weight-bold text-grey-10">
                        {{ d.name }}
                      </div>
                      <div class="text-body2 text-grey-7">{{ d.inference }}</div>
                    </div>
                  </div>

                  <div v-if="s.smartGoals && s.smartGoals.length > 0" class="q-mt-md">
                    <div
                      class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-xs"
                    >
                      SMART Goals
                    </div>
                    <div class="goal-list">
                      <div class="goal-item">
                        <div class="goal-mark">✓</div>
                        <div class="goal-text">
                          Reduce pain during daily reaching and dressing activities.
                        </div>
                      </div>

                      <div class="goal-item">
                        <div class="goal-mark">✓</div>
                        <div class="goal-text">
                          Improve shoulder range of motion for overhead function.
                        </div>
                      </div>

                      <div class="goal-item">
                        <div class="goal-mark">✓</div>
                        <div class="goal-text">
                          Restore strength and control for regular work and home tasks.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reassessment Session Content -->
                <div v-if="s.kind === 'reassessment'" class="content-block">
                  <div class="text-body2 text-grey-9 q-mb-md">
                    <span class="text-weight-bold text-blue-grey-8">Modalities Used:</span>
                    <span class="text-weight-medium q-ml-xs">{{
                      s.treatmentGiven?.replace(/,\s*/g, ' · ')
                    }}</span>
                  </div>

                  <q-expansion-item
                    class="milestone-details q-mt-md"
                    header-class="milestone-header text-weight-bold"
                    expand-icon-class="text-black"
                    dense
                  >
                    <template v-slot:header>
                      <div class="row items-center w-100 justify-between full-width">
                        <span class="text-h6 text-weight-bold text-grey-10"
                          >View milestone details</span
                        >
                        <q-chip
                          size="sm"
                          square
                          class="bg-teal-1 text-teal-8 text-weight-bold q-ma-none"
                          style="border-radius: 12px; font-size: 11px"
                        >
                          {{ s.milestoneBadge || '3/5 achieved' }}
                        </q-chip>
                      </div>
                    </template>

                    <div class="q-pa-md bg-white q-mt-none q-pt-none">
                      <div class="column q-gutter-y-md">
                        <div
                          v-for="(item, mIdx) in s.milestoneDetails"
                          :key="'m-' + mIdx"
                          class="metric-card"
                        >
                          <div class="row justify-between items-center q-mb-xs">
                            <div class="text-subtitle2 text-weight-bold text-grey-10">
                              {{ item.title }}
                            </div>
                            <div class="text-caption text-grey-8">
                              {{ calculateGoalProgress(item) }}%
                            </div>
                          </div>
                          <div class="text-caption text-grey-6 q-mb-sm">
                            Baseline {{ formatMetric(item.baseValue, item.unit) }} → Current
                            {{ formatMetric(item.achievedValue, item.unit) }} → Goal
                            {{ formatMetric(item.goalValue, item.unit) }}
                          </div>
                          <q-linear-progress
                            :value="calculateGoalProgress(item) / 100"
                            color="teal-8"
                            track-color="grey-4"
                            class="rounded-borders"
                            size="8px"
                          />
                        </div>
                        <div
                          v-if="!s.milestoneDetails || s.milestoneDetails.length === 0"
                          class="text-grey-6 text-center text-body2 q-py-sm"
                        >
                          No detailed milestone data available.
                        </div>
                      </div>
                    </div>
                  </q-expansion-item>
                </div>
              </q-card-section>
            </q-card>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()
const treatment_sessions_data = ref(null)

const fetchSessionTimelineData = async () => {
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    // First fetch summary and assessment_id
    const taskResponse = await api.post('get_recovery_tasks', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (taskResponse.data?.status === 'success') {
      // Map the summary details for the top card
      treatment_sessions_data.value = taskResponse.data.session_timeline
      
      const assessmentId = taskResponse.data.assessment_id || taskResponse.data.session_timeline?.assessment_id
      if (assessmentId) {
        fetchSessionTimeline(patientId, assessmentId)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const sessions = ref([])

const fetchSessionTimeline = async (patientId, assessmentId) => {
  try {
    const response = await api.post('getSessionTimeline', {
      patient_id: patientId,
      assessment_id: assessmentId
    })

    if (response.data?.status === 'success') {
      const rawSessions = response.data.session_timeline || []
      sessions.value = rawSessions.map(s => {
        let kind = 'treatment'
        if (s.is_consultation === '1') kind = 'assessment'
        else if (s.is_reassessment === '1') kind = 'reassessment'

        let formattedDate = ''
        if (s.date && !isNaN(s.date)) {
          const d = new Date(parseInt(s.date) * 1000)
          formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        } else {
          formattedDate = s.created_at
        }

        let doctor = s.doctor_name || (s.visit ? s.visit.split('-')[0] : '')
        let number = s.session_title
        if (s.session_number) {
          number = `Session ${s.session_number}`
        }

        let totalSessionsAdvised = null
        let chiefComplaint = null
        let smartGoals = []

        if (kind === 'assessment' && s.assessment_details) {
          totalSessionsAdvised = s.assessment_details.treatment_plan_and_smart_goals?.total_sessions
          chiefComplaint = s.assessment_details.chief_complaint === 'n/s' ? 'Not specified' : s.assessment_details.chief_complaint
          
          const goals = s.assessment_details.treatment_plan_and_smart_goals?.functional_performance?.long_term_smart_goals || []
          smartGoals = goals.map(g => g.goal_title)
        }

        return {
          kind,
          number,
          date: formattedDate,
          duration: s.time_slot,
          doctor,
          location: s.hospital_name || 'Clinic',
          modalities: s.used_modalities ? s.used_modalities.split(', ') : [],
          totalSessionsAdvised,
          chiefComplaint,
          diagnoses: [],
          smartGoals,
          treatmentGiven: s.used_modalities,
          milestoneBadge: null,
          milestoneDetails: []
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchSessionTimelineData()
})

const calculateGoalProgress = (item) => {
  if (item.goalValue === item.baseValue) return 100
  const progress = ((item.achievedValue - item.baseValue) / (item.goalValue - item.baseValue)) * 100
  return Math.min(Math.max(Math.round(progress), 0), 100)
}

const formatMetric = (val, unit) => {
  return `${val} ${unit || ''}`.trim()
}

// Removed static mock data
</script>

<style scoped>
.session-timeline-page {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  border: 1px solid #e0e0e0;
}

.sub-heading {
  font-size: 14px;
}

.metric-card {
  border: 1px solid #eef0f2;
  border-radius: 12px;
  padding: 12px 16px;
}

.session-card {
  /* border-radius: 16px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #eef0f2;
}

/* Base style for the thicker left border component using box-shadow inset or border-left */
.session-card.border-treatment {
  border-left: 5px solid #00605a;
}

.session-card.border-assessment {
  border-left: 5px solid #d4a34b;
}

.session-card.border-reassessment {
  border-left: 5px solid #005696;
}

.meta-line {
  font-size: 13px;
}

.divider {
  margin: 0 6px;
  color: #c4c4c4;
}

.session-badge {
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
}

.diagnosis-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  background: #fbfdfd;
}

.w-100 {
  width: 100%;
}

.milestone-details {
  border: 1px solid #eef0f2;
  border-radius: 16px;
  overflow: hidden;
}

.milestone-header {
  padding: 12px 16px;
}

:deep(.q-timeline--dense--right .q-timeline__entry) {
  padding-left: 20px;
}
.card {
  padding: 10px;
  margin: 10px;
}
.goal-list {
  display: grid;
  gap: 8px;
}
.goal-item {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 9px;
  align-items: flex-start;
  padding: 10px 11px;
  border-radius: 12px;
  background: #f8fbfb;
  border: 1px solid #e3ebee;
}

.goal-mark {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: #e9f5f1;
  color: var(--brand);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.goal-text {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text);
  font-weight: 400;
}
</style>
