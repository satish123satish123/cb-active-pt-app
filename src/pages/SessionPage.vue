<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="session-page column bg-white">
        
        <!-- Header -->
        <div class="row items-center justify-between q-pa-md shadow-1 z-top relative-position bg-white">
          <q-btn flat round dense icon="arrow_back_ios" color="dark" @click="handleBack" />
          <div class="text-subtitle1 text-weight-bolder tracking-tight" v-if="state !== 'completed'">
             EX {{ currentExerciseIndex + 1 }}/{{ exercises.length }}: {{ currentExercise.name }}
          </div>
          <div class="text-subtitle1 text-weight-bolder tracking-tight text-info" v-else>
             Session Complete
          </div>
          <q-btn flat round dense icon="more_vert" color="dark" />
        </div>

        <!-- PROGRESS BAR HEADER -->
        <q-linear-progress :value="(currentExerciseIndex) / exercises.length" color="info" size="4px" v-if="state !== 'completed'" />

        <!-- MAIN CONTENT AREA -->
        <div class="col column flex-center q-pa-md relative-position">
          
          <transition name="fade" mode="out-in">
            <!-- State: INTRO / GET READY -->
            <div v-if="state === 'ready'" key="ready" class="column flex-center text-center full-width">
              <q-icon name="accessibility_new" size="140px" color="info" class="q-mb-xl drop-shadow" />
              <div class="text-h4 text-weight-bolder text-dark tracking-tight q-mb-md">Get Ready</div>
              <div class="text-subtitle1 text-grey-7 text-weight-medium q-mb-xl">
                {{ currentExercise.name }}
              </div>
              <div class="text-h1 text-weight-bolder text-dark q-mt-lg">
                {{ countdown }}
              </div>
            </div>

            <!-- State: EXERCISING -->
            <div v-else-if="state === 'exercising'" key="exercising" class="column flex-center text-center full-width">
              <!-- Visual Guide -->
              <div class="visual-guide q-mb-xl shadow-4 rounded-borders flex flex-center bg-grey-1 relative-position overflow-hidden">
                <q-icon name="accessibility_new" size="110px" color="grey-5" />
                <div class="absolute-bottom bg-dark text-white text-caption full-width q-py-xs text-weight-medium" style="opacity: 0.85">
                  Animation Demo
                </div>
              </div>
              
              <div class="text-h5 text-weight-bolder text-dark tracking-tight q-mb-sm">
                {{ currentExercise.instruction }}
              </div>

              <!-- Reps / Circular Progress -->
              <div class="q-mt-md relative-position">
                 <q-circular-progress
                  show-value
                  class="text-info"
                  :value="(currentRep / currentExercise.reps) * 100"
                  size="220px"
                  :thickness="0.10"
                  color="info"
                  track-color="grey-2"
                 >
                   <div class="column flex-center">
                     <div class="text-caption text-weight-bold text-grey-6 text-uppercase tracking-wider">Set {{ currentSet }}</div>
                     <div class="row items-baseline q-mt-sm">
                       <span class="text-h2 text-weight-bolder text-dark" style="line-height:1">{{ currentRep }}</span>
                       <span class="text-h6 text-grey-6 text-weight-bold q-ml-xs">/ {{ currentExercise.reps }}</span>
                     </div>
                     <div class="text-caption text-weight-bold text-grey-5 q-mt-md tracking-wider">REPS</div>
                   </div>
                 </q-circular-progress>

              </div>

            </div>

            <!-- State: REST / EXERCISE COMPLETED -->
            <div v-else-if="state === 'rest'" key="rest" class="column flex-center text-center full-width">
              <div class="success-check shadow-4 q-mb-xl flex flex-center">
                <q-icon name="check" size="72px" color="white" />
              </div>
              <div class="text-h4 text-weight-bolder text-dark tracking-tight q-mb-sm">Exercise Completed</div>
              <div class="text-subtitle1 text-grey-7 text-weight-medium q-mb-xl">
                Get Ready for Next
              </div>
              
              <q-btn outline color="grey-6" rounded label="ISSUES WITH THIS EXERCISE?" no-caps class="q-mb-xl text-weight-bold" />

              <!-- Rest timer -->
              <q-circular-progress
                  show-value
                  class="text-info"
                  :value="(restCountdown / 5) * 100"
                  size="160px"
                  :thickness="0.10"
                  color="info"
                  track-color="grey-2"
                 >
                   <div class="text-h2 text-weight-bolder text-dark">{{ restCountdown }}</div>
                 </q-circular-progress>
            </div>

            <!-- State: COMPLETED -->
            <div v-else-if="state === 'completed'" key="completed" class="column flex-center text-center full-width">
              <div class="success-check shadow-4 q-mb-xl flex flex-center">
                <q-icon name="emoji_events" size="72px" color="white" />
              </div>
              <div class="text-h4 text-weight-bolder text-dark tracking-tight q-mb-sm">Session Complete!</div>
              <div class="text-subtitle1 text-grey-7 text-weight-medium q-mb-xl">
                Amazing work today.
              </div>
              <q-btn unelevated color="info" rounded size="lg" label="Back to Dashboard" no-caps class="text-weight-bold shadow-4 q-px-xl" @click="handleBack" />
            </div>
          </transition>
        </div>

        <!-- Professional Bottom Controls -->
        <div class="controls-bar row items-center justify-around q-px-md q-py-lg bg-white shadow-up-subtle relative-position" v-if="state === 'exercising' || state === 'rest'">
          <q-btn flat round color="grey-5" icon="settings" size="sm" />
          <q-btn flat round color="primary" class="bg-blue-1" icon="fast_rewind" @click="prevEx" />
          
          <!-- Overlapping Center Play/Pause Button -->
          <div class="absolute-top text-center full-width" style="top: -42px; left: 0; pointer-events: none;">
            <q-btn 
               round 
               class="center-play-glow" 
               :icon="autoPlaying ? 'pause' : 'play_arrow'" 
               size="28px"
               style="background: linear-gradient(135deg, #0ea5e9, #10b981); color: white; border: 4px solid white; pointer-events: auto;"
               @click="toggleAutoPlay"
               v-if="state === 'exercising'"
            />
          </div>
          
          <q-btn flat round color="primary" class="bg-blue-1" icon="fast_forward" @click="nextEx" />
          <q-btn flat round color="grey-5" icon="headset" size="sm" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Static JSON payload
const exercises = ref([
  { name: 'Shoulder Shrugs', instruction: 'Sit, arms by side', reps: 10, sets: 1 },
  { name: 'Row Scapular Retraction', instruction: 'Squeeze shoulder blades', reps: 8, sets: 1 },
  { name: 'Facial Eyebrows Raise', instruction: 'Raise eyebrows up', reps: 5, sets: 1 }
])

const currentExerciseIndex = ref(0)
const currentExercise = computed(() => exercises.value[currentExerciseIndex.value])

// States: 'ready', 'exercising', 'rest', 'completed'
const state = ref('ready')

const countdown = ref(3)
const restCountdown = ref(5)
const currentRep = ref(0)
const currentSet = ref(1)

const autoPlaying = ref(false)
let timer = null

const handleBack = () => {
  stopTimer()
  router.push('/')
}

const startReadyTimer = () => {
  state.value = 'ready'
  countdown.value = 3
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      startExercise()
    }
  }, 1000)
}

const startExercise = () => {
  state.value = 'exercising'
  currentRep.value = 0
  currentSet.value = 1
  autoPlaying.value = false
  toggleAutoPlay() // Auto-start timer
}

const toggleAutoPlay = () => {
  if (autoPlaying.value) {
    autoPlaying.value = false
    clearInterval(timer)
  } else {
    autoPlaying.value = true
    clearInterval(timer)
    timer = setInterval(() => {
      mockAdvanceRep()
    }, 1500) // 1.5 sec per rep animation speed
  }
}

const mockAdvanceRep = () => {
  if (state.value !== 'exercising') return
  if (currentRep.value < currentExercise.value.reps) {
    currentRep.value++
  }
  
  if (currentRep.value >= currentExercise.value.reps) {
    clearInterval(timer)
    autoPlaying.value = false
    setTimeout(() => {
       finishExercise()
    }, 800)
  }
}

const finishExercise = () => {
  if (currentExerciseIndex.value < exercises.value.length - 1) {
    startRestTimer()
  } else {
    state.value = 'completed'
  }
}

const startRestTimer = () => {
  state.value = 'rest'
  restCountdown.value = 5
  clearInterval(timer)
  timer = setInterval(() => {
    restCountdown.value--
    if (restCountdown.value <= 0) {
      clearInterval(timer)
      currentExerciseIndex.value++
      startReadyTimer()
    }
  }, 1000)
}

const nextEx = () => {
  clearInterval(timer)
  if (currentExerciseIndex.value < exercises.value.length - 1) {
    currentExerciseIndex.value++
    startReadyTimer()
  } else {
    state.value = 'completed'
  }
}

const prevEx = () => {
  clearInterval(timer)
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--
    startReadyTimer()
  }
}

const stopTimer = () => {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  startReadyTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.session-page {
  min-height: 100dvh;
}

.visual-guide {
  width: 260px;
  height: 260px;
  border: 4px solid white;
}

.success-check {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
}

.drop-shadow {
  filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1));
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.bg-white-20 {
  background: rgba(255,255,255,0.1);
}


.center-play-glow {
  box-shadow: 0px 10px 30px rgba(16, 185, 129, 0.35), inset 0 2px 6px rgba(255, 255, 255, 0.4) !important;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.center-play-glow:active {
  transform: scale(0.92);
}

.shadow-up-subtle {
  box-shadow: 0 -10px 30px rgba(0,0,0,0.04) !important;
  border-top: 1px solid rgba(0,0,0,0.02);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
