<template>
  <div class="exercise-view">
    <!-- Welcome -->
    <div class="welcome">
      <div class="welcome-lbl">Welcome back</div>
      <div class="welcome-name">{{ patientName }}</div>
    </div>

    <!-- Program card -->
    <div class="prog-card">
      <div class="prog-deco" style="top:-50px;right:-50px;width:180px;height:180px;background:rgba(255,255,255,0.06);"></div>
      <div class="prog-deco" style="bottom:-40px;left:-20px;width:130px;height:130px;background:rgba(255,255,255,0.04);"></div>
      <div class="prog-inner">
        <div class="prog-tag">
          <span class="prog-tag-dot"></span>
          <span class="prog-tag-text">Current Program</span>
        </div>
        <div class="prog-top">
          <div>
            <div class="prog-name">{{ program.name }}</div>
            <div class="prog-days">{{ program.daysLeft }} days remaining</div>
          </div>
          <!-- Progress ring -->
          <div class="ring-wrap">
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle class="ring-bg"  cx="35" cy="35" r="28"/>
              <circle class="ring-bar" cx="35" cy="35" r="28"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"/>
            </svg>
            <div class="ring-txt">
              <span class="ring-pct">{{ program.progressPct }}%</span>
              <span class="ring-done">done</span>
            </div>
          </div>
        </div>
        <!-- Stats -->
        <div class="stats-strip">
          <div class="stat">
            <span class="stat-num">{{ program.totalExercises }}</span>
            <span class="stat-label">Exercises</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ program.session }}</span>
            <span class="stat-label">Session</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ program.mins }}</span>
            <span class="stat-label">Mins</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <button class="session-cta" @click="startSession">
      <div class="cta-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
      </div>
      <span class="cta-label">Start Today's Session</span>
    </button>

    <!-- Section header -->
    <div class="sec-row">
      <div>
        <div class="sec-title">Today's Exercises</div>
        <div class="sec-meta">{{ completedCount }} of {{ exercises.length }} completed</div>
      </div>
      <button class="see-all">
        See All
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>

    <!-- Exercise cards -->
    <div class="ex-list">
      <div v-for="ex in exercises" :key="ex.id" class="ex-wrap">
        <div class="ex-card" :class="{ done: ex.done }" @click="toggleDone(ex)">
          <div class="ex-thumb" :class="ex.done ? 'done' : 'pending'">
            <div v-if="!ex.done" class="thumb-play">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <div v-else class="thumb-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <div class="ex-info">
            <div class="ex-name" :class="{ muted: ex.done }">{{ ex.name }}</div>
            <div class="ex-meta">
              <span class="ex-reps">{{ ex.reps }} Reps · {{ ex.sets }} Set</span>
              <span class="ex-tag" :class="ex.equipment.toLowerCase()">{{ ex.equipment }}</span>
            </div>
          </div>
          <div class="ex-action">
            <div v-if="ex.done" class="done-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </div>
            <div v-else class="more-btn">
              <span class="more-dot"></span><span class="more-dot"></span><span class="more-dot"></span>
            </div>
          </div>
        </div>
        <div v-if="ex.done" class="ex-done-bar"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const patientName = computed(() => authStore.user?.username || 'Rahul Sharma')

const program = ref({
  name:           'Shoulder Rehab',
  daysLeft:       18,
  progressPct:    75,
  totalExercises: 8,
  session:        1,
  mins:           11,
})

const circumference = computed(() => 2 * Math.PI * 28)
const dashOffset    = computed(() =>
  circumference.value * (1 - program.value.progressPct / 100)
)

const exercises = ref([
  { id:1, name:'Shoulder Shrugs',        reps:10, sets:1, equipment:'CHAIR',  done:true  },
  { id:2, name:'Row Scapular Retraction', reps:10, sets:1, equipment:'CHAIR',  done:false },
  { id:3, name:'Facial Eyebrows Raise',   reps:10, sets:1, equipment:'MIRROR', done:false },
  { id:4, name:'Neck Stretches',          reps:5,  sets:2, equipment:'CHAIR',  done:false },
])

const completedCount = computed(() => exercises.value.filter(e => e.done).length)

function toggleDone(ex) { ex.done = !ex.done; }
function startSession() { 
  router.push('/session')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

.exercise-view {
  font-family: 'Sora', sans-serif;
  padding-bottom: 20px;
}

button { font-family: inherit; cursor: pointer; border: none; outline: none; }

@keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulseDot { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.35); opacity:.6; } }

/* ── Welcome ── */
.welcome {
  padding:20px 20px 0;
  animation:fadeUp .35s cubic-bezier(.25,.8,.25,1) both;
}
.welcome-lbl {
  font-size:11.5px; font-weight:600; color:#7ab5ac;
  letter-spacing:.8px; text-transform:uppercase;
  font-family:'DM Sans',sans-serif; margin-bottom:3px;
}
.welcome-name { font-size:24px; font-weight:800; color:#0d2922; letter-spacing:-.4px; }

/* ── Program card ── */
.prog-card {
  margin:16px 16px 0; border-radius:24px;
  background:linear-gradient(145deg,#0c9b80 0%,#0A7E6E 55%,#087560 100%);
  padding:22px 20px 20px; position:relative; overflow:hidden;
  box-shadow:0 10px 36px rgba(10,126,110,0.28);
  animation:fadeUp .38s .05s cubic-bezier(.25,.8,.25,1) both;
}
.prog-deco { position:absolute; border-radius:50%; pointer-events:none; }
.prog-inner { position:relative; }
.prog-tag {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(255,255,255,0.14); border-radius:20px;
  padding:4px 11px; margin-bottom:8px;
  border:1px solid rgba(255,255,255,0.2);
}
.prog-tag-dot  { width:5px; height:5px; border-radius:50%; background:#7dffd0; animation:pulseDot 2s ease infinite; }
.prog-tag-text { font-size:10px; font-weight:600; color:rgba(255,255,255,.88); letter-spacing:.6px; text-transform:uppercase; font-family:'DM Sans',sans-serif; }
.prog-top  { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; }
.prog-name { font-size:22px; font-weight:800; color:white; letter-spacing:-.4px; line-height:1.2; }
.prog-days { font-size:12px; color:rgba(255,255,255,.65); font-family:'DM Sans',sans-serif; margin-top:4px; }

/* Ring */
.ring-wrap     { position:relative; width:70px; height:70px; flex-shrink:0; }
.ring-wrap svg { transform:rotate(-90deg); }
.ring-bg  { fill:none; stroke:rgba(255,255,255,.15); stroke-width:5; }
.ring-bar { fill:none; stroke:white; stroke-width:5; stroke-linecap:round; transition:stroke-dashoffset 1.2s ease; }
.ring-txt  {
  position:absolute; inset:0;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.ring-pct  { font-size:16px; font-weight:800; color:white; line-height:1; }
.ring-done { font-size:8.5px; font-weight:600; color:rgba(255,255,255,.65); letter-spacing:.4px; text-transform:uppercase; font-family:'DM Sans',sans-serif; }

/* Stats strip */
.stats-strip {
  display:flex; background:rgba(255,255,255,0.12);
  border:1px solid rgba(255,255,255,0.18); border-radius:16px; overflow:hidden;
}
.stat { flex:1; padding:12px 8px; display:flex; flex-direction:column; align-items:center; gap:3px; position:relative; }
.stat + .stat::before { content:''; position:absolute; left:0; top:20%; height:60%; width:1px; background:rgba(255,255,255,.18); }
.stat-num   { font-size:20px; font-weight:800; color:white; line-height:1; }
.stat-label { font-size:9.5px; font-weight:600; color:rgba(255,255,255,.6); letter-spacing:.5px; text-transform:uppercase; font-family:'DM Sans',sans-serif; }

/* ── Session CTA ── */
.session-cta {
  margin:16px 16px 0; height:58px; border-radius:18px; background:#0d2922;
  display:flex; align-items:center; justify-content:center; gap:14px;
  box-shadow:0 6px 24px rgba(13,41,34,0.25);
  transition:transform .15s ease, box-shadow .15s ease;
  animation:fadeUp .4s .1s cubic-bezier(.25,.8,.25,1) both;
  width:calc(100% - 32px);
}
.session-cta:active { transform:scale(0.97); }
.cta-icon {
  width:34px; height:34px; border-radius:10px;
  background:linear-gradient(145deg,#0c9b80,#0A7E6E);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 3px 10px rgba(10,126,110,0.4); flex-shrink:0;
}
.cta-label { font-size:15.5px; font-weight:700; color:white; }

/* ── Section header ── */
.sec-row {
  padding:22px 20px 12px;
  display:flex; align-items:center; justify-content:space-between;
  animation:fadeUp .4s .12s cubic-bezier(.25,.8,.25,1) both;
}
.sec-title  { font-size:17px; font-weight:700; color:#0d2922; letter-spacing:-.2px; }
.sec-meta   { font-size:12px; color:#8ab5ae; font-family:'DM Sans',sans-serif; margin-top:2px; }
.see-all    { font-size:13px; font-weight:600; color:#0A7E6E; font-family:'DM Sans',sans-serif; background:none; display:flex; align-items:center; gap:4px; }

/* ── Exercise list ── */
.ex-list { padding:0 16px; display:flex; flex-direction:column; gap:10px; }

.ex-wrap:nth-child(1) { animation:fadeUp .4s .15s cubic-bezier(.25,.8,.25,1) both; }
.ex-wrap:nth-child(2) { animation:fadeUp .4s .22s cubic-bezier(.25,.8,.25,1) both; }
.ex-wrap:nth-child(3) { animation:fadeUp .4s .29s cubic-bezier(.25,.8,.25,1) both; }
.ex-wrap:nth-child(4) { animation:fadeUp .4s .36s cubic-bezier(.25,.8,.25,1) both; }
.ex-wrap:nth-child(5) { animation:fadeUp .4s .43s cubic-bezier(.25,.8,.25,1) both; }

/* ── Exercise card ── */
.ex-card {
  background:rgba(255,255,255,0.88);
  border:1.5px solid rgba(0,0,0,0.055); border-radius:18px;
  display:flex; align-items:center; gap:14px;
  padding:13px 14px 13px 13px;
  box-shadow:0 2px 10px rgba(10,126,110,0.06);
  transition:transform .15s ease; cursor:pointer;
}
.ex-card:active { transform:scale(.98); }
.ex-card.done  { background:rgba(10,126,110,0.04); border-color:rgba(10,126,110,0.18); }
.ex-done-bar   { height:3px; margin-top:-1px; border-radius:0 0 18px 18px; background:linear-gradient(90deg,#0c9b80,#3dba8a); }

.ex-thumb {
  width:52px; height:52px; border-radius:14px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
}
.ex-thumb.pending { background:rgba(10,126,110,0.08); }
.ex-thumb.done    { background:rgba(10,126,110,0.1); }
.thumb-play {
  width:28px; height:28px; border-radius:8px;
  background:linear-gradient(145deg,#0c9b80,#0A7E6E);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 3px 10px rgba(10,126,110,0.35);
}
.thumb-check {
  width:28px; height:28px; border-radius:8px;
  background:rgba(10,126,110,0.18);
  display:flex; align-items:center; justify-content:center;
}

.ex-info   { flex:1; min-width:0; }
.ex-name   { font-size:14.5px; font-weight:700; color:#0d2922; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ex-name.muted { color:#6a9e96; }
.ex-meta   { display:flex; align-items:center; gap:8px; margin-top:4px; }
.ex-reps   { font-size:12px; color:#8ab5ae; font-family:'DM Sans',sans-serif; font-weight:500; }
.ex-tag    { font-size:10px; font-weight:700; letter-spacing:.4px; padding:2px 8px; border-radius:20px; font-family:'DM Sans',sans-serif; text-transform: uppercase; }
.ex-tag.chair  { background:rgba(10,126,110,0.1);  color:#0A7E6E; }
.ex-tag.mirror { background:rgba(13,122,156,0.1);  color:#0d7a9c; }
.ex-tag.mat    { background:rgba(120,80,180,0.1);  color:#7850b4; }
.ex-tag.wall   { background:rgba(200,120,30,0.1);  color:#c87820; }

.ex-action { flex-shrink:0; }
.done-badge {
  display:flex; align-items:center; gap:5px;
  background:linear-gradient(135deg,#0c9b80,#0A7E6E);
  color:white; font-size:12px; font-weight:600;
  font-family:'DM Sans',sans-serif;
  padding:7px 14px; border-radius:20px;
  box-shadow:0 3px 10px rgba(10,126,110,0.28);
}
.more-btn  { width:32px; height:32px; border-radius:9px; background:rgba(10,126,110,0.06); display:flex; align-items:center; justify-content:center; flex-direction:column; gap:3px; }
.more-dot  { width:3.5px; height:3.5px; border-radius:50%; background:#9bb8b3; }
</style>
