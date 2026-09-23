<template>
  <div class="lm-profile-page">
    <div class="lm-page-head">
      <div>
        <h2 class="lm-page-title">Profile</h2>
        <p class="lm-page-sub">Manage your lead-manager account details</p>
      </div>
    </div>

    <div class="profile-layout">
      <section class="lm-card profile-identity">
        <img src="/lead-manager-logo.webp" alt="CB Physiotherapy" class="profile-logo" />
        <div>
          <h3>{{ form.name }}</h3>
          <p>{{ form.email }}</p>
        </div>
      </section>

      <form class="lm-card profile-form" @submit.prevent="saveProfile">
        <h3 class="form-title">Profile Update</h3>
        <label class="field">
          <span>Name *</span>
          <input v-model.trim="form.name" class="lm-input" required autocomplete="name" />
          <small class="name-help"
            >*Please use CBC for clinic and CBH for home instead of just CB and then add city
            name.</small
          >
        </label>

        <label class="field">
          <span>Password *</span>
          <input
            v-model="form.password"
            class="lm-input"
            type="password"
            placeholder="Leave blank to keep current password"
            autocomplete="new-password"
          />
        </label>

        <label class="field">
          <span>Confirm *</span>
          <input
            v-model="form.confirmPassword"
            class="lm-input"
            type="password"
            placeholder="Confirm new password"
            autocomplete="new-password"
          />
        </label>

        <label class="field">
          <span>Email *</span>
          <input
            v-model.trim="form.email"
            class="lm-input"
            type="email"
            required
            autocomplete="email"
          />
        </label>

        <p v-if="error" class="form-message error" role="alert">{{ error }}</p>
        <p v-if="saved" class="form-message success" role="status">Profile updated.</p>

        <div class="actions">
          <button class="lm-btn primary" type="submit">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { MANAGER } from './leadManagerDemoData'

const form = reactive({
  name: MANAGER.name,
  email: MANAGER.email,
  password: '',
  confirmPassword: '',
})
const error = ref('')
const saved = ref(false)

function saveProfile() {
  saved.value = false
  error.value = ''
  if (form.password !== form.confirmPassword) {
    error.value = 'Password and confirmation do not match.'
    return
  }
  saved.value = true
  form.password = ''
  form.confirmPassword = ''
}
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.5fr);
  gap: 18px;
  min-height: calc(100vh - 126px);
  align-items: stretch;
}
.profile-identity {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 32px;
  text-align: center;
}
.profile-logo {
  width: 88px;
  height: 88px;
  object-fit: contain;
}
.profile-identity h3 {
  margin: 0 0 4px;
  font-size: 20px;
}
.profile-identity p {
  margin: 0;
  color: var(--lm-text-2);
}
.profile-form {
  display: grid;
  grid-template-columns: 1fr;
  align-content: start;
  gap: 16px;
  padding: 24px;
  min-height: 100%;
}
.form-title {
  margin: 0 0 2px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--lm-line);
  color: var(--lm-brand);
  font-size: 15px;
}
.field {
  display: grid;
  grid-template-columns: minmax(130px, 0.42fr) minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  color: var(--lm-text);
  font-size: 13px;
  font-weight: 700;
}
.field > .lm-input,
.field > .name-help {
  grid-column: 2;
}
.name-help {
  color: #d92d20;
  font-size: 11px;
  font-weight: 600;
}
.form-message,
.actions {
  grid-column: 1 / -1;
}
.form-message {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
}
.form-message.error {
  color: #b42318;
  background: #fef3f2;
}
.form-message.success {
  color: #067647;
  background: #ecfdf3;
}
.actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}
@media (max-width: 680px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
  .profile-identity {
    min-height: 220px;
  }
  .profile-layout {
    min-height: auto;
  }
  .profile-form {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  .field {
    grid-template-columns: 1fr;
  }
  .field > .lm-input,
  .field > .name-help {
    grid-column: 1;
  }
}
</style>
