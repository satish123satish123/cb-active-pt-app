<template>
  <q-page class="dashboard-page q-pb-xl">
    <div v-if="loading" class="q-px-md" style="padding-top: 14px">
      <div v-for="n in 3" :key="n" class="dashboard-skeleton q-mb-md">
        <div class="dashboard-skeleton-bar"></div>
        <div class="dashboard-skeleton-body">
          <div class="skeleton-line" style="width: 56%; height: 14px; margin-bottom: 8px"></div>
          <div class="skeleton-line" style="width: 38%; height: 10px; margin-bottom: 16px"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <div class="skeleton-line" style="height: 48px; border-radius: 12px"></div>
            <div class="skeleton-line" style="height: 48px; border-radius: 12px"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="q-pa-lg text-center text-negative">{{ error }}</div>

    <!-- Toggle Content -->
    <template v-else-if="hasExercises">
      <DashboardExerciseView :dashboard-data="dashboardData" />
    </template>
    <template v-else>
      <DashboardPlanView />
    </template>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import DashboardExerciseView from 'src/components/DashboardExerciseView.vue'
import DashboardPlanView from 'src/components/DashboardPlanView.vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const dashboardData = ref(null)

const hasExercises = computed(() => {
  const details = dashboardData.value?.performance_tracking_details
  return Array.isArray(details) && details.length > 0
})

const fetchDashboardData = async () => {
  loading.value = true
  error.value = ''
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getPatientPhysioGymSubscriptionDetails', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    if (response.data?.status === 'success') {
      dashboardData.value = response.data
    } else {
      dashboardData.value = null
      error.value = response.data?.message || 'Failed to load dashboard data.'
    }
  } catch (e) {
    dashboardData.value = null
    error.value = e.response?.data?.message || 'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-page {
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
  position: relative;
}

@keyframes skeletonShimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.dashboard-skeleton {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(0, 0, 0, 0.055);
  box-shadow: 0 3px 14px rgba(10, 126, 110, 0.07);
}

.dashboard-skeleton-bar {
  height: 3.5px;
  background: linear-gradient(90deg, #0c9b80, #3dba8a, #0c9b80);
  background-size: 200% auto;
  animation: skeletonShimmer 1.4s ease infinite;
}

.dashboard-skeleton-body {
  padding: 16px;
}

.skeleton-line {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: skeletonShimmer 1.4s ease infinite;
}
</style>
