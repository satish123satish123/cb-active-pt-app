<template>
  <section class="screen">
    <ScreenHeader title="Profile & Settings" sub="Manage your account, records, and preferences" />

    <ProfileHero />
    <PatientDetails />
    <HealthInformation />
    <SecurityAccount />
    <QuickActions />
    <ReportsDocuments />
    <AppPreferences />
    <HelpSupport />
    <SignOutButton />
  </section>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/authStore'
import ScreenHeader from 'src/components/ScreenHeader.vue'
import ProfileHero from 'src/components/profile/ProfileHero.vue'
import PatientDetails from 'src/components/profile/PatientDetails.vue'
import HealthInformation from 'src/components/profile/HealthInformation.vue'
import SecurityAccount from 'src/components/profile/SecurityAccount.vue'
import QuickActions from 'src/components/profile/QuickActions.vue'
import ReportsDocuments from 'src/components/profile/ReportsDocuments.vue'
import AppPreferences from 'src/components/profile/AppPreferences.vue'
import HelpSupport from 'src/components/profile/HelpSupport.vue'
import SignOutButton from 'src/components/profile/SignOutButton.vue'

const authStore = useAuthStore()
const profileData = ref(null)
provide('profileData', profileData)

const fetchProfileData = async () => {
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getPatientProfileData', {
      patient_id: patientId,
      hospital_id: hospitalId
    })

    if (response.data?.status === 'success') {
      profileData.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch profile data', error)
  }
}

onMounted(() => {
  fetchProfileData()
})
</script>
