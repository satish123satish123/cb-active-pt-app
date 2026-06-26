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
    ],
  },
  {
    id: 'wc_3',
    text: 'Where is your screen positioned while working?',
    type: 'choice',
    options: ['At eye level', 'Slightly below eye level', 'Much lower (looking down)', 'Not sure'],
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
    options: ['Less than 4 hours', '4–6 hours', '6–8 hours', 'More than 8 hours'],
  },
  {
    id: 'wc_6',
    text: 'How often do you take breaks during work?',
    type: 'choice',
    options: ['Every 30–45 minutes', 'Every 1–2 hours', 'Rarely'],
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
    type: 'multi_with_other',
    otherOption: 'Other',
    options: [
      'Neck',
      'Upper back',
      'Lower back',
      'Shoulder',
      'Forearm / Elbow',
      'Wrist / Hand',
      'Headache',
      'Hip',
      'Knee',
      'Eye Strain / Dry Eyes',
      'No discomfort',
      'Other',
    ],
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
    text: 'Do you often carry a bag on one shoulder?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'lf_5',
    text: 'What is your water intake throughout the day?',
    type: 'choice',
    options: ['Less than 1 litre', '1-2 litres', 'More than 2 litres'],
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
    options: ['3+ times per week', '1–2 times per week', 'Rarely', 'Not at all'],
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
    type: 'choice',
    options: ['Yes', 'No'],
    otherOption: 'Yes',
  },
]

// ─── Company 2 Specific Questions ───
export const company2Questions = {
  pd_trigger: {
    id: 'pd_trigger',
    section: 'Pain & Discomfort',
    text: 'When does your discomfort usually increase the most? (select all that apply)',
    type: 'multi_with_other',
    otherOption: 'Other',
    options: [
      'During prolonged sitting',
      'After a full workday',
      'During workouts',
      'After waking up',
      'Random — no clear trigger',
      'Other',
    ],
    skipIfNoDiscomfort: true,
  },
  pd_functional_impact: {
    id: 'pd_functional_impact',
    text: 'Does this discomfort affect your work or daily activities?',
    type: 'choice',
    options: [
      "No, it doesn't really affect me",
      'Mildly — I notice it but manage fine',
      'Moderately — it distracts me or slows me down',
      "Significantly — I've had to modify, pause, or miss work/activities",
    ],
    skipIfNoDiscomfort: true,
  },
  pd_water_intake: {
    id: 'pd_water_intake',
    text: 'What is your water intake throughout the day?',
    type: 'choice',
    options: ['Less than 1 litre', '1–1.5 litres', '1.5–2 litres', 'More than 2 litres'],
  },
  lf_sleep_quality: {
    id: 'lf_sleep_quality',
    text: 'How would you rate your sleep quality?',
    type: 'choice',
    options: ['Good', 'Average', 'Poor'],
  },
  hs_treatment: {
    id: 'hs_treatment',
    text: 'Are you currently receiving any treatment or physiotherapy for pain or injury?',
    type: 'choice',
    options: ['No', 'Yes — ongoing', 'Yes — in the past 6 months'],
  },
  gi_live_session_cover: {
    id: 'gi_live_session_cover',
    section: 'Goals & Additional Information',
    text: 'What would you most like our physiotherapist to cover in the live session? (select all that apply)',
    type: 'multi_with_other',
    otherOption: 'Other',
    options: [
      'Correcting posture at the desk',
      'Neck & upper-back pain',
      'Lower-back pain',
      'Wrist & forearm strain (typing, mouse)',
      'Headaches & eye strain',
      'Simple desk stretches',
      'Setting up an ergonomic workstation (incl. work-from-home)',
      'Staying active in a desk-bound job',
      'Managing an existing or old injury',
      'Other',
    ],
  },
  gi_1: {
    id: 'gi_1',
    text: 'What would you like help with overall? (Select all that apply)',
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
  gi_qa_question: {
    id: 'gi_qa_question',
    text: "Is there a specific question you'd like answered during the live Q&A?",
    type: 'text',
  },
  gi_onsite_interest: {
    id: 'gi_onsite_interest',
    text: 'If CB Physiotherapy offered a personalised 1:1 physiotherapy assessment (onsite), would you be interested?',
    type: 'choice',
    options: ["Yes, I'd like that", 'Maybe — tell me more', 'No, not right now'],
  },
}
