<template>
  <section class="screen">
    <ScreenHeader title="Support" sub="Quick access to clinic communication" />

    <div class="section">
      <div class="card grad">
        <div class="title">Need help with your recovery?</div>
        <div class="muted" style="margin-top: 8px">
          Use WhatsApp for routine support. Call the clinic directly if you need urgent scheduling
          help.
        </div>
      </div>
    </div>

    <div class="section">
      <div class="card support-box">
        <button class="btn primary contact-btn" @click="openWhatsApp" :disabled="!hospitalInfo?.phone">💬 WhatsApp Clinic</button>
        <button class="btn secondary contact-btn" @click="callClinic" :disabled="!hospitalInfo?.phone">📞 Call Clinic</button>
        <button class="btn ghost contact-btn" @click="getDirections" :disabled="!hospitalInfo?.address">📍 Get Directions</button>
      </div>
    </div>

    <div class="section">
      <div class="card soft">
        <div class="title">Recent alerts</div>
        <div class="list" style="margin-top: 12px">
          <div class="list-item">
            <strong>Exercise reminder</strong>
            <div class="muted" style="margin-top: 6px">
              You still have 3 exercises pending today.
            </div>
          </div>
          <div class="list-item">
            <strong>Appointment reminder</strong>
            <div class="muted" style="margin-top: 6px">
              Your next clinic session is tomorrow at 10:30 AM.
            </div>
          </div>
          <div class="list-item">
            <strong>Progress update</strong>
            <div class="muted" style="margin-top: 6px">
              Your pain has improved over the last four weeks.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ScreenHeader from 'src/components/ScreenHeader.vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const hospitalInfo = ref(null)

const getGuide = async () => {
  try {
    const patientId = authStore.user?.patient
    const response = await api.post('getPatientRecoveryGuide', { patient_id: patientId })
    if (response.data?.status === 'success') {
      hospitalInfo.value = response.data.hospital_info
    }
  } catch (e) {
    console.error(e)
  }
}

const openWhatsApp = () => {
  if (hospitalInfo.value?.phone) {
    window.open(`https://wa.me/91${hospitalInfo.value.phone}`, "_blank")
  }
}

const callClinic = () => {
  if (hospitalInfo.value?.phone) {
    window.location.href = `tel:${hospitalInfo.value.phone}`
  }
}

const getDirections = () => {
  if (hospitalInfo.value?.address) {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(hospitalInfo.value.address)}`, "_blank")
  }
}

onMounted(() => {
  getGuide()
})
</script>

<style scoped>
.support-box {
  display: grid;
  gap: 10px;
}
.contact-btn {
  width: 100%;
  justify-content: center;
}
</style>
