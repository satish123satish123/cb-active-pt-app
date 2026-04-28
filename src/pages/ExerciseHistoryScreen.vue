<template>
  <section class="screen">
    <ScreenHeader
      title="Exercise History"
      sub="See current program progress and previous program logs"
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

    <!-- Current Program -->
    <div class="section">
      <div class="card grad">
        <div class="title-row">
          <div>
            <div class="eyebrow">CURRENT PROGRAM</div>
            <div class="title">{{ cp.name }}</div>
            <div class="muted" style="margin-top: 6px"><span v-if="cp.area">{{ cp.area }} &bull; </span>{{ cp.dateRange }}</div>
          </div>
          <span class="badge brand">{{ cp.completionPercent }}% done</span>
        </div>
        <div class="grid-3" style="margin-top: 12px">
          <div class="stat">
            <div class="stat-number">{{ cp.totalDays }}</div>
            <div class="stat-caption">Program Days</div>
          </div>
          <div class="stat">
            <div class="stat-number">{{ cp.sessionsLogged }}</div>
            <div class="stat-caption">Sessions Logged</div>
          </div>
          <div class="stat">
            <div class="stat-number">{{ cp.completionPercent }}%</div>
            <div class="stat-caption">Adherence</div>
          </div>
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

    <!-- Current Program History -->
    <div class="section">
      <div class="card">
        <div class="title-row">
          <div>
            <div class="title">Current Program History</div>
            <div class="muted">
              Logs are grouped month-wise so longer 30-day programs stay easy to scan.
            </div>
          </div>
          <span class="badge brand">{{ cp.totalDays }} days</span>
        </div>
        <div class="list" style="margin-top: 12px">
          <details
            v-for="group in cp.monthlyGroups"
            :key="group.month"
            style="
              border: 1px solid #e4e7ec;
              border-radius: 12px;
              margin-bottom: 12px;
              overflow: hidden;
            "
          >
            <summary style="padding: 16px; list-style: none; cursor: pointer; background: #fff">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span class="title" style="font-size: 16px; margin: 0">{{ group.month }}</span>
                <span style="font-weight: 700; color: #475467; font-size: 13px"
                  >{{ Math.min(group.visibleCount, group.logs.length) }} shown &bull;
                  {{ group.logs.length }} logs</span
                >
              </div>
            </summary>
            <div class="details-body" style="padding: 0 16px 4px">
              <div>
                <div
                  v-for="(log, i) in group.logs.slice(0, group.visibleCount)"
                  :key="i"
                  style="
                    padding: 16px;
                    margin-bottom: 12px;
                    background: #fff;
                    border: 1px solid #e4e7ec;
                    border-radius: 12px;
                  "
                >
                  <div class="split q-mb-sm" style="align-items: flex-start">
                    <div style="flex: 1">
                      <strong style="font-size: 15px; color: var(--text-1); display: block">{{
                        log.title
                      }}</strong>
                      <div class="muted">{{ log.date }}</div>
                    </div>
                    <span
                      :class="[
                        'badge',
                        log.status === 'done'
                          ? 'success'
                          : log.status === 'partial'
                            ? 'warn'
                            : 'danger',
                      ]"
                      >{{ log.completion }} done</span
                    >
                  </div>
                  <div class="muted">{{ log.detail }}</div>
                </div>
                <div
                  v-if="group.logs.length > group.visibleCount"
                  class="muted sm"
                  style="padding: 4px 2px 12px; text-align: center"
                >
                  + {{ group.logs.length - group.visibleCount }} more entries in {{ group.month }}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- Past Programs -->
    <div class="section">
      <div class="card">
        <div class="title-row">
          <div>
            <div class="title">Past Programs</div>
            <div class="muted">
              Older programs are kept separately so the current recovery plan remains the main
              focus.
            </div>
          </div>
          <span class="badge brand">{{ h.pastPrograms.length }} programs</span>
        </div>
        <div class="list" style="margin-top: 12px">
          <details
            v-for="program in h.pastPrograms"
            :key="program.name"
            style="
              border: 1px solid #e4e7ec;
              border-radius: 12px;
              margin-bottom: 12px;
              overflow: hidden;
            "
          >
            <summary style="padding: 16px; list-style: none; cursor: pointer; background: #fff">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span class="title" style="font-size: 16px; margin: 0">{{ program.name }}</span>
                <span style="font-weight: 700; color: #475467; font-size: 13px"
                  >{{ program.durationLabel }} &bull; {{ program.completionPercent }}% done</span
                >
              </div>
            </summary>
            <div class="details-body" style="padding: 0 16px 16px">
              <div class="card soft" style="padding: 14px; margin-bottom: 12px; margin-top: 4px">
                <div class="split" style="align-items: flex-start; gap: 10px">
                  <div>
                    <div class="title" style="font-size: 16px">{{ program.name }}</div>
                    <div class="muted" style="margin-top: 6px">
                      <span v-if="program.area">{{ program.area }} &bull; </span>{{ program.dateRange || program.durationLabel }}
                    </div>
                  </div>
                  <span class="badge brand">{{ program.sessionsLogged }} logs</span>
                </div>
              </div>
              <div class="list" style="border-top: none; margin-top: 0">
                <details
                  v-for="group in program.monthlyGroups"
                  :key="group.month"
                  style="
                    border: 1px solid #e4e7ec;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    overflow: hidden;
                  "
                >
                  <summary
                    style="padding: 16px; list-style: none; cursor: pointer; background: #fff"
                  >
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                      "
                    >
                      <span class="title" style="font-size: 16px; margin: 0">{{
                        group.month
                      }}</span>
                      <span style="font-weight: 700; color: #475467; font-size: 13px"
                        >{{ Math.min(group.visibleCount, group.logs.length) }} shown &bull;
                        {{ group.logs.length }} logs</span
                      >
                    </div>
                  </summary>
                  <div class="details-body" style="padding: 0 16px 4px">
                    <div>
                      <div
                        v-for="(log, i) in group.logs.slice(0, group.visibleCount)"
                        :key="i"
                        style="
                          padding: 16px;
                          margin-bottom: 12px;
                          background: #fff;
                          border: 1px solid #e4e7ec;
                          border-radius: 12px;
                        "
                      >
                        <div class="split q-mb-sm" style="align-items: flex-start">
                          <div style="flex: 1">
                            <strong style="font-size: 15px; color: var(--text-1); display: block">{{
                              log.title
                            }}</strong>
                            <div class="muted">{{ log.date }}</div>
                          </div>
                          <span
                            :class="[
                              'badge',
                              log.status === 'done'
                                ? 'success'
                                : log.status === 'partial'
                                  ? 'warn'
                                  : 'danger',
                            ]"
                            >{{ log.completion }} done</span
                          >
                        </div>
                        <div class="muted">{{ log.detail }}</div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ScreenHeader from 'src/components/ScreenHeader.vue'

import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()
const loading = ref(true)

const h = ref({
  overallCompletion: 0,
  totalDaysTracked: 0,
  completedDays: 0,
  currentStreak: 0,
  thisWeek: [],
  recentLogs: [],
  pastPrograms: []
})

const cp = ref({
  name: '',
  area: '',
  dateRange: '',
  completionPercent: 0,
  totalDays: 0,
  sessionsLogged: 0,
  monthlyGroups: []
})

const fetchHistory = async () => {
  loading.value = true
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getExercisesHistory', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (response.data?.status === 'success') {
      const data = response.data.exercises_data
      
      h.value = {
        overallCompletion: Math.round(data.overall_completed_percentage || 0),
        totalDaysTracked: data.total_days || 0,
        completedDays: data.days_completed || 0,
        currentStreak: data.streak || 0,
        thisWeek: (data.this_week_adherence || []).map(d => ({
          day: d.day_name,
          percent: Math.round(d.completed_percentage || 0),
          status: (d.completed_percentage || 0) >= 100 ? 'done' : (d.completed_percentage || 0) > 0 ? 'partial' : 'missed'
        })),
        recentLogs: (data.recent_activity || []).map(log => ({
          date: log.date,
          title: log.title,
          detail: `${log.description} • ${Math.ceil((log.time_taken || 0) / 60)} minutes`
        })),
        pastPrograms: (data.past_programs || []).map(p => ({
          name: p.program_name,
          durationLabel: p.duration,
          completionPercent: Math.round(p.adherence || 0),
          sessionsLogged: Object.values(p.history_groups || {}).flat().length,
          monthlyGroups: Object.keys(p.history_groups || {}).map(month => ({
            month,
            visibleCount: 5,
            logs: (p.history_groups[month] || []).map(log => ({
              title: log.title,
              date: log.date,
              status: log.completed_percentage >= 100 ? 'done' : log.completed_percentage > 0 ? 'partial' : 'danger',
              completion: Math.round(log.completed_percentage || 0) + '%',
              detail: `${log.description} • ${Math.ceil((log.time_taken || 0) / 60)} minutes`
            }))
          }))
        }))
      }

      if (data.current_program) {
        cp.value = {
          name: data.current_program.program_name,
          area: '', // Not provided by API
          dateRange: `${data.current_program.start_date} - ${data.current_program.end_date}`,
          completionPercent: Math.round(data.current_program.overall_completed_percentage || 0),
          totalDays: data.current_program.total_days || 0,
          sessionsLogged: data.current_program.days_completed || 0,
          monthlyGroups: Object.keys(data.current_program_history || {}).map(month => ({
            month,
            visibleCount: 5,
            logs: (data.current_program_history[month] || []).map(log => ({
              title: log.title,
              date: log.date,
              status: log.completed_percentage >= 100 ? 'done' : log.completed_percentage > 0 ? 'partial' : 'danger',
              completion: Math.round(log.completed_percentage || 0) + '%',
              detail: `${log.description} • ${Math.ceil((log.time_taken || 0) / 60)} minutes`
            }))
          }))
        }
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHistory()
})

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
