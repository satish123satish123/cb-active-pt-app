import {
  workingConditions,
  lifestyleFactors,
  company2Questions,
} from 'src/data/assessmentQuestions'

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
  'Less than 6 weeks (Acute)': 'Acute',
  '6 weeks to 3 months': 'Sub-acute',
  '6 weeks to 3 months (Subacute)': 'Sub-acute',
  'More than 3 months': 'Chronic',
  'More than 3 months (Chronic)': 'Chronic',
  'Not applicable': '',
}

// ─── Pain level description and color mapping ───
const PAIN_DESCRIPTIONS = {
  0: 'No Pain',
  1: 'Minimal Pain',
  2: 'Mild Pain',
  3: 'Mild to Moderate Pain',
  4: 'Moderate Pain',
  5: 'Moderate to Severe Pain',
  6: 'Severe Pain',
  7: 'Very Severe Pain',
  8: 'Intense Pain',
  9: 'Unbearable Pain',
  10: 'Worst Pain Possible',
}

function getPainLabelColor(level) {
  if (level === 1) return 'green-7'
  if (level === 2) return 'green-14'
  if (level === 3) return 'green'
  if (level === 4) return 'light-green-6'
  if (level === 5) return 'lime-7'
  if (level === 6) return 'yellow-7'
  if (level === 7) return 'amber-7'
  if (level === 8) return 'orange-6'
  if (level === 9) return 'deep-orange-6'
  if (level === 10) return 'deep-orange-9'
  return 'green-7'
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
function buildQuestionsArray(responses, formData, companyId) {
  const gender = formData.sex
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const questions = []

  // Collect all questions that should appear in the MCQ questions array
  let mcqSources = []
  if (String(companyId) === '2') {
    mcqSources = [
      {
        id: 'location',
        text: 'Which location are you based in?',
        options: [
          'Gurgaon office (attending in person)',
          'Other India location (joining via broadcast)',
        ],
      },
      ...workingConditions,
      company2Questions.pd_functional_impact,
      company2Questions.pd_water_intake,
      ...lifestyleFactors.filter((q) => q.id !== 'lf_5' && (!q.femaleOnly || gender === 'female')),
      company2Questions.lf_sleep_quality,
      company2Questions.hs_treatment,
      company2Questions.gi_live_session_cover,
      company2Questions.gi_onsite_interest,
    ]
  } else {
    mcqSources = [
      ...workingConditions,
      ...lifestyleFactors.filter((q) => {
        if (q.femaleOnly && gender !== 'female') return false
        return true
      }),
    ]
  }

  mcqSources.forEach((q) => {
    const options = (q.options || []).map((label, i) => ({
      key: ALPHABET[i] || String(i + 1),
      label,
    }))

    // Find the user's answer for this question
    let patientAnswer = null
    if (q.id === 'location') {
      patientAnswer = formData.location
    } else {
      const response = responses.find((r) => r.id === q.id)
      if (response) {
        patientAnswer = response.answer
      }
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
 * Build pain_assessment array from pd_1, pd_2_* (per-area), pd_3 responses.
 * Creates one entry per selected pain area with individual severity.
 */
function buildPainAssessment(responses) {
  const pd1 = responses.find((r) => r.id === 'pd_1')
  const pd3 = responses.find((r) => r.id === 'pd_3')

  if (!pd1 || pd1.answer.includes('No discomfort')) {
    return []
  }

  const pdTrigger = responses.find((r) => r.id === 'pd_trigger')
  const aggravatingFactors = pdTrigger && pdTrigger.answer
    ? pdTrigger.answer
        .split(', ')
        .map((item) => {
          const cleaned = item.trim()
          return cleaned.startsWith('Other:') ? cleaned.replace('Other:', '').trim() : cleaned
        })
        .filter((item) => item !== 'Other' && item !== '')
    : []

  const areas = pd1.answer.split(', ').map((a) => a.trim())

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

      // Find per-area duration from dynamic pd_3_<key> responses
      const pd3Area = responses.find((r) => r.id === `pd_3_${areaKey}`)
      const durationRaw = pd3Area ? pd3Area.answer : pd3 ? pd3.answer : ''
      const duration = DURATION_MAP[durationRaw] || durationRaw

      return {
        pain_site_side: PAIN_SITE_MAP[cleanArea] || cleanArea.toLowerCase().replace(/\s+/g, '_'),
        pain_severity: severity,
        pain_onset: '',
        pain_duration: duration,
        frequency: '',
        pain_nature: [],
        referral_pattern: '',
        referral_pattern_area: [],
        referred_pain_area: [],
        aggravating_factors: aggravatingFactors,
        relieving_factors: [],
        pain_label: `${severity} - ${PAIN_DESCRIPTIONS[severity] || 'Unknown Pain Level'}`,
        labelColor: getPainLabelColor(severity),
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
      const lowerClean = clean.toLowerCase()
      const needsPainSuffix = !['headache', 'dizziness', 'eye strain', 'dry eyes'].some(term => lowerClean.includes(term))
      return needsPainSuffix ? `${clean} pain` : clean
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
  const gi2 = responses.find((r) => r.id === 'gi_2' || r.id === 'gi_qa_question')
  if (!gi2 || !gi2.answer.trim()) return 'NA'
  // Remove "Other:" prefix if it exists
  return gi2.answer.replace(/^Other:\s*/i, '').trim()
}

/**
 * Build palpation_observation array.
 */
function buildPalpationObservation(responses) {
  const lf2 = responses.find((r) => r.id === 'lf_2')
  const stiffnessValue = lf2 && lf2.answer
    ? lf2.answer.charAt(0).toUpperCase() + lf2.answer.slice(1).toLowerCase()
    : null

  return [
    {
      value: null,
      label: 'swelling',
      grade: null,
      area: null,
    },
    {
      value: stiffnessValue,
      label: 'stiffness',
      area: [],
    },
    {
      value: null,
      label: 'gait',
      grade: null,
    },
    {
      value: null,
      label: 'tightness',
      area: [],
    },
    {
      value: null,
      label: 'tenderness',
      grade: [],
      area: [],
    },
    {
      value: null,
      label: 'sensation',
      grade: null,
    },
    {
      value: null,
      label: 'wound',
      area: null,
    },
    {
      value: null,
      label: 'oedema',
      grade: null,
      area: null,
    },
    {
      value: null,
      label: 'muscle_wasting',
      area: [],
    },
    {
      value: null,
      label: 'deformity',
      area: [],
    },
    {
      value: null,
      label: 'contracture',
      area: [],
    },
    {
      value: null,
      label: 'joint_tendon_sound',
    },
    {
      value: null,
      label: 'scar',
    },
    {
      value: null,
      label: 'behavior',
    },
    {
      value: null,
      label: 'speech',
    },
    {
      value: [],
      label: 'appearance',
    },
    {
      value: null,
      label: 'effusion',
      grade: [],
      area: [],
    },
    {
      value: null,
      label: 'spasm',
      grade: [],
      area: [],
    },
  ]
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
    location: formData.location || '',
    occupations: ['Corporate Employee'],
    activities: [],
    prescription: {},
    chief_complaint: buildChiefComplaint(assessmentResponses),
    questions: buildQuestionsArray(assessmentResponses, formData, formData.company_id),
    patient_expectations: buildExpectations(assessmentResponses),
    patient_expectations_other: patientExpectationsOther,
    medical_history: buildMedicalHistory(assessmentResponses),
    medical_history_other: medicalHistoryOther,
    present_past_illness: buildPresentPastIllness(assessmentResponses),
    surgical_history: 'NA',
    personal_family_history: 'NA',
    current_medications: [],
    red_flags: [],
    pain_assessment: buildPainAssessment(assessmentResponses),
    palpation_observation: buildPalpationObservation(assessmentResponses),
  }
}
