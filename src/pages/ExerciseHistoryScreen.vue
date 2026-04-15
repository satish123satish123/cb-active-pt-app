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
            <div class="muted" style="margin-top: 6px">{{ cp.area }} &bull; {{ cp.dateRange }}</div>
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
                      {{ program.area }} &bull; {{ program.dateRange }}
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
  pastPrograms: [
    {
      name: 'Early Pain Relief Program',
      area: 'Right Shoulder',
      dateRange: '10 Jan 2026 - 09 Mar 2026',
      durationLabel: '2 months',
      completionPercent: 74,
      sessionsLogged: 45,
      monthlyGroups: [
        {
          month: 'February 2026',
          visibleCount: 3,
          logs: [
            {
              title: 'Daily Home Session',
              date: '28 Feb 2026',
              status: 'done',
              completion: '100%',
              detail: 'All 4 exercises completed • 28 minutes',
            },
          ],
        },
      ],
    },
    {
      name: 'Postural Control Program',
      area: 'Neck & Upper Back',
      dateRange: '05 Oct 2025 - 05 Jan 2026',
      durationLabel: '3 months',
      completionPercent: 81,
      sessionsLogged: 70,
      monthlyGroups: [
        {
          month: 'January 2026',
          visibleCount: 3,
          logs: [
            {
              title: 'Daily Home Session',
              date: '05 Jan 2026',
              status: 'done',
              completion: '100%',
              detail: 'All 4 exercises completed • 28 minutes',
            },
          ],
        },
      ],
    },
  ],
}

const cp = {
  name: 'Shoulder Mobility & Strength Program',
  area: 'Right Shoulder',
  dateRange: '10 Mar 2026 - 08 Apr 2026',
  completionPercent: 68,
  totalDays: 30,
  sessionsLogged: 21,
  monthlyGroups: [
    {
      month: 'April 2026',
      visibleCount: 5,
      logs: Array(6)
        .fill(null)
        .map((_, i) => ({
          title: 'Daily Home Session',
          date: `0${6 - i} Apr 2026`,
          status: i % 3 === 0 ? 'partial' : 'done',
          completion: i % 3 === 0 ? '50%' : '100%',
          detail:
            i % 3 === 0
              ? '2 of 4 exercises completed • 14 minutes'
              : 'All 4 exercises completed • 28 minutes',
        })),
    },
    {
      month: 'March 2026',
      visibleCount: 5,
      logs: Array(6)
        .fill(null)
        .map((_, i) => ({
          title: 'Daily Home Session',
          date: `${28 - i} Mar 2026`,
          status: 'done',
          completion: '100%',
          detail: 'All 4 exercises completed • 28 minutes',
        })),
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
