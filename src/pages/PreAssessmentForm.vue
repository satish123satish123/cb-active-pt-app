<template>
  <div class="pre-assessment-container">
    <div class="app-shell">
      <!-- HERO -->
      <header class="hero">
        <div class="hero-row">
          <div class="brand-lockup">
            <div class="brand-logo">A</div>
            <div class="brand-text">
              Activ PT
              <small>Move Activ · Live Activ</small>
            </div>
          </div>
          <div class="secure-chip">Secure</div>
        </div>
        <span class="kicker">Corporate wellness</span>
        <h1>Pre-Assessment</h1>
        <p>
          A short self-check before your on-site physiotherapy assessment. Takes about 2 minutes.
        </p>
      </header>

      <div class="content">
        <!-- STEP RAIL -->
        <div class="step-rail" v-if="!submitted">
          <div class="step-dots">
            <div class="step-dot" :class="{ active: currentStep === 1, complete: currentStep > 1 }">
              <div class="dot-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="dot-label">Profile</div>
            </div>
            <div class="step-dot" :class="{ active: currentStep === 2, complete: currentStep > 2 }">
              <div class="dot-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  ></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div class="dot-label">AI Check</div>
            </div>
          </div>
          <div class="progress-wrap">
            <div class="progress-rail">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="progress-meta">
              <span class="step-counter">Step {{ currentStep }} of 2</span>
              <span class="percent">{{ progressPercent }}% complete</span>
            </div>
          </div>
        </div>

        <form v-if="!submitted" class="card" @submit.prevent="handleSubmit">
          <!-- STEP 1: PROFILE -->
          <section v-if="currentStep === 1" class="step active">
            <div class="step-header">
              <div class="eyebrow">Step 1 · Profile</div>
              <h2>Let's start with the basics</h2>
              <p class="step-intro">We use these details to register you before your assessment.</p>
            </div>

            <div class="field" :class="{ 'has-error': v$.name.$error }">
              <label class="required">Full name</label>
              <input
                type="text"
                v-model="form.name"
                @blur="v$.name.$touch()"
                placeholder="e.g. Aarav Sharma"
                required
              />
              <div v-if="v$.name.$error" class="error-msg">{{ v$.name.$errors[0].$message }}</div>
            </div>

            <div class="field" :class="{ 'has-error': v$.phone.$error }">
              <label class="required">Phone number</label>
              <input
                type="tel"
                v-model="form.phone"
                @blur="v$.phone.$touch()"
                placeholder="10-digit mobile"
                required
              />
              <div v-if="v$.phone.$error" class="error-msg">
                {{ v$.phone.$errors[0].$message }}
              </div>
            </div>

            <div class="field" :class="{ 'has-error': v$.email.$error }">
              <label class="required">Email address</label>
              <input
                type="email"
                v-model="form.email"
                @blur="v$.email.$touch()"
                placeholder="you@company.com"
                required
              />
              <div v-if="v$.email.$error" class="error-msg">
                {{ v$.email.$errors[0].$message }}
              </div>
            </div>

            <div class="field" :class="{ 'has-error': v$.age.$error }">
              <label class="required">Age</label>
              <input
                type="number"
                v-model="form.age"
                @blur="v$.age.$touch()"
                min="18"
                max="80"
                placeholder="18 – 80"
                required
              />
              <div v-if="v$.age.$error" class="error-msg">{{ v$.age.$errors[0].$message }}</div>
            </div>

            <div class="field">
              <label>Gender</label>
              <select v-model="form.gender">
                <option value="">Select</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div class="field" :class="{ 'has-error': v$.preferred_slot.$error }">
              <label class="required">Preferred assessment slot</label>
              <select v-model="form.preferred_slot" @change="v$.preferred_slot.$touch()">
                <option value="">Select a slot</option>
                <option>Morning (09:00 - 12:00)</option>
                <option>Afternoon (12:00 - 15:00)</option>
                <option>Evening (15:00 - 18:00)</option>
              </select>
              <div v-if="v$.preferred_slot.$error" class="error-msg">
                {{ v$.preferred_slot.$errors[0].$message }}
              </div>
            </div>
          </section>

          <!-- STEP 2: AI GENERATED QUESTIONS -->
          <section v-if="currentStep === 2" class="step active">
            <div class="step-header">
              <div class="eyebrow">Step 2 · AI Assessment ({{ currentAiIdx + 1 }}/{{ aiQuestions.length }})</div>
              <h2>{{ aiQuestions[currentAiIdx].title }}</h2>
              <p class="step-intro">{{ aiQuestions[currentAiIdx].description }}</p>
            </div>

            <div class="field">
              <div class="question-title required">{{ aiQuestions[currentAiIdx].question }}</div>
              <div class="options">
                <q-radio
                  v-for="(choice, index) in aiQuestions[currentAiIdx].choices"
                  :key="index"
                  v-model="form.ai_responses[currentAiIdx]"
                  :val="choice"
                  :label="choice"
                  class="choice-card full-width"
                  :class="{ 'active-card': form.ai_responses[currentAiIdx] === choice }"
                />
              </div>
            </div>
          </section>

          <div class="nav">
            <button type="button" class="btn ghost" v-if="currentStep > 1" @click="handleBack">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
            <button
              type="button"
              class="btn primary"
              @click="handleNext"
            >
              <template v-if="currentStep === 1">
                <span>Continue</span>
                <svg
                  class="arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </template>
              <template v-else-if="currentAiIdx < aiQuestions.length - 1">
                <span>Continue</span>
                <svg
                  class="arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </template>
              <template v-else>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Submit assessment</span>
              </template>
            </button>
          </div>

          <p class="footer-note">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Encrypted · For clinical pre-assessment only
          </p>
        </form>

        <div class="card success" v-if="submitted">
          <div class="success-badge">
            <q-icon name="check" size="42px" color="white" />
          </div>
          <h5>Submitted successfully</h5>
          <p>
            Your pre-assessment is saved and ready for your physio. We'll see you at your scheduled
            session.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  email,
  numeric,
  minLength,
  maxLength,
  between,
  helpers,
} from '@vuelidate/validators'

const $q = useQuasar()
const currentStep = ref(1)
const submitted = ref(false)
const loading = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  age: '',
  gender: '',
  preferred_slot: '',
  ai_responses: [], // Stores answers for each AI question
})

const aiQuestions = ref([
  {
    title: 'Daily Activity',
    description: 'Understanding your base activity levels.',
    question: 'In a typical workday, which of these best describes your physical activity levels?',
    choices: [
      'Mostly sedentary (sitting for > 6 hours)',
      'Moderately active (mixture of sitting and standing)',
      'Highly active (frequent movement/lifting)',
      'Varied (no fixed pattern)',
    ],
  },
])

const currentAiIdx = ref(0)

const progressPercent = computed(() => {
  if (currentStep.value === 1) return (currentStep.value / 2) * 50 // 25% for profile
  const aiProgress = ((currentAiIdx.value + 1) / aiQuestions.value.length) * 50
  return 50 + aiProgress
})

const rules = {
  name: { required: helpers.withMessage('Full name is required', required) },
  phone: {
    required: helpers.withMessage('Phone number is required', required),
    numeric: helpers.withMessage('Enter a valid 10-digit number', numeric),
    minLength: helpers.withMessage('Enter a valid 10-digit number', minLength(10)),
    maxLength: helpers.withMessage('Enter a valid 10-digit number', maxLength(10)),
  },
  email: {
    required: helpers.withMessage('Email address is required', required),
    email: helpers.withMessage('Enter a valid email address', email),
  },
  age: {
    required: helpers.withMessage('Age is required', required),
    between: helpers.withMessage('Enter an age between 18 and 80', between(18, 80)),
  },
  preferred_slot: {
    required: helpers.withMessage('Please select a preferred slot', required),
  },
}

const v$ = useVuelidate(rules, form)

const generateAIQuestion = async () => {
  loading.value = true
  $q.loading.show({
    message: 'AI is personalizing your assessment...',
    backgroundColor: 'teal-10',
  })

  try {
    const systemPrompt = `You are a clinical physiotherapy assistant. Generate 4 to 5 highly relevant follow-up questions for a patient based on their profile.
    The questions should help understand their musculoskeletal health, lifestyle risk factors, or daily physical strain.
    Return ONLY a JSON object with this structure:
    {
      "questions": [
        {
          "title": "A short, catchy title (e.g., 'Daily Dynamics')",
          "description": "A brief explanation of why this question is being asked.",
          "question": "The actual question text.",
          "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]
        }
      ]
    }`

    const userPrompt = `Patient Profile: Age ${form.value.age}, Gender ${form.value.gender}.
    Preferred Slot: ${form.value.preferred_slot}.`

    const input = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: userPrompt,
          },
        ],
      },
    ]

    const body = {
      model: 'gpt-5.2',
      input,
      prompt_cache_retention: '24h',
      prompt_cache_key: 'cb-admin-assessment-key-v1-ai',
    }

    const token = '8|UB7tKBUmWtzYgbF10kt4oEWMjNrnXblfWR3627ky76ed6f58'

    const res = await axios.post('http://assessment_api.test/api/ai/responses', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = res.data

    if (data) {
      let extractedText = data.output?.at(-1)?.content?.[0]?.text ?? ''

      // Clean markdown code blocks if present
      const markdownMatch =
        extractedText.match(/```json\s*([\s\S]*?)\s*```/) ||
        extractedText.match(/```\s*([\s\S]*?)\s*```/)
      if (markdownMatch) {
        extractedText = markdownMatch[1].trim()
      }

      try {
        const parsed = JSON.parse(extractedText)
        if (parsed.questions && Array.isArray(parsed.questions)) {
          aiQuestions.value = parsed.questions
          currentAiIdx.value = 0
          form.value.ai_responses = new Array(parsed.questions.length).fill('')
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e, extractedText)
      }
    }
  } catch (err) {
    console.error('AI Generation Error:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to generate personalized question. Using default.',
    })
  } finally {
    loading.value = false
    $q.loading.hide()
  }
}

const handleBack = () => {
  if (currentStep.value === 2) {
    if (currentAiIdx.value > 0) {
      currentAiIdx.value--
    } else {
      currentStep.value = 1
    }
  } else {
    currentStep.value--
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleNext = async () => {
  if (currentStep.value === 1) {
    const isValid = await v$.value.$validate()
    if (isValid) {
      await generateAIQuestion()
      currentStep.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else {
    // Navigate through AI questions
    if (!form.value.ai_responses[currentAiIdx.value]) {
      $q.notify({
        type: 'warning',
        message: 'Please select an option to continue.',
        position: 'top',
      })
      return
    }

    if (currentAiIdx.value < aiQuestions.value.length - 1) {
      currentAiIdx.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }
}

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  console.log('Form Submitted:', form.value)
  submitted.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.pre-assessment-container {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.app-shell {
  max-width: 440px;
  margin: 0 auto;
  padding-bottom: 32px;
}

@media (min-width: 720px) {
  .app-shell {
    max-width: 720px;
    padding-bottom: 48px;
  }
}

/* HERO */
.hero {
  padding: 22px 20px 32px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  overflow: hidden;
}

/* HERO-ROW and HERO::AFTER are handled by global style.scss */

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  margin: 0px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-text {
  text-align: left;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
}

.brand-text small {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 1px;
}

.secure-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.secure-chip::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7fe6c6;
  box-shadow: 0 0 0 3px rgba(127, 230, 198, 0.25);
}

.kicker {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
  line-height: 1.15;
  position: relative;
  z-index: 1;
}

.hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
  line-height: 1.55;
  max-width: 40ch;
  position: relative;
  z-index: 1;
}

/* CONTENT */
.content {
  padding: 0 16px;
  margin-top: -18px;
  position: relative;
  z-index: 2;
}

.step-rail {
  background: var(--card);
  border: 1px solid rgba(220, 231, 234, 0.85);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 14px;
}

.step-dots {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.step-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-dot .dot-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: var(--card-2);
  border: 1.5px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-3);
  transition: all 0.35s ease;
}

.step-dot .dot-icon svg {
  width: 15px;
  height: 15px;
}

.step-dot .dot-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--text-3);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.step-dot.active .dot-icon {
  background: var(--grad);
  border-color: transparent;
  color: #fff;
  box-shadow:
    0 0 0 4px rgba(10, 126, 110, 0.1),
    0 8px 18px rgba(10, 126, 110, 0.25);
  transform: scale(1.05);
}

.step-dot.active .dot-label {
  color: var(--brand);
}

.step-dot.complete .dot-icon {
  background: var(--brand-3);
  border-color: rgba(10, 126, 110, 0.2);
  color: var(--brand);
}

.progress-wrap {
  margin-top: 4px;
}
.progress-rail {
  height: 8px;
  background: #e6eeef;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--grad);
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-40px);
  }
  100% {
    transform: translateX(40px);
  }
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 11.5px;
  font-weight: 700;
}

/* CARD */
.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 20px 18px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}

.step {
  animation: stepIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

/* .eyebrow is global */

.step h2 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
}

.question-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 12px;
  color: var(--text);
}

.step-intro {
  margin: 0;
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.55;
}

/* FIELDS */
/* .field label is mostly handled by global style.scss */
.field {
  margin-bottom: 16px;
}

.required::after {
  content: '*';
  color: var(--danger);
  margin-left: 4px;
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='number'],
select {
  width: 100%;
  min-height: 54px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--line);
  background: var(--card);
  padding: 0 16px;
  color: var(--text);
  outline: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.18s ease;
}

input:focus,
select:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 4px rgba(10, 126, 110, 0.1);
}

/* .grid-2 is global */

/* OPTIONS */
.options {
  display: grid;
  gap: 10px;
}

.choice-card {
  border: 1.5px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  padding: 8px 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.choice-card :deep(.q-radio__label) {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  padding-left: 8px;
}

.active-card {
  border-color: var(--brand);
  background: var(--grad-soft);
}

.active-card :deep(.q-radio__label) {
  color: var(--brand);
  font-weight: 600;
}

/* BUTTONS */
.nav {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

/* .btn styles are global */
.btn.primary {
  flex: 1;
}

/* SUCCESS */
.success {
  text-align: center;
  padding: 36px 20px 28px;
}

.success-badge {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--grad);
  color: #fff;
  margin-bottom: 18px;
  box-shadow: 0 14px 30px rgba(10, 126, 110, 0.25);
  animation: successPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes successPop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.footer-note {
  margin-top: 14px;
  color: var(--text-3);
  font-size: 11.5px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* ERROR MESSAGE */
.error-msg {
  font-size: 12.5px;
  color: var(--danger);
  margin-top: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: shake 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.error-msg::before {
  content: '';
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23d9485f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.field.has-error input,
.field.has-error select {
  border-color: var(--danger) !important;
  background: #fff7f8;
}

.footer-note svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
</style>
