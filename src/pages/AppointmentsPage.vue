<template>
  <q-page class="q-pa-md q-pb-xl page-wrapper">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <div class="icon-box q-mr-sm">
          <q-icon name="edit_calendar" color="white" size="24px" />
        </div>
        <div class="text-h6 text-weight-bolder tracking-tight text-dark">Appointments</div>
      </div>
    </div>

    <!-- Segmented Tabs for Upcoming vs Past -->
    <div class="custom-tabs row q-mb-lg bg-white shadow-2 rounded-borders overflow-hidden">
      <q-btn
        class="col text-weight-bold"
        no-caps
        unelevated
        :color="activeTab === 'upcoming' ? 'info' : 'transparent'"
        :text-color="activeTab === 'upcoming' ? 'white' : 'grey-8'"
        label="Upcoming"
        @click="activeTab = 'upcoming'"
      />
      <q-btn
        class="col text-weight-bold"
        no-caps
        unelevated
        :color="activeTab === 'past' ? 'info' : 'transparent'"
        :text-color="activeTab === 'past' ? 'white' : 'grey-8'"
        label="Past"
        @click="activeTab = 'past'"
      />
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="activeTab === 'upcoming'" key="upcoming">
        <!-- Next Appointment Highlight Card -->
        <div class="text-subtitle1 text-weight-bolder text-dark q-mb-md">Next Appointment</div>

        <q-card
          class="glass-card shadow-4 q-mb-xl overflow-hidden"
          style="
            border-radius: 20px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border: none;
          "
        >
          <q-card-section class="q-pa-md text-white border-bottom-light-dark">
            <div class="row justify-between items-center">
              <q-chip
                dense
                color="blue-9"
                text-color="blue-2"
                class="text-weight-bold text-uppercase"
                size="sm"
                icon="event"
                >Today</q-chip
              >
              <q-icon name="more_horiz" size="24px" color="blue-2" class="cursor-pointer" />
            </div>
          </q-card-section>

          <q-card-section class="q-px-lg q-pt-md q-pb-lg text-white">
            <div class="row items-center q-mb-lg">
              <q-avatar size="64px" class="shadow-2 q-mr-md">
                <img
                  src="https://ui-avatars.com/api/?name=Dr+Saulihal&background=0ea5e9&color=fff&size=128"
                />
              </q-avatar>
              <div>
                <div class="text-h6 text-weight-bolder tracking-tight" style="line-height: 1.2">
                  Dr. Saulihal
                </div>
                <div class="text-caption text-blue-2 text-weight-medium q-mt-xs">
                  Lead Physiotherapist
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-sm bg-white-10 q-pa-md rounded-borders">
              <div class="col-6 row items-center">
                <q-icon name="schedule" color="blue-2" size="20px" class="q-mr-sm" />
                <div>
                  <div class="text-caption text-blue-2">Time</div>
                  <div class="text-body2 text-weight-bold">03:00 PM</div>
                </div>
              </div>
              <div class="col-6 row items-center">
                <q-icon name="videocam" color="blue-2" size="20px" class="q-mr-sm" />
                <div>
                  <div class="text-caption text-blue-2">Type</div>
                  <div class="text-body2 text-weight-bold">Video Call</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="q-px-lg q-pb-lg q-pt-none">
            <q-btn
              unelevated
              color="info"
              class="full-width text-weight-bold shadow-3"
              rounded
              no-caps
            >
              <q-icon name="videocam" size="20px" class="q-mr-sm" />
              Join Call
            </q-btn>
          </q-card-actions>
        </q-card>

        <!-- Later Appointments Map -->
        <div class="text-subtitle1 text-weight-bolder text-dark q-mb-md">Later Upcoming</div>
        <div class="q-gutter-y-md">
          <q-card
            v-for="(appt, idx) in upcomingAppointments"
            :key="idx"
            class="glass-card shadow-1 q-pa-md list-card transition-hover"
            style="border-radius: 16px"
          >
            <div class="row items-center">
              <div
                class="bg-blue-1 text-info flex flex-center rounded-borders q-mr-md q-pa-sm shadow-1"
                style="min-width: 65px; text-align: center"
              >
                <div>
                  <div
                    class="text-caption text-weight-bolder text-uppercase"
                    style="line-height: 1"
                  >
                    {{ appt.month }}
                  </div>
                  <div class="text-h5 text-weight-bolder" style="line-height: 1.1">
                    {{ appt.day }}
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="text-weight-bold text-dark ellipsis">{{ appt.doctor }}</div>
                <div class="text-caption text-grey-6 text-weight-medium q-mt-xs">
                  {{ appt.type }} • {{ appt.time }}
                </div>
              </div>
              <q-chip
                :color="appt.statusColor"
                :text-color="appt.statusTextColor"
                size="sm"
                class="text-weight-bold"
                >{{ appt.status }}</q-chip
              >
            </div>
          </q-card>
        </div>
      </div>

      <!-- Past Appointments Tab -->
      <div v-else key="past">
        <div class="q-gutter-y-md">
          <q-card
            v-for="(appt, idx) in pastAppointments"
            :key="'past-' + idx"
            class="glass-card shadow-1 q-pa-md list-card opacity-80"
            style="border-radius: 16px"
          >
            <div class="row items-center">
              <div
                class="bg-grey-2 text-grey-7 flex flex-center rounded-borders q-mr-md q-pa-sm"
                style="min-width: 65px; text-align: center"
              >
                <div>
                  <div
                    class="text-caption text-weight-bolder text-uppercase"
                    style="line-height: 1"
                  >
                    {{ appt.month }}
                  </div>
                  <div class="text-h5 text-weight-bolder" style="line-height: 1.1">
                    {{ appt.day }}
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="text-weight-bold text-grey-8 ellipsis">{{ appt.doctor }}</div>
                <div class="text-caption text-grey-5 text-weight-medium q-mt-xs">
                  {{ appt.type }} • {{ appt.time }}
                </div>
              </div>
              <q-btn flat round dense icon="chevron_right" color="grey-5" />
            </div>
          </q-card>
        </div>
      </div>
    </transition>

    <!-- Extra Spacer for footer -->
    <div style="height: 100px"></div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('upcoming')

const upcomingAppointments = ref([
  {
    month: 'Apr',
    day: '02',
    doctor: 'Dr. Jane Smith',
    type: 'In-Person Review',
    time: '11:30 AM',
    status: 'Confirmed',
    statusColor: 'positive',
    statusTextColor: 'white',
  },
  {
    month: 'Apr',
    day: '15',
    doctor: 'Dr. Saulihal',
    type: 'Follow-up Call',
    time: '04:00 PM',
    status: 'Pending',
    statusColor: 'orange-1',
    statusTextColor: 'orange-9',
  },
])

const pastAppointments = ref([
  {
    month: 'Mar',
    day: '18',
    doctor: 'Dr. Saulihal',
    type: 'Initial Assessment',
    time: '10:00 AM',
  },
  {
    month: 'Feb',
    day: '22',
    doctor: 'Dr. Alan Walker',
    type: 'Consultation',
    time: '02:15 PM',
  },
])
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

.custom-tabs {
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.border-bottom-light-dark {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bg-white-10 {
  background: rgba(255, 255, 255, 0.1);
}

.list-card {
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.opacity-80 {
  opacity: 0.8;
}

.transition-hover {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.transition-hover:active {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
