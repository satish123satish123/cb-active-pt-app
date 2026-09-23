<template>
  <div>
    <div class="lm-page-head">
      <div>
        <h2 class="lm-page-title">Exophones</h2>
        <p class="lm-page-sub">Exohphones</p>
      </div>
      <button class="lm-btn primary" @click="openEditor(null)">
        <i class="material-icons">add</i> Add New
      </button>
    </div>

    <div class="lm-stack">
      <!-- CRM columns: Exophones · Network id · Action -->
      <section class="lm-card flush has-table">
        <div class="lm-table-wrap">
          <table class="lm-table">
            <thead>
              <tr>
                <th>Exophone</th>
                <th>Network id</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in activeRows" :key="e.id">
                <td class="lm-td-main" data-label="Exophone">
                  <div class="lm-row">
                    <span class="lm-avatar"><i class="material-icons">dialpad</i></span>
                    <div style="min-width: 0">
                      <div class="lm-strong">{{ e.exophone }}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Network id">{{ e.networkId }}</td>
                <td data-label="Action">
                  <span class="lm-row" style="gap: 6px">
                    <button class="lm-btn sm" @click="openEditor(e)">Edit</button>
                    <button v-if="e.isActive" class="lm-btn sm danger" @click="confirmTarget = e">
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- ============ ADD / EDIT ============ -->
    <div v-if="editor" class="lm-scrim" @click.self="editor = null">
      <form
        class="lm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exo-title"
        @submit.prevent="saveExophone"
      >
        <div class="lm-sheet-head">
          <h3 id="exo-title" class="lm-sheet-title">
            {{ editor.target ? 'Update Exophone' : 'Add New' }}
          </h3>
          <button type="button" class="lm-icon-btn" aria-label="Close" @click="editor = null">
            <i class="material-icons">close</i>
          </button>
        </div>

        <div class="lm-field">
          <label class="lm-label" for="exo-phone">Phone</label>
          <input
            id="exo-phone"
            v-model="editor.phone"
            class="lm-input"
            inputmode="tel"
            autocomplete="off"
            placeholder="+91 80471 20099"
          />
          <div v-if="phoneError" class="lm-tiny" style="color: var(--lm-danger); margin-top: 6px">
            {{ phoneError }}
          </div>
        </div>
        <div class="lm-sheet-foot">
          <button type="button" class="lm-btn" @click="editor = null">Cancel</button>
          <button
            type="submit"
            class="lm-btn primary"
            :disabled="!!phoneError || !editor.phone.trim()"
          >
            {{ editor.target ? 'Update' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>

    <!-- ============ DELETE CONFIRM ============ -->
    <div v-if="confirmTarget" class="lm-scrim" @click.self="confirmTarget = null">
      <div class="lm-sheet" role="alertdialog" aria-modal="true" aria-labelledby="exo-del-title">
        <div class="lm-sheet-head">
          <h3 id="exo-del-title" class="lm-sheet-title">Delete {{ confirmTarget.exophone }}?</h3>
        </div>
        <p class="lm-muted" style="margin: 0">
          Calls to this number will stop creating leads. You can restore it later.
        </p>
        <div class="lm-sheet-foot">
          <button class="lm-btn" @click="confirmTarget = null">Cancel</button>
          <button class="lm-btn danger" @click="deleteConfirmed">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import { EXOPHONES, MANAGER } from './leadManagerDemoData'
import { useEscapeKey } from './useEscapeKey'

/* Local reactive copy: edits are visible for the session without mutating the seed. */
const rows = ref(EXOPHONES.map((e) => ({ ...e })))
const activeRows = computed(() => rows.value.filter((e) => e.isActive))

/* ---------------- add / edit ---------------- */
const editor = ref(null) // { target: row | null, phone, label }
const confirmTarget = ref(null)

useEscapeKey(() => {
  editor.value = null
  confirmTarget.value = null
})

const digitsOf = (p) => String(p || '').replace(/\D/g, '')

const phoneError = computed(() => {
  if (!editor.value) return ''
  const digits = digitsOf(editor.value.phone)
  if (!digits) return ''
  if (digits.length < 10) return 'Enter a complete phone number.'
  const taken = rows.value.some((e) => e !== editor.value.target && digitsOf(e.exophone) === digits)
  return taken ? 'This number is already on the list.' : ''
})

function openEditor(target) {
  editor.value = { target, phone: target?.exophone || '' }
}

function saveExophone() {
  if (phoneError.value || !editor.value.phone.trim()) return
  const { target, phone } = editor.value
  const clean = { exophone: phone.trim() }

  if (target) {
    Object.assign(target, clean)
  } else {
    rows.value.push({
      id: `e-new-${Date.now()}`,
      networkId: MANAGER.networkId,
      isActive: true,
      ...clean,
    })
  }
  Notify.create({ type: 'positive', message: target ? 'Exophone updated' : 'Exophone added' })
  editor.value = null
}

/* ---------------- soft delete / restore (CRM: deleteExophone, restoreExophone) ---------------- */
function setActive(e, isActive) {
  e.isActive = isActive
  Notify.create({
    type: isActive ? 'positive' : 'warning',
    message: `${e.exophone} ${isActive ? 'restored' : 'deleted'}`,
  })
}

function deleteConfirmed() {
  setActive(confirmTarget.value, false)
  confirmTarget.value = null
}
</script>

<style scoped>
.lm-avatar .material-icons {
  font-size: 18px;
}
tr.inactive td {
  color: var(--lm-text-3);
}
</style>
