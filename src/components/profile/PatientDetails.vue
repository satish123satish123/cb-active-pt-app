<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="section-icon" style="background:#edf5f3;color:var(--brand);">👤</div>
          <div>
            <div class="title" style="margin:0;">Patient Details</div>
            <div class="muted">Basic information linked to your care profile</div>
          </div>
        </div>
      </div>

      <!-- KV rows -->
      <div class="kv" style="margin-top:4px;">
        <div class="kv-row">
          <div class="kv-key">Phone</div>
          <div class="kv-val">+91 98100 86624</div>
        </div>
        <div class="kv-row">
          <div class="kv-key">Email</div>
          <div class="kv-val">priya@email.com</div>
        </div>
        <div class="kv-row">
          <div class="kv-key">Preferred Clinic</div>
          <div class="kv-val">CB Physiotherapy - GK II</div>
        </div>
        <div class="kv-row">
          <div class="kv-key">Address</div>
          <div class="kv-val">South Delhi, New Delhi</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// no props needed – static data in original
</script>

<style scoped>
.section-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
</style>
