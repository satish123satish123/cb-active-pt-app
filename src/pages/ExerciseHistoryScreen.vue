<template>
  <section class="screen">
    <ScreenHeader
      title="Exercise History"
      sub="See previous days, adherence, and home program progress"
    />

    <!-- Stats -->
    <div class="section stats">
      <div class="grid-3">
        <div class="stat">
          <div class="stat-number">{{ h.overallCompletion }}%</div>
          <div class="stat-caption">Overall Done</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ h.completedDays }}/{{ h.totalDaysTracked }}</div>
          <div class="stat-caption">Days Completed</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ h.currentStreak }}</div>
          <div class="stat-caption">Day Streak</div>
        </div>
      </div>
    </div>

    <!-- Weekly chart -->
    <div class="section">
      <div class="card soft">
        <div class="title">This week</div>
        <div class="muted">A quick view of your daily home exercise completion.</div>
        <div class="week-grid">
          <div v-for="item in h.thisWeek" :key="item.day" style="text-align: center">
            <div style="font-size: 11px; color: var(--text-2); margin-bottom: 8px">
              {{ item.day }}
            </div>
            <div
              class="week-bar"
              :style="`background:${barBg(item.status)};color:${item.status === 'missed' ? 'var(--text-3)' : '#fff'};`"
            >
              {{ item.percent }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="section">
      <div class="card">
        <div class="title">Recent activity</div>
        <div class="list" style="margin-top: 12px">
          <div v-for="log in h.recentLogs" :key="log.date" class="list-item">
            <div class="split">
              <strong>{{ log.title }}</strong>
              <span class="badge brand">{{ log.date }}</span>
            </div>
            <div class="muted" style="margin-top: 8px">{{ log.detail }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note -->
    <div class="section">
      <div class="card grad">
        <div class="split">
          <div>
            <div class="title">Where this should live</div>
            <div class="muted">
              Best practice is to show overall recovery in Progress, and home exercise history here
              as a dedicated sub-screen linked from both Dashboard and Exercises.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ScreenHeader from 'src/components/ScreenHeader.vue'

const h = {
  overallCompletion: 68,
  totalDaysTracked: 14,
  completedDays: 9,
  currentStreak: 3,
  thisWeek: [
    {
      day: 'Mon',
      status: 'done',
      percent: 100,
      note: 'All exercises completed',
    },
    {
      day: 'Tue',
      status: 'done',
      percent: 75,
      note: '3 of 4 exercises completed',
    },
    {
      day: 'Wed',
      status: 'partial',
      percent: 50,
      note: '2 of 4 exercises completed',
    },
    {
      day: 'Thu',
      status: 'done',
      percent: 100,
      note: 'All exercises completed',
    },
    { day: 'Fri', status: 'partial', percent: 68, note: 'Today in progress' },
    { day: 'Sat', status: 'missed', percent: 0, note: 'No exercises logged' },
    {
      day: 'Sun',
      status: 'done',
      percent: 100,
      note: 'All exercises completed',
    },
  ],
  recentLogs: [
    {
      date: '05 Apr 2026',
      title: 'Daily Home Session',
      detail: '3 of 4 exercises completed • 24 minutes',
    },
    {
      date: '04 Apr 2026',
      title: 'Daily Home Session',
      detail: 'All 4 exercises completed • 28 minutes',
    },
    {
      date: '03 Apr 2026',
      title: 'Daily Home Session',
      detail: '2 of 4 exercises completed • 14 minutes',
    },
    {
      date: '02 Apr 2026',
      title: 'Daily Home Session',
      detail: 'All 4 exercises completed • 26 minutes',
    },
  ],
}

function barBg(status) {
  if (status === 'done') return 'linear-gradient(180deg,#1aa894 0%,#0a7e6e 100%)'
  if (status === 'partial') return 'linear-gradient(180deg,#f3e3b3 0%,#e0b85d 100%)'
  return '#e9eeee'
}
</script>

<style scoped>
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 14px;
}
.week-bar {
  height: 92px;
  border-radius: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  font-size: 11px;
  font-weight: 800;
}
</style>
