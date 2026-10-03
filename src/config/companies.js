import {
  workingConditions,
  painDiscomfort,
  lifestyleFactors,
  healthSafety,
  goalsInfo,
  company2Questions,
} from '../data/assessmentQuestions.js'

// Add companies here, keyed by the company_id used in signed assessment links.
// Spread DEFAULT_COMPANY (or an existing company) and override the settings needed.
// Logo paths refer to public/ assets; external image URLs also work.
// Profile fields support text, tel, email, number and select, optional required,
// defaultValue, min/max, options, fullWidth, progress and includeInSummary.
// Field names must match backend-supported keys. New backend fields need API support.
const PROFILE_FIELDS = [
  {
    name: 'name',
    label: 'Full name',
    type: 'text',
    placeholder: 'e.g. Aarav Sharma',
    required: true,
    fullWidth: true,
  },
  {
    name: 'employee_id',
    label: 'Employee ID',
    type: 'text',
    placeholder: 'Enter Employee ID',
    required: true,
    fullWidth: true,
    progress: false,
  },
  {
    name: 'phone',
    label: 'Phone number',
    type: 'tel',
    placeholder: '10-digit mobile',
    required: true,
    validation: 'phone',
  },
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    placeholder: 'you@company.com',
    required: true,
    validation: 'email',
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'e.g. 32',
    min: 18,
    max: 80,
    required: true,
  },
  {
    name: 'sex',
    label: 'Gender',
    type: 'select',
    placeholder: 'Select',
    defaultValue: 'female',
    options: [
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' },
      { value: 'other', label: 'Other' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
]
const LOCATION = {
  name: 'location',
  label: 'Which location are you based in?',
  type: 'select',
  placeholder: 'Select location',
  required: true,
  fullWidth: true,
  includeInSummary: true,
  requiredMessage: 'Location is required',
  options: ['Gurgaon office (attending in person)', 'Other India location (joining via broadcast)'],
}

export const DEFAULT_COMPANY = {
  name: '',
  logo: '',
  title: 'Pre-Assessment',
  description:
    'A short self-check before your on-site physiotherapy assessment. Takes about 2 minutes.',
  profileFields: PROFILE_FIELDS,
  questions: [
    ...workingConditions,
    ...painDiscomfort,
    ...lifestyleFactors,
    ...healthSafety,
    ...goalsInfo,
  ],
  summaryQuestions: [...workingConditions, ...lifestyleFactors],
  painDurationOptions: [
    'Less than 6 weeks',
    '6 weeks to 3 months',
    'More than 3 months',
    'Not applicable',
  ],
  successMessage: 'Thank you for completing the evaluation. Please book your assessment slot.',
  successNote:
    'If you have any relevant medical reports, scans, or previous treatment records related to your concern, please carry them along for the assessment.',
  bookingUrl: 'https://calendly.com/workplace-wellness-cbphysiotherapy',
  bookingLabel: 'Book Assessment Slot',
}

export const COMPANIES = {
  1: { ...DEFAULT_COMPANY, name: 'Cars24', logo: 'cars24.webp' },
  2: {
    ...DEFAULT_COMPANY,
    name: 'DB India',
    logo: 'db_india.jpeg',
    title: 'Onboarding',
    description: 'A short self-check before your workshop. Takes about 3 minutes.',
    profileFields: [
      ...PROFILE_FIELDS.map((field) =>
        field.name === 'sex' ? { ...field, defaultValue: '' } : field,
      ),
      LOCATION,
    ],
    questions: [
      ...workingConditions,
      ...painDiscomfort,
      company2Questions.pd_trigger,
      company2Questions.pd_functional_impact,
      company2Questions.pd_water_intake,
      ...lifestyleFactors.filter((q) => q.id !== 'lf_5'),
      company2Questions.lf_sleep_quality,
      ...healthSafety,
      company2Questions.hs_treatment,
      company2Questions.gi_live_session_cover,
      company2Questions.gi_1,
      company2Questions.gi_qa_question,
      company2Questions.gi_onsite_interest,
    ],
    summaryQuestions: [
      ...workingConditions,
      company2Questions.pd_functional_impact,
      company2Questions.pd_water_intake,
      ...lifestyleFactors.filter((q) => q.id !== 'lf_5'),
      company2Questions.lf_sleep_quality,
      company2Questions.hs_treatment,
      company2Questions.gi_live_session_cover,
      company2Questions.gi_onsite_interest,
    ],
    painDurationOptions: [
      'Less than 6 weeks (Acute)',
      '6 weeks to 3 months (Subacute)',
      'More than 3 months (Chronic)',
      'Not applicable',
    ],
  },
  // '3': { ...DEFAULT_COMPANY, name: 'New company', logo: 'new-company.webp' },
}

// Unknown IDs use neutral branding, never another company's logo.
export function getCompanyConfig(companyId) {
  return Object.hasOwn(COMPANIES, String(companyId))
    ? COMPANIES[String(companyId)]
    : DEFAULT_COMPANY
}

export function getCompanyQuestions(companyId, gender, summary = false) {
  const company = getCompanyConfig(companyId)
  return (summary ? company.summaryQuestions : company.questions).filter(
    (question) => !question.femaleOnly || gender === 'female',
  )
}
