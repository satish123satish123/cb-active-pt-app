<template>
  <section class="screen">
    <ScreenHeader title="Progress Tracking" sub="See how your recovery is moving forward" />

    <div class="section">
      <div class="progress-overview-card">
        <div class="title-row" style="margin-bottom: 0">
          <div>
            <div class="eyebrow">Recovery Overview</div>
            <div class="title">Milestones and reassessment trend</div>
            <div class="muted" style="margin-top: 4px">
              Your recovery is reviewed at reassessment points so you can see exactly how pain,
              range, and function are progressing across session ranges.
            </div>
          </div>
          <span class="progress-chart-badge">On Track</span>
        </div>
        <div class="progress-overview-grid">
          <div class="progress-overview-item">
            <div class="progress-overview-label">Overall Progress</div>
            <div class="progress-overview-value">{{ overview.overallPercent }}%</div>
            <div class="progress-overview-note">Across tracked clinical milestones</div>
          </div>
          <div class="progress-overview-item">
            <div class="progress-overview-label">Reassessments</div>
            <div class="progress-overview-value">{{ overview.reassessments }}</div>
            <div class="progress-overview-note">Completed so far in this plan</div>
          </div>
          <div class="progress-overview-item">
            <div class="progress-overview-label">Milestones Completed</div>
            <div class="progress-overview-value">
              {{ overview.completedMilestones }}/{{ overview.totalMilestones }}
            </div>
            <div class="progress-overview-note">
              Measured and functional milestones achieved till now
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section" v-if="overview.numericMetrics && overview.numericMetrics.length > 0">
      <div class="progress-section-label">Measured Progress</div>
      <div class="progress-stack">
        <div
          v-for="(metric, index) in overview.numericMetrics"
          :key="index"
          class="progress-chart-card"
        >
          <div class="progress-chart-head">
            <div>
              <div class="title">{{ metric.title }}</div>
              <div class="muted" style="margin-top: 4px">{{ metric.subtitle }}</div>
            </div>
            <span :class="['badge', metric.statusTone]">{{ metric.statusLabel }}</span>
          </div>
          <div class="progress-chart-shell">
            <svg class="progress-chart-svg" viewBox="0 0 320 220" preserveAspectRatio="none">
              <defs>
                <linearGradient :id="'progressArea' + index" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#0a7e6e" stop-opacity="0.18"></stop>
                  <stop offset="100%" stop-color="#0a7e6e" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              <g v-for="(val, vIdx) in getGridValues(metric)" :key="vIdx">
                <line
                  :x1="CHART_CONFIG.left"
                  :y1="getYFor(val, metric)"
                  :x2="CHART_CONFIG.width - CHART_CONFIG.right"
                  :y2="getYFor(val, metric)"
                  stroke="#dbe6e9"
                  stroke-width="1"
                ></line>
                <text
                  :x="CHART_CONFIG.left - 8"
                  :y="getYFor(val, metric) + 4"
                  text-anchor="end"
                  font-size="10"
                  fill="#7f94a0"
                  font-weight="700"
                >
                  {{ val }}{{ metric.unit }}
                </text>
              </g>
              <line
                :x1="CHART_CONFIG.left"
                :y1="getYFor(metric.target, metric)"
                :x2="CHART_CONFIG.width - CHART_CONFIG.right"
                :y2="getYFor(metric.target, metric)"
                stroke="#c78810"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              ></line>
              <text
                :x="CHART_CONFIG.width - CHART_CONFIG.right"
                :y="getYFor(metric.target, metric) - 6"
                text-anchor="end"
                font-size="10"
                fill="#a77411"
                font-weight="800"
              >
                Target {{ metric.target }}{{ metric.unit }}
              </text>

              <polygon
                :points="getAreaPoints(metric)"
                :fill="'url(#progressArea' + index + ')'"
              ></polygon>
              <polyline
                :points="getLinePoints(metric)"
                fill="none"
                stroke="#0a7e6e"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></polyline>

              <g v-for="(value, idx) in metric.values" :key="idx">
                <circle
                  v-if="value !== null"
                  :cx="getXPosition(idx, metric.xLabels.length)"
                  :cy="getYFor(value, metric)"
                  r="5.5"
                  fill="#ffffff"
                  stroke="#0a7e6e"
                  stroke-width="3"
                ></circle>
                <text
                  :x="getXPosition(idx, metric.xLabels.length)"
                  :y="
                    CHART_CONFIG.top +
                    (CHART_CONFIG.height - CHART_CONFIG.top - CHART_CONFIG.bottom) +
                    18
                  "
                  text-anchor="middle"
                  font-size="10"
                  fill="#7f94a0"
                  font-weight="800"
                >
                  {{ metric.xLabels[idx] }}
                </text>
                <text
                  :x="getXPosition(idx, metric.xLabels.length)"
                  :y="
                    CHART_CONFIG.top +
                    (CHART_CONFIG.height - CHART_CONFIG.top - CHART_CONFIG.bottom) +
                    32
                  "
                  text-anchor="middle"
                  font-size="9"
                  fill="#96a7b0"
                >
                  {{ metric.sessionRanges[idx] }}
                </text>
              </g>
            </svg>
          </div>
          <div class="progress-chart-legend">
            <span class="chip">{{ getTrendText(metric) }}</span>
            <span v-for="(range, rIdx) in metric.sessionRanges.slice(1)" :key="rIdx" class="chip">{{ range }}</span>
          </div>
          <div class="progress-direction-note">{{ metric.summary }}</div>
        </div>
      </div>
    </div>

    <div class="section" v-if="overview.statusMetrics && overview.statusMetrics.length > 0">
      <div class="progress-section-label">Functional Milestones</div>
      <div class="progress-stack">
        <div
          v-for="(metric, mIdx) in overview.statusMetrics"
          :key="mIdx"
          class="progress-status-card"
        >
          <div class="progress-status-head">
            <div>
              <div class="title">{{ metric.title }}</div>
              <div class="muted" style="margin-top: 4px">{{ metric.subtitle }}</div>
            </div>
            <span :class="['badge', metric.statusTone]">{{ metric.statusLabel }}</span>
          </div>
          <div class="progress-status-timeline">
            <div v-for="(status, sIdx) in metric.statuses" :key="sIdx" class="progress-status-step">
              <span :class="['progress-status-dot', getStatusToneClass(status, metric)]"></span>
              <div class="progress-status-step-label">{{ metric.xLabels[sIdx] }}</div>
              <div class="progress-status-step-range">{{ metric.sessionRanges[sIdx] }}</div>
              <span :class="['progress-status-chip', getStatusToneClass(status, metric)]">{{
                status
              }}</span>
            </div>
          </div>
          <div class="progress-status-summary">{{ metric.summary }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="card grad">
        <div class="split">
          <div>
            <div class="title">How to read this</div>
            <div class="muted">
              Goals with numbers are shown as graphs across reassessments. Goals without numeric
              values are shown as milestone timelines, so you can still see clear progress without
              forcing a false graph.
            </div>
          </div>
          <button class="btn ghost small" @click="$router.push('/session-timeline')">
            Session Notes
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()

const CHART_CONFIG = {
  width: 320,
  height: 220,
  left: 52,
  right: 14,
  top: 18,
  bottom: 54,
}

const metricsState = ref({
  numericMetrics: [],
  statusMetrics: [],
})

const overview = computed(() => {
  const numMetrics = metricsState.value.numericMetrics
  const statMetrics = metricsState.value.statusMetrics
  
  const totalMilestones = numMetrics.length + statMetrics.length
  
  const achievedNumeric = numMetrics.filter(m => m.isAchieved).length
  const achievedStatus = statMetrics.filter(m => m.isAchieved).length
  const completedMilestones = achievedNumeric + achievedStatus
  
  const overallPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  
  let maxReassessments = 0
  numMetrics.forEach(m => {
    const achievedCount = m.values.slice(1).filter(v => v !== null).length
    if (achievedCount > maxReassessments) maxReassessments = achievedCount
  })
  statMetrics.forEach(m => {
    const achievedCount = m.statuses.slice(1).filter(v => v !== 'Pending').length
    if (achievedCount > maxReassessments) maxReassessments = achievedCount
  })
  
  return {
    overallPercent,
    reassessments: maxReassessments,
    completedMilestones,
    totalMilestones,
    numericMetrics: numMetrics,
    statusMetrics: statMetrics
  }
})

const fetchProgressData = async () => {
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const taskResponse = await api.post('get_recovery_tasks', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (taskResponse.data?.status === 'success') {
      const assessmentId = taskResponse.data.assessment_id || taskResponse.data.session_timeline?.assessment_id
      if (assessmentId) {
        const progressResponse = await api.post('getPatientProgressTrackingData', {
          patient_id: patientId,
          hospital_id: hospitalId,
          assessment_id: assessmentId
        })
        
        if (progressResponse.data?.status === 'success') {
          const data = progressResponse.data.data
          
          let numericMetrics = []
          if (data.measured_progress && data.measured_progress.length > 0) {
            numericMetrics = data.measured_progress.map((item) => {
              const sessions = item.sessions || []
              const baseValues = item.base_values || []
              const targetValues = item.target_values || []
              const achievedValues = item.achieved_values || []
              
              const title = item.written_goal || 'Goal'
              let unit = ''
              if (title.toLowerCase().includes('(degrees)')) unit = '°'
              else if (title.toLowerCase().includes('(nprs)')) unit = '/10'
              else if (title.toLowerCase().includes('%')) unit = '%'
              
              const baseNum = parseFloat(baseValues[0]) || 0
              const targetNumStr = targetValues.slice().reverse().find(v => v !== null) || targetValues[0]
              const targetNum = parseFloat(targetNumStr) || 0
              
              const betterDirection = targetNum >= baseNum ? 'up' : 'down'
              
              const sessionRanges = ['Baseline', ...sessions.map(s => `Sessions ${s}`)]
              const xLabels = ['Initial', ...sessions.map((_, i) => `Review ${i + 1}`)]
              
              const values = [baseNum, ...achievedValues.map(v => v !== null ? parseFloat(v) : null)]
              
              const currentVal = values.slice().reverse().find(v => v !== null)
              const validCurrentVal = currentVal !== undefined ? currentVal : baseNum
              
              let isAchieved = false
              if (betterDirection === 'up' && validCurrentVal >= targetNum) isAchieved = true
              else if (betterDirection === 'down' && validCurrentVal <= targetNum) isAchieved = true
              
              let statusTone = 'brand'
              let statusLabel = 'In progress'
              
              if (isAchieved) {
                statusTone = 'success'
                statusLabel = 'Target reached'
              }
              
              return {
                type: 'numeric',
                title,
                subtitle: '',
                unit,
                betterDirection,
                sessionRanges,
                xLabels,
                values,
                target: targetNum,
                isAchieved,
                statusLabel,
                statusTone,
                summary: `Target is ${targetNum}${unit}. Currently at ${validCurrentVal}${unit}.`
              }
            })
          }
          
          let statusMetrics = []
          if (data.functional_milestones && data.functional_milestones.length > 0) {
            statusMetrics = data.functional_milestones.map((item) => {
              const sessions = item.sessions || []
              const baseValues = item.base_values || []
              const targetValues = item.target_values || []
              const achievedValues = item.achieved_values || []
              
              const sessionRanges = ['Baseline', ...sessions.map(s => `Sessions ${s}`)]
              const xLabels = ['Initial', ...sessions.map((_, i) => `Review ${i + 1}`)]
              
              const statuses = [baseValues[0] || 'Initial', ...achievedValues.map(v => v !== null ? v : 'Pending')]
              
              const currentStatus = statuses.slice().reverse().find(v => v !== 'Pending') || statuses[0]
              const targetStatus = targetValues.slice().reverse().find(v => v !== null) || targetValues[0]
              
              const isAchieved = currentStatus === targetStatus
              
              return {
                type: 'status',
                title: item.written_goal || 'Functional Goal',
                subtitle: `Target: ${targetStatus}`,
                statusLabel: isAchieved ? 'Achieved' : 'In progress',
                statusTone: isAchieved ? 'success' : 'brand',
                xLabels,
                sessionRanges,
                statuses,
                targetStatus,
                isAchieved,
                summary: isAchieved ? `Target '${targetStatus}' achieved.` : `Working towards '${targetStatus}'.`
              }
            })
          }
          
          metricsState.value = {
            numericMetrics,
            statusMetrics
          }
        }
      }
    }
  } catch (e) {
    console.error('Error fetching progress data:', e)
  }
}

onMounted(() => {
  fetchProgressData()
})

function getGridValues(metric) {
  const validValues = metric.values.filter(v => v !== null)
  const allValues = validValues.concat([metric.target])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = Math.max(
    (maxValue - minValue) * 0.18,
    metric.unit === '°' ? 10 : metric.unit === '/10' ? 1 : 8,
  )
  const domainMin = Math.max(0, Math.floor(minValue - padding))
  const domainMax = Math.ceil(maxValue + padding)
  const range = Math.max(1, domainMax - domainMin)
  const steps = 4
  return Array.from(
    { length: steps + 1 },
    (_, idx) => Math.round((domainMin + ((steps - idx) / steps) * range) * 10) / 10,
  )
}

function getYFor(value, metric) {
  if (value === null) return 0
  const chartHeight = CHART_CONFIG.height - CHART_CONFIG.top - CHART_CONFIG.bottom
  const validValues = metric.values.filter(v => v !== null)
  const allValues = validValues.concat([metric.target])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = Math.max(
    (maxValue - minValue) * 0.18,
    metric.unit === '°' ? 10 : metric.unit === '/10' ? 1 : 8,
  )
  const domainMin = Math.max(0, Math.floor(minValue - padding))
  const domainMax = Math.ceil(maxValue + padding)
  const range = Math.max(1, domainMax - domainMin)
  return CHART_CONFIG.top + ((domainMax - value) / range) * chartHeight
}

function getXPosition(idx, total) {
  const chartWidth = CHART_CONFIG.width - CHART_CONFIG.left - CHART_CONFIG.right
  return CHART_CONFIG.left + (total === 1 ? chartWidth / 2 : (idx * chartWidth) / (total - 1))
}

function getLinePoints(metric) {
  const validPoints = []
  metric.values.forEach((value, idx) => {
    if (value !== null) {
      validPoints.push(`${getXPosition(idx, metric.xLabels.length)},${getYFor(value, metric)}`)
    }
  })
  return validPoints.join(' ')
}

function getAreaPoints(metric) {
  const chartHeight = CHART_CONFIG.height - CHART_CONFIG.top - CHART_CONFIG.bottom
  const points = getLinePoints(metric)
  if (!points) return ''
  
  const validIndices = metric.values.map((v, i) => v !== null ? i : -1).filter(i => i !== -1)
  if (validIndices.length === 0) return ''
  
  const firstIdx = validIndices[0]
  const lastIdx = validIndices[validIndices.length - 1]
  const startX = getXPosition(firstIdx, metric.xLabels.length)
  const endX = getXPosition(lastIdx, metric.xLabels.length)
  
  return `${startX},${CHART_CONFIG.top + chartHeight} ${points} ${endX},${CHART_CONFIG.top + chartHeight}`
}

function getTrendText(metric) {
  const validValues = metric.values.filter(v => v !== null)
  if (validValues.length === 0) return ''
  const nowValue = validValues[validValues.length - 1]
  return metric.betterDirection === 'down'
    ? `${validValues[0]}${metric.unit} to ${nowValue}${metric.unit}`
    : `${nowValue}${metric.unit} current`
}

function getStatusToneClass(status, metric) {
  if (!status || status === 'Pending') return ''
  if (status === metric.targetStatus) return 'done'
  if (status !== metric.statuses[0]) return 'active'
  return ''
}
</script>

<style scoped>
.progress-overview-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbfb 100%);
  border: 1px solid #dbe7ea;
  box-shadow: 0 12px 28px rgba(16, 33, 42, 0.06);
  padding: 18px;
}
.progress-overview-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(10, 126, 110, 0.08), transparent 26%);
  pointer-events: none;
}
.progress-overview-card > * {
  position: relative;
  z-index: 1;
}
.progress-overview-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.progress-overview-item {
  padding: 13px 14px;
  border-radius: 18px;
  border: 1px solid #e1eaed;
  background: #fff;
  box-shadow: 0 4px 14px rgba(16, 33, 42, 0.04);
}
.progress-overview-label {
  color: var(--text-2);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 7px;
}
.progress-overview-value {
  font-size: 22px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--text);
}
.progress-overview-note {
  margin-top: 6px;
  color: var(--text-2);
  font-size: 12px;
  line-height: 1.45;
  font-weight: 600;
}
.progress-chart-card {
  border-radius: 24px;
  border: 1px solid #dce7ea;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfb 100%);
  box-shadow: 0 12px 28px rgba(16, 33, 42, 0.05);
  padding: 18px;
}
.progress-chart-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.progress-chart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  background: var(--brand-3);
  color: var(--brand);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}
.progress-chart-shell {
  position: relative;
  border-radius: 20px;
  border: 1px solid #e1eaed;
  background: linear-gradient(180deg, #fcfefe 0%, #f3f8f8 100%);
  padding: 12px 12px 10px;
}
.progress-chart-svg {
  width: 100%;
  height: 220px;
  display: block;
}
.progress-chart-legend {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.progress-chart-legend .chip {
  background: #fff;
}
.progress-direction-note {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-2);
  font-weight: 600;
}
.progress-section-label {
  margin-bottom: 10px;
  color: var(--text-3);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 2px;
}
.progress-stack {
  display: grid;
  gap: 12px;
}
.progress-status-card {
  border-radius: 24px;
  border: 1px solid #dce7ea;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfb 100%);
  box-shadow: 0 12px 28px rgba(16, 33, 42, 0.05);
  padding: 18px;
}
.progress-status-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.progress-status-timeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  position: relative;
}
.progress-status-step {
  position: relative;
  padding-top: 24px;
}
.progress-status-step::before {
  content: '';
  position: absolute;
  left: 18px;
  right: -18px;
  top: 10px;
  height: 2px;
  background: #d9e5e8;
  z-index: 0;
}
.progress-status-step:last-child::before {
  display: none;
}
.progress-status-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #cfdde1;
  z-index: 1;
  box-shadow: 0 0 0 4px #f8fbfb;
}
.progress-status-dot.done {
  background: #e7f5ef;
  border-color: var(--success);
}
.progress-status-dot.active {
  background: #eaf7f3;
  border-color: var(--brand);
}
.progress-status-step-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text);
  line-height: 1.35;
}
.progress-status-step-range {
  margin-top: 4px;
  font-size: 10px;
  color: var(--text-3);
  line-height: 1.4;
  font-weight: 700;
}
.progress-status-chip {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 9px;
  border-radius: 999px;
  border: 1px solid #e1eaed;
  background: #fff;
  color: var(--text-2);
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}
.progress-status-chip.done {
  background: #edf7f0;
  border-color: #d7eadc;
  color: var(--success);
}
.progress-status-chip.active {
  background: var(--brand-3);
  border-color: #d5ece6;
  color: var(--brand);
}
.progress-status-summary {
  margin-top: 12px;
  padding: 12px 13px;
  border-radius: 16px;
  border: 1px solid #e1eaed;
  background: #fff;
  color: var(--text-2);
  font-size: 12px;
  line-height: 1.55;
  font-weight: 600;
}

@media (max-width: 380px) {
  .progress-overview-grid {
    grid-template-columns: 1fr;
  }
  .progress-status-timeline {
    grid-template-columns: 1fr;
  }
  .progress-status-step {
    padding-top: 0;
    padding-left: 30px;
  }
  .progress-status-step::before {
    left: 10px;
    right: auto;
    top: 22px;
    bottom: -18px;
    width: 2px;
    height: auto;
  }
  .progress-status-step:last-child::before {
    display: none;
  }
  .progress-status-dot {
    top: 2px;
    left: 0;
  }
}
</style>
