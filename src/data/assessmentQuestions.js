// ─── SECTION 2: Working Conditions ───
export const workingConditions = [
  {
    id: 'wc_1',
    section: 'Working Conditions',
    text: 'What is your primary work pattern?',
    type: 'choice',
    options: [
      'Mostly computer-based work',
      'Meeting-heavy role',
      'Mixed (desk + movement)',
      'Other',
    ],
  },
  {
    id: 'wc_2',
    text: 'What is your usual workstation setup?',
    type: 'choice',
    options: [
      'Laptop only',
      'Laptop + external keyboard',
      'Laptop + external monitor',
      'Desktop with monitor',
      'Flexible seating (couch/bed/varied)',
    ],
  },
  {
    id: 'wc_3',
    text: 'Where is your screen positioned while working?',
    type: 'choice',
    options: [
      'At eye level',
      'Slightly below eye level',
      'Much lower (looking down)',
      'Not sure',
    ],
  },
  {
    id: 'wc_4',
    text: 'Do your feet fully touch the floor while sitting?',
    type: 'radio',
    options: ['Yes', 'No', 'Sometimes'],
  },
  {
    id: 'wc_5',
    text: 'What is your average daily screen time during work hours?',
    type: 'choice',
    options: [
      'Less than 4 hours',
      '4–6 hours',
      '6–8 hours',
      'More than 8 hours',
    ],
  },
  {
    id: 'wc_6',
    text: 'How often do you take breaks during work?',
    type: 'choice',
    options: [
      'Every 30–45 minutes',
      'Every 1–2 hours',
      'Rarely',
    ],
  },
]

// ─── SECTION 3: Pain & Discomfort ───
// pd_3 should be SKIPPED if pd_1 answer includes "No discomfort"
// Pain scale (pd_2) is generated dynamically per area in AssessmentQuestions.vue
export const painDiscomfort = [
  {
    id: 'pd_1',
    section: 'Pain & Discomfort',
    text: 'Do you currently experience pain or discomfort in any of the following areas?',
    type: 'multi',
    options: [
      'Neck',
      'Upper back',
      'Lower back',
      'Shoulder',
      'Forearm / Elbow',
      'Wrist / Hand',
      'Headaches',
      'Hip',
      'Knee',
      'Eye Strain / Dry Eyes',
      'No discomfort',
      'Other',
    ],
  },
  {
    id: 'pd_3',
    text: 'How long have you been experiencing this discomfort?',
    type: 'choice',
    options: [
      'Less than 6 weeks (Acute)',
      '6 weeks to 3 months (Subacute)',
      'More than 3 months (Chronic)',
      'Not applicable',
    ],
    skipIfNoDiscomfort: true,
  },
]

// ─── SECTION 4: Lifestyle & Women-Specific Factors ───
// Shown to ALL genders (heels question is women-specific by context)
export const lifestyleFactors = [
  {
    id: 'lf_1',
    section: 'Lifestyle & Women-Specific Factors',
    text: 'Do you feel physical fatigue by the end of your workday?',
    type: 'choice',
    options: ['Rarely', 'Sometimes', 'Often', 'Almost every day'],
  },
  {
    id: 'lf_2',
    text: 'Do you feel stiffness after sitting for long hours?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'lf_3',
    text: 'Do you frequently wear heels? (More than 2–3 times per week)',
    type: 'radio',
    options: ['Yes', 'No'],
    femaleOnly: true,
  },
  {
    id: 'lf_4',
    text: 'Do you carry a bag on one shoulder?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'lf_5',
    text: 'What is your water intake throughout the day?',
    type: 'choice',
    options: [
      'Less than 1 litre',
      '1-2 litres',
      'More than 2 litres',
    ],
  },
  {
    id: 'lf_6',
    text: 'How would you rate your stress levels at work?',
    type: 'choice',
    options: ['Low', 'Moderate', 'High'],
  },
  {
    id: 'lf_7',
    text: 'How often do you exercise?',
    type: 'choice',
    options: [
      '3+ times per week',
      '1–2 times per week',
      'Rarely',
      'Not at all',
    ],
  },
  {
    id: 'lf_8',
    text: 'Do you find yourself slouching during work?',
    type: 'choice',
    options: ['Often', 'Sometimes', 'Rarely', 'Not aware', 'Never'],
  },
  {
    id: 'lf_9',
    text: 'Do you use your phone by bending your neck forward for long periods?',
    type: 'choice',
    options: ['Frequently', 'Sometimes', 'Rarely', 'Not aware'],
  },
]

// ─── SECTION 5: Health & Safety Information ───
export const healthSafety = [
  {
    id: 'hs_1',
    section: 'Health & Safety Information',
    text: 'Do you have any health condition that your physiotherapist should know about before suggesting exercises?',
    type: 'multi_with_other',
    options: [
      'None',
      'Diabetes',
      'High blood pressure',
      'Thyroid condition',
      'Osteoporosis / osteopenia',
      'Rheumatoid arthritis',
      'Cardiac condition',
      'Neurological condition',
      'Recent surgery / injury',
      'Other',
    ],
    otherOption: 'Other',
  },
]

// ─── SECTION 6: Goals & Additional Information ───
export const goalsInfo = [
  {
    id: 'gi_1',
    section: 'Goals & Additional Information',
    text: 'What would you like help with through this assessment? Select all that apply.',
    type: 'multi',
    options: [
      'Understand and reduce my pain',
      'Correct my posture',
      'Improve my strength',
      'Move more freely',
      'Get a personalised exercise plan',
      'Prevent future issues',
    ],
  },
  {
    id: 'gi_2',
    text: 'Is there anything else you would like us to know about your physical comfort, posture, or work habits?',
    type: 'text',
  },
]
