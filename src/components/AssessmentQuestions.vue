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
          v-for="n in staticQuestions.length"
          :key="n"
          class="progress-segment"
          :class="{ active: n <= currentIdx + 1, completed: n < currentIdx + 1 }"
        ></div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="chat-container" ref="chatScroll">
      <div v-for="(item, idx) in history" :key="idx" class="chat-row" :class="item.type">
        <div class="bubble">
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

      <!-- Current Question -->
      <div v-if="!isThinking && currentQuestion && !isComplete" class="chat-row assistant">
        <div class="bubble animate-in">
          {{ currentQuestion.text }}
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area" v-if="!isThinking && currentQuestion && !isComplete">
      <div
        v-if="currentQuestion.type === 'radio' || currentQuestion.type === 'choice'"
        class="options-grid"
      >
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="option-btn"
          @click="handleAnswer(option)"
        >
          {{ option }}
        </button>
      </div>
      <div v-else-if="currentQuestion.type === 'text'" class="text-input-wrap">
        <input
          v-model="textAnswer"
          placeholder="Type your answer here..."
          @keyup.enter="handleTextSubmit"
        />
        <button class="send-btn" @click="handleTextSubmit" :disabled="!textAnswer.trim()">
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

const emit = defineEmits(['complete'])

const staticQuestions = [
  {
    id: 1,
    text: 'Where do you feel the most discomfort or pain?',
    type: 'choice',
    options: ['Neck', 'Shoulder', 'Lower Back', 'Knee', 'Other'],
  },
  {
    id: 2,
    text: 'How would you describe your pain intensity?',
    type: 'choice',
    options: ['1-3 (Mild)', '4-6 (Moderate)', '7-8 (Severe)', '9-10 (Intense)'],
  },
  {
    id: 3,
    text: 'How long have you been experiencing this?',
    type: 'choice',
    options: ['Less than a week', '1-4 weeks', '1-3 months', 'More than 3 months'],
  },
  {
    id: 4,
    text: 'Does the pain travel or radiate to your limbs?',
    type: 'radio',
    options: ['Yes, it radiates', 'No, it stays local'],
  },
  {
    id: 5,
    text: 'Are there any specific activities that trigger the pain?',
    type: 'text',
  },
  {
    id: 6,
    text: 'What is your primary goal for today\'s session?',
    type: 'choice',
    options: ['Pain relief', 'Increased flexibility', 'Postural correction', 'Not sure'],
  },
]

const currentIdx = ref(0)
const history = ref([])
const isThinking = ref(false)
const isComplete = ref(false)
const textAnswer = ref('')
const chatScroll = ref(null)

const currentQuestion = computed(() => staticQuestions[currentIdx.value])

const scrollToBottom = async () => {
  await nextTick()
  if (chatScroll.value) {
    chatScroll.value.scrollTop = chatScroll.value.scrollHeight
  }
}

const handleAnswer = async (answer) => {
  // 1. Add current question to history so it stays visible
  history.value.push({ type: 'assistant', text: currentQuestion.value.text })

  // 2. Add user answer to history
  history.value.push({ type: 'user', text: answer })
  await scrollToBottom()

  // 2. Transition to thinking
  isThinking.value = true
  await scrollToBottom()

  // 3. Simulated delay
  setTimeout(async () => {
    isThinking.value = false
    if (currentIdx.value < staticQuestions.length - 1) {
      currentIdx.value++
    } else {
      isComplete.value = true
      emit('complete', history.value)
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

onMounted(() => {
  // Could start with a small delay or thinking state if desired
})
</script>

<style scoped>
.assessment-flow {
  display: flex;
  flex-direction: column;
  height: 600px;
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
  gap: 4px;
}

.progress-segment {
  width: 24px;
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
}

.option-btn:hover {
  border-color: #107e6e;
  background: #f0f7f5;
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
