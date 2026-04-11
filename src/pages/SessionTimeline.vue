<template>
  <section class="screen">
    <ScreenHeader
      title="Session Timeline"
      sub="A clear record of your assessment, treatment, and progress reviews"
    />

    <q-card class="bg-grey-2">
      <q-card-section>
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
                      class="diagnosis-card bg-grey-1"
                    >
                      <div
                        class="text-caption text-weight-bold text-blue-grey-6 text-uppercase q-mb-xs"
                      >
                        {{ d.label }}
                      </div>
                      <div class="text-subtitle1 text-weight-bold text-grey-10 q-mb-xs">
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
                      <div
                        v-for="(goal, gIdx) in s.smartGoals"
                        :key="'g-' + gIdx"
                        class="row no-wrap items-start q-mb-xs"
                      >
                        <q-icon name="check" color="green" size="xs" class="q-mr-sm q-mt-xs" />
                        <div class="text-body2">{{ goal }}</div>
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
import { ref } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const calculateGoalProgress = (item) => {
  if (item.goalValue === item.baseValue) return 100
  const progress = ((item.achievedValue - item.baseValue) / (item.goalValue - item.baseValue)) * 100
  return Math.min(Math.max(Math.round(progress), 0), 100)
}

const formatMetric = (val, unit) => {
  return `${val} ${unit || ''}`.trim()
}

// Mock Data based on the image
const sessions = ref([
  {
    kind: 'treatment',
    number: 'Session 3',
    date: 'April 5, 2026',
    duration: '45 min',
    doctor: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    modalities: ['Manual Therapy', 'Joint Mobilisation', 'ROM Exercises', 'Soft Tissue Release'],
  },
  {
    kind: 'reassessment',
    number: 'Session 2',
    date: 'April 2, 2026',
    duration: '60 min',
    doctor: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    treatmentGiven: 'Manual Therapy, TENS, Ice Therapy',
    milestoneBadge: '3/5 achieved',
    milestoneDetails: [
      {
        title: 'Pain During Daily Reaching',
        baseValue: 8,
        achievedValue: 5,
        goalValue: 2,
        unit: '/10',
      },
      {
        title: 'Shoulder Flexion',
        baseValue: 90,
        achievedValue: 120,
        goalValue: 160,
        unit: '°',
      },
      {
        title: 'Sleep Interruption Per Week',
        baseValue: 6,
        achievedValue: 3,
        goalValue: 0,
        unit: ' nights',
      },
      {
        title: 'Overhead Reach Comfort',
        baseValue: 20,
        achievedValue: 45,
        goalValue: 90,
        unit: '%',
      },
    ],
  },
  {
    kind: 'assessment',
    number: 'Session 1',
    date: 'March 28, 2026',
    duration: '60 min',
    doctor: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    totalSessionsAdvised: 8,
    chiefComplaint: 'Pain while lifting the right arm and difficulty reaching overhead.',
    diagnoses: [
      {
        label: 'PRIMARY DIAGNOSIS',
        name: 'Right Rotator Cuff Tendinopathy',
        inference:
          'Findings suggest overload of the rotator cuff with pain during active elevation and resisted testing.',
      },
    ],
    smartGoals: [],
  },
])
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
  border-radius: 16px;
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
</style>
