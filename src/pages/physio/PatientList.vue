<template>
  <section class="screen">
    <!-- Hero / Header -->
    <div class="hero" style="padding-bottom: 50px;">
      <div class="hero-row">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="icon-btn" @click="$router.push('/physio')">◀</button>
          <div>
            <h5 class="q-ma-none text-weight-bold">My Patients</h5>
            <div class="subtle">Track and monitor recovery</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Stack -->
    <div class="stack" style="margin-top: -30px; padding: 0 16px;">
      <!-- Search Box Card -->
      <div class="card soft" style="margin-bottom: 16px;">
        <div style="position: relative;">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search patients..."
            style="width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius-sm); outline: none; background: #fff; font-size: 14px;"
          />
        </div>
      </div>

      <!-- Patients List -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div
          v-for="patient in filteredPatients"
          :key="patient.id"
          class="card"
          style="padding: 16px; border: 1px solid rgba(220, 231, 234, 0.85);"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-weight: 800; font-size: 16px; color: var(--text);">
                {{ patient.name }}
              </div>
              <div class="muted" style="font-size: 13px; margin-top: 2px;">
                {{ patient.condition }}
              </div>
            </div>
            <span class="badge" :class="patient.status === 'Active' ? 'success' : 'muted-badge'">
              {{ patient.status }}
            </span>
          </div>

          <hr style="border: 0; border-top: 1px solid var(--line); margin: 12px 0;" />

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span class="muted">Recovery Progress</span>
              <span style="font-weight: 700; color: var(--brand);">{{ patient.progress }}%</span>
            </div>
            <div style="width: 100%; height: 6px; background: var(--bg-soft); border-radius: 99px; overflow: hidden;">
              <div
                :style="{ width: patient.progress + '%', background: 'var(--brand)' }"
                style="height: 100%; border-radius: 99px;"
              ></div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 14px; align-items: center;">
            <div class="muted" style="font-size: 12px;">
              Last visit: {{ patient.lastVisit }}
            </div>
            <button class="btn secondary small" style="padding: 6px 12px; font-size: 12px;">
              Open Case
            </button>
          </div>
        </div>

        <div
          v-if="filteredPatients.length === 0"
          style="text-align: center; padding: 40px 20px;"
          class="muted"
        >
          No patients found matching your search.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const patients = ref([
  {
    id: 1,
    name: 'Rohan Malhotra',
    condition: 'Post-Op Knee ACL Reconstruction',
    status: 'Active',
    progress: 65,
    lastVisit: 'Yesterday',
  },
  {
    id: 2,
    name: 'Anjali Sharma',
    condition: 'Cervical Spondylosis',
    status: 'Active',
    progress: 40,
    lastVisit: 'Today',
  },
  {
    id: 3,
    name: 'Kabir Das',
    condition: 'Lumbar Herniated Disc',
    status: 'Active',
    progress: 85,
    lastVisit: '2 days ago',
  },
  {
    id: 4,
    name: 'Preeti Singh',
    condition: 'Adhesive Capsulitis (Frozen Shoulder)',
    status: 'Inactive',
    progress: 95,
    lastVisit: '1 week ago',
  },
])

const filteredPatients = computed(() => {
  if (!searchQuery.value) return patients.value
  return patients.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
.badge.success {
  background: var(--brand-3);
  color: var(--brand);
}
.badge.muted-badge {
  background: #edf1f3;
  color: var(--text-2);
}
</style>
