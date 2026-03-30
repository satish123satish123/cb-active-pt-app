<template>
  <q-page class="q-pa-md q-pb-xl page-wrapper">
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="icon-box q-mr-sm">
        <q-icon name="analytics" color="white" size="24px" />
      </div>
      <div class="text-h6 text-weight-bolder tracking-tight text-dark">Program Report</div>
    </div>

    <!-- Dropdown -->
    <q-select
      v-model="selectedProgram"
      :options="programOptions"
      outlined
      dense
      class="q-mb-md custom-select shadow-1"
      bg-color="white"
    >
      <template v-slot:selected>
        <div class="text-info text-weight-bold text-body2">
          {{ selectedProgram.label }}
        </div>
      </template>
    </q-select>

    <!-- Custom Segmented Tabs -->
    <div class="custom-tabs row q-mb-lg bg-white shadow-2 rounded-borders overflow-hidden">
      <q-btn
        class="col text-weight-bold"
        no-caps
        unelevated
        :color="activeTab === 'graph' ? 'info' : 'transparent'"
        :text-color="activeTab === 'graph' ? 'white' : 'grey-8'"
        label="Graph"
        @click="activeTab = 'graph'"
      />
      <q-btn
        class="col text-weight-bold"
        no-caps
        unelevated
        :color="activeTab === 'full_report' ? 'info' : 'transparent'"
        :text-color="activeTab === 'full_report' ? 'white' : 'grey-8'"
        label="Full Report"
        @click="activeTab = 'full_report'"
      />
      <q-btn
        class="col text-weight-bold"
        no-caps
        unelevated
        :color="activeTab === 'details' ? 'info' : 'transparent'"
        :text-color="activeTab === 'details' ? 'white' : 'grey-8'"
        label="Details"
        @click="activeTab = 'details'"
      />
    </div>

    <!-- Tab Contents -->

    <!-- GRAPH TAB -->
    <div v-show="activeTab === 'graph'" class="tab-section fade-in">
      <q-card class="glass-card shadow-3 q-pa-md q-mb-md">
        <div class="text-subtitle1 text-weight-bolder q-mb-sm text-dark">Completion Progress</div>
        <apexchart
          type="area"
          height="280"
          :options="chartOptions"
          :series="chartSeries"
        />
      </q-card>
      <div class="row justify-between text-caption text-weight-medium text-grey-6 q-px-sm">
        <span>Started: Mar 25</span>
        <span>Est. Completion: Apr 24</span>
      </div>
    </div>

    <!-- FULL REPORT TAB -->
    <div v-show="activeTab === 'full_report'" class="tab-section fade-in">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-weight-bolder text-dark">Daily Breakdown</div>
      </div>

      <!-- Outer day card -->
      <q-card class="glass-card shadow-2 overflow-hidden q-mb-lg" style="border-radius: 20px;">
        <div class="row items-center justify-between q-pa-md bg-white border-bottom-light">
          <div class="text-subtitle2 text-dark text-weight-bolder">Wed, March 25</div>
          <q-chip outline color="negative" size="sm" class="text-weight-bold shadow-1" icon="error_outline">
            0% Completed
          </q-chip>
        </div>

        <q-list separator class="bg-grey-1">
          <q-expansion-item
            group="days"
            default-opened
            header-class="bg-grey-2 text-dark font-weight-bold transition-bg"
            expand-icon-class="text-dark"
          >
            <template v-slot:header>
               <q-item-section avatar>
                 <q-avatar size="36px" font-size="14px" color="blue-1" text-color="primary" class="text-weight-bold">
                   S1
                 </q-avatar>
               </q-item-section>
               <q-item-section>
                 <q-item-label class="text-weight-bold">Set 1</q-item-label>
                 <q-item-label caption class="text-grey-7">8 Exercises</q-item-label>
               </q-item-section>
               <q-item-section side>
                  <div class="text-caption text-weight-bold text-dark q-mb-xs">0%</div>
                  <q-linear-progress :value="0" color="negative" size="6px" class="rounded-borders" style="width: 60px" />
               </q-item-section>
            </template>

            <q-card class="bg-white">
              <q-card-section class="q-pa-none">
                <q-list separator>
                  <q-item v-for="(ex, idx) in exercises" :key="idx" class="q-py-md">
                    <q-item-section avatar top>
                      <q-icon name="radio_button_unchecked" color="grey-4" size="26px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-dark q-mb-xs">{{ ex.name }}</q-item-label>
                      <q-item-label caption class="text-grey-7 text-weight-medium">
                         <span class="q-mr-sm inline-block"><q-icon name="repeat" class="q-mr-xs"/>{{ ex.reps }} Reps</span>
                         <span class="q-mr-sm inline-block"><q-icon name="timer" class="q-mr-xs"/>{{ ex.mins }} min</span>
                         <span class="inline-block"><q-icon name="pan_tool" class="q-mr-xs"/>{{ ex.hold }}s Hold</span>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                       <q-badge color="grey-2" text-color="grey-7" class="text-weight-bold q-pa-xs">Pending</q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </div>

    <!-- DETAILS TAB -->
    <div v-show="activeTab === 'details'" class="tab-section fade-in">
      
      <!-- Premium Summary Card -->
      <q-card class="shadow-4 q-mb-lg" style="border-radius: 20px; background: linear-gradient(135deg, #0f172a 0%, #334155 100%); border:none;">
        <q-card-section class="q-pa-lg text-white">
          <div class="row justify-between items-start">
            <div>
              <div class="text-caption text-blue-2 text-weight-bold text-uppercase tracking-wider q-mb-sm">Program Details</div>
              <div class="text-h5 text-weight-bolder tracking-tight" style="line-height:1.2">31 Days Plan</div>
            </div>
            <q-avatar size="52px" font-size="28px" color="blue-9" text-color="white" icon="fitness_center" class="shadow-2" />
          </div>

          <div class="row q-mt-xl q-col-gutter-sm">
            <div class="col-4">
              <div class="text-h6 text-weight-bold">11m</div>
              <div class="text-caption text-blue-2 text-weight-medium">Per Session</div>
            </div>
            <div class="col-4">
              <div class="text-h6 text-weight-bold">8</div>
              <div class="text-caption text-blue-2 text-weight-medium">Exercises</div>
            </div>
            <div class="col-4">
              <div class="text-h6 text-weight-bold">1</div>
              <div class="text-caption text-blue-2 text-weight-medium">Session/Day</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Up Next / Exercises List Intro -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-weight-bolder text-dark">Included Exercises</div>
        <q-btn flat color="primary" label="View All" no-caps class="text-weight-bold" />
      </div>

      <!-- Horizontal Scrollable Exercises -->
      <q-scroll-area horizontal style="height: 190px;" class="bg-transparent" :thumb-style="{ display: 'none' }">
        <div class="row no-wrap q-gutter-md q-px-xs q-py-xs">
          <q-card v-for="(ex, idx) in exercises" :key="idx" class="shadow-1 exercise-card text-center overflow-hidden" style="min-width: 140px; border-radius: 16px;">
            <div class="bg-grey-2 flex flex-center" style="height: 100px;">
               <q-icon name="accessibility_new" size="48px" color="grey-5" />
            </div>
            <q-card-section class="q-pa-sm bg-white">
              <div class="text-caption text-weight-bold text-dark ellipsis-2-lines" style="line-height:1.2; height: 32px;">{{ ex.name }}</div>
              <div class="text-xs text-grey-6 text-weight-medium q-mt-xs">{{ ex.reps }} Reps</div>
            </q-card-section>
          </q-card>
        </div>
      </q-scroll-area>
    </div>

    <!-- Extra Spacer for footer -->
    <div style="height: 100px;"></div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import apexchart from 'vue3-apexcharts'

const activeTab = ref('graph')

const selectedProgram = ref({
  label: 'shrugs (2026-03-25 - 2026-04-24)',
  value: 'prog1'
})

const programOptions = [
  { label: 'shrugs (2026-03-25 - 2026-04-24)', value: 'prog1' },
  { label: 'neck mobility (2026-05-01 - 2026-06-01)', value: 'prog2' }
]

const exercises = [
  { name: 'Shoulder Shrugs', reps: 10, mins: 1, hold: 6 },
  { name: 'Row Scapular Retraction', reps: 10, mins: 1, hold: 6 },
  { name: 'Facial Platysma', reps: 10, mins: 1, hold: 6 },
  { name: 'Facial Eyebrows Raise', reps: 10, mins: 1, hold: 6 },
  { name: 'Facial Eyes Squeeze', reps: 10, mins: 1, hold: 6 },
  { name: 'Facial Lower Lip', reps: 10, mins: 1, hold: 6 },
  { name: 'Facial Frowning', reps: 10, mins: 1, hold: 6 }
]

// ApexChart Config
const chartSeries = ref([{
  name: 'Completion %',
  data: [0, 5, 12, 22, 18, 40, 60, 55, 75, 80, 85, 90, 95]
}])

const chartOptions = ref({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'inherit',
    background: 'transparent'
  },
  colors: ['#0ea5e9'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.0,
      stops: [0, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 4
  },
  xaxis: {
    categories: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9', 'Day 11', 'Day 13', 'Day 15', 'Day 17', 'Day 19', 'Day 21', 'Day 23', 'Day 25'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#94a3b8',
        fontWeight: 600
      }
    }
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      style: {
        colors: '#94a3b8',
        fontWeight: 600
      },
      formatter: (val) => val + '%'
    }
  },
  grid: {
    borderColor: 'rgba(0,0,0,0.05)',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  }
})
</script>

<style scoped>
.page-wrapper {
  background: transparent;
}

.icon-box {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.text-info {
  color: #0ea5e9 !important;
}
.bg-info {
  background-color: #0ea5e9 !important;
}

.custom-select {
  border-radius: 12px;
}
.custom-select :deep(.q-field__control) {
  border-radius: 12px !important;
  border: none;
}

.custom-tabs {
  border: 1px solid rgba(0,0,0,0.03);
  border-radius: 12px;
}

.tab-section {
  min-height: 400px;
}

.fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
}

.border-bottom-light {
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.exercise-preview-container {
  flex-direction: column;
}

.image-wrapper {
  width: 240px;
  height: 240px;
  background: #f8fafc;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}
.transition-bg {
  transition: background 0.3s ease;
}
.transition-bg:hover {
  background: #f1f5f9;
}

.text-xs {
  font-size: 0.75rem;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.exercise-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.03);
}

.inline-block {
  display: inline-block;
}
</style>
