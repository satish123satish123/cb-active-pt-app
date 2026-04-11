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
        <button class="btn primary contact-btn">💬 WhatsApp Clinic</button>
        <button class="btn secondary contact-btn">📞 Call Clinic</button>
        <button class="btn ghost contact-btn">📍 Get Directions</button>
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
