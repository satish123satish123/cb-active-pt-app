<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom: 14px">
        <div style="display: flex; align-items: center; gap: 12px">
          <div class="section-icon" style="background: #edf5f3; color: #1676a2">📄</div>
          <div>
            <div class="title" style="margin: 0">Reports &amp; Documents</div>
            <div class="muted">Download important care records and reports</div>
          </div>
        </div>
      </div>

      <!-- Documents list -->
      <div class="list" style="gap: 0">
        <div
          v-for="(doc, i) in documents"
          :key="doc.title"
          class="flat-row"
          :style="i < documents.length - 1 ? 'border-bottom:1px solid var(--line);' : ''"
        >
          <div style="display: flex; align-items: center; gap: 14px">
            <div class="doc-icon" :style="`background:${doc.bg};color:${doc.color};`">
              {{ doc.emoji }}
            </div>
            <div>
              <div style="font-size: 15px; font-weight: 800">{{ doc.title }}</div>
              <div class="muted">{{ doc.meta }}</div>
            </div>
          </div>
          <q-btn color="secondary" outline dense icon="download" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const documents = [
  {
    emoji: '📋',
    title: 'Assessment Report – Mar 2026',
    meta: '1.2 MB · 28 Mar 2026',
    bg: '#f8ebea',
    color: '#e4563f',
  },
  {
    emoji: '📘',
    title: 'Treatment Plan – Shoulder Rehab',
    meta: '890 KB · 01 Apr 2026',
    bg: '#eaf2f7',
    color: '#2a7da8',
  },
  {
    emoji: '🩻',
    title: 'X-Ray Reference – Right Shoulder',
    meta: '3.4 MB · 15 Mar 2026',
    bg: '#f0eef9',
    color: '#7a43d1',
  },
  {
    emoji: '🧾',
    title: 'Progress Report – Week 4',
    meta: '640 KB · 05 Apr 2026',
    bg: '#f8ebea',
    color: '#e4563f',
  },
]
</script>

<style scoped>
.section-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.flat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 0;
  background: transparent;
}
.flat-row:last-child {
  padding-bottom: 0;
}
.doc-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
</style>
