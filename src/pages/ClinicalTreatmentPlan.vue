<template>
  <section class="screen">
    <ScreenHeader
      title="My Clinical Treatment Plan"
      sub="Understand what your care is focused on"
    />

    <div class="q-px-md q-py-sm">
      <div flat bordered class="card soft q-mb-md">
        <div class="row justify-between items-start q-mb-lg">
          <div class="col">
            <div class="text-h6 text-weight-bold text-grey-10">Treatment phases</div>
            <div class="text-caption text-grey-7 q-mt-xs" style="line-height: 1.3">
              Your care progresses step by step, with the current phase highlighted.
            </div>
          </div>
          <q-chip
            size="sm"
            class="bg-teal-1 text-teal-8 text-weight-bold q-ma-none q-mt-xs q-px-sm"
            square
            style="border-radius: 12px"
          >
            {{ milestones_data?.total_sessions }} Total Sessions
          </q-chip>
        </div>

        <q-timeline class="q-pl-sm custom-timeline">
          <q-timeline-entry
            v-for="(phase, index) in treatmentPhases"
            :key="index"
            :color="phase.dotColor"
          >
            <q-card bordered class="phase-card q-mb-md" :class="phase.cardClass">
              <q-card-section class="q-pa-md">
                <div class="row justify-between items-start q-mb-md">
                  <div>
                    <div class="text-subtitle1 text-weight-bold text-grey-10 leading-tight">
                      Sessions {{ phase.session }}
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ formattedFrequency(phase.session_frequency) }}
                    </div>
                  </div>
                  <q-chip
                    size="sm"
                    square
                    class="text-weight-bold q-ma-none"
                    :class="phase.statusClass || 'bg-teal-1 text-teal-8'"
                    style="border-radius: 12px; font-size: 11px"
                  >
                    {{ phase.status || 'Completed' }}
                  </q-chip>
                </div>

                <!-- Milestones -->
                <div class="metric-box q-mb-sm">
                  <div
                    class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-sm letter-spacing-1"
                    style="font-size: 10px"
                  >
                    Milestones
                  </div>
                  <div class="milestones-list">
                    <div
                      class="row no-wrap items-start q-mb-sm"
                      v-for="(m, mIdx) in phase.goal_progress"
                      :key="'m-' + mIdx"
                      :class="{ 'q-mb-none': mIdx === phase.goal_progress.length - 1 }"
                    >
                      <q-icon
                        name="circle"
                        :color="phase.dotColor"
                        size="8px"
                        class="q-mr-sm q-mt-xs"
                      />
                      <div>
                        <div class="text-subtitle2 text-weight-bold text-teal-10 leading-tight">
                          {{ m.written_goal }}
                        </div>
                        <div
                          class="text-caption text-grey-7"
                          style="font-size: 12px; margin-top: 2px"
                        >
                          Base: {{ m.base_value }} · Target: {{ m.target_value }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Modalities -->
                <div class="metric-box">
                  <div
                    class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-sm letter-spacing-1"
                    style="font-size: 10px"
                  >
                    Modalities
                  </div>
                  <div class="modalities-container">
                    <div
                      v-for="mod in (phase.modalities ? phase.modalities.split(',').map((item) => item.trim()) : [])"
                      :key="mod"
                      class="modality-chip"
                    >
                      <span class="text-blue-grey-8">{{ mod }}</span>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-timeline-entry>
        </q-timeline>
      </div>

      <q-card bordered class="rounded-16 q-mb-xl clinical-summary-card">
        <q-card-section class="q-pa-lg">
          <div class="row justify-between items-start q-mb-xs">
            <div
              class="text-caption text-weight-bold text-blue-grey-6 text-uppercase letter-spacing-1"
              style="font-size: 10px"
            >
              Clinical Summary
            </div>
            <q-chip
              size="sm"
              square
              class="bg-teal-1 text-teal-9 text-weight-bold q-ma-none"
              style="border-radius: 12px; font-size: 11px"
            >
              Active Plan
            </q-chip>
          </div>
          <div class="text-h5 text-weight-bold text-grey-10 leading-tight q-mb-xs">
            Your condition
          </div>
          <div class="text-body2 text-grey-7" style="line-height: 1.4; max-width: 90%">
            A clear view of your main complaint and diagnosis, presented in a more clinical format.
          </div>
        </q-card-section>

        <q-separator color="grey-3" />

        <q-card-section class="q-pa-md q-pt-lg">
          <q-card flat bordered class="rounded-12 q-mb-lg condition-panel">
            <q-card-section class="q-pa-none">
              <div
                class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-sm letter-spacing-1"
                style="font-size: 10px"
              >
                Chief Complaint
              </div>
              <div class="text-subtitle2 text-weight-bold text-grey-10 leading-tight">
                {{ assessmentSession.chiefComplaint }}
              </div>
            </q-card-section>
          </q-card>

          <div class="row q-col-gutter-sm">
            <div class="col-6 col-sm-6" v-if="primaryDiagnosis">
              <q-card flat bordered class="rounded-12 h-100">
                <q-card-section class="q-pa-md">
                  <div
                    class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-sm letter-spacing-1"
                    style="font-size: 10px"
                  >
                    Primary Diagnosis
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-grey-10 q-mb-sm leading-tight">
                    {{ primaryDiagnosis.name }}
                  </div>
                  <div v-if="primaryDiagnosis.inference" class="text-caption text-grey-7" style="line-height: 1.4; font-size: 12px">
                    {{ primaryDiagnosis.inference }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 col-sm-6" v-if="secondaryDiagnosis">
              <q-card flat bordered class="rounded-12 h-100">
                <q-card-section class="q-pa-md">
                  <div
                    class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-sm letter-spacing-1"
                    style="font-size: 10px"
                  >
                    Secondary Diagnosis
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-grey-10 q-mb-sm leading-tight">
                    {{ secondaryDiagnosis.name }}
                  </div>
                  <div v-if="secondaryDiagnosis.inference" class="text-caption text-grey-7" style="line-height: 1.4; font-size: 12px">
                    {{ secondaryDiagnosis.inference }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()

const milestones_data = ref(null)
const treatmentPhases = ref([])

const assessmentSession = ref({
  chiefComplaint: '',
})

const primaryDiagnosis = ref(null)
const secondaryDiagnosis = ref(null)

const getClinicalTreatmentPlanData = async () => {
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    // First, fetch assessment_id from recovery progress or tasks
    const recResponse = await api.post('getRecoveryProgressCardData', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    const assessmentId = recResponse.data?.card_data?.assessment_id

    if (!assessmentId) return

    const response = await api.post('getClinicalTreatmentPlanData', {
      assessment_id: assessmentId
    })

    if (response.data?.status === 'success') {
      const data = response.data
      const planData = data.treatment_plan_data || {}
      const summary = data.clinical_summary || {}

      milestones_data.value = { total_sessions: planData.total_sessions || 0 }

      const phases = []
      Object.keys(planData).forEach(key => {
        if (key.startsWith('Session')) {
          const phase = planData[key]
          const goal_progress = []
          
          if (phase.milestones && Array.isArray(phase.milestones)) {
            for (let i = 0; i < phase.milestones.length; i += 2) {
              const title = phase.milestones[i]
              const baseTarget = phase.milestones[i+1] || ''
              const match = baseTarget.match(/Base:\s*(.*?)\s*·\s*Target:\s*(.*)/)
              goal_progress.push({
                written_goal: title,
                base_value: match ? match[1] : 'N/A',
                target_value: match ? match[2] : 'N/A'
              })
            }
          }

          const isCurrent = phase.status === 'Current Phase'
          const isUpcoming = phase.status === 'Upcoming'

          phases.push({
            session: key.replace('Session ', ''),
            session_frequency: phase.frequency || '',
            status: phase.status,
            statusClass: isCurrent ? 'bg-teal-1 text-teal-8' : (isUpcoming ? 'bg-grey-2 text-grey-7' : 'bg-green-1 text-green-8'),
            dotColor: isCurrent ? 'teal-8' : (isUpcoming ? 'grey-4' : 'green-6'),
            cardClass: isCurrent ? 'active-phase-border bg-teal-1' : '',
            goal_progress,
            modalities: phase.modalities || ''
          })
        }
      })
      treatmentPhases.value = phases

      assessmentSession.value.chiefComplaint = summary.chief_complaint || 'No chief complaint recorded.'
      primaryDiagnosis.value = summary.primary_diagnosis ? { name: summary.primary_diagnosis, inference: '' } : null
      secondaryDiagnosis.value = summary.secondary_diagnosis ? { name: summary.secondary_diagnosis, inference: '' } : null
    }
  } catch (e) {
    console.error(e)
  }
}

function formattedFrequency(frequency) {
  if (!frequency) return ''

  const [number, period] = frequency.split('/').map((s) => s.trim())

  if (!number || !period) return frequency

  return `${number} session${number === '1' ? '' : 's'}/${period}`
}

onMounted(() => {
  getClinicalTreatmentPlanData()
})
</script>

<style scoped>
.rounded-16 {
  border-radius: 16px;
  border-color: #f1f3f5;
}
.rounded-12 {
  border-radius: 12px;
  border-color: #eef0f2;
}
.active-phase-border {
  border: 1px solid #c0e0dc !important;
}
.leading-tight {
  line-height: 1.2;
}
.letter-spacing-1 {
  letter-spacing: 0.5px;
}
.border-top {
  border-top: 1px solid #f1f3f5;
}
.h-100 {
  height: 100%;
}
.phase-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  border-color: #eef0f2;
}
.modality-chip {
  border: 1px solid #eef0f2;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 11px;
  color: #555;
  background-color: #f0f6f6;
  font-weight: 700;
  display: inline-block;
}
.modalities-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.custom-timeline :deep(.q-timeline__dot) {
  /* Ensure timeline dots have solid backgrounds */
  background-color: white !important;
}
.custom-timeline :deep(.q-timeline__dot .q-icon) {
  /* Remove quasar's default circle icon inner color and adjust size to look like the image */
  font-size: 16px;
}
.metric-box {
  background: #f8fbfb;
  border: 1px solid #eef0f2;
  border-radius: 12px;
  padding: 12px 16px;
}
.clinical-summary-card {
  border: 1px solid #dbe7ea;
  border-top: 5px solid #00605a !important;
  background: linear-gradient(180deg, #fcfefe 0%, #f3f8f8 100%);
  box-shadow: 0 12px 28px rgba(16, 33, 42, 0.06);
}
:deep(.custom-timeline .q-timeline__dot) {
  background-color: #f8fbfb !important;
}
:deep(.q-timeline--dense--right .q-timeline__entry) {
  padding-left: 20px;
}
:deep(.q-timeline__content) {
  padding-bottom: 0px !important;
}
:deep(.bg-teal-1) {
  background: linear-gradient(180deg, #f6fcfa 0%, #eef8f5 100%) !important;
}
.condition-panel {
  padding: 15px 16px;
  border-radius: 18px;
  border: 1px solid #dfe9ec;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfb 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
</style>
