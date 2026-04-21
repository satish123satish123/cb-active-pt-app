<template>
  <section class="screen">
    <ScreenHeader title="Recovery Guide" sub="Condition-based care guidance for each recovery phase" />

    <!-- Care Guidance -->
    <div class="section" v-if="educationList.length">
      <div class="card">
        <div class="title-row">
          <div>
            <div class="title">Care guidance</div>
            <div class="muted">
              These recommendations help you recover better between clinic visits. Keep them simple
              and consistent
            </div>
          </div>
        </div>
        <div class="list">
          <div
            v-for="(item, index) in educationList"
            :key="'edu-' + index"
            class="todo-item"
            style="padding: 12px"
          >
            <div class="todo-left">
              <div class="todo-icon" style="background: #e6f7ed; color: var(--success)">✓</div>
              <div>
                <div class="todo-label">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Do's & Don'ts -->
    <div class="section" v-if="dosAndDontsList.length">
      <div class="card soft">
        <div class="title-row">
          <div>
            <div class="title">Do's & Don'ts</div>
             <div class="muted">Important actions to follow and avoid for your recovery</div>
          </div>
        </div>
        <div class="list">
          <div
            v-for="(item, index) in dosAndDontsList"
            :key="'dodont-' + index"
            class="todo-item"
            style="padding: 12px"
          >
            <div class="todo-left">
              <div class="todo-icon" style="background: #e6f7ed; color: var(--success)">✓</div>
              <div>
                <div class="todo-label">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- When to contact -->
    <div class="section">
      <div class="card">
        <div class="title">When to contact the clinic</div>
        <div class="list" style="margin-top: 12px">
          <div class="list-item">
            <strong>Pain becomes sharply worse</strong>
            <div class="muted" style="margin-top: 6px">
              If discomfort changes suddenly or spreads significantly.
            </div>
          </div>
          <div class="list-item">
            <strong>You cannot perform assigned movements</strong>
            <div class="muted" style="margin-top: 6px">
              If usual exercises feel much harder than before.
            </div>
          </div>
          <div class="list-item">
            <strong>You miss more than 2 days of exercises</strong>
            <div class="muted" style="margin-top: 6px">
              Your therapist may need to adjust the plan.
            </div>
          </div>
        </div>
        <div style="margin-top: 14px">
          <button class="btn primary full" @click="$router.push('/support')">Contact Clinic</button>
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

const educationList = ref([])
const dosAndDontsList = ref([])

const getGuide = async () => {
  try {
    const patientId = authStore.user?.patient
    const response = await api.post('getPatientRecoveryGuide', { patient_id: patientId })
    if (response.data?.status === 'success') {
      educationList.value = response.data.education || []
      dosAndDontsList.value = response.data.dos_and_donts || []
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  getGuide()
})
</script>
