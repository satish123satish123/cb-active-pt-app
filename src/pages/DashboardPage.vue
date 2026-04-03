<template>
  <q-page class="dashboard-page q-pb-xl">
    <!-- Toggle Content -->
    <template v-if="hasExercises">
      <DashboardExerciseView />
    </template>
    <template v-else>
      <DashboardPlanView />
    </template>

    <!-- DEV TOGGLE (Moved down for better UX) -->
    <div class="row justify-center q-px-md q-pt-md q-mb-xl q-pb-xl mt-4">
      <q-toggle v-model="hasExercises" label="Toggle Exercise View (Dev)" color="secondary" dense />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import DashboardExerciseView from 'src/components/DashboardExerciseView.vue'
import DashboardPlanView from 'src/components/DashboardPlanView.vue'

// Dev toggle
const hasExercises = ref(false)
</script>

<style scoped>
.dashboard-page {
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
  position: relative;
}
</style>
