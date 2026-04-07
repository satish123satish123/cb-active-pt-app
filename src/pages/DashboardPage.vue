<template>
  <q-page class="dashboard-page q-pb-xl">
    <div v-if="loading" class="q-pa-lg text-center text-grey-6">Loading dashboard...</div>
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
</style>
