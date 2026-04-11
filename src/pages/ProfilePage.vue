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
</script>
