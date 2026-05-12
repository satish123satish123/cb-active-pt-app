<template>
  <div class="pre-assessment-container">
    <div class="pre-assessment-container">
      <div v-if="!isValidLink" class="invalid-link-wrapper">
        <div class="card error-state-card text-center">
          <div class="error-badge-ring">
            <q-icon name="lock" size="44px" color="negative" />
          </div>
          <h2>Access Denied</h2>
          <p class="error-text">{{ invalidMessage }}</p>
          <p class="error-subtext">
            For security reasons, assessment links must be valid and unmodified. Please use the link
            sent to your official email or contact your coordinator.
          </p>
          <div class="q-mt-xl">
            <q-btn
              label="Try Again"
              color="primary"
              unelevated
              rounded
              padding="12px 32px"
              @click="window.location.reload()"
            />
          </div>
        </div>
      </div>

      <div v-else class="app-shell">
        <div class="layout-container">
          <!-- SIDEBAR: HERO & PROGRESS -->
          <aside class="sidebar">
            <header class="hero">
              <div class="hero-row">
                <div class="brand-lockup">
                  <div class="brand-logo">CB</div>
                  <div class="brand-text">
                    CB Physiotherapy
                    <small>Move Activ · Live Activ</small>
                  </div>
                </div>
                <div class="secure-chip">Secure</div>
              </div>
              <span class="kicker">Corporate wellness</span>
              <h1>Pre-Assessment</h1>
              <p>
                A short self-check before your on-site physiotherapy assessment. Takes about 2
                minutes.
              </p>
            </header>

            <!-- STEP RAIL -->
            <div class="step-rail" v-if="!submitted">
              <div class="step-dots">
                <div
                  class="step-dot"
                  :class="{ active: currentStep === 1, complete: currentStep > 1 }"
                >
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
                <div
                  class="step-dot"
                  :class="{ active: currentStep === 2, complete: currentStep > 2 }"
                >
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
          </aside>

          <main class="content">
            <form v-if="!submitted" class="card" @submit.prevent="handleSubmit">
              <!-- STEP 1: PROFILE -->
              <section v-if="currentStep === 1" class="step active">
                <div class="step-header">
                  <div class="eyebrow">Step 1 · Profile</div>
                  <h2>Let's start with the basics</h2>
                  <p class="step-intro">
                    We use these details to register you before your assessment.
                  </p>
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
                  <div v-if="v$.name.$error" class="error-msg">
                    {{ v$.name.$errors[0].$message }}
                  </div>
                </div>

                <div class="grid-2">
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
                </div>

                <div class="grid-2">
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
                    <div v-if="v$.age.$error" class="error-msg">
                      {{ v$.age.$errors[0].$message }}
                    </div>
                  </div>

                  <div class="field">
                    <label>Gender</label>
                    <select v-model="form.sex">
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
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
                  <div class="eyebrow">
                    Step 2 · AI Assessment ({{ currentAiIdx + 1 }}/{{ aiQuestions.length }})
                  </div>
                  <h2>{{ aiQuestions[currentAiIdx].title }}</h2>
                  <p class="step-intro">{{ aiQuestions[currentAiIdx].description }}</p>
                </div>

                <div class="field">
                  <div class="question-title required">
                    {{ aiQuestions[currentAiIdx].question }}
                  </div>
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
                <button type="button" class="btn primary" @click="handleNext">
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
                Your pre-assessment is saved and ready for your physio. We'll see you at your
                scheduled session.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api, assessment_api } from 'src/boot/axios'
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
const route = useRoute()
const currentStep = ref(1)
const submitted = ref(false)
const loading = ref(false)
const isValidLink = ref(true)
const invalidMessage = ref('')

const validateLink = async (companyId, hospitalId, providedKey) => {
  if (!companyId || !hospitalId || !providedKey) return false

  try {
    const secretKey = 'CB_CORPORATE_ASSESSMENT_SECRET_2026'
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secretKey)
    const messageData = encoder.encode(`${companyId}|${hospitalId}`)

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData)

    const hashHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return hashHex === providedKey
  } catch (err) {
    console.error('Link validation error:', err)
    return false
  }
}

const form = ref({
  company_id: '',
  hospital_id: '',
  name: '',
  phone: '',
  email: '',
  age: '',
  sex: '',
  preferred_slot: '',
})

onMounted(async () => {
  const company_id = route.query.company_id || ''
  const hospital_id = route.query.hospital_id || ''
  const key = route.query.key || ''

  form.value.company_id = company_id
  form.value.hospital_id = hospital_id

  const valid = await validateLink(company_id, hospital_id, key)
  if (!valid) {
    isValidLink.value = false
    invalidMessage.value = 'Invalid or modified assessment link.'
  }
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

    const userPrompt = `Patient Profile: Age ${form.value.age}, Gender ${form.value.sex}.
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

    const res = await assessment_api.post('ai/responses', body, {
      headers: {
        Authorization: `Bearer ${process.env.ASSESSMENT_API_TOKEN}`,
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

async function createPatient() {
  try {
    const payload = {
      username: form.value.name,
      phone: form.value.phone,
      email: form.value.email,
      company_id: form.value.company_id,
      hospital_id: form.value.hospital_id,
      age: form.value.age,
      sex: form.value.sex,
    }

    const res = await api.post('/assessmentSignUp', payload)

    if (res.data.status === 'success') {
      return await createPatientInAssessmentDB(res.data.user)
    } else {
      $q.notify({
        type: 'negative',
        message: res.data.message || 'Registration failed',
        position: 'top',
        html: true,
      })
      return false
    }
  } catch (err) {
    console.error('Patient creation error:', err)
    const data = err.response?.data
    if (data?.results && typeof data.results === 'object') {
      Object.values(data.results)
        .flat()
        .forEach((msg) => {
          $q.notify({ type: 'negative', message: msg, position: 'top', html: true })
        })
    } else {
      $q.notify({
        type: 'negative',
        message: data?.message || 'Failed to create patient',
        position: 'top',
        html: true,
      })
    }
    return false
  }
}

async function createPatientInAssessmentDB(user) {
  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      sex: user.sex,
      // company_id: form.value.company_id,
      hospital_id: form.value.hospital_id,
    }

    const res = await assessment_api.post('/patients', payload, {
      headers: {
        Authorization: `Bearer ${process.env.ASSESSMENT_API_TOKEN}`,
      },
    })

    if (!res.data.error) {
      $q.notify({
        type: 'positive',
        message: res.data.message || 'Registration successful',
        position: 'top',
      })
      return true
    } else {
      if (res.data.results && typeof res.data.results === 'object') {
        Object.values(res.data.results)
          .flat()
          .forEach((msg) => {
            $q.notify({ type: 'negative', message: msg, position: 'top', html: true })
          })
      } else {
        $q.notify({
          type: 'negative',
          message: res.data.message || 'Failed to sync with assessment database',
          position: 'top',
          html: true,
        })
      }
      return false
    }
  } catch (error) {
    console.error('Patient creation error:', error)
    const data = error.response?.data
    if (data?.results && typeof data.results === 'object') {
      Object.values(data.results)
        .flat()
        .forEach((msg) => {
          $q.notify({ type: 'negative', message: msg, position: 'top', html: true })
        })
    } else {
      $q.notify({
        type: 'negative',
        message: data?.message || 'Failed to create patient',
        position: 'top',
        html: true,
      })
    }
    return false
  }
}

const handleNext = async () => {
  if (currentStep.value === 1) {
    const isValid = await v$.value.$validate()
    if (isValid) {
      $q.loading.show({
        message: 'Creating your profile...',
        backgroundColor: 'teal-10',
      })
      const isCreated = await createPatient()
      if (isCreated) {
        await generateAIQuestion()
        currentStep.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      $q.loading.hide()
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

<style>
/* Global overrides to break out of app.scss constraints for this page */
#q-app,
.desktop-constrained {
  max-width: 100% !important;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.pre-assessment-container {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.app-shell {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 32px;
}

@media (min-width: 768px) {
  .app-shell {
    max-width: 720px;
    padding-bottom: 48px;
  }
}

@media (min-width: 1024px) {
  .app-shell {
    max-width: 1200px;
    padding: 60px 40px;
  }
}

.layout-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

@media (min-width: 1024px) {
  .layout-container {
    flex-direction: row;
    gap: 54px;
    align-items: flex-start;
  }
}

.sidebar {
  width: 100%;
}

@media (min-width: 1024px) {
  .sidebar {
    width: 400px;
    position: sticky;
    top: 60px;
    flex-shrink: 0;
  }
}

/* HERO */
.hero {
  padding: 32px 20px 64px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  overflow: hidden;
  background: var(--grad);
  color: white;
}

@media (min-width: 1024px) {
  .hero {
    border-radius: 28px;
    padding: 40px 32px;
    margin-bottom: 24px;
    box-shadow: 0 20px 40px rgba(10, 126, 110, 0.15);
  }
}

/* HERO-ROW and HERO::AFTER are handled by global style.scss */

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

@media (min-width: 1024px) {
  .brand-lockup {
    margin-bottom: 24px;
  }
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.brand-text {
  text-align: left;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.1;
}

.brand-text small {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
}

.secure-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.secure-chip::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7fe6c6;
  box-shadow: 0 0 0 3px rgba(127, 230, 198, 0.25);
}

.kicker {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 10px;
  line-height: 1.1;
  position: relative;
  z-index: 1;
}

@media (min-width: 1024px) {
  .hero h1 {
    font-size: 34px;
  }
}

.hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.6;
  max-width: 42ch;
  position: relative;
  z-index: 1;
}

/* CONTENT */
.content {
  padding: 0 16px;
  margin-top: 16px;
  position: relative;
  z-index: 2;
  flex: 1;
}

@media (min-width: 1024px) {
  .content {
    padding: 0;
    margin-top: 0;
  }
}

.step-rail {
  background: var(--card);
  border: 1px solid rgba(220, 231, 234, 0.85);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  margin: -40px 16px 16px; /* Overlap hero on mobile */
  position: relative;
  z-index: 10;
}

@media (min-width: 1024px) {
  .step-rail {
    margin: 0 0 16px 0;
    padding: 32px;
    border-radius: 28px;
    box-shadow: var(--shadow-md);
  }
}

.step-dots {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-bottom: 16px;
}

@media (min-width: 1024px) {
  .step-dots {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 32px;
    padding-left: 4px;
  }
}

.step-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

@media (min-width: 1024px) {
  .step-dot {
    flex-direction: row;
    gap: 18px;
  }
}

.step-dot .dot-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: var(--card-2);
  border: 1.5px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-3);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.step-dot .dot-icon svg {
  width: 18px;
  height: 18px;
}

.step-dot .dot-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .step-dot .dot-label {
    font-size: 13px;
  }
}

.step-dot.active .dot-icon {
  background: var(--grad);
  border-color: transparent;
  color: #fff;
  box-shadow:
    0 0 0 5px rgba(10, 126, 110, 0.1),
    0 12px 24px rgba(10, 126, 110, 0.25);
  transform: scale(1.08);
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
  height: 10px;
  background: #e9f1f2;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--grad);
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 2.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-2);
}

/* CARD */
.card {
  background: var(--card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: 24px 20px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}

@media (min-width: 768px) {
  .card {
    padding: 48px;
  }
}

@media (min-width: 1024px) {
  .card {
    box-shadow: var(--shadow-lg);
  }
}

.step {
  animation: stepIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

@media (min-width: 768px) {
  .step-header {
    margin-bottom: 36px;
    padding-bottom: 28px;
  }
}

/* .eyebrow is global */

.step h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
  line-height: 1.15;
}

@media (min-width: 768px) {
  .step h2 {
    font-size: 30px;
  }
}

.question-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 16px;
  color: var(--text);
}

@media (min-width: 768px) {
  .question-title {
    font-size: 20px;
    margin-bottom: 24px;
  }
}

.step-intro {
  margin: 0;
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .step-intro {
    font-size: 16px;
  }
}

/* FIELDS */
.field {
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .field {
    margin-bottom: 28px;
  }
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
  min-height: 56px;
  border-radius: var(--radius-md);
  border: 1.8px solid var(--line);
  background: var(--card);
  padding: 0 18px;
  color: var(--text);
  outline: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

@media (min-width: 768px) {
  input[type='text'],
  input[type='email'],
  input[type='tel'],
  input[type='number'],
  select {
    font-size: 16px;
    min-height: 64px;
    padding: 0 22px;
  }
}

input:focus,
select:focus {
  border-color: var(--brand);
  background: #fff;
  box-shadow: 0 0 0 5px rgba(10, 126, 110, 0.08);
}

/* .grid-2 */
.grid-2 {
  display: grid;
  gap: 0 24px;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

/* OPTIONS */
.options {
  display: grid;
  gap: 12px;
}

@media (min-width: 768px) {
  .options {
    gap: 16px;
  }
}

.choice-card {
  border: 1.8px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  padding: 12px 16px;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
}

@media (min-width: 768px) {
  .choice-card {
    padding: 20px 24px;
  }
}

.choice-card :deep(.q-radio__label) {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  padding-left: 10px;
}

@media (min-width: 768px) {
  .choice-card :deep(.q-radio__label) {
    font-size: 17px;
    padding-left: 14px;
  }
}

.active-card {
  border-color: var(--brand);
  background: var(--grad-soft);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(10, 126, 110, 0.08);
}

.active-card :deep(.q-radio__label) {
  color: var(--brand);
  font-weight: 600;
}

/* BUTTONS */
.nav {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

@media (min-width: 768px) {
  .nav {
    margin-top: 36px;
    padding-top: 32px;
    gap: 20px;
  }
}

/* .btn styles are global */
.btn.primary {
  flex: 1;
}

/* SUCCESS */
.success {
  text-align: center;
  padding: 48px 24px 36px;
}

@media (min-width: 768px) {
  .success {
    padding: 80px 48px;
  }
}

.success-badge {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--grad);
  color: #fff;
  margin-bottom: 24px;
  box-shadow: 0 16px 36px rgba(10, 126, 110, 0.3);
  animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@media (min-width: 768px) {
  .success-badge {
    width: 110px;
    height: 110px;
    margin-bottom: 32px;
  }
}

@keyframes successPop {
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.footer-note {
  margin-top: 18px;
  color: var(--text-3);
  font-size: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* ERROR MESSAGE */
.error-msg {
  font-size: 13px;
  color: var(--danger);
  margin-top: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shake 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.error-msg::before {
  content: '';
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d9485f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E");
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
  background: #fffafa;
}

.footer-note svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* INVALID LINK UI */
.invalid-link-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f8fafb;
}

.error-state-card {
  max-width: 440px;
  width: 100%;
  padding: 48px 32px;
  background: white;
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--line);
}

.error-badge-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #fff5f6;
  border: 4px solid #fff;
  box-shadow: 0 0 0 1px #fee2e4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.error-state-card h2 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px;
  color: var(--text);
}

.error-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--danger);
  margin-bottom: 16px;
}

.error-subtext {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-3);
  margin: 0;
}
</style>
