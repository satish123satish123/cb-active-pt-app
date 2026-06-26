<template>
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
          <header class="hero" :class="{ minimized: isMinimized }">
            <div class="hero-row">
              <div class="brand-lockup">
                <div class="brand-logo cb-logo">
                  <q-img src="cb_white.webp" />
                </div>
                <div class="brand-divider"></div>
                <div class="brand-logo partner-logo">
                  <q-img :src="String(form.company_id) === '2' ? 'db_india.jpeg' : 'cars24.webp'" />
                </div>
              </div>
              <!-- <div class="secure-chip">Secure</div> -->
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
                <div class="dot-label">
                  Section 1
                  <small>(Profile)</small>
                </div>
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
                <div class="dot-label">
                  <span
                    v-if="currentStep === 2 && assessmentProgress.section"
                    class="active-section"
                  >
                    Section {{ sectionNumber(assessmentProgress.section) }}
                    <small>({{ assessmentProgress.section }})</small>
                  </span>
                  <span v-else>Section 2</span>
                </div>
              </div>
            </div>
            <div class="progress-wrap">
              <div class="progress-rail">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="progress-meta">
                <span class="step-counter">Section {{ currentDisplayStep }} of 7</span>
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

              <div class="field" :class="{ 'has-error': v$.employee_id.$error }">
                <label class="required">Employee ID</label>
                <input
                  type="text"
                  v-model="form.employee_id"
                  @blur="v$.employee_id.$touch()"
                  placeholder="Enter Employee ID"
                  required
                />
                <div v-if="v$.employee_id.$error" class="error-msg">
                  {{ v$.employee_id.$errors[0].$message }}
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
                    placeholder="e.g. 32"
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

              <div
                v-if="String(form.company_id) === '2'"
                class="field"
                :class="{ 'has-error': v$.location.$error }"
              >
                <label class="required">Which location are you based in?</label>
                <select v-model="form.location" @change="v$.location.$touch()" required>
                  <option value="">Select location</option>
                  <option value="Gurgaon office (attending in person)">
                    Gurgaon office (attending in person)
                  </option>
                  <option value="Other India location (joining via broadcast)">
                    Other India location (joining via broadcast)
                  </option>
                </select>
                <div v-if="v$.location.$error" class="error-msg">
                  {{ v$.location.$errors[0].$message }}
                </div>
              </div>

              <!-- <div class="field" :class="{ 'has-error': v$.preferred_slot.$error }">
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
              </div> -->

              <!-- <div class="field" :class="{ 'has-error': v$.previous_assessment.$error }">
                <label class="required"
                  >Were you part of the previous Cars24 x CB Physiotherapy assessment?</label
                >
                <select
                  v-model="form.previous_assessment"
                  @change="v$.previous_assessment.$touch()"
                >
                  <option value="">Select an option</option>
                  <option value="completed">Yes, I completed the assessment</option>
                  <option value="registered_incomplete">
                    I registered but could not complete the assessment
                  </option>
                  <option value="first_time">No, this is my first time</option>
                  <option value="not_sure">Not sure</option>
                </select>
                <div v-if="v$.previous_assessment.$error" class="error-msg">
                  {{ v$.previous_assessment.$errors[0].$message }}
                </div>
              </div> -->
            </section>

            <!-- STEP 2: SEQUENTIAL QUESTIONS -->
            <section v-if="currentStep === 2" class="step active">
              <AssessmentQuestions
                :gender="form.sex"
                :company-id="form.company_id"
                @complete="handleAssessmentComplete"
                @progress="handleAssessmentProgress"
              />
            </section>

            <div class="nav" v-if="currentStep === 1">
              <button type="button" class="btn primary" @click="handleNext">
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

          <!-- SUCCESS SCREEN -->
          <div class="card success-screen" v-if="submitted">
            <div class="success-badge">
              <q-icon name="check" size="42px" color="white" />
            </div>
            <h5>Submitted successfully</h5>
            <p>Thank you for completing the evaluation. Please book your assessment slot.</p>
            <p>
              If you have any relevant medical reports, scans, or previous treatment records related
              to your concern, please carry them along for the assessment.
            </p>
            <div class="q-mt-md">
              <a
                type="button"
                class="btn primary"
                href="https://calendly.com/workplace-wellness-cbphysiotherapy"
                target="_blank"
                style="text-decoration: none"
              >
                <span>Book Assessment Slot</span>
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
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <!-- Patient Already Exists Dialog -->
  <q-dialog v-model="showExistsDialog" persistent>
    <q-card
      class="existing-profile-card"
      style="min-width: 350px; max-width: 500px; border-radius: 20px"
    >
      <q-card-section class="q-pb-none row no-wrap items-center q-pt-lg q-px-lg">
        <div class="alert-icon-container q-mr-md">
          <q-icon name="account_circle" size="44px" color="teal-8" />
        </div>
        <div>
          <div class="text-h6 text-weight-bold text-grey-9 dialog-title">
            Profile Already Registered
          </div>
          <div class="text-caption text-grey-6">
            We found an existing record matching these details
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-px-lg q-py-md">
        <div
          class="patient-details-box q-pa-md q-mb-md"
          style="background: #f4fcf9; border-radius: 12px; border: 1px solid #d2f2e7"
        >
          <div class="row items-center justify-between q-mb-xs">
            <span
              class="text-caption text-grey-7 text-uppercase text-weight-bold"
              style="letter-spacing: 0.05em"
              >Patient Name</span
            >
            <span class="text-subtitle2 text-weight-bold text-teal-9">{{
              existingPatientName
            }}</span>
          </div>
        </div>
        <p class="text-body2 text-grey-8 q-mb-none" style="line-height: 1.6">
          A profile with the name <strong>{{ existingPatientName }}</strong> is already registered
          in our system using this email address. Would you like to continue or register with a new
          email ID?
        </p>
      </q-card-section>

      <q-card-actions class="q-px-lg q-pb-lg q-pt-none row no-wrap justify-end gap-sm">
        <q-btn
          flat
          label="Edit Details"
          color="grey-7"
          no-caps
          class="text-weight-medium rounded-borders col-xs-6 col-sm-auto"
          style="border: 1px solid #e2e8f0; padding: 8px 12px"
          v-close-popup
        />
        <q-btn
          unelevated
          label="Continue"
          color="primary"
          no-caps
          class="text-weight-medium rounded-borders col-xs-6 col-sm-auto"
          style="padding: 8px 12px"
          @click="handleContinueWithExisting"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api, assessment_api } from 'src/boot/axios'
import { useVuelidate } from '@vuelidate/core'
import AssessmentQuestions from 'src/components/AssessmentQuestions.vue'
import { mapAssessmentPayload } from 'src/utils/assessmentMapper'
import { required, email, numeric, minLength, maxLength, helpers } from '@vuelidate/validators'
import { QUESTION_SUMMARY_SYSTEM_PROMPT } from 'src/utils/prompts.js'

const $q = useQuasar()
const route = useRoute()
const currentStep = ref(1)
const submitted = ref(false)
const isSubmitting = ref(false)
const isValidLink = ref(true)
const invalidMessage = ref('')
const assessmentResponses = ref([])
const patientId = ref(null)
const assessmentProgress = ref({
  section: '',
  percent: 0,
})
const showExistsDialog = ref(false)
const existingPatientName = ref('')
const existingPatientUserObj = ref(null)

const SECTION_MAP = {
  'Working Conditions': 2,
  'Pain & Discomfort': 3,
  'Lifestyle & Women-Specific Factors': 4,
  'Health & Safety Information': 5,
  'Goals & Additional Information': 6,
}

const sectionNumber = (section) => SECTION_MAP[section] || 2

const currentDisplayStep = computed(() => {
  if (submitted.value) return 7
  if (currentStep.value === 1) return 1
  return sectionNumber(assessmentProgress.value.section)
})

const isMinimized = computed(() => {
  return currentStep.value === 2 && !submitted.value
})

// const previousAssessmentLabel = computed(() => {
//   const map = {
//     completed: 'Yes, I completed the assessment',
//     registered_incomplete: 'I registered but could not complete the assessment',
//     first_time: 'No, this is my first time',
//     not_sure: 'Not sure',
//   }
//   return map[form.value.previous_assessment] || form.value.previous_assessment
// })

const validateLink = async (companyId, hospitalId, providedKey) => {
  // console.log(companyId, hospitalId, providedKey)
  // return true
  if (!companyId || !hospitalId || !providedKey) return false

  try {
    const secretKey = process.env.SECRET_KEY
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
  employee_id: '',
  name: '',
  phone: '',
  email: '',
  age: '',
  sex: 'female',
  location: '',
  // preferred_slot: '',
  // previous_assessment: '',
})

onMounted(async () => {
  const company_id = route.query.company_id || ''
  const hospital_id = route.query.hospital_id || ''
  const key = route.query.key || ''
  const employee_id = route.query.employee_id || ''

  form.value.company_id = company_id
  form.value.hospital_id = hospital_id
  form.value.employee_id = employee_id

  const valid = await validateLink(company_id, hospital_id, key)
  if (!valid) {
    isValidLink.value = false
    invalidMessage.value = 'Invalid or modified assessment link.'
  }
})

const profilePercent = computed(() => {
  const fields = ['name', 'phone', 'email', 'age', 'sex']
  if (String(form.value.company_id) === '2') {
    fields.push('location')
  }
  const filled = fields.filter((f) => !!form.value[f]).length
  return Math.round((filled / fields.length) * 100)
})

const progressPercent = computed(() => {
  if (submitted.value) return 100

  if (currentStep.value === 1) {
    // Step 1: 0% to 10%
    return Math.round(profilePercent.value * 0.1)
  }
  if (currentStep.value === 2) {
    // Step 2: 10% to 100%
    return 10 + Math.round(assessmentProgress.value.percent * 0.9)
  }
  return 0
})

const handleAssessmentProgress = (data) => {
  assessmentProgress.value = data
}

const rules = computed(() => {
  const baseRules = {
    employee_id: { required: helpers.withMessage('Employee ID is required', required) },
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
    },
  }

  if (String(form.value.company_id) === '2') {
    baseRules.location = {
      required: helpers.withMessage('Location is required', required),
    }
  }

  return baseRules
})

const v$ = useVuelidate(rules, form)

const handleAssessmentComplete = async (responses) => {
  form.value.assessment_data = responses
  assessmentResponses.value = responses
  await handleFinalSubmit()
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
      location: form.value.location,
    }

    const res = await api.post('/assessmentSignUp', payload)

    if (res.data.status === 'success') {
      if (res.data.exists) {
        existingPatientUserObj.value = res.data.user || null
        existingPatientName.value =
          res.data.user?.name || res.data.user?.username || form.value.name
        showExistsDialog.value = true
        return false
      }

      patientId.value = res.data.user.id
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
    const rawSex = user.sex || form.value.sex
    const formattedSex = rawSex
      ? rawSex.charAt(0).toUpperCase() + rawSex.slice(1).toLowerCase()
      : ''

    const payload = {
      id: user.id,
      name: user.name || user.username || form.value.name,
      email: user.email || form.value.email,
      phone: user.phone || form.value.phone,
      age: user.age || form.value.age,
      sex: formattedSex,
      // company_id: form.value.company_id,
      hospital_id: form.value.hospital_id,
      employee_id: form.value.employee_id,
      location: form.value.location || user.location,
    }

    const res = await assessment_api.post('/patients', payload)

    if (!res.data.error) {
      patientId.value = res.data.results.id
      console.log(res.data.message || 'Registration successful')
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

const handleContinueWithExisting = async () => {
  showExistsDialog.value = false
  if (existingPatientUserObj.value) {
    $q.loading.show({
      message: 'Linking profile...',
      backgroundColor: 'teal-10',
    })
    patientId.value = existingPatientUserObj.value.id
    const isSynced = await createPatientInAssessmentDB(existingPatientUserObj.value)
    if (isSynced) {
      currentStep.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    $q.loading.hide()
  } else {
    $q.notify({
      type: 'negative',
      message: 'Could not find existing patient details. Please modify your information.',
      position: 'top',
    })
  }
}

async function getMcqSummary(questions) {
  const prompt = `Questions: ${questions.map((q) => `Q: ${q.question}\nA: ${q.patient_answer || 'Not answered'}`).join('\n\n')}`
  const aiPayload = {
    model: 'gpt-5.2',
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: QUESTION_SUMMARY_SYSTEM_PROMPT,
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: prompt,
          },
        ],
      },
    ],
  }

  try {
    const res = await assessment_api.post('ai/responses', aiPayload)
    if (res.data && res.data.output) {
      return res.data.output[0]?.content[0]?.text || ''
    }
    return ''
  } catch (error) {
    console.error('Error getting MCQ summary:', error)
    return ''
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
        currentStep.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      $q.loading.hide()
    }
  }
}

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  console.log('Form Submitted:', form.value)
  submitted.value = true
}

const handleFinalSubmit = async () => {
  isSubmitting.value = true
  try {
    // Build structured payload from form data + assessment responses
    const payload = mapAssessmentPayload(form.value, assessmentResponses.value)

    // Get MCQ Summary from AI
    $q.loading.show({
      message: 'Generating clinical summary...',
      backgroundColor: 'teal-10',
    })
    const mcqSummary = await getMcqSummary(payload.questions)

    payload.mcq_summary = mcqSummary

    $q.loading.show({
      message: 'Saving your responses...',
      backgroundColor: 'teal-10',
    })

    // Send payload to assessment API with patient_id and hospital_id
    await assessment_api
      .post('/assessments', {
        patient_id: patientId.value,
        employee_id: form.value.employee_id,
        hospital_id: form.value.hospital_id,
        assessment_context: 'ergonomic',
        ...payload,
        b2b_assessment_data: {
          patient_id: patientId.value,
          ...form.value,
        },
      })
      .then((res) => {
        console.log('Assessment API Response:', res.data)
        if (res.data.error) {
          $q.notify({
            type: 'negative',
            message: res.data.message || 'Failed to sync with assessment database',
            position: 'top',
            html: true,
          })
          return false
        }
        $q.notify({
          type: 'positive',
          message: res.data.message || 'Assessment sync successful',
          position: 'top',
        })
        return true
      })
      .catch((err) => {
        console.error('Assessment API Error:', err)
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
            message: data?.message || 'Failed to sync with assessment database',
            position: 'top',
            html: true,
          })
        }
        return false
      })

    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isSubmitting.value = false
    $q.loading.hide()
  }
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

@media (max-width: 599px) {
  .dialog-title {
    font-size: 1rem !important;
  }
}

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
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 1023px) {
  .hero.minimized {
    padding-top: 16px;
    padding-bottom: 40px;
  }
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
  margin-bottom: 10px;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.brand-logo {
  height: 32px;
  display: flex;
  align-items: center;
}

.cb-logo {
  width: 140px;
}

.partner-logo {
  width: 100px;
}

.brand-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.25);
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
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
}

@media (max-width: 1023px) {
  .hero.minimized .kicker,
  .hero.minimized h1,
  .hero.minimized p {
    opacity: 0;
    max-height: 0;
    margin: 0;
    pointer-events: none;
    overflow: hidden;
  }
}

.hero h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 10px;
  line-height: 1.1;
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
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
  transition: all 0.4s ease;
}

/* CONTENT */
.content {
  padding: 0 16px;
  margin-top: 5px;
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
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-align: center;
  align-items: center;
}

.step-dot .dot-label small {
  font-size: 10px;
  font-weight: 500;
  color: #6a716a;
  text-transform: none;
  letter-spacing: 0;
}

@media (min-width: 1024px) {
  .step-dot .dot-label {
    font-size: 13px;
    text-align: left;
    align-items: flex-start;
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

.active-section {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.active-section small {
  font-size: 10px;
  font-weight: 500;
  color: #6a716a;
  text-transform: none;
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
  /* margin-top: 24px; */
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

@media (min-width: 768px) {
  .nav {
    /* margin-top: 36px; */
    padding-top: 32px;
    gap: 20px;
  }
}

/* .btn styles are global */
.btn.primary {
  flex: 1;
}

/* SUCCESS SCREEN */
.success-screen {
  text-align: center;
  padding: 80px 24px 60px;
  animation: stepIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@media (min-width: 768px) {
  .success-screen {
    padding: 120px 48px 80px;
  }
}

.success-screen h5 {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 800;
  color: var(--text);
}

.success-screen p {
  margin: 0 auto;
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.6;
  max-width: 360px;
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
