<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="section-icon" style="background:#fff5df;color:#d68b00;">❔</div>
          <div>
            <div class="title" style="margin:0;">Help &amp; Support</div>
            <div class="muted">Get assistance and app information</div>
          </div>
        </div>
      </div>

      <div class="list" style="gap:0;">

        <!-- Chat with Support -->
        <div class="flat-row" style="border-bottom:1px solid var(--line);">
          <div class="row-left">
            <div class="row-icon" style="background:#fff3de;color:#cf8b1b;">💬</div>
            <div>
              <div class="row-label">Chat with Support</div>
              <div class="muted">Typically replies in minutes</div>
            </div>
          </div>
          <span class="chevron">›</span>
        </div>

        <!-- Terms & Privacy -->
        <div class="flat-row" style="border-bottom:1px solid var(--line);">
          <div class="row-left">
            <div class="row-icon" style="background:#f3f3f3;color:#444;">📄</div>
            <div>
              <div class="row-label">Terms &amp; Privacy Policy</div>
              <div class="muted">Read our data usage policy</div>
            </div>
          </div>
          <span class="chevron">›</span>
        </div>

        <!-- App Version -->
        <div class="flat-row">
          <div class="row-left">
            <div class="row-icon" style="background:#edf5f3;color:var(--brand);">〰️</div>
            <div>
              <div class="row-label">App Version</div>
              <div class="muted">Active PT v2.1.0</div>
            </div>
          </div>
          <span class="badge success">Latest</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// static
</script>

<style scoped>
.section-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.flat-row {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 14px 0; background: transparent;
}
.flat-row:last-child { padding-bottom: 0; }
.row-left { display: flex; align-items: center; gap: 14px; }
.row-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.row-label { font-size: 15px; font-weight: 800; }
.chevron { font-size: 22px; color: var(--text-3); }
</style>
