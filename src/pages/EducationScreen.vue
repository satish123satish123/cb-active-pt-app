<template>
  <section class="screen">
    <ScreenHeader title="Do's & Don'ts" sub="Simple care guidance for better recovery" />

    <!-- Do's -->
    <div class="section">
      <div class="card">
        <div class="title-row">
          <div>
            <div class="title">Care guidance</div>
            <div class="muted">
              These recommendations help you recover better between clinic visits. Keep them simple
              and consistent
            </div>
          </div>
        </div>
        <div class="list">
          <div
            v-for="item in careGuidance"
            :key="item.label"
            class="todo-item"
            style="padding: 12px"
          >
            <div class="todo-left">
              <div class="todo-icon" style="background: #e6f7ed; color: var(--success)">✓</div>
              <div>
                <div class="todo-label">{{ item.label }}</div>
                <div class="todo-sub">{{ item.sub }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Do's -->
    <div class="section">
      <div class="card">
        <div class="title-row">
          <div>
            <div class="title">Do's</div>
            <div class="muted">Helpful actions for your shoulder recovery</div>
          </div>
          <span class="badge success">Recommended</span>
        </div>
        <div class="list">
          <div v-for="item in dos" :key="item.label" class="todo-item" style="padding: 12px">
            <div class="todo-left">
              <div class="todo-icon" style="background: #e6f7ed; color: var(--success)">✓</div>
              <div>
                <div class="todo-label">{{ item.label }}</div>
                <div class="todo-sub">{{ item.sub }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Don'ts -->
    <div class="section">
      <div class="card soft">
        <div class="title-row">
          <div>
            <div class="title">Don'ts</div>
            <div class="muted">Things that may delay recovery</div>
          </div>
          <span class="badge danger">Avoid</span>
        </div>
        <div class="list">
          <div v-for="item in donts" :key="item.label" class="todo-item" style="padding: 12px">
            <div class="todo-left">
              <div class="todo-icon" style="background: #fde8ec; color: var(--danger)">!</div>
              <div>
                <div class="todo-label">{{ item.label }}</div>
                <div class="todo-sub">{{ item.sub }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- When to contact -->
    <div class="section">
      <div class="card">
        <div class="title">When to contact the clinic</div>
        <div class="list" style="margin-top: 12px">
          <div class="list-item">
            <strong>Pain becomes sharply worse</strong>
            <div class="muted" style="margin-top: 6px">
              If discomfort changes suddenly or spreads significantly.
            </div>
          </div>
          <div class="list-item">
            <strong>You cannot perform assigned movements</strong>
            <div class="muted" style="margin-top: 6px">
              If usual exercises feel much harder than before.
            </div>
          </div>
          <div class="list-item">
            <strong>You miss more than 2 days of exercises</strong>
            <div class="muted" style="margin-top: 6px">
              Your therapist may need to adjust the plan.
            </div>
          </div>
        </div>
        <div style="margin-top: 14px">
          <button class="btn primary full" @click="$router.push('/support')">Contact Clinic</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ScreenHeader from 'src/components/ScreenHeader.vue'

const careGuidance = [
  {
    label: 'Perform home exercises with control',
    sub: 'Slow, comfortable movement is better than rushing.',
  },
  {
    label: 'Maintain good sitting posture',
    sub: 'Keep shoulders relaxed, avoid prolonged slouching.',
  },
  {
    label: 'Use ice if advised by your therapist',
    sub: 'Especially after clinic sessions or exercise soreness.',
  },
]

const dos = [
  {
    label: 'Perform home exercises with control',
    sub: 'Slow, comfortable movement is better than rushing.',
  },
  {
    label: 'Maintain good sitting posture',
    sub: 'Keep shoulders relaxed, avoid prolonged slouching.',
  },
  {
    label: 'Use ice if advised by your therapist',
    sub: 'Especially after clinic sessions or exercise soreness.',
  },
]

const donts = [
  {
    label: 'Avoid lifting heavy weight overhead',
    sub: 'Especially if it increases shoulder pain.',
  },
  {
    label: 'Do not ignore sharp or sudden pain',
    sub: 'Pause exercise and contact the clinic if this happens.',
  },
  {
    label: 'Avoid skipping multiple home sessions',
    sub: 'Consistency matters more than intensity.',
  },
]
</script>
