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
    id: 'pd_2',
    text: 'On a scale of 0–10, how would you rate your main area of pain or discomfort?',
    type: 'slider',
  },
  {
    id: 'pd_3',
    text: 'How did this issue start?',
    type: 'choice',
    options: [
      'Gradually over time',
      'Suddenly one day',
      'After a specific incident or injury',
      'I am not sure',
      'Not applicable',
    ],
  },
  {
    id: 'pd_4',
    text: 'When does your discomfort usually increase the most?',
    type: 'choice',
    options: [
      'During prolonged sitting',
      'After a full workday',
      'During workouts',
      'After waking up',
      'Random / no clear trigger',
      'Not applicable',
      'Other',
    ],
  },
  {
    id: 'pd_5',
    text: 'How long have you been experiencing this discomfort?',
    type: 'choice',
    options: [
      'Less than a month',
      '1–6 months',
      'More than 6 months',
      'Not applicable',
    ],
  },
  {
    id: 'pd_6',
    text: 'How often do you feel this discomfort?',
    type: 'choice',
    options: [
      'Comes and goes',
      'Present most of the time',
      'Only after a specific activity',
      'Not applicable',
    ],
  },
  {
    id: 'pd_7',
    text: 'Does your discomfort stay in one place or travel elsewhere?',
    type: 'choice',
    options: [
      'Stays in one place',
      'Spreads to a nearby area',
      'Shoots/goes down the arm or leg',
      'Not applicable',
    ],
  },
  {
    id: 'pd_8',
    text: 'Do you experience any of the following along with your discomfort?',
    type: 'choice',
    options: [
      'No',
      'Numbness or tingling',
      'Weakness',
      'Dizziness or blackout',
      'Pain shooting down the arm or leg',
    ],
  },
]

// ─── SECTION 4: Women-Specific Health ───
export const womenHealth = [
  {
    id: 'wh_1',
    section: 'Women-Specific Health',
    text: 'Do you feel physical fatigue by the end of your workday?',
    type: 'choice',
    options: ['Rarely', 'Sometimes', 'Often', 'Almost every day'],
  },
  {
    id: 'wh_2',
    text: 'Do you feel stiffness after sitting for long hours?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'wh_3',
    text: 'Does your discomfort increase around your menstrual cycle?',
    type: 'radio',
    options: ['Yes', 'No', 'Not sure'],
  },
  {
    id: 'wh_4',
    text: 'Have you given birth?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'wh_5',
    text: 'Do you frequently wear heels? (More than 2–3 times per week)',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'wh_6',
    text: 'Do you carry a bag on one shoulder?',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    id: 'wh_7',
    text: 'What is your water intake throughout the day?',
    type: 'choice',
    options: [
      'Less than 1 litre',
      '1–1.5 litres',
      '1.5–2 litres',
      'More than 2 litres',
    ],
  },
  {
    id: 'wh_8',
    text: 'How would you rate your stress levels at work?',
    type: 'choice',
    options: ['Low', 'Moderate', 'High'],
  },
]

// ─── SECTION 5: Functional Self-Check ───
export const functionalSelfCheck = [
  {
    id: 'fc_1',
    section: 'Functional Self-Check',
    text: 'Can you raise both arms overhead without discomfort?',
    type: 'choice',
    options: ['Easily', 'With slight stiffness', 'With pain'],
  },
  {
    id: 'fc_2',
    text: 'Can you stand up from a chair without using hands?',
    type: 'choice',
    options: ['Easily', 'With some effort', 'Difficult'],
  },
  {
    id: 'fc_3',
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
    id: 'fc_4',
    text: 'Do you find yourself slouching during work?',
    type: 'choice',
    options: ['Often', 'Sometimes', 'Rarely', 'Not aware', 'Never'],
  },
  {
    id: 'fc_5',
    text: 'Do you use your phone by bending your neck forward for long periods?',
    type: 'choice',
    options: ['Frequently', 'Sometimes', 'Rarely', 'Not aware'],
  },
]

// ─── SECTION 6: Health & Safety Information ───
export const healthSafety = [
  {
    id: 'hs_1',
    section: 'Health & Safety Information',
    text: 'Do you have any health condition that your physiotherapist should know about before suggesting exercises?',
    type: 'multi',
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
      'Other — will mention to therapist',
    ],
  },
]

// ─── SECTION 7: Goals & Additional Information ───
export const goalsInfo = [
  {
    id: 'gi_1',
    section: 'Goals & Additional Information',
    text: 'What do you most want to get out of this assessment? Select all that apply.',
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
