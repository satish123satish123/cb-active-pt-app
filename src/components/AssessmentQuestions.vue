<template>
  <div class="assessment-flow">
    <!-- Header -->
    <!-- <div class="flow-header">
      <div class="brand-info">
        <div class="physio-icon">
          <q-icon name="medical_services" color="white" size="20px" />
        </div>
        <div class="brand-meta">
          <strong>PhysioCheck</strong>
          <span>Symptom assessment</span>
        </div>
      </div>
      <div class="progress-indicator">
        <div
          v-for="n in totalQuestions"
          :key="n"
          class="progress-segment"
          :class="{ active: n <= currentIdx + 1, completed: n < currentIdx + 1 }"
        ></div>
      </div>
    </div> -->

    <!-- Chat Area -->
    <div class="chat-container" ref="chatScroll">
      <div
        v-for="(item, idx) in history"
        :key="idx"
        class="chat-row"
        :class="[item.type, { 'section-header': item.isSection }]"
      >
        <q-btn
          v-if="item.type === 'user'"
          icon="edit"
          flat
          round
          size="sm"
          class="edit-btn q-mr-sm self-center"
          color="grey-5"
          @click="handleEdit(item)"
        >
          <q-tooltip>Edit answer</q-tooltip>
        </q-btn>
        <div class="bubble" :class="{ 'section-divider': item.isSection }" v-html="item.text"></div>
      </div>

      <!-- Current Question Thinking -->
      <div v-if="isThinking" class="chat-row assistant">
        <div class="bubble thinking">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>

      <!-- Section Header -->
      <div
        v-if="!isThinking && sectionHeader && !isComplete"
        class="chat-row assistant section-header"
      >
        <div class="bubble section-divider animate-in">
          {{ sectionHeader }}
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="!isThinking && currentQuestion && !isComplete" class="chat-row assistant">
        <div class="bubble animate-in" v-html="displayText"></div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area" v-if="!isThinking && currentQuestion && !isComplete">
      <!-- Radio / Choice (single select) -->
      <div
        v-if="currentQuestion.type === 'radio' || currentQuestion.type === 'choice'"
        class="options-grid"
        :class="{ 'vertical-grid': isVertical }"
      >
        <button
          type="button"
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: selectedRadio === option }"
          @click="handleRadioClick(option)"
        >
          {{ option }}
        </button>

        <div v-if="selectedRadio" class="other-text-wrap">
          <input
            v-model="otherText"
            placeholder="Please specify..."
            class="other-text-input"
            @keyup.enter="handleRadioOtherSubmit"
          />
        </div>

        <button
          v-if="selectedRadio"
          type="button"
          class="option-btn submit-multi"
          :disabled="!otherText.trim()"
          @click="handleRadioOtherSubmit"
        >
          Confirm Selection
        </button>
      </div>

      <!-- Multi-select (checkboxes) -->
      <div
        v-else-if="currentQuestion.type === 'multi'"
        class="options-grid"
        :class="{ 'vertical-grid': isVertical }"
      >
        <button
          type="button"
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: multiSelected.includes(option) }"
          @click="toggleMulti(option)"
        >
          <span class="check-indicator">{{ multiSelected.includes(option) ? '✓' : '' }}</span>
          {{ option }}
        </button>
        <button
          type="button"
          class="option-btn submit-multi"
          :disabled="multiSelected.length === 0"
          @click="handleMultiSubmit"
        >
          Confirm Selection
        </button>
      </div>

      <!-- Multi-select with Other text box -->
      <div
        v-else-if="currentQuestion.type === 'multi_with_other'"
        class="options-grid"
        :class="{ 'vertical-grid': isVertical }"
      >
        <button
          type="button"
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          :class="{ selected: multiSelected.includes(option) }"
          @click="toggleMulti(option)"
        >
          <span class="check-indicator">{{ multiSelected.includes(option) ? '✓' : '' }}</span>
          {{ option }}
        </button>
        <div v-if="multiSelected.includes(currentQuestion.otherOption)" class="other-text-wrap">
          <input v-model="otherText" placeholder="Please specify..." class="other-text-input" />
        </div>
        <button
          type="button"
          class="option-btn submit-multi"
          :disabled="
            multiSelected.length === 0 ||
            (multiSelected.includes(currentQuestion.otherOption) && !otherText.trim())
          "
          @click="handleMultiWithOtherSubmit"
        >
          Confirm Selection
        </button>
      </div>

      <!-- Slider (pain scale) -->
      <div v-else-if="currentQuestion.type === 'slider'" class="slider-wrap">
        <div class="slider-labels">
          <span>0 — No pain</span>
          <span>10 — Severe pain</span>
        </div>
        <input type="range" min="0" max="10" v-model.number="sliderValue" class="pain-slider" />
        <div class="slider-value">{{ sliderValue }}</div>
        <button
          type="button"
          class="option-btn submit-slider"
          @click="handleAnswer(String(sliderValue))"
        >
          Confirm
        </button>
      </div>

      <!-- Text input -->
      <div v-else-if="currentQuestion.type === 'text'" class="text-input-wrap">
        <input
          v-model="textAnswer"
          placeholder="Type your answer here..."
          @keyup.enter="handleTextSubmit"
        />
        <button
          type="button"
          class="send-btn"
          @click="handleTextSubmit"
          :disabled="!textAnswer.trim()"
        >
          <q-icon name="send" />
        </button>
      </div>
    </div>

    <!-- Complete State -->
    <div v-if="isComplete" class="complete-state minimal animate-in">
      <div class="minimal-content">
        <q-icon name="check_circle" size="28px" color="primary" />
        <div class="minimal-text">
          <strong>All set!</strong>
          <span>Review your answers.</span>
        </div>
      </div>
      <q-btn
        label="Submit"
        color="primary"
        unelevated
        rounded
        padding="8px 24px"
        @click="showConfirmDialog = true"
      />
    </div>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 300px; border-radius: 16px">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold">Ready to submit?</div>
        </q-card-section>

        <q-card-section>
          <p class="text-body2 text-grey-8">
            You have answered all questions. Are you sure you want to submit your assessment?
          </p>
        </q-card-section>

        <q-card-actions align="right" class="q-pt-none">
          <q-btn flat label="Review Answers" color="primary" v-close-popup />
          <q-btn
            unelevated
            rounded
            label="Submit Assessment"
            color="primary"
            @click="confirmSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'

const props = defineProps({
  gender: {
    type: String,
    default: '',
  },
  companyId: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['complete', 'progress'])

import {
  workingConditions,
  painDiscomfort,
  lifestyleFactors,
  healthSafety,
  goalsInfo,
  company2Questions,
} from 'src/data/assessmentQuestions'

// ─── Build question list (filter femaleOnly questions for non-female) ───
const allQuestions = computed(() => {
  const filterByGender = (questions) => {
    return questions.filter((q) => {
      if (q.femaleOnly && props.gender !== 'female') return false
      return true
    })
  }

  if (String(props.companyId) === '2') {
    return [
      ...workingConditions,
      ...painDiscomfort,
      company2Questions.pd_trigger,
      company2Questions.pd_functional_impact,
      company2Questions.pd_water_intake,
      ...filterByGender(lifestyleFactors.filter((q) => q.id !== 'lf_5')),
      company2Questions.lf_sleep_quality,
      ...healthSafety,
      company2Questions.hs_treatment,
      company2Questions.gi_live_session_cover,
      company2Questions.gi_1,
      company2Questions.gi_qa_question,
      company2Questions.gi_onsite_interest,
    ]
  }

  return [
    ...workingConditions,
    ...painDiscomfort,
    ...filterByGender(lifestyleFactors),
    ...healthSafety,
    ...goalsInfo,
  ]
})

const totalQuestions = computed(() => allQuestions.value.length)

const currentIdx = ref(0)
const history = ref([])
const responses = ref([])
const isThinking = ref(false)
const isComplete = ref(false)
const showConfirmDialog = ref(false)
const textAnswer = ref('')
const sliderValue = ref(5)
const multiSelected = ref([])
const selectedRadio = ref(null)
const otherText = ref('')
const chatScroll = ref(null)
const lastSection = ref('')
const hasNoDiscomfort = ref(false)

const isVertical = computed(() => {
  const q = currentQuestion.value
  if (!q || !q.options) return false
  // Exception for pd_1 (Pain area selection)
  if (q.id === 'pd_1') return false
  // More than 2 options -> vertical
  return q.options.length > 2
})

// ─── Per-area pain slider state ───
const painAreasQueue = ref([]) // areas still to rate
const activePainArea = ref(null) // area currently being rated
const activePainStep = ref(0) // 0: severity slider, 1: duration choice
const painRatings = ref({}) // { 'Neck': 7, 'Upper back': 5 }

// Is the component currently showing a dynamic pain slider?
const isInPainSliderMode = computed(() => activePainArea.value !== null)

// The current question — either from static list or a dynamic pain slider
const currentQuestion = computed(() => {
  if (isInPainSliderMode.value) {
    const displayArea = activePainArea.value.startsWith('Other:')
      ? activePainArea.value.replace('Other:', '').trim()
      : activePainArea.value

    if (activePainStep.value === 0) {
      return {
        id: `pd_2_${activePainArea.value.toLowerCase().replace(/[\s/]+/g, '_')}`,
        section: 'Pain & Discomfort',
        text: `On a scale of 0–10, how would you rate your <strong>${displayArea}</strong> pain or discomfort?`,
        type: 'slider',
        _dynamic: true,
      }
    } else {
      return {
        id: `pd_3_${activePainArea.value.toLowerCase().replace(/[\s/]+/g, '_')}`,
        section: 'Pain & Discomfort',
        text: `How long have you been experiencing <strong>${displayArea}</strong> discomfort?`,
        type: 'choice',
        options:
          String(props.companyId) === '2'
            ? [
                'Less than 6 weeks (Acute)',
                '6 weeks to 3 months (Subacute)',
                'More than 3 months (Chronic)',
                'Not applicable',
              ]
            : ['Less than 6 weeks', '6 weeks to 3 months', 'More than 3 months', 'Not applicable'],
        _dynamic: true,
      }
    }
  }
  return allQuestions.value[currentIdx.value]
})

// Display text (used in template)
const displayText = computed(() => {
  const q = currentQuestion.value
  if (!q) return ''
  return q.text
})

const sectionHeader = computed(() => {
  const q = currentQuestion.value
  if (q && q.section && q.section !== lastSection.value) {
    return `📋 ${q.section}`
  }
  return null
})

const currentSectionName = computed(() => {
  if (isInPainSliderMode.value) return 'Pain & Discomfort'
  const q = allQuestions.value[currentIdx.value]
  if (!q) return ''

  // Search backwards for the section label
  for (let i = currentIdx.value; i >= 0; i--) {
    if (allQuestions.value[i].section) return allQuestions.value[i].section
  }
  return ''
})

const scrollToBottom = async () => {
  await nextTick()
  if (chatScroll.value) {
    chatScroll.value.scrollTop = chatScroll.value.scrollHeight
  }
}

// ─── Emit progress when question changes ───
import { watch } from 'vue'
watch(
  [currentIdx, activePainArea, activePainStep],
  () => {
    if (isComplete.value) return
    const q = currentQuestion.value
    if (!q) return

    // Calculate progress based on static index
    const progress = Math.min(Math.round((currentIdx.value / totalQuestions.value) * 100), 99)

    emit('progress', {
      section: currentSectionName.value,
      percent: progress,
    })
  },
  { immediate: true },
)

// ─── Advance: check pain slider queue first, then static list ───
const advanceToNext = () => {
  // If we just finished the slider, move to duration for the same area
  if (isInPainSliderMode.value && activePainStep.value === 0) {
    activePainStep.value = 1
    return
  }

  // If there are more pain areas to rate, show next slider
  if (painAreasQueue.value.length > 0) {
    activePainArea.value = painAreasQueue.value.shift()
    activePainStep.value = 0
    sliderValue.value = 5
    return
  }

  // Clear pain slider mode if queue is empty
  if (activePainArea.value !== null) {
    activePainArea.value = null
    activePainStep.value = 0
  }

  // Advance static question index
  let nextIdx = currentIdx.value + 1

  // Skip questions flagged with skipIfNoDiscomfort when user selected "No discomfort"
  while (nextIdx < allQuestions.value.length) {
    const nextQ = allQuestions.value[nextIdx]
    if (nextQ.skipIfNoDiscomfort && hasNoDiscomfort.value) {
      nextIdx++
    } else {
      break
    }
  }

  if (nextIdx < allQuestions.value.length) {
    currentIdx.value = nextIdx
  } else {
    isComplete.value = true
    showConfirmDialog.value = true
    scrollToBottom()
  }
}

const handleAnswer = async (answer) => {
  const q = currentQuestion.value

  const currentStateSnapshot = {
    currentIdx: currentIdx.value,
    hasNoDiscomfort: hasNoDiscomfort.value,
    painAreasQueue: [...painAreasQueue.value],
    activePainArea: activePainArea.value,
    activePainStep: activePainStep.value,
    lastSection: lastSection.value,
    historyLength: history.value.length,
    responsesLength: responses.value.length,
  }

  // After pd_1: populate pain areas queue for per-area sliders
  if (q.id === 'pd_1') {
    if (answer.includes('No discomfort')) {
      hasNoDiscomfort.value = true
    } else {
      hasNoDiscomfort.value = false
      // Split areas and filter out "Other" / "Eye Strain / Dry Eyes" from slider
      const areas = answer
        .split(', ')
        .map((a) => a.trim())
        .filter((a) => a !== 'No discomfort' && a !== 'Other')
      if (areas.length > 0) {
        // First area goes to active, rest go to queue
        painAreasQueue.value = areas.slice(1)
        activePainArea.value = areas[0]
        activePainStep.value = 0
      }
    }
  }

  // If this is a dynamic pain slider answer, store the rating
  if (q._dynamic && q.id.startsWith('pd_2_')) {
    painRatings.value[activePainArea.value] = parseInt(answer, 10)
  }

  // Track section header in history if new section
  if (q.section && q.section !== lastSection.value) {
    history.value.push({ type: 'assistant', text: `📋 ${q.section}`, isSection: true })
    lastSection.value = q.section
  }

  // 1. Add current question to history
  history.value.push({ type: 'assistant', text: q.text })

  // 2. Add user answer to history
  history.value.push({ type: 'user', text: answer, snapshot: currentStateSnapshot })

  // 3. Collect structured response
  responses.value.push({
    id: q.id,
    section: q.section || lastSection.value,
    question: q.text,
    answer: answer,
  })

  await scrollToBottom()

  // 4. Transition to thinking
  isThinking.value = true
  multiSelected.value = []
  selectedRadio.value = null
  otherText.value = ''
  sliderValue.value = 5
  await scrollToBottom()

  // 5. Simulated delay then advance
  setTimeout(async () => {
    isThinking.value = false

    // After pd_1 with discomfort: don't advance index yet — pain sliders take over
    if (q.id === 'pd_1' && !hasNoDiscomfort.value && activePainArea.value) {
      // activePainArea is already set, just scroll
      await scrollToBottom()
      return
    }

    advanceToNext()
    await scrollToBottom()
  }, 800)
}

const confirmSubmit = () => {
  showConfirmDialog.value = false
  emit('complete', responses.value)
}

const handleEdit = (item) => {
  if (!item.snapshot) return

  const snap = item.snapshot
  currentIdx.value = snap.currentIdx
  hasNoDiscomfort.value = snap.hasNoDiscomfort
  painAreasQueue.value = [...snap.painAreasQueue]
  activePainArea.value = snap.activePainArea
  activePainStep.value = snap.activePainStep
  lastSection.value = snap.lastSection

  history.value = history.value.slice(0, snap.historyLength)
  responses.value = responses.value.slice(0, snap.responsesLength)

  isComplete.value = false
  showConfirmDialog.value = false
  isThinking.value = false

  multiSelected.value = []
  selectedRadio.value = null
  otherText.value = ''
  sliderValue.value = 5
}

const handleTextSubmit = () => {
  if (textAnswer.value.trim()) {
    handleAnswer(textAnswer.value.trim())
    textAnswer.value = ''
  }
}

const handleRadioClick = (option) => {
  const q = currentQuestion.value
  const isOther = option === 'Other' || (q.otherOption && option === q.otherOption)

  if (isOther) {
    selectedRadio.value = option
  } else {
    selectedRadio.value = null
    handleAnswer(option)
  }
}

const handleRadioOtherSubmit = () => {
  if (otherText.value.trim()) {
    handleAnswer(`Other: ${otherText.value.trim()}`)
    selectedRadio.value = null
  }
}

const toggleMulti = (option) => {
  const idx = multiSelected.value.indexOf(option)
  if (idx >= 0) {
    multiSelected.value.splice(idx, 1)
  } else {
    multiSelected.value.push(option)
  }
}

const handleMultiSubmit = () => {
  if (multiSelected.value.length > 0) {
    handleAnswer(multiSelected.value.join(', '))
  }
}

const handleMultiWithOtherSubmit = () => {
  if (multiSelected.value.length > 0) {
    const q = currentQuestion.value
    const selected = [...multiSelected.value]

    // Replace "Other" with "Other: <text>" if text provided
    if (q.otherOption && selected.includes(q.otherOption) && otherText.value.trim()) {
      const otherIdx = selected.indexOf(q.otherOption)
      selected[otherIdx] = `Other: ${otherText.value.trim()}`
    }

    handleAnswer(selected.join(', '))
  }
}

onMounted(() => {
  // Could start with a small delay or thinking state if desired
})
</script>

<style scoped>
.assessment-flow {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 80vh;
  background: #fbfcfb;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #e0e7e1;
}

/* HEADER */
.flow-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eef2ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.physio-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #107e6e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-meta strong {
  font-size: 15px;
  color: #1a1c1a;
}

.brand-meta span {
  font-size: 12px;
  color: #6a716a;
}

.progress-indicator {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  max-width: 50%;
}

.progress-segment {
  width: 8px;
  height: 4px;
  border-radius: 2px;
  background: #e0e7e1;
  transition: all 0.3s ease;
}

.progress-segment.active {
  background: #7fe6c6;
}

.progress-segment.completed {
  background: #107e6e;
}

/* CHAT AREA */
.chat-container {
  flex: 1;
  min-height: 120px;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-behavior: smooth;
}

.chat-row {
  display: flex;
  width: 100%;
}

.chat-row.assistant {
  justify-content: flex-start;
}

.chat-row.user {
  justify-content: flex-end;
}

.chat-row.section-header {
  justify-content: center;
  margin: 12px 0 4px;
}

.bubble {
  max-width: 80%;
  padding: 14px 18px;
  font-size: 13px;
  line-height: 1.5;
  border-radius: 18px;
  position: relative;
}

.assistant .bubble {
  background: white;
  color: #1a1c1a;
  border: 1px solid #eef2ef;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.user .bubble {
  background: #eef9f5;
  color: #0a5c50;
  border: 1px solid #d4ece3;
  border-bottom-right-radius: 4px;
  font-weight: 500;
}

.edit-btn {
  opacity: 0.4;
  transition: opacity 0.2s;
}

.chat-row.user:hover .edit-btn {
  opacity: 1;
}

/* Section Divider */
.section-divider {
  background: linear-gradient(135deg, #107e6e, #0a5c50) !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  letter-spacing: 0.05em;
  border: none !important;
  border-radius: 12px !important;
  padding: 12px 18px !important;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(16, 126, 110, 0.15) !important;
  width: 100%;
  max-width: 100% !important;
  text-align: center;
}

/* THINKING ANIMATION */
.thinking {
  display: flex;
  gap: 4px;
  padding: 12px 18px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #cbd5cb;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-in {
  animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* INPUT AREA */
.input-area {
  padding: 24px;
  background: white;
  border-top: 1px solid #eef2ef;
  max-height: 50vh;
  overflow-y: auto;
  flex-shrink: 0;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 480px) {
  .options-grid:not(.vertical-grid) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.option-btn {
  padding: 14px 16px;
  background: white;
  border: 1.5px solid #e0e7e1;
  border-radius: 14px;
  color: #1a1c1a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-btn:hover {
  border-color: #107e6e;
  background: #f0f7f5;
  color: #107e6e;
}

.option-btn.selected {
  border-color: #107e6e;
  background: #eef9f5;
  color: #0a5c50;
}

.check-indicator {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #d0d7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #107e6e;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.option-btn.selected .check-indicator {
  border-color: #107e6e;
  background: #107e6e;
  color: white;
}

.submit-multi,
.submit-slider {
  grid-column: 1 / -1;
  background: #107e6e;
  color: white;
  border-color: #107e6e;
  text-align: center;
  justify-content: center;
  font-weight: 700;
}

.submit-multi:hover,
.submit-slider:hover {
  background: #0a5c50;
  border-color: #0a5c50;
  color: white;
}

.submit-multi:disabled {
  background: #cbd5cb;
  border-color: #cbd5cb;
  cursor: not-allowed;
}

/* Other text box in multi_with_other */
.other-text-wrap {
  grid-column: 1 / -1;
  animation: slideUp 0.3s ease both;
}

.other-text-input {
  width: 100%;
  padding: 14px 16px;
  background: #f6f8f6;
  border: 1.5px solid #107e6e;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1c1a;
  outline: none;
  transition: all 0.2s ease;
}

.other-text-input:focus {
  box-shadow: 0 0 0 3px rgba(16, 126, 110, 0.12);
}

/* Slider */
.slider-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6a716a;
  font-weight: 600;
}

.pain-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #7fe6c6, #107e6e, #d9485f);
  border-radius: 4px;
  outline: none;
}

.pain-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #107e6e;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pain-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #107e6e;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.slider-value {
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  color: #107e6e;
}

.text-input-wrap {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f6f8f6;
  padding: 8px 8px 8px 20px;
  border-radius: 16px;
  border: 1.5px solid #e0e7e1;
}

.text-input-wrap input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1a1c1a;
  padding: 8px 0;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #107e6e;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:disabled {
  background: #cbd5cb;
  cursor: not-allowed;
}

/* COMPLETE STATE */
.complete-state.minimal {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #eef2ef;
  flex-shrink: 0;
}

.minimal-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.minimal-text {
  display: flex;
  flex-direction: column;
}

.minimal-text strong {
  font-size: 15px;
  color: #1a1c1a;
  line-height: 1.2;
}

.minimal-text span {
  font-size: 13px;
  color: #6a716a;
}
</style>
