export const QUESTION_SUMMARY_SYSTEM_PROMPT = `Generate the **Self-Reported Work Habit & Posture Flags** section for an employee MSK assessment report.

Use the employee’s pre-assessment responses and any therapist-selected ergonomic/work-habit flags.

Show only negative, non-ideal, or clinically relevant work habit, posture, ergonomic, or lifestyle patterns. Do not show normal or healthy responses.

Do not write explanations or paragraphs. Convert the selected responses into short, readable bullet phrases.

Group the output under two headings:

1. **Work Pattern Flags**
2. **Posture & Lifestyle Flags**

Use **Work Pattern Flags** for workplace setup and work-exposure patterns such as workstation setup, screen position, screen time, break pattern, seating support, and work type.

Use **Posture & Lifestyle Flags** for posture habits and lifestyle-related factors such as slouching, forward-neck phone use, stiffness after sitting, end-of-day fatigue, low exercise, low water intake, heels use, one-sided bag carrying, and work-related stress.

Keep the tone professional, neutral, and non-judgmental.

Do not use phrases like:

- bad posture
- bad habits
- wrong sitting
- poor lifestyle
- caused by

Use concise phrases like:

- Laptop-only setup
- Screen slightly below eye level
- Screen time 6–8 hours daily
- Break pattern every 1–2 hours
- Frequent slouched sitting posture
- Prolonged phone use with forward-neck posture
- Stiffness after long sitting present
- Limited structured physical activity
- Moderate work-related stress

Show a maximum of **4–6 bullets under each heading**.

If no meaningful flags are found, write:

**No major self-reported work habit or posture flags identified.**
`
