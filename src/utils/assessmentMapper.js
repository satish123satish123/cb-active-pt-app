import { workingConditions, lifestyleFactors } from 'src/data/assessmentQuestions'

// ─── Pain area → pain_site_side key mapping ───
const PAIN_SITE_MAP = {
  Neck: 'neck',
  'Upper back': 'upper_thoracic_region',
  'Lower back': 'lower_lumbar_region',
  Shoulder: 'shoulder',
  'Forearm / Elbow': 'forearm_elbow',
  'Wrist / Hand': 'wrist_hand',
  Headaches: 'head',
  Hip: 'hip',
  Knee: 'knee',
  'Eye Strain / Dry Eyes': 'eye_strain',
}

// ─── Patient expectations label mapping ───
const EXPECTATION_MAP = {
  'Understand and reduce my pain': 'Pain Management',
  'Correct my posture': 'Posture Correction',
  'Improve my strength': 'Strengthening',
  'Move more freely': 'Improve Mobility',
  'Get a personalised exercise plan': 'Others',
  'Prevent future issues': 'Others',
}

// ─── Pain duration mapping ───
const DURATION_MAP = {
  'Less than 6 weeks': 'Acute',
  '6 weeks to 3 months': 'Sub-acute',
  'More than 3 months': 'Chronic',
  'Not applicable': '',
}

// ─── Previous assessment option label mapping ───
// const PREVIOUS_ASSESSMENT_OPTIONS = [
//   { key: 'completed', label: 'Yes, I completed the assessment' },
//   { key: 'registered_incomplete', label: 'I registered but could not complete the assessment' },
//   { key: 'first_time', label: 'No, this is my first time' },
//   { key: 'not_sure', label: 'Not sure' },
// ]

/**
 * Build the MCQ-formatted questions array from Working Conditions
 * and Lifestyle sections with patient answers.
 * Also prepends previous_assessment from step 1 as a MCQ question.
 */
function buildQuestionsArray(responses, gender /* , formData */) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const questions = []

  // 1. Prepend previous_assessment from form as MCQ
  // if (formData.previous_assessment) {
  //   const prevMatch = PREVIOUS_ASSESSMENT_OPTIONS.find(
  //     (o) => o.key === formData.previous_assessment,
  //   )
  //   questions.push({
  //     id: 1,
  //     question: 'Were you part of the previous Cars24 x CB Physiotherapy assessment?',
  //     options: PREVIOUS_ASSESSMENT_OPTIONS.map((o, i) => ({ key: ALPHABET[i], label: o.label })),
  //     patient_answer: prevMatch ? prevMatch.label : formData.previous_assessment,
  //   })
  // }

  // Collect all questions that should appear in the MCQ questions array
  const mcqSources = [
    ...workingConditions,
    ...lifestyleFactors.filter((q) => {
      if (q.femaleOnly && gender !== 'female') return false
      return true
    }),
  ]

  mcqSources.forEach((q) => {
    const options = (q.options || []).map((label, i) => ({
      key: ALPHABET[i] || String(i + 1),
      label,
    }))

    // Find the user's answer for this question
    const response = responses.find((r) => r.id === q.id)
    let patientAnswer = null
    if (response) {
      patientAnswer = response.answer
    }

    questions.push({
      id: questions.length + 1,
      question: q.text,
      options,
      patient_answer: patientAnswer,
    })
  })

  return questions
}

/**
 * Build occupations array from wc_1 (Primary Work Pattern) response.
 */
function buildOccupations(responses) {
  const wc1 = responses.find((r) => r.id === 'wc_1')
  if (!wc1) return []
  return [wc1.answer.trim()]
}

/**
 * Build pain_assessment array from pd_1, pd_2_* (per-area), pd_3 responses.
 * Creates one entry per selected pain area with individual severity.
 */
function buildPainAssessment(responses) {
  const pd1 = responses.find((r) => r.id === 'pd_1')
  const pd3 = responses.find((r) => r.id === 'pd_3')

  if (!pd1 || pd1.answer.includes('No discomfort')) {
    return []
  }

  const areas = pd1.answer.split(', ').map((a) => a.trim())
  const durationRaw = pd3 ? pd3.answer : ''
  const duration = DURATION_MAP[durationRaw] || durationRaw

  return areas
    .filter((area) => area !== 'No discomfort' && area !== 'Other')
    .map((area) => {
      let cleanArea = area
      if (area.startsWith('Other:')) {
        cleanArea = area.replace('Other:', '').trim()
      }

      // Find per-area severity from dynamic pd_2_<key> responses
      const areaKey = area.toLowerCase().replace(/[\s/]+/g, '_')
      const pd2 = responses.find((r) => r.id === `pd_2_${areaKey}`)
      const severity = pd2 ? parseInt(pd2.answer, 10) : 0

      return {
        pain_site_side: PAIN_SITE_MAP[cleanArea] || cleanArea.toLowerCase().replace(/\s+/g, '_'),
        pain_severity: severity,
        pain_onset: 'Gradual',
        pain_duration: duration,
        frequency: '',
        pain_nature: [],
        referral_pattern: '',
        referral_pattern_area: [],
        referred_pain_area: [],
        aggravating_factors: [],
        relieving_factors: [],
        pain_label: String(severity),
        labelColor: '',
      }
    })
}

/**
 * Build the chief_complaint string from pd_1 areas.
 */
function buildChiefComplaint(responses) {
  const pd1 = responses.find((r) => r.id === 'pd_1')
  if (!pd1 || pd1.answer.includes('No discomfort')) {
    return 'No discomfort'
  }
  const areas = pd1.answer
    .split(', ')
    .map((a) => a.trim())
    .filter((a) => a !== 'Other' && a !== 'No discomfort')
  return areas
    .map((a) => {
      const clean = a.startsWith('Other:') ? a.replace('Other:', '').trim() : a
      return `${clean} pain`
    })
    .join(', ')
}

/**
 * Build patient_expectations array from gi_1 response.
 */
function buildExpectations(responses) {
  const gi1 = responses.find((r) => r.id === 'gi_1')
  if (!gi1) return []
  const selected = gi1.answer.split(', ').map((a) => a.trim())
  // Map to standard labels, dedup "Others"
  const mapped = selected.map((s) => EXPECTATION_MAP[s] || s)
  return [...new Set(mapped)]
}

// ─── Medical history option mapping ───
const MEDICAL_HISTORY_MAP = {
  None: 'none',
  Diabetes: 'diabetes',
  'High blood pressure': 'htn',
  'Thyroid condition': 'thyroid',
  'Osteoporosis / osteopenia': 'osteoporosis/osteopenia',
  'Rheumatoid arthritis': 'rheumatoid arthritis',
  'Cardiac condition': 'cardiac issues',
  'Neurological condition': 'neurological issues',
  'Recent surgery / injury': 'injury',
}

/**
 * Build medical_history array from hs_1 response.
 * Maps pre-assessment labels to standard API values.
 * Unmapped items become "others".
 */
function buildMedicalHistory(responses) {
  const hs1 = responses.find((r) => r.id === 'hs_1')
  if (!hs1) return ['none']
  const selected = hs1.answer.split(', ').map((a) => a.trim())
  const mapped = selected.map((item) => MEDICAL_HISTORY_MAP[item] || 'others')
  return [...new Set(mapped)]
}

/**
 * Build present_past_illness from gi_2 response.
 */
function buildPresentPastIllness(responses) {
  const gi2 = responses.find((r) => r.id === 'gi_2')
  if (!gi2 || !gi2.answer.trim()) return 'NA'
  // Remove "Other:" prefix if it exists
  return gi2.answer.replace(/^Other:\s*/i, '').trim()
}

/**
 * Main mapper: transforms form data + assessment responses
 * into the structured API payload.
 *
 * @param {Object} formData - The form ref value (name, email, age, sex, etc.)
 * @param {Array} assessmentResponses - Array of {id, section, question, answer}
 * @returns {Object} - Structured payload matching assessment API schema
 */
export function mapAssessmentPayload(formData, assessmentResponses) {
  const gender = formData.sex ? formData.sex.charAt(0).toUpperCase() + formData.sex.slice(1) : ''

  // Extract "Other" medical history text if present
  const hs1 = assessmentResponses.find((r) => r.id === 'hs_1')
  let medicalHistoryOther = ''
  if (hs1) {
    const otherItem = hs1.answer
      .split(', ')
      .map((a) => a.trim())
      .find((a) => a.startsWith('Other:'))
    if (otherItem) {
      medicalHistoryOther = otherItem.replace('Other:', '').trim()
    }
  }

  // Extract "Other" patient expectations if present
  const gi1 = assessmentResponses.find((r) => r.id === 'gi_1')
  let patientExpectationsOther = ''
  if (gi1) {
    const selected = gi1.answer.split(', ').map((a) => a.trim())
    const others = selected.filter(
      (item) => item === 'Get a personalised exercise plan' || item === 'Prevent future issues',
    )
    if (others.length > 0) {
      patientExpectationsOther = others.join(', ')
    }
  }

  return {
    age: parseInt(formData.age, 10) || 0,
    gender,
    occupations: buildOccupations(assessmentResponses),
    activities: [],
    prescription: {},
    chief_complaint: buildChiefComplaint(assessmentResponses),
    questions: buildQuestionsArray(assessmentResponses, formData.sex),
    patient_expectations: buildExpectations(assessmentResponses),
    patient_expectations_other: patientExpectationsOther,
    medical_history: buildMedicalHistory(assessmentResponses),
    medical_history_other: medicalHistoryOther,
    present_past_illness: buildPresentPastIllness(assessmentResponses),
    surgical_history: 'NA',
    personal_family_history: 'NA',
    current_medications: [],
    red_flags: ['None'],
    pain_assessment: buildPainAssessment(assessmentResponses),
  }
}
