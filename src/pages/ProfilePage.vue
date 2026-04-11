<template>
  <section class="screen">
    <div class="topbar">
      <q-btn class="back-btn" flat round dense icon="arrow_back" @click="$router.back()"></q-btn>
      <div>
        <div class="screen-title">Profile & Settings</div>
        <div class="screen-sub">Manage your account, records, and preferences</div>
      </div>
    </div>

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
