<template>
  <div class="stepper-wrap">
    <div class="stepper-row">
      <div v-for="(l, i) in labels" :key="l" class="step-item">
        <span
          class="step-circle"
          :class="{ on: i + 1 <= step }"
        >{{ i + 1 < step ? '✓' : i + 1 }}</span>
        <span class="step-label" :class="{ now: i + 1 === step }">{{ l }}</span>
        <span v-if="i < labels.length - 1" class="step-sep">›</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ step: { type: Number, required: true } })
const labels = ['Treatment', 'Invoice', 'Follow-up']
</script>

<style scoped>
.stepper-wrap {
  padding: 0 16px;
  margin-top: 4px;
}
.stepper-row {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  flex-wrap: nowrap;
}
.step-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.step-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  background: #eef4f4;
  color: #8da0aa;
}
.step-circle.on {
  background: #0a7e6e;
  color: #fff;
}
.step-label {
  font-size: 12px;
  font-weight: 700;
  color: #8da0aa;
}
.step-label.now {
  font-weight: 800;
  color: #0a7e6e;
}
.step-sep {
  color: #8da0aa;
  margin: 0 2px;
}
</style>