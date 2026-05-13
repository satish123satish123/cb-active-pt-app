<template>
  <div class="assessment-flow">
    <!-- Header -->
    <div class="flow-header">
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
    </div>

    <!-- Chat Area -->
    <div class="chat-container" ref="chatScroll">
      <div v-for="(item, idx) in history" :key="idx" class="chat-row" :class="item.type">
        <div class="bubble" :class="{ 'section-divider': item.isSection }">
          {{ item.text }}
        </div>
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
      <div v-if="!isThinking && sectionHeader && !isComplete" class="chat-row assistant">
        <div class="bubble section-divider animate-in">
          {{ sectionHeader }}
        </div>
      </div>

      <!-- Current Question -->
      <div v-if="!isThinking && currentQuestion && !isComplete" class="chat-row assistant">
        <div class="bubble animate-in">
          {{ currentQuestion.text }}
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area" v-if="!isThinking && currentQuestion && !isComplete">
      <!-- Radio / Choice (single select) -->
      <div
        v-if="currentQuestion.type === 'radio' || currentQuestion.type === 'choice'"
        class="options-grid"
      >
        <button
          type="button"
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          @click="handleAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <!-- Multi-select (checkboxes) -->
      <div v-else-if="currentQuestion.type === 'multi'" class="options-grid">
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

      <!-- Slider (pain scale) -->
      <div v-else-if="currentQuestion.type === 'slider'" class="slider-wrap">
        <div class="slider-labels">
          <span>0 — No pain</span>
          <span>10 — Severe pain</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          v-model.number="sliderValue"
          class="pain-slider"
        />
        <div class="slider-value">{{ sliderValue }}</div>
        <button type="button" class="option-btn submit-slider" @click="handleAnswer(String(sliderValue))">
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
        <button type="button" class="send-btn" @click="handleTextSubmit" :disabled="!textAnswer.trim()">
          <q-icon name="send" />
        </button>
      </div>
    </div>

    <!-- Complete State -->
    <div v-if="isComplete" class="complete-state animate-in">
      <div class="success-badge">
        <q-icon name="check" size="32px" color="white" />
      </div>
      <h3>All set!</h3>
      <p>Thank you for answering. Your physio will review these details.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'

const props = defineProps({
  gender: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['complete'])

import {
  workingConditions,
  painDiscomfort,
  womenHealth,
  functionalSelfCheck,
  healthSafety,
  goalsInfo,
} from 'src/data/assessmentQuestions'

// ─── Build question list (conditionally include women-specific) ───
const allQuestions = computed(() => {
  const base = [
    ...workingConditions,
    ...painDiscomfort,
  ]

  if (props.gender === 'female') {
    base.push(...womenHealth)
  }

  base.push(...functionalSelfCheck)
  base.push(...healthSafety)
  base.push(...goalsInfo)

  return base
})

const totalQuestions = computed(() => allQuestions.value.length)

const currentIdx = ref(0)
const history = ref([])
const responses = ref([])
const isThinking = ref(false)
const isComplete = ref(false)
const textAnswer = ref('')
const sliderValue = ref(5)
const multiSelected = ref([])
const chatScroll = ref(null)
const lastSection = ref('')

const currentQuestion = computed(() => allQuestions.value[currentIdx.value])

const sectionHeader = computed(() => {
  const q = currentQuestion.value
  if (q && q.section && q.section !== lastSection.value) {
    return `📋 ${q.section}`
  }
  return null
})

const scrollToBottom = async () => {
  await nextTick()
  if (chatScroll.value) {
    chatScroll.value.scrollTop = chatScroll.value.scrollHeight
  }
}

const handleAnswer = async (answer) => {
  const q = currentQuestion.value

  // Track section header in history if new section
  if (q.section && q.section !== lastSection.value) {
    history.value.push({ type: 'assistant', text: `📋 ${q.section}`, isSection: true })
    lastSection.value = q.section
  }

  // 1. Add current question to history
  history.value.push({ type: 'assistant', text: q.text })

  // 2. Add user answer to history
  history.value.push({ type: 'user', text: answer })

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
  sliderValue.value = 5
  await scrollToBottom()

  // 5. Simulated delay
  setTimeout(async () => {
    isThinking.value = false
    if (currentIdx.value < allQuestions.value.length - 1) {
      currentIdx.value++
    } else {
      isComplete.value = true
      emit('complete', responses.value)
    }
    await scrollToBottom()
  }, 800)
}

const handleTextSubmit = () => {
  if (textAnswer.value.trim()) {
    handleAnswer(textAnswer.value.trim())
    textAnswer.value = ''
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

.bubble {
  max-width: 80%;
  padding: 14px 18px;
  font-size: 15px;
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

/* Section Divider */
.section-divider {
  background: linear-gradient(135deg, #107e6e, #0a5c50) !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  letter-spacing: 0.03em;
  border: none !important;
  border-radius: 12px !important;
  padding: 10px 18px !important;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(16, 126, 110, 0.2) !important;
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
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.option-btn {
  padding: 14px 16px;
  background: white;
  border: 1.5px solid #e0e7e1;
  border-radius: 14px;
  color: #1a1c1a;
  font-size: 14px;
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
.complete-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.success-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #107e6e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(16, 126, 110, 0.2);
}

.complete-state h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  color: #1a1c1a;
}

.complete-state p {
  font-size: 14px;
  color: #6a716a;
  max-width: 240px;
  line-height: 1.5;
}
</style>
