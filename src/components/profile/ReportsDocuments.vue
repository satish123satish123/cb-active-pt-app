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
          <q-btn color="secondary" outline dense icon="download" @click="downloadFile(doc.url)" />
        </div>
      </div>
      
      <div v-if="documents.length === 0" class="q-py-md text-center text-grey-6">
        No documents available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const profileData = inject('profileData')

const documents = computed(() => {
  const docs = []
  
  if (profileData.value?.reports_and_documents) {
    profileData.value.reports_and_documents.forEach(doc => {
      docs.push({
        title: doc.name,
        meta: `${doc.size || 'Unknown size'} · ${doc.date || ''}`,
        url: doc.url,
        emoji: '📋',
        bg: '#eaf2f7',
        color: '#2a7da8'
      })
    })
  }

  if (profileData.value?.investigation_data?.investigation_files) {
    profileData.value.investigation_data.investigation_files.forEach(file => {
      const isImg = ['jpg', 'png', 'jpeg'].includes(file.type?.toLowerCase())
      docs.push({
        title: file.name.split('/').pop() || file.name,
        meta: `${file.type ? file.type.toUpperCase() : 'File'} · ${file.uploaded_at ? file.uploaded_at.split(' ')[0] : ''}`,
        url: file.url,
        emoji: isImg ? '🩻' : '📄',
        bg: isImg ? '#f0eef9' : '#f8ebea',
        color: isImg ? '#7a43d1' : '#e4563f'
      })
    })
  }
  
  return docs
})

const downloadFile = (url) => {
  if (url) window.open(url, '_blank')
}
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
