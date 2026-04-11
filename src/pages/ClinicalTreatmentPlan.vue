<template>
  <section class="screen">
    <ScreenHeader
      title="My Clinical Treatment Plan"
      sub="Understand what your care is focused on"
    />

    <div class="q-px-md q-py-sm">
      <q-card flat bordered class="rounded-16 q-mb-md">
        <q-card-section>
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
              {{ totalSessions }} Total Sessions
            </q-chip>
          </div>

          <q-timeline class="q-pl-sm custom-timeline">
            <q-timeline-entry
              v-for="(phase, index) in treatmentPhases"
              :key="index"
              :color="phase.dotColor"
            >
              <q-card flat bordered class="phase-card q-mb-md" :class="phase.cardClass">
                <q-card-section class="q-pa-md">
                  <div class="row justify-between items-start q-mb-md">
                    <div>
                      <div class="text-subtitle1 text-weight-bold text-grey-10 leading-tight">
                        {{ phase.range }}
                      </div>
                      <div class="text-caption text-grey-7">{{ phase.frequency }}</div>
                    </div>
                    <q-chip
                      size="sm"
                      square
                      class="text-weight-bold q-ma-none"
                      :class="phase.statusClass"
                      style="border-radius: 12px; font-size: 11px"
                    >
                      {{ phase.status }}
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
                        v-for="(m, mIdx) in phase.milestones"
                        :key="'m-' + mIdx"
                        :class="{ 'q-mb-none': mIdx === phase.milestones.length - 1 }"
                      >
                        <q-icon
                          name="circle"
                          :color="phase.dotColor"
                          size="8px"
                          class="q-mr-sm q-mt-xs"
                        />
                        <div>
                          <div class="text-subtitle2 text-weight-bold text-teal-10 leading-tight">
                            {{ m.title }}
                          </div>
                          <div
                            class="text-caption text-grey-7"
                            style="font-size: 12px; margin-top: 2px"
                          >
                            Base: {{ m.base }} · Target: {{ m.target }}
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
                      <div v-for="mod in phase.modalities" :key="mod" class="modality-chip">
                        <span class="text-blue-grey-8">{{ mod }}</span>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="rounded-16 q-mb-xl clinical-summary-card">
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

        <q-card-section class="q-pa-lg q-pt-lg">
          <q-card flat bordered class="rounded-12 q-mb-lg">
            <q-card-section class="q-pa-md">
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
            <div class="col-12 col-sm-6" v-if="primaryDiagnosis">
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
                  <div class="text-caption text-grey-7" style="line-height: 1.4; font-size: 12px">
                    {{ primaryDiagnosis.inference }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-sm-6" v-if="secondaryDiagnosis">
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
                  <div class="text-caption text-grey-7" style="line-height: 1.4; font-size: 12px">
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
import { ref } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const totalSessions = 8

const treatmentPhases = ref([
  {
    range: 'Sessions 1-2',
    frequency: '3 sessions/week',
    status: 'Completed',
    statusClass: 'bg-green-1 text-green-8',
    cardClass: 'bg-white',
    dotColor: 'green-8',
    milestones: [
      { title: 'Pain during daily reaching', base: '6/10', target: '3/10' },
      { title: 'Shoulder flexion', base: '90°', target: '110°' },
      { title: 'Sleep interruption per week', base: '4 times/week', target: '2 times/week' },
    ],
    modalities: ['Manual Therapy', 'TENS', 'Ice Therapy'],
  },
  {
    range: 'Sessions 3-4',
    frequency: '3 sessions/week',
    status: 'Current Phase',
    statusClass: 'bg-teal-1 text-teal-9',
    cardClass: 'bg-teal-1 active-phase-border',
    dotColor: 'teal-8',
    milestones: [
      { title: 'Pain during overhead reach', base: '6/10', target: '2/10' },
      { title: 'Shoulder flexion', base: '110°', target: '140°' },
      { title: 'Overhead reach comfort', base: '40%', target: '75%' },
    ],
    modalities: ['Joint Mobilization', 'Stretching', 'Band Work'],
  },
  {
    range: 'Sessions 5-8',
    frequency: '2-3 sessions/week',
    status: 'Upcoming',
    statusClass: 'bg-orange-1 text-orange-9',
    cardClass: 'bg-white',
    dotColor: 'grey-4',
    milestones: [
      { title: 'Shoulder flexion', base: '140°', target: '160°' },
      { title: 'Shoulder strength', base: '3+/5', target: '5/5' },
      {
        title: 'Return to functional activity',
        base: 'Limited',
        target: 'Independent & pain-controlled',
      },
    ],
    modalities: ['Strength Training', 'Functional Drills', 'Return to Sport'],
  },
])

const assessmentSession = ref({
  chiefComplaint: 'Pain while lifting the right arm and difficulty reaching overhead.',
})

const primaryDiagnosis = ref({
  name: 'Right Rotator Cuff Tendinopathy',
  inference:
    'Findings suggest overload of the rotator cuff with pain during active elevation and resisted testing.',
})

const secondaryDiagnosis = ref({
  name: 'Scapular Dyskinesis',
  inference:
    'Scapular movement pattern showed reduced control, contributing to poor shoulder mechanics during overhead activity.',
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
  background-color: #f8f9fa;
  font-weight: 500;
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
  border: 1px solid #eef0f2;
  border-radius: 12px;
  padding: 12px 16px;
}
.clinical-summary-card {
  border-top: 5px solid #00605a !important;
}
</style>
