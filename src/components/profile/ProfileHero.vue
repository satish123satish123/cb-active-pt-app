<template>
  <div class="section">
    <div class="card" style="text-align: center; padding: 22px 16px">
      <div class="profile-avatar">
        {{ patient.name.charAt(0) }}
      </div>
      <div class="title">{{ patient.name }}</div>
      <div class="muted">Patient ID: {{ patient.id }}</div>
      <div
        style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 12px"
      >
        <span class="badge brand">Active Patient</span>
        <span class="badge success">Profile Updated</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const patient = {
  name: 'Priya Verma',
  id: 'CB2026-001',
  conditionSimple: 'Shoulder pain while lifting and reaching overhead',
  conditionClinical: 'Right Rotator Cuff Tendinopathy with Scapular Dyskinesis',
  nextAppointment: {
    relative: 'Tomorrow, 10:30 AM',
    date: 'April 10, 2026',
    physio: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    type: 'Mobility & Strength Session',
  },
  plan: {
    sessionsDone: 3,
    sessionsTotal: 8,
    milestonesDone: 5,
    milestonesTotal: 8,
    recoveryPercent: 63,
    exerciseCompliance: 68,
    attendance: '2/2 this week',
    romGain: '+35°',
    painReduction: '63%',
  },
}
</script>

<style scoped>
.profile-avatar {
  width: 86px;
  height: 86px;
  border-radius: 26px;
  background: var(--grad);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 900;
  margin: 0 auto 14px;
  box-shadow: var(--shadow-md);
}
</style>
