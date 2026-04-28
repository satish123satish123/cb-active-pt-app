<template>
  <q-page class="q-pa-md q-pb-xl premium-layout">
    
    <!-- Top Header -->
    <div class="row items-center q-mb-xl q-mt-sm scale-in">
      <q-btn flat round dense icon="arrow_back_ios_new" color="dark" class="action-btn q-mr-md" to="/profile" />
      <div class="text-h5 text-weight-bolder text-dark tracking-tight">Personal Info</div>
    </div>

    <!-- Avatar Picker -->
    <div class="flex flex-center q-mb-xl scale-in-delay-1 relative-position">
      <q-avatar size="100px" class="avatar-glow cursor-pointer">
        <img :src="avatarUrl" />
        <div class="edit-overlay flex flex-center">
          <q-icon name="photo_camera" color="white" size="28px" />
        </div>
      </q-avatar>
    </div>

    <!-- Form Container -->
    <div class="glass-form-card q-pa-xl scale-in-delay-2">
      <q-form @submit.prevent="saveInfo" class="q-gutter-y-lg">
        
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-caption text-weight-bold text-grey-6 q-mb-xs tracking-tight text-uppercase">First Name</div>
            <q-input v-model="form.firstName" filled class="custom-input text-weight-bolder" hide-bottom-space borderless />
          </div>
          <div class="col-6">
            <div class="text-caption text-weight-bold text-grey-6 q-mb-xs tracking-tight text-uppercase">Last Name</div>
            <q-input v-model="form.lastName" filled class="custom-input text-weight-bolder" hide-bottom-space borderless />
          </div>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-grey-6 q-mb-xs tracking-tight text-uppercase">Email Address</div>
          <q-input v-model="form.email" type="email" filled class="custom-input text-weight-bolder" hide-bottom-space borderless>
            <template v-slot:prepend><q-icon name="email" color="grey-5" size="xs" /></template>
          </q-input>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-grey-6 q-mb-xs tracking-tight text-uppercase">Phone Number</div>
          <q-input v-model="form.phone" type="tel" filled class="custom-input text-weight-bolder" hide-bottom-space borderless>
            <template v-slot:prepend><q-icon name="phone" color="grey-5" size="xs" /></template>
          </q-input>
        </div>

        <div>
          <div class="text-caption text-weight-bold text-grey-6 q-mb-xs tracking-tight text-uppercase">Date of Birth</div>
          <q-input v-model="form.dob" type="date" filled class="custom-input text-weight-bolder" hide-bottom-space borderless />
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="text-caption text-weight-bold text-grey-6 q-mb-xs tracking-tight text-uppercase">Gender</div>
            <q-select v-model="form.gender" :options="['Male', 'Female', 'Other', 'Prefer not to say']" filled class="custom-input text-weight-bolder" hide-bottom-space borderless />
          </div>
        </div>

      </q-form>
    </div>

    <!-- Save Button -->
    <div class="q-mt-xl scale-in-delay-3 flex flex-center">
      <q-btn
        unelevated
        class="save-btn full-width"
        label="Save Changes"
        size="lg"
        no-caps
        @click="saveInfo"
      />
    </div>

  </q-page>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'

const $q = useQuasar()
const authStore = useAuthStore()

const avatarUrl = computed(() => {
  const name = authStore.user?.username || 'Guest'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A7E6E&color=fff&size=200`
})

const form = reactive({
  firstName: authStore.user?.first_name || '',
  lastName: authStore.user?.last_name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  dob: '',
  gender: ''
})

const saveInfo = () => {
  $q.notify({
    type: 'positive',
    message: 'Personal info updated securely.',
    position: 'top',
    timeout: 2000
  })
}
</script>

<style scoped>
.premium-layout {
  font-family: 'Sora', sans-serif;
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
}

/* Typography */
.text-caption {
  font-family: 'DM Sans', sans-serif;
}

.tracking-tight {
  letter-spacing: -0.5px;
}

/* Animations */
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.scale-in {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.scale-in-delay-1 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}

.scale-in-delay-2 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.scale-in-delay-3 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
}

.action-btn {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.avatar-glow {
  box-shadow: 0 12px 30px rgba(10, 126, 110, 0.25);
  border: 4px solid white;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.edit-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-glow:hover .edit-overlay {
  opacity: 1;
}

/* Form Styles */
.glass-form-card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 28px;
  border: 1.5px solid rgba(10, 126, 110, 0.08);
  box-shadow: 0 10px 40px rgba(10, 126, 110, 0.05);
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(10, 126, 110, 0.04);
  border: 1.5px solid rgba(10, 126, 110, 0.06);
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field__control:before),
.custom-input :deep(.q-field__control:after) {
  display: none !important;
}

.custom-input :deep(.q-field--focused .q-field__control) {
  background: white;
  border-color: #0A7E6E;
  box-shadow: 0 4px 16px rgba(10, 126, 110, 0.15);
}

/* Save Button */
.save-btn {
  border-radius: 20px;
  background: linear-gradient(145deg, #0c9b80 0%, #0A7E6E 60%, #087a68 100%) !important;
  color: white;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 12px 28px rgba(10, 126, 110, 0.25);
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(10, 126, 110, 0.35);
}

.save-btn:active {
  transform: translateY(1px);
}
</style>
