<template>
  <div class="lm-app lm-shell" :class="{ 'drawer-open': drawerOpen }">
    <!-- ============ SIDEBAR (drawer below 1024px) ============ -->
    <aside id="lm-sidebar" class="lm-side" aria-label="Lead manager navigation">
      <div class="lm-brand">
        <img src="/cb_white.webp" alt="CB Physiotherapy" class="lm-logo" />
        <button
          class="lm-icon-btn lm-side-close"
          aria-label="Close menu"
          @click="drawerOpen = false"
        >
          <i class="material-icons">close</i>
        </button>
      </div>

      <nav class="lm-nav">
        <template v-for="item in NAV" :key="item.label">
          <!-- group (Communications → Queries, Exophones) -->
          <div v-if="item.children" class="lm-nav-group">
            <button
              class="lm-nav-link"
              :class="{ active: isUnder(item.base) }"
              :aria-expanded="isGroupOpen(item)"
              @click="toggleGroup(item)"
            >
              <i class="material-icons">{{ item.icon }}</i>
              <span class="lm-grow">{{ item.label }}</span>
              <i class="material-icons lm-chevron" :class="{ open: isGroupOpen(item) }">
                expand_more
              </i>
            </button>
            <div v-show="isGroupOpen(item)" class="lm-subnav">
              <router-link
                v-for="c in item.children"
                :key="c.to"
                :to="c.to"
                class="lm-subnav-link"
                :class="{ active: isUnder(c.to) }"
              >
                {{ c.label }}
              </router-link>
            </div>
          </div>

          <router-link
            v-else
            :to="item.to"
            class="lm-nav-link"
            :class="{ active: item.exact ? route.path === item.to : isUnder(item.to) }"
          >
            <i class="material-icons">{{ item.icon }}</i>
            <span>{{ item.label }}</span>
          </router-link>
        </template>
      </nav>

      <div class="lm-side-foot">
        <div class="lm-strong">CB Physiotherapy</div>
        <div>© {{ year }} All Rights Reserved</div>
      </div>
    </aside>

    <div class="lm-backdrop" aria-hidden="true" @click="drawerOpen = false"></div>

    <!-- ============ MAIN ============ -->
    <div class="lm-main">
      <header class="lm-top">
        <button
          class="lm-icon-btn lm-burger"
          aria-label="Open menu"
          aria-controls="lm-sidebar"
          :aria-expanded="drawerOpen"
          @click="drawerOpen = true"
        >
          <i class="material-icons">menu</i>
        </button>

        <h1 class="lm-top-title lm-truncate">{{ route.meta.title || 'Lead Manager' }}</h1>

        <router-link to="/lead-manager/profile" class="lm-user" aria-label="Your profile">
          <span class="lm-avatar">{{ initials(userName) }}</span>
          <span class="lm-user-text">
            <span class="lm-strong lm-truncate">{{ userName }}</span>
          </span>
        </router-link>
      </header>

      <main class="lm-content">
        <!-- phones/tablets have no sidebar, so Communications gets in-page tabs -->
        <div v-if="isUnder(COMMS_BASE)" class="lm-seg lm-comms-tabs">
          <router-link
            v-for="c in COMMS_CHILDREN"
            :key="c.to"
            :to="c.to"
            :class="{ on: isUnder(c.to) }"
          >
            {{ c.label }}
          </router-link>
        </div>

        <router-view />
      </main>
    </div>

    <!-- ============ PHONE BOTTOM NAV ============ -->
    <nav class="lm-bottom" aria-label="Quick navigation">
      <router-link
        v-for="t in BOTTOM_TABS"
        :key="t.to"
        :to="t.to"
        class="lm-bottom-tab"
        :class="{ active: t.exact ? route.path === t.to : isUnder(t.base || t.to) }"
      >
        <i class="material-icons">{{ t.icon }}</i>
        <span>{{ t.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { MANAGER, initials } from 'src/pages/lead-manager/leadManagerDemoData'

const route = useRoute()

const ROOT = '/lead-manager'
const COMMS_BASE = `${ROOT}/communications`
const COMMS_CHILDREN = [
  { to: `${COMMS_BASE}/queries`, label: 'Queries' },
  { to: `${COMMS_BASE}/exophones`, label: 'Exophones' },
]

/* Mirrors the CRM sidebar for the Lead-manager group (home/views/shared/sidebar.php). */
const NAV = [
  { to: ROOT, label: 'Dashboard', icon: 'space_dashboard', exact: true },
  { to: `${ROOT}/leads`, label: 'Leads', icon: 'person_search' },
  { to: `${ROOT}/feedback`, label: 'Patient Feedbacks', icon: 'reviews' },
  { label: 'Communications', icon: 'forum', base: COMMS_BASE, children: COMMS_CHILDREN },
  { to: `${ROOT}/profile`, label: 'Profile', icon: 'account_circle' },
]

const BOTTOM_TABS = [
  { to: ROOT, label: 'Home', icon: 'space_dashboard', exact: true },
  { to: `${ROOT}/leads`, label: 'Leads', icon: 'person_search' },
  { to: `${ROOT}/feedback`, label: 'Feedback', icon: 'reviews' },
  { to: COMMS_CHILDREN[0].to, base: COMMS_BASE, label: 'Comms', icon: 'forum' },
  { to: `${ROOT}/profile`, label: 'Me', icon: 'account_circle' },
]

const year = new Date().getFullYear()
const userName = MANAGER.name

/** Prefix match on whole path segments, so /leads never matches /leadsX. */
const isUnder = (base) => route.path === base || route.path.startsWith(base + '/')

/* ---------------- Communications group: open while inside it, togglable elsewhere ---------------- */
const manualOpen = ref(false)
const isGroupOpen = (item) => manualOpen.value || isUnder(item.base)
function toggleGroup(item) {
  manualOpen.value = !isGroupOpen(item)
}

/* ---------------- drawer ---------------- */
const drawerOpen = ref(false)
watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  },
)

function onKey(e) {
  if (e.key === 'Escape') drawerOpen.value = false
}

/* The phone apps cap #q-app at 460px; lift that only while this layout is on screen. */
onMounted(() => {
  document.documentElement.classList.add('lm-wide')
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.documentElement.classList.remove('lm-wide')
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.lm-shell {
  --side-w: 248px;
  min-height: 100vh;
}

/* ---------------- sidebar ---------------- */
.lm-side {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--side-w);
  z-index: 150;
  display: flex;
  flex-direction: column;
  background: var(--lm-surface);
  border-right: 1px solid var(--lm-line-soft);
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}
.drawer-open .lm-side {
  transform: none;
  box-shadow: 0 20px 50px rgba(16, 33, 42, 0.2);
}

.lm-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 64px;
  padding: 0 14px 0 18px;
  background: var(--lm-grad);
}
.lm-logo {
  height: 30px;
  width: auto;
  max-width: 150px;
  object-fit: contain;
}
.lm-side-close {
  color: #fff;
}
.lm-side-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

.lm-nav {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
}
.lm-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 2px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--lm-text-2);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.lm-nav-link .material-icons {
  font-size: 20px;
}
.lm-nav-link:hover {
  background: var(--lm-subtle);
  color: var(--lm-text);
}
.lm-nav-link.active {
  background: var(--lm-brand-ink);
  color: var(--lm-brand);
}
.lm-nav-link:focus-visible,
.lm-subnav-link:focus-visible,
.lm-bottom-tab:focus-visible,
.lm-user:focus-visible {
  outline: 2px solid var(--lm-brand);
  outline-offset: -2px;
}
.lm-chevron {
  transition: transform 0.15s ease;
}
.lm-chevron.open {
  transform: rotate(180deg);
}
.lm-subnav {
  padding: 2px 0 6px 44px;
}
.lm-subnav-link {
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--lm-text-2);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
}
.lm-subnav-link:hover {
  background: var(--lm-subtle);
  color: var(--lm-text);
}
.lm-subnav-link.active {
  color: var(--lm-brand);
  background: var(--lm-brand-ink);
}

.lm-side-foot {
  padding: 14px 20px 18px;
  border-top: 1px solid var(--lm-line-soft);
  font-size: 11.5px;
  color: var(--lm-text-3);
}

.lm-backdrop {
  display: none;
}
.drawer-open .lm-backdrop {
  display: block;
  position: fixed;
  inset: 0;
  z-index: 140;
  background: rgba(16, 33, 42, 0.4);
}

/* ---------------- top bar ---------------- */
.lm-main {
  min-width: 0;
}
.lm-top {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--lm-line-soft);
}
.lm-top-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.lm-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 4px 4px;
  border-radius: 12px;
  color: var(--lm-text);
  text-decoration: none;
  min-width: 0;
}
.lm-user:hover {
  background: var(--lm-subtle);
}
.lm-user-text {
  display: none;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;
  max-width: 180px;
}

/* ---------------- content ---------------- */
.lm-content {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 18px 16px 96px;
}
.lm-content .lm-comms-tabs {
  margin-bottom: 16px;
}

/* ---------------- phone bottom nav ---------------- */
.lm-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 120;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--lm-line-soft);
}
.lm-bottom-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 2px;
  border-radius: 12px;
  color: var(--lm-text-3);
  font-size: 10.5px;
  font-weight: 700;
  text-decoration: none;
}
.lm-bottom-tab .material-icons {
  font-size: 22px;
}
.lm-bottom-tab.active {
  color: var(--lm-brand);
  background: var(--lm-brand-ink);
}

/* ---------------- tablet: no bottom nav, drawer stays ---------------- */
@media (min-width: 768px) {
  .lm-bottom {
    display: none;
  }
  .lm-content {
    padding: 24px 24px 40px;
  }
  .lm-top {
    padding: 0 24px;
  }
  .lm-user-text {
    display: flex;
  }
}

/* ---------------- laptop: fixed sidebar ---------------- */
@media (min-width: 1024px) {
  .lm-side {
    transform: none;
    box-shadow: none;
  }
  .lm-side-close,
  .lm-burger,
  .lm-backdrop,
  .drawer-open .lm-backdrop,
  .lm-content .lm-comms-tabs {
    display: none;
  }
  .lm-main {
    margin-left: var(--side-w);
  }
  .lm-content {
    padding: 10px 18px 40px;
  }
  .lm-top {
    padding: 0 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lm-side,
  .lm-chevron {
    transition: none;
  }
}
</style>
