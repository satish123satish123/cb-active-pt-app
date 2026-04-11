<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="section-icon" style="background:#edf5f3;color:var(--brand);">♡</div>
          <div>
            <div class="title" style="margin:0;">Health Information</div>
            <div class="muted">Helpful reference for ongoing treatment and safety</div>
          </div>
        </div>
      </div>

      <!-- 2×2 vitals grid -->
      <div class="vitals-grid">
        <div class="vital-cell" style="border-right:1px solid var(--line);border-bottom:1px solid var(--line);">
          <div class="eyebrow" style="margin-bottom:6px;">Age</div>
          <div class="vital-val">34 years</div>
        </div>
        <div class="vital-cell" style="border-bottom:1px solid var(--line);">
          <div class="eyebrow" style="margin-bottom:6px;">Blood Group</div>
          <div class="vital-val" style="color:var(--brand);">B+</div>
        </div>
        <div class="vital-cell" style="border-right:1px solid var(--line);">
          <div class="eyebrow" style="margin-bottom:6px;">Height</div>
          <div class="vital-val">5'10" (178 cm)</div>
        </div>
        <div class="vital-cell">
          <div class="eyebrow" style="margin-bottom:6px;">Weight</div>
          <div class="vital-val">74 kg</div>
        </div>
      </div>

      <!-- Allergies -->
      <div class="allergy-box">
        <div class="eyebrow" style="margin-bottom:8px;">Allergies / Medications</div>
        <div style="font-size:15px;line-height:1.55;color:var(--text);">
          No known allergies · Ibuprofen (NSAIDs) – avoid
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// static data
</script>

<style scoped>
.section-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}

.vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.vital-cell {
  padding: 14px;
}

.vital-val {
  font-size: 16px;
  font-weight: 800;
}

.allergy-box {
  margin-top: 12px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
}
</style>
