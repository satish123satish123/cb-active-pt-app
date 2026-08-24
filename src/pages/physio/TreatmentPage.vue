<template>
  <div class="ph-page">
    <div class="ph-screen" style="padding-bottom: 120px">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" @click="$router.push('/physio')">←</button>
        <div class="grow">
          <h2 class="font-sora">Treatment room</h2>
          <div class="muted" style="font-size: 12.5px">{{ p.name }} · {{ p.condition }}</div>
        </div>
      </div>

      <PhysioStepper v-if="!isLive" :step="1" />

      <div v-if="!isLive" class="section" style="margin-top: 8px">
        <p class="muted" style="margin: 0 2px">
          Record what you did, confirm the home exercises, then continue to billing.
        </p>
      </div>

      <!-- ============ LIVE: SESSION CONTEXT ============ -->
      <template v-if="isLive">
        <div v-if="ctx" class="section" style="margin-top: 8px">
          <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
            <div class="between">
              <strong style="font-size: 13px">🎯 Session {{ ctx.session_number || '—' }} milestones</strong>
            </div>
            <div class="muted" style="margin-top: 6px">{{ ctx.milestones || 'No milestones set for this range.' }}</div>
          </div>
          <div v-if="ctx.contraindications" class="card" style="background: #fff4dd; border-color: #ffe6b0; margin-top: 10px">
            <strong style="font-size: 13px">⚠️ Contraindications</strong>
            <div class="muted" style="margin-top: 4px">{{ ctx.contraindications }}</div>
          </div>
        </div>

        <!-- LIVE: MODALITIES -->
        <div class="section">
          <div class="section-title">
            <h3 class="font-sora">Treatment given</h3>
            <span v-if="!hasAssessmentSession" class="link" @click="showPicker = true">+ Add modality</span>
          </div>
          <p class="tiny" style="margin: -2px 2px 8px">
            Start a modality when you begin it, End when you take it off. Timers are saved to the CRM.
          </p>
          <div class="card">
            <template v-if="liveLog.length || planned.length">
              <template v-for="m in liveLog" :key="m.modality_id">
                <!-- assessment marked done by the assessment app -->
                <div v-if="isAssessName(m) && m.assessDone" class="pick" style="margin-bottom: 8px; background: #f1faf7">
                  <div class="check on">✓</div>
                  <div class="grow">
                    <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                    <div class="tiny">
                      Done<template v-if="m.end_at_iso"> · {{ liveDurLabel(m) }}</template>
                      <template v-else-if="m.start_at_iso"> · started {{ hm(m.start_at_iso) }}</template>
                    </div>
                  </div>
                </div>
                <!-- running -->
                <div v-else-if="!m.end_at_iso" class="pick on" style="margin-bottom: 8px; border-color: var(--brand-2)">
                  <span class="ph-dot" style="background: var(--brand); box-shadow: 0 0 0 4px rgba(10, 126, 110, 0.18)"></span>
                  <div class="grow">
                    <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                    <div class="tiny" style="color: var(--brand)">Running · {{ elapsedLive(m) }}</div>
                  </div>
                  <button
                    v-if="isAssessName(m)"
                    class="btn primary small"
                    :disabled="liveBusyId === m.modality_id"
                    @click="liveResume(m)"
                  >
                    {{ liveBusyId === m.modality_id ? '…' : assessShowResume ? 'Resume' : 'Start' }}
                  </button>
                  <button v-else class="btn secondary small" :disabled="liveBusyId === m.modality_id" @click="liveEnd(m)">
                    {{ liveBusyId === m.modality_id ? '…' : 'End' }}
                  </button>
                </div>
                <!-- ended -->
                <div v-else class="pick" style="margin-bottom: 8px; background: #f1faf7">
                  <div class="check on">✓</div>
                  <div class="grow">
                    <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                    <div class="tiny">Done · {{ liveDurLabel(m) }}</div>
                  </div>
                </div>
              </template>
              <!-- planned (attached but not started) -->
              <div
                v-for="pl in planned"
                :key="'pl-' + pl.id"
                class="pick"
                style="margin-bottom: 8px"
                @click="liveStart(pl)"
              >
                <div class="check"><span style="color: var(--text-3)">▶</span></div>
                <div class="grow">
                  <div style="font-weight: 700; font-size: 14px">{{ pl.name }}</div>
                  <div class="tiny">From treatment plan · tap to start</div>
                </div>
                <button v-if="pl.isAssess" class="btn primary small" :disabled="liveBusyId === pl.id">
                  {{ liveBusyId === pl.id ? '…' : assessShowResume ? 'Resume' : 'Start' }}
                </button>
                <span v-else-if="liveBusyId === pl.id" class="tiny">Starting…</span>
              </div>
            </template>
            <div v-else class="tiny" style="text-align: center; padding: 10px 0">
              No modality started yet — tap “+ Add modality” to begin.
            </div>
          </div>
        </div>
      </template>

      <!-- ============ PATIENT APP FEEDBACK ============ -->
      <div v-if="!isLive && p.feedback" class="section" style="margin-top: 12px">
        <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
          <div class="between">
            <strong style="font-size: 13px">📲 From patient's app</strong>
            <span class="tiny">{{ p.feedback.when }}</span>
          </div>
          <div class="muted" style="margin-top: 6px">
            Reported pain <strong style="color: var(--warning)">{{ p.feedback.pain }}/10</strong> ·
            home exercises felt <strong>{{ p.feedback.difficulty }}</strong>
          </div>
          <div class="muted" style="margin-top: 4px; font-style: italic">"{{ p.feedback.note }}"</div>
        </div>
      </div>

      <!-- ============ CLINICAL TREATMENT (tap-to-time) ============ -->
      <div v-if="!isLive" class="section">
        <div class="section-title">
          <h3 class="font-sora">Clinical Treatment</h3>
          <span class="link" @click="showAddMod = true">+ Add</span>
        </div>
        <p class="tiny" style="margin: -2px 2px 8px">
          Tap a therapy when you start it, and End when you take it off. You can run more than one
          at the same time — finishing the session stops any that are still running.
        </p>
        <div class="card">
          <template v-for="m in MODALITIES" :key="m.id">
            <!-- running -->
            <div
              v-if="entryOf(m.id) && entryOf(m.id).end === null"
              class="pick on"
              style="margin-bottom: 8px; border-color: var(--brand-2)"
            >
              <span class="ph-dot" style="background: var(--brand); box-shadow: 0 0 0 4px rgba(10, 126, 110, 0.18)"></span>
              <div class="grow">
                <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                <div class="tiny" style="color: var(--brand)">Running · {{ elapsed(entryOf(m.id)) }}</div>
              </div>
              <button class="btn secondary small" @click="demoEndModality(m.id)">End</button>
            </div>
            <!-- done -->
            <div v-else-if="entryOf(m.id)" class="pick" style="margin-bottom: 8px; background: #f1faf7">
              <div class="check on">✓</div>
              <div class="grow">
                <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                <div class="tiny">Done · {{ fmtDur((entryOf(m.id).end - entryOf(m.id).start) / 1000) }}</div>
              </div>
              <button class="btn ghost small" @click="demoStartModality(m.id)">Redo</button>
            </div>
            <!-- idle -->
            <div v-else class="pick" style="margin-bottom: 8px" @click="demoStartModality(m.id)">
              <div class="check"><span style="color: var(--text-3)">▶</span></div>
              <div class="grow">
                <div style="font-weight: 700; font-size: 14px">{{ m.name }}</div>
                <div class="tiny">~{{ m.std }} min standard</div>
              </div>
              <span class="tiny" style="color: var(--text-3)">Tap to start</span>
            </div>
          </template>
        </div>
      </div>

      <!-- ============ HOME EXERCISE PROGRAM ============ -->
      <div v-if="!isLive" class="section">
        <div class="section-title">
          <h3 class="font-sora">Home exercise program</h3>
          <span class="link" @click="showExPicker = true">+ Add</span>
        </div>
        <p class="tiny" style="margin: -4px 2px 8px">
          From the treatment plan — confirm what stays for this patient. Tap to include/exclude.
        </p>

        <template v-if="p.exercises.length">
          <div
            v-for="ex in p.exercises"
            :key="ex.id"
            class="card"
            :style="confirmedSet.has(ex.id) ? '' : 'opacity:.55'"
          >
            <div class="between">
              <div class="row" style="gap: 10px">
                <button
                  class="check"
                  :class="{ on: confirmedSet.has(ex.id) }"
                  style="cursor: pointer"
                  @click="toggleConfirm(ex.id)"
                >
                  {{ confirmedSet.has(ex.id) ? '✓' : '' }}
                </button>
                <div>
                  <div style="font-weight: 800">{{ exDef(ex.id).name }}</div>
                  <div class="tiny">{{ exDef(ex.id).part }} · {{ exDef(ex.id).equip }}</div>
                </div>
              </div>
              <span v-if="confirmedSet.has(ex.id)" class="chip" style="background: var(--brand-3); color: var(--brand)">In plan</span>
              <span v-else class="chip">Excluded</span>
            </div>
            <div class="chips">
              <span class="chip">{{ exDef(ex.id).sets }} sets</span>
              <span class="chip">{{ exDef(ex.id).reps }} reps</span>
              <span v-if="exDef(ex.id).hold" class="chip">{{ exDef(ex.id).hold }}s hold</span>
              <span v-if="confirmedSet.has(ex.id)" class="chip" style="background: #eef9f5">📲 In patient's app</span>
            </div>
          </div>
        </template>
        <div v-else class="card" style="text-align: center; color: var(--text-3)">
          No exercises in the plan yet.<br />
          <span class="tiny">Add one — it syncs to the patient's ActivPT app.</span>
        </div>
      </div>

      <!-- ============ SESSION NOTE ============ -->
      <div v-if="!isLive" class="section" style="margin-top: 14px">
        <p class="field-label">Session note</p>
        <textarea
          v-model="a.note"
          class="textarea"
          placeholder="Progress, response to treatment, plan for next visit…"
        ></textarea>
      </div>
    </div>

    <!-- ============ STICKY FOOT ============ -->
    <div class="sticky-foot">
      <button v-if="isLive" class="btn primary full" :disabled="finishBusy" @click="finishLive">
        {{ finishBusy ? 'Ending session…' : 'End session →' }}
      </button>
      <button v-else class="btn primary full" @click="finishTreatment">Continue to billing →</button>
    </div>

    <!-- ============ LIVE: MODALITY PICKER SHEET ============ -->
    <div v-if="showPicker" class="scrim" @click="showPicker = false">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 10px; font-size: 19px">Add modality</h2>
        <input v-model="pickerSearch" class="input" placeholder="Search modalities…" />
        <div class="chips" style="margin: 10px 0 12px">
          <button
            v-for="c in categories"
            :key="c"
            class="chip"
            :class="{ 'chip-active': pickerCat === c }"
            @click="pickerCat = c"
          >
            {{ c === 'All' ? 'All' : c.replace(' Categories', '').replace(' Modalities', '').replace(' Techniques', '') }}
          </button>
        </div>
        <div v-if="catLoading" class="tiny" style="text-align: center; padding: 14px 0">Loading catalogue…</div>
        <template v-else>
          <div
            v-for="item in pickerItems"
            :key="item.id"
            class="pick"
            :style="isAdded(item.id) ? 'opacity:.45' : isContra(item) ? 'border-color:#ffd28a;background:#fffaf0' : ''"
            style="margin-bottom: 8px"
            @click="!isAdded(item.id) && addToPlan(item)"
          >
            <div class="check">
              <span style="color: var(--text-3)">{{ isAdded(item.id) ? '✓' : '+' }}</span>
            </div>
            <div class="grow">
              <div style="font-weight: 700; font-size: 14px">{{ item.name }}</div>
              <div class="tiny">
                {{ item.category }}<span v-if="isContra(item)" style="color: var(--warning); font-weight: 800"> · ⚠️ Contraindicated</span>
              </div>
            </div>
          </div>
          <div v-if="!pickerItems.length" class="tiny" style="text-align: center; padding: 14px 0">No match.</div>
        </template>
      </div>
    </div>

    <!-- ============ LIVE: BILLING (full-screen, prototype style) ============ -->
    <div v-if="showBilling" class="bill-screen">
      <div class="bill-inner">
        <div class="topbar">
          <button class="back" @click="billDone">←</button>
          <div class="grow">
            <h2 class="font-sora">Billing</h2>
            <div class="muted" style="font-size: 12.5px">{{ p.name }}</div>
          </div>
        </div>

        <PhysioStepper :step="2" />

        <!-- STEP 1: items -->
        <template v-if="billStep === 'items'">
          <div class="section" style="margin-top: 8px">
            <p class="muted" style="margin: 0 2px">
              Tap the treatment(s) given in this session.
              <template v-if="activePkg"> The package treatment is taken from their package automatically while sessions last.</template>
            </p>
          </div>

          <!-- Package progress card -->
          <div v-if="activePkg" class="section" style="margin-top: 6px">
            <div class="card" :style="usingPackageNow ? 'border-color:#cfeee6' : ''">
              <div class="between">
                <strong style="font-size: 14px">{{ activePkg.payment_procedure }}</strong>
                <span v-if="usingPackageNow" class="badge brand">Using 1 session</span>
                <span v-else class="badge muted">Not used today</span>
              </div>
              <div class="muted" style="margin-top: 6px">
                {{ pkgUsed }} of {{ pkgTotal }} used · <strong>{{ pkgLeft }} left</strong>
              </div>
              <div class="pkg-bar"><i :style="{ width: pkgTotal ? (pkgUsed / pkgTotal * 100) + '%' : '0%' }"></i></div>
            </div>
          </div>

          <!-- Treatment given -->
          <div class="section" style="margin-top: 12px">
            <div class="section-title"><h3 class="font-sora">Treatment given</h3></div>
            <input v-model="billSearch" class="input" placeholder="Search procedures…" style="margin-bottom: 10px" />
            <div class="card">
              <div
                v-for="t in billProcedures"
                :key="t.id"
                class="pick"
                :class="{ on: isSel(t) }"
                style="margin-bottom: 10px"
                @click="toggleSel(t)"
              >
                <div class="check" :class="{ on: isSel(t) }">
                  <template v-if="isSel(t)">✓</template><span v-else style="color: var(--text-3)">+</span>
                </div>
                <div class="grow">
                  <div style="font-weight: 700; font-size: 14px">{{ t.category }}</div>
                  <div v-if="txInPackage(t)" class="tiny" style="color: var(--brand)">
                    In package — comes from package<template v-if="txCovered(t)"> (1 session)</template>
                  </div>
                  <div v-else-if="t.description" class="tiny">{{ t.description }}</div>
                </div>
                <div class="muted" style="flex: none">
                  <span v-if="txCovered(t)" style="color: var(--brand); font-weight: 700">Included</span>
                  <span v-else>{{ inr(t.c_price) }}</span>
                </div>
              </div>
              <div v-if="!billProcedures.length" class="tiny" style="text-align: center; padding: 10px 0">No match.</div>
            </div>
          </div>

          <!-- Discount (hidden for package-covered and consultation-only bills) -->
          <div v-if="discountAllowed" class="section" style="margin-top: 12px">
            <div class="card">
              <div class="row" style="gap: 10px; align-items: center">
                <span class="field-label" style="margin: 0; flex: none">Discount ₹</span>
                <input v-model.number="billDiscount" class="input grow" type="number" min="0" placeholder="0" />
              </div>
              <p class="tiny" style="margin-top: 8px">Applies to charged items only — packages are never discounted.</p>
            </div>
          </div>

          <!-- Bill -->
          <div class="section" style="margin-top: 12px">
            <div class="section-title"><h3 class="font-sora">Bill</h3></div>
            <div class="card">
              <template v-if="billSel.length">
                <div v-for="t in billSel" :key="'inv-' + t.id" class="inv-row">
                  <span>{{ t.category }}</span>
                  <strong v-if="txCovered(t)">Included</strong>
                  <strong v-else>{{ inr(t.c_price) }}</strong>
                </div>
                <div v-if="Number(billDiscount)" class="inv-row">
                  <span style="color: var(--success)">Discount</span>
                  <strong style="color: var(--success)">− {{ inr(billDiscount) }}</strong>
                </div>
              </template>
              <div v-else class="muted" style="text-align: center; padding: 8px 0">No treatment selected yet.</div>
              <div class="inv-total">
                <span>To collect at counter</span>
                <span>{{ inr(billGrandTotal) }}</span>
              </div>
              <p v-if="billSel.length && billGrandTotal === 0" class="tiny" style="margin-top: 10px">
                Fully covered by package — nothing to collect today.
              </p>
            </div>
          </div>

          <div class="section" style="margin-top: 12px; padding-bottom: 110px">
            <div class="card" style="background: #fff4dd; border-color: #ffe6b0">
              <strong style="font-size: 13px">💳 Payment is taken at the counter</strong>
              <div class="muted" style="margin-top: 4px">You're only generating the bill — reception collects and marks it paid.</div>
            </div>
          </div>

          <div class="sticky-foot" style="display: flex; gap: 10px">
            <button class="btn ghost" style="flex: none; width: 34%" @click="billDone">Skip</button>
            <button class="btn primary grow" :disabled="billBusy || !billSel.length" @click="onGenerateBill">
              {{ billBusy ? 'Generating…' : 'Generate bill →' }}
            </button>
          </div>
        </template>

        <!-- STEP 2: collect payment -->
        <template v-else>
          <div class="section" style="margin-top: 12px; padding-bottom: 110px">
            <div class="card">
              <div class="between">
                <span class="muted">Invoice total</span>
                <strong style="font-size: 20px">{{ inr(payInfo?.gross_total) }}</strong>
              </div>
            </div>
            <p class="field-label" style="margin-top: 14px">Paid to</p>
            <div class="chips">
              <button
                v-for="opt in payToOptions"
                :key="opt.value"
                class="chip dur"
                :class="{ 'chip-active': payTo && payTo.value === opt.value }"
                style="flex: 1; justify-content: center; padding: 9px 0"
                @click="selectPayTo(opt)"
              >
                {{ opt.label }}
              </button>
            </div>
            <template v-if="payTo">
              <p class="field-label" style="margin-top: 14px">Paid via</p>
              <div v-if="payMethodsLoading" class="tiny" style="padding: 6px 2px">Loading options…</div>
              <div v-else class="chips">
                <button
                  v-for="m in payMethods"
                  :key="m.id"
                  class="chip dur"
                  :class="{ 'chip-active': paySel && paySel.id === m.id }"
                  style="flex: 0 0 auto; padding: 9px 14px"
                  @click="paySel = m"
                >
                  {{ m.paid_via }}
                </button>
                <span v-if="!payMethods.length" class="tiny">No options for {{ payTo.label }} — pick another.</span>
              </div>
            </template>
          </div>
          <div class="sticky-foot" style="display: flex; gap: 10px">
            <button
              class="btn ghost"
              style="flex: none; width: 40%"
              @click="(setApptBillingState(liveIds.appointment_id, 'invoiced'), billDoneThenFollowUp())"
            >
              Pay at counter
            </button>
            <button class="btn primary grow" :disabled="billBusy || !paySel" @click="markPaid">
              {{ billBusy ? 'Saving…' : freeInvoice ? 'Mark as settled →' : `Mark ${inr(payInfo?.gross_total)} paid` }}
            </button>
          </div>
        </template>

        <!-- OUT-OF-PACKAGE REASON POPUP -->
        <div v-if="showOopReason" class="oop-scrim" @click="showOopReason = false">
          <div class="oop-dialog" @click.stop>
            <h2 class="font-sora" style="margin: 0 0 6px; font-size: 18px">Out-of-package treatment</h2>
            <p class="muted" style="margin: 0 0 12px">
              This patient has an active package, but the selected procedure is not covered by it. Please provide a
              reason for invoicing outside the package.
            </p>
            <input v-model="oopReason" class="input" placeholder="Reason…" />
            <div class="row" style="gap: 10px; margin-top: 16px">
              <button class="btn ghost" style="flex: none; width: 34%" @click="showOopReason = false">Cancel</button>
              <button class="btn primary grow" :disabled="oopBusy || !oopReason.trim()" @click="submitOopReason">
                {{ oopBusy ? 'Saving…' : 'OK — continue' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ LIVE: NO-MODALITY REASON SHEET ============ -->
    <div v-if="showReason" class="scrim" @click="showReason = false">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">End without modality?</h2>
        <p class="muted" style="margin: 0 0 14px">{{ reasonPrompt }}</p>
        <p class="field-label">Reason</p>
        <textarea v-model="reasonText" class="textarea" placeholder="e.g. Patient assessment only, patient left early…"></textarea>
        <button class="btn primary full" style="margin-top: 16px" :disabled="finishBusy" @click="endWithReason">
          {{ finishBusy ? 'Ending…' : 'End session' }}
        </button>
      </div>
    </div>

    <!-- ============ ADD TREATMENT SHEET ============ -->
    <div v-if="showAddMod" class="scrim" @click="showAddMod = false">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Add a treatment</h2>
        <p class="muted" style="margin: 0 0 14px">Adds it to the Clinical Treatment list for everyone in this clinic.</p>
        <p class="field-label">Name</p>
        <input v-model="newModName" class="input" placeholder="e.g. Shockwave Therapy" />
        <p class="field-label" style="margin-top: 14px">Standard minutes</p>
        <input v-model.number="newModMin" class="input" type="number" min="1" />
        <button class="btn primary full" style="margin-top: 16px" @click="addModality">Add treatment</button>
      </div>
    </div>

    <!-- ============ EXERCISE PICKER SHEET ============ -->
    <div v-if="showExPicker" class="scrim" @click="showExPicker = false">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Add to home program</h2>
        <p class="muted" style="margin: 0 0 14px">Added exercises join the plan and sync to the patient's app.</p>
        <div
          v-for="e in EXERCISES"
          :key="e.id"
          class="pick"
          :class="{ on: inPlan(e.id) }"
          style="margin-bottom: 8px"
          @click="togglePlan(e.id)"
        >
          <div class="check" :class="{ on: inPlan(e.id) }">
            <template v-if="inPlan(e.id)">✓</template>
            <span v-else style="color: var(--text-3)">+</span>
          </div>
          <div class="grow">
            <div style="font-weight: 700; font-size: 14px">{{ e.name }}</div>
            <div class="tiny">{{ e.part }} · {{ e.sets }}×{{ e.reps }}{{ e.hold ? ` · ${e.hold}s` : '' }}</div>
          </div>
        </div>
        <button class="btn primary full" style="margin-top: 12px" @click="showExPicker = false">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import PhysioStepper from './PhysioStepper.vue'
import {
  getAppt, getPatient, MODALITIES, EXERCISES, exDef,
  startMod, endMod, endAllRunning, fmtElapsed, fmtDur,
} from './physioDemoData'
import {
  liveSessions, resolveDoctorId, resolveHospitalId, nowHM as apiNowHM, nowISO,
  getPhysioTodayAppointments, startAppointment,
  getPhysioDefaultModalities, getPhysioAppointmentModalities,
  startModality, endModality, getAssessmentResumeState, addModality as addModalityApi,
  endSession, saveNoModalityReasonAndEndSession, getAppointmentInvoiceDetails,
  addPayment, patientDeposit, getPaidViaByPaymentMethod, encodeWithSalt, randHex32,
  saveInvoiceReviewReason, deleteInvoiceReviewReason,
  setApptBillingState, getApptBillingOutcome,
} from './physioApi'
import { useAuthStore } from 'src/stores/authStore'
import { reactive } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

/* Live session (real appointment — numeric id) or demo appointment */
const demoAppt = getAppt(route.params.id)
const isLive = !demoAppt && /^\d+$/.test(String(route.params.id))
const a = demoAppt || reactive({ id: route.params.id, modLog: [], exConfirmed: null, note: '', status: 'in_treatment' })
const p = demoAppt
  ? getPatient(a.pid)
  : isLive
    ? reactive({ name: 'Loading…', condition: '', feedback: null, exercises: [] })
    : getPatient('p1')

/* =====================================================================
   LIVE SESSION ENGINE — real CRM APIs
===================================================================== */
const liveIds = {
  appointment_id: Number(route.params.id),
  hospital_id: Number(resolveHospitalId(authStore.user)),
}
const livePatientId = ref(null)
const liveDoctorId = Number(resolveDoctorId(authStore.user))
const PT_LINE = { Daily: 'Daily patient', InPackage: 'Package patient', NotConverted: 'New enquiry' }

/* Modalities attached to the session but not started yet (from the plan / auto-tracking) */
const planned = ref([])

/* Start vs Resume for the assessment row. The CRM checks the (version-aware)
   assessment tool for us — we only need appointment_id + hospital_id, so this
   runs on every page load/refresh, before the patient id is even known.
   Priority: is_assessment_done === 1 wins (→ Done); otherwise this flag decides. */
const assessShowResume = ref(false)
async function loadAssessmentFlag() {
  try {
    const d = await getAssessmentResumeState({ ...liveIds })
    assessShowResume.value = d?.show_resume === true
  } catch (e) {
    console.log('getAssessmentResumeState failed:', e)
    assessShowResume.value = false
  }
}

/* Open the assessment tool in THIS tab — ONLY for ASSESSMENT/REASSESSMENT rows.
   The URL must come from the CRM because only it knows the assessment version
   (v1 vs v2 host). Re-checked at click time so the URL is fresh; falls back to
   startModality's redirect_url if the resume-state call returns nothing. */
async function gotoAssessment(fallbackUrl) {
  let url = fallbackUrl
  try {
    const d = await getAssessmentResumeState({ ...liveIds })
    assessShowResume.value = d?.show_resume === true
    if (d?.resume_url) url = d.resume_url
  } catch (e) {
    console.log('getAssessmentResumeState failed:', e)
  }
  if (url) window.location.href = url
}

function localIsoFromHM(hm) {
  // "10:34" → today's local ISO with offset (matches nowISO format)
  const d = new Date()
  const [h, m] = String(hm).split(':').map(Number)
  d.setHours(h, m, 0, 0)
  const pd = (n) => String(n).padStart(2, '0')
  const off = -d.getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  return `${d.getFullYear()}-${pd(d.getMonth() + 1)}-${pd(d.getDate())}T${pd(d.getHours())}:${pd(d.getMinutes())}:00${sign}${pd(Math.floor(Math.abs(off) / 60))}:${pd(Math.abs(off) % 60)}`
}

/**
 * Parse startAppointment's response: seed the modality log (already started /
 * ended entries with server times) + planned list, and use its data as the
 * clinical context (same shape as getPhysioAppointmentModalities).
 */
function applySessionData(session) {
  const d = session?.data
  if (!d) return
  if (d.milestones || d.contraindications || d.session_number) ctx.value = d
  liveLog.splice(0)
  planned.value = []
  for (const m of d.selected_modalities || []) {
    const startIso = m.start_at_iso || (m.start_time ? localIsoFromHM(m.start_time) : null)
    const endIso = m.end_at_iso || (m.end_time ? localIsoFromHM(m.end_time) : null)
    const isAssess = /assessment/i.test(m.modality || '')
    const assessDone = Number(m.is_assessment_done) === 1 || Number(m.is_reassessment_done) === 1
    if (startIso) {
      liveLog.push({
        modality_id: m.id,
        name: m.modality,
        start_at_iso: startIso,
        end_at_iso: endIso,
        duration_ms: startIso && endIso ? new Date(endIso) - new Date(startIso) : null,
        isAssess,
        assessDone,
      })
    } else {
      planned.value.push({ id: m.id, name: m.modality, isAssess })
    }
  }
}

const catalogue = ref([]) // [{ id, name, category }]
const catLoading = ref(false)
const ctx = ref(null) // { milestones, contraindications, session_number, ... }
const liveLog = reactive([]) // [{ modality_id, name, start_at_iso, end_at_iso, duration_ms }]

/* Assessment/reassessment sessions: no extra modalities can be added */
const hasAssessmentSession = computed(() =>
  [...liveLog, ...planned.value, ...(ctx.value?.selected_modalities || [])].some((m) =>
    /assessment/i.test(m.name || m.modality || ''),
  ),
)
const liveBusyId = ref(null)
const showPicker = ref(false)
const pickerSearch = ref('')
const pickerCat = ref('All')
const showReason = ref(false)
const reasonText = ref('')

/* When must End session ask for a reason (→ saveNoModalityReasonAndEndSession)?
   1. ASSESSMENT present but is_assessment_done still 0
   2. REASSESSMENT not done AND none of the other modalities were started
   3. Normal session with nothing started at all */
const allEntries = () => [...liveLog, ...planned.value]
const isAssessName = (m) => /assessment/i.test(m.name || m.modality || '')
const isReassessName = (m) => /reassessment/i.test(m.name || m.modality || '')
const pendingPureAssess = computed(() =>
  allEntries().some((m) => isAssessName(m) && !isReassessName(m) && !m.assessDone),
)
const pendingReassess = computed(() => allEntries().some((m) => isReassessName(m) && !m.assessDone))
const startedOther = computed(() => liveLog.some((m) => !isAssessName(m)))
const needsReason = computed(
  () =>
    pendingPureAssess.value ||
    (pendingReassess.value && !startedOther.value) ||
    !liveLog.length,
)
const reasonPrompt = computed(() =>
  pendingPureAssess.value
    ? 'The assessment is not completed yet — why are you ending the session?'
    : pendingReassess.value && !startedOther.value
      ? 'The reassessment is not completed yet — why are you ending the session?'
      : 'No modality was recorded — a reason is required to end the session.',
)
const finishBusy = ref(false)

/* billing sheet after session end — endSession data + addPayment + patientDeposit */
const showBilling = ref(false)
const billStep = ref('items') // items → pay → (done routes away)
const billData = ref(null)
const billSearch = ref('')
const billSel = ref([]) // multi-select of procedure objects
const billDiscount = ref(0)
const billBusy = ref(false)
/* Open the billing step with a fresh billing payload (endSession /
   saveNoModalityReason… / getAppointmentInvoiceDetails all return the same shape). */
function applyBillData(bill) {
  billData.value = bill
  billSel.value = bill.treatment_procedures?.length === 1 ? [bill.treatment_procedures[0]] : []
  billSearch.value = ''
  billDiscount.value = 0
  billStep.value = 'items'
  pkgSel.value = (bill.package_details || [])[0] || null
  showPkgItems.value = false
  showBilling.value = true
}
const payInfo = ref(null) // addPayment response
/* ₹0 invoice — created, but nothing to collect */
const freeInvoice = computed(() => !Number(payInfo.value?.gross_total))
const payTo = ref(null) // { label: 'Clinic', value: '0' } — who received the payment
const payToOptions = computed(() => {
  const pm = payInfo.value?.makePayment?.payment_methods || { Clinic: '0', Company: '1', Physio: '2' }
  return Object.entries(pm).map(([label, value]) => ({ label, value }))
})
const payMethods = ref([]) // paid-via options for the selected payTo
const payMethodsLoading = ref(false)
const paySel = ref(null)

async function selectPayTo(opt) {
  payTo.value = opt
  paySel.value = null
  payMethods.value = []
  payMethodsLoading.value = true
  try {
    const pm = await getPaidViaByPaymentMethod({ paid_to: Number(opt.value), hospital_id: liveIds.hospital_id })
    payMethods.value = (pm?.data || []).filter((m) => m.is_active === '1')
  } catch (e) {
    console.log('getPaidViaByPaymentMethod failed:', e)
    payMethods.value = []
  } finally {
    payMethodsLoading.value = false
  }
}

const billProcedures = computed(() => {
  const items = (billData.value?.treatment_procedures || []).filter(
    (t) => t.is_active === '1' && t.is_cancellation_charges !== '1',
  )
  const q = billSearch.value.trim().toLowerCase()
  return q ? items.filter((t) => (t.category + ' ' + (t.description || '')).toLowerCase().includes(q)) : items
})
const activePkg = computed(() => (billData.value?.package_details || [])[0] || null)
const pkgTotal = computed(() => Number(activePkg.value?.quantity || activePkg.value?.total_sessions || 0))
const pkgUsed = computed(() => {
  const p = activePkg.value
  if (!p) return 0
  // used = expired + refunded (sessions already consumed); brand-new package = 0 used
  return Number(p.expired_sessions || 0) + Number(p.refunded_sessions || 0)
})
const pkgLeft = computed(() => Math.max(0, pkgTotal.value - pkgUsed.value))
const pkgHasBalance = computed(() => pkgLeft.value > 0)
/* does this procedure match the package's procedure? (fuzzy) */
function txInPackage(t) {
  const list = billData.value?.package_procedures
  if (Array.isArray(list) && list.length) {
    return list.some((n) => normName(n) === normName(t.category))
  }
  if (!activePkg.value) return false
  return normName(t.category) === normName(activePkg.value.payment_procedure) ||
    normName(t.category).includes(normName(activePkg.value.payment_procedure)) ||
    normName(activePkg.value.payment_procedure).includes(normName(t.category))
}
/* is this selected line covered by the package right now? */
function txCovered(t) {
  return isSel(t) && txInPackage(t) && pkgHasBalance.value
}
const billLineAmt = (t) => (txCovered(t) ? 0 : Number(t.c_price || 0))
const billSubtotal = computed(() => billSel.value.reduce((n, t) => n + billLineAmt(t), 0))
const billGrandTotal = computed(() =>
  Math.max(0, billSubtotal.value - (Number(billDiscount.value) || 0)),
)
const usingPackageNow = computed(() => billSel.value.some((t) => txCovered(t)))
/* No discount on: package-covered sessions, consultation-only bills (free or
   paid), or a ₹0 bill. Clear any typed value when it becomes disallowed — a
   hidden field must never keep affecting the total. */
const consultationOnly = computed(
  () => billSel.value.length > 0 && billSel.value.every((t) => /consultation/i.test(t.category || '')),
)
const discountAllowed = computed(
  () => !usingPackageNow.value && !consultationOnly.value && billSubtotal.value > 0,
)
watch(discountAllowed, (ok) => {
  if (!ok) billDiscount.value = 0
})
const inr = (v) => (Number(v) ? '₹' + Number(v).toLocaleString('en-IN') : 'Free')

/* package selection + fuzzy procedure matching */
const pkgSel = ref(null)
const showPkgItems = ref(false)
function normName(x) {
  return String(x || '').toLowerCase().replace(/sessions?/g, '').replace(/[^a-z0-9]/g, '')
}
const isSel = (t) => billSel.value.some((x) => x.id === t.id)
function toggleSel(t) {
  const i = billSel.value.findIndex((x) => x.id === t.id)
  if (i >= 0) billSel.value.splice(i, 1)
  else billSel.value.push(t)
}
const billTotal = computed(() => {
  const sum = billSel.value.reduce((n, t) => n + Number(t.c_price || 0), 0)
  return Math.max(0, sum - (Number(billDiscount.value) || 0))
})
function todayYMD() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* out-of-package review */
const reviewId = ref(null)
const showOopReason = ref(false)
const oopReason = ref('')
const oopBusy = ref(false)
const needsOopReason = computed(
  () => !!activePkg.value && billSel.value.some((t) => !txInPackage(t)),
)
function onGenerateBill() {
  if (!billSel.value.length) {
    Notify.create({ type: 'negative', message: 'Select at least one procedure' })
    return
  }
  if (needsOopReason.value && !reviewId.value) {
    oopReason.value = ''
    showOopReason.value = true
    return
  }
  createInvoice(usingPackageNow.value)
}
async function submitOopReason() {
  if (oopBusy.value || !oopReason.value.trim()) return
  oopBusy.value = true
  try {
    const res = await saveInvoiceReviewReason({
      appointment_id: liveIds.appointment_id,
      patient_id: livePatientId.value,
      doctor_id: liveDoctorId,
      hospital_id: liveIds.hospital_id,
      user_id: Number(authStore.user?.user_id || authStore.user?.id) || null,
      reason: oopReason.value.trim(),
    })
    const id = res?.inserted_id || res?.id || res?.data?.inserted_id
    if (res?.status === 'success' && id) {
      reviewId.value = Number(id)
      showOopReason.value = false
      createInvoice(usingPackageNow.value)
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not save reason' })
    }
  } catch (e) {
    console.log('saveInvoiceReviewReason failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not save reason' })
  } finally {
    oopBusy.value = false
  }
}
async function discardReview() {
  if (!reviewId.value) return
  try {
    await deleteInvoiceReviewReason({ review_id: reviewId.value, id: reviewId.value })
  } catch (e) {
    console.log('deleteInvoiceReviewReason failed:', e)
  }
  reviewId.value = null
}

function billDone() {
  discardReview()
  showBilling.value = false
  router.push('/physio')
}
/** Billing finished successfully → dashboard opens the Book follow-up step */
function billDoneThenFollowUp() {
  discardReview()
  showBilling.value = false
  router.push({ path: '/physio', query: { followup: String(liveIds.appointment_id) } })
}

/** Create the invoice — package auto-settles, otherwise moves to the payment step */
async function createInvoice(usePackage) {
  if (billBusy.value) return
  billBusy.value = true
  try {
    const categories = billSel.value
    if (!categories.length) {
      billBusy.value = false
      Notify.create({ type: 'negative', message: 'Select at least one procedure' })
      return
    }
    const payload = {
      appointment_id: liveIds.appointment_id,
      appointment_type: 'Clinic',
      patient_id: livePatientId.value,
      doctor_id: liveDoctorId,
      hospital_id: liveIds.hospital_id,
      category_id: categories.map((t) => Number(t.id)),
      quantity: categories.map(() => 1),
      discount: Number(billDiscount.value) || 0,
      remarks: 'Invoice created from ActivPT app',
      appointment_date: todayYMD(),
    }
    if (reviewId.value) payload.review_id = reviewId.value
    if (usePackage && activePkg.value?.payment_id) {
      payload.package_payment_id = Number(activePkg.value.payment_id)
    }
    const res = await addPayment(payload)
    if (res?.status === 'success') reviewId.value = null // linked server-side
    if (res?.status !== 'success') {
      if (/already\s*invoice/i.test(res?.message || '')) {
        setApptBillingState(liveIds.appointment_id, 'invoiced')
        Notify.create({ message: res.message || 'Already invoiced' })
        billDone()
        return
      }
      throw new Error(res?.message || 'Could not create invoice')
    }
    if (res.is_in_package || res.next_action === 'inpackage') {
      Notify.create({ type: 'positive', message: res.message || 'Session covered under active package.' })
      setApptBillingState(liveIds.appointment_id, 'paid')
      billDoneThenFollowUp()
      return
    }
    if (!Number(res.gross_total)) {
      /* Free invoice (₹0 consultation): it IS an invoice, so stay on the billing
         page and show the same step everyone else gets — minus paid-to/paid-via,
         since there is nothing to collect (patientDeposit also rejects ₹0). */
      Notify.create({ type: 'positive', message: 'Invoice created — free session, nothing to collect.' })
      setApptBillingState(liveIds.appointment_id, 'paid')
      payInfo.value = res
      billStep.value = 'pay'
      return
    }
    // Direct payment required → payment step (user picks paid-to, then paid-via)
    payInfo.value = res
    billStep.value = 'pay'
    payTo.value = null
    paySel.value = null
    payMethods.value = []
  } catch (e) {
    console.log('addPayment failed:', e)
    const msg = e.response?.data?.message || e.message || ''
    if (e.response?.status === 409 || /already\s*invoice/i.test(msg)) {
      setApptBillingState(liveIds.appointment_id, 'invoiced')
      Notify.create({ message: msg || 'Already invoiced' })
      billDone()
    } else {
      Notify.create({ type: 'negative', message: msg || 'Could not create invoice' })
    }
  } finally {
    billBusy.value = false
  }
}

/** Record the received payment */
async function markPaid() {
  if (billBusy.value) return
  if (!paySel.value) {
    Notify.create({ type: 'negative', message: 'Select how the patient paid' })
    return
  }
  const amount = Number(payInfo.value?.gross_total) || billTotal.value
  billBusy.value = true
  try {
    const mp = payInfo.value?.makePayment || {}
    const salt = mp.salt || ''
    const res = await patientDeposit({
      patient: encodeWithSalt(livePatientId.value, salt),
      physio: encodeWithSalt(liveDoctorId, salt),
      payment_id: payInfo.value.encoded_inserted_id || encodeWithSalt(payInfo.value.inserted_id, salt),
      success_message: mp.success_message || 'Continue Payment',
      appointmentId: mp.appointmentId || liveIds.appointment_id,
      appointment_type: mp.appointment_type || 'Clinic',
      unique_identifier: randHex32(),
      user_id: Number(authStore.user?.user_id || authStore.user?.id) || null,
      deposited_amount: amount,
      deposit_type: Number(payTo.value?.value) || 0,
      paid_via: Number(paySel.value.id),
    })
    if (res?.status === 'success') {
      Notify.create({ type: 'positive', message: res.message || 'Payment received ✓' })
      setApptBillingState(liveIds.appointment_id, 'paid')
      billDoneThenFollowUp()
    } else if (!amount) {
      settleFreeInvoice(res?.message)
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not record payment' })
    }
  } catch (e) {
    console.log('patientDeposit failed:', e)
    if (!amount) settleFreeInvoice(e.response?.data?.message)
    else Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not record payment — try again' })
  } finally {
    billBusy.value = false
  }
}

/* A ₹0 invoice has nothing to collect, so a rejected deposit must not block the
   physio — the invoice itself already exists. The CRM currently refuses ₹0
   (`empty($deposited_amount)` is true for 0); once that validation is fixed the
   deposit records normally and this fallback simply stops being reached. */
function settleFreeInvoice(serverMessage) {
  console.log('free-invoice deposit not recorded:', serverMessage || '(no message)')
  Notify.create({ type: 'positive', message: 'Free invoice — nothing to collect.' })
  setApptBillingState(liveIds.appointment_id, 'paid')
  billDoneThenFollowUp()
}

/* Ended session reopened: fetch the billing context and show the billing step.
   Already paid (or no billing data) → nothing left to do here, back to the list. */
async function openBillingForEndedSession(apt) {
  if (apt?.payment_status === 'paid' || getApptBillingOutcome(liveIds.appointment_id) === 'paid') {
    router.push('/physio')
    return
  }
  try {
    const inv = await getAppointmentInvoiceDetails({
      ...liveIds,
      doctor_id: liveDoctorId,
      patient_id: livePatientId.value,
    })
    if (inv?.status === 'success' && inv.treatment_procedures) applyBillData(inv)
    else router.push('/physio')
  } catch (e) {
    console.log('getAppointmentInvoiceDetails failed:', e)
    router.push('/physio')
  }
}

async function loadLiveData() {
  if (!isLive) return
  catLoading.value = true
  try {
    let sess = liveSessions[route.params.id]
    if (!sess) {
      /* RECOVERY: page opened/refreshed without an in-memory session.
         Rebuild it from the server: find the appointment in today's list
         (patient info), then call startAppointment — the server returns the
         already-running session (per backend design). */
      const listRes = await getPhysioTodayAppointments(liveDoctorId)
      const g = listRes?.appointments || {}
      const all = [
        ...(g.confirmed || []), ...(g.pending_confirmation || []),
        ...(g.treated || []), ...(g.other || []),
      ]
      const apt = all.find((x) => String(x.id) === String(route.params.id))
      const patient = apt
        ? { id: apt.patient_id, name: apt.patient_name, line2: PT_LINE[apt.patient_status] || apt.patient_status || '' }
        : { id: null, name: 'Patient', line2: '' }
      /* Session is already over (e.g. the page was refreshed on the billing
         step). Never re-start it — go straight to billing, or out if it's paid. */
      if (apt?.actual_session_end) {
        p.name = patient.name
        p.condition = patient.line2 || ''
        livePatientId.value = patient.id ? Number(patient.id) : null
        await openBillingForEndedSession(apt)
        return
      }
      const resp = await startAppointment({ ...liveIds, doctor_id: liveDoctorId })
      console.log('▶ startAppointment RESPONSE (copy this whole line and send it):', JSON.stringify(resp))
      if (resp?.status !== 'success') throw new Error(resp?.message || 'Could not resume session')
      sess = { patient, session: resp }
      liveSessions[route.params.id] = sess
    } else if (sess.session) {
      console.log('▶ startAppointment RESPONSE (copy this whole line and send it):', JSON.stringify(sess.session))
    }
    p.name = sess.patient.name
    p.condition = sess.patient.line2 || ''
    livePatientId.value = sess.patient.id ? Number(sess.patient.id) : null

    applySessionData(sess.session)

    const [cat, context] = await Promise.all([
      getPhysioDefaultModalities({ hospital_id: liveIds.hospital_id }),
      !ctx.value && livePatientId.value
        ? getPhysioAppointmentModalities({ ...liveIds, patient_id: livePatientId.value })
        : Promise.resolve(null),
    ])
    if (cat?.status === 'success') catalogue.value = cat.items || []
    if (context?.status === 'success' && !ctx.value) {
      ctx.value = context.data || null
      // seed the modality list from the fallback context too
      if (ctx.value?.selected_modalities && !liveLog.length && !planned.value.length) {
        applySessionData({ data: ctx.value })
      }
    }
    // Only sessions that actually carry an ASSESSMENT/REASSESSMENT need this.
    if (hasAssessmentSession.value) loadAssessmentFlag()
  } catch (e) {
    console.log('loadLiveData failed:', e)
    Notify.create({ type: 'negative', message: e.message || 'Could not load session' })
  } finally {
    catLoading.value = false
  }
}
loadLiveData()

const categories = computed(() => ['All', ...new Set(catalogue.value.map((i) => i.category))])
const pickerItems = computed(() => {
  const q = pickerSearch.value.trim().toLowerCase()
  return catalogue.value.filter(
    (i) =>
      (pickerCat.value === 'All' || i.category === pickerCat.value) &&
      (!q || i.name.toLowerCase().includes(q)),
  )
})
const inLiveLog = (id) => liveLog.some((m) => m.modality_id === id)
const isAdded = (id) => inLiveLog(id) || planned.value.some((p) => p.id === id)
/** Picker tap: attach to the session via the CRM, then show it in the list to start */
async function addToPlan(item) {
  if (liveBusyId.value) return
  liveBusyId.value = item.id
  try {
    const res = await addModalityApi({
      appointment_id: liveIds.appointment_id,
      patient_id: livePatientId.value,
      hospital_id: liveIds.hospital_id,
      modality_label: item.name,
    })
    if (res?.status !== 'success') {
      Notify.create({ type: 'negative', message: res?.message || 'Could not add modality' })
      return
    }
    const id = res.modality_id || res.id || res.inserted_id || res.data?.id
    if (id) {
      planned.value.push({ id: Number(id), name: item.name, isAssess: /assessment/i.test(item.name || '') })
    } else {
      // no id returned — resync the session list from the server
      const context = await getPhysioAppointmentModalities({ ...liveIds, patient_id: livePatientId.value })
      if (context?.status === 'success') applySessionData({ data: context.data })
    }
  } catch (e) {
    console.log('addModality failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not add — try again' })
  } finally {
    liveBusyId.value = null
  }
}

const contraList = computed(() =>
  (ctx.value?.contraindications || '').split(',').map((x) => x.trim()).filter(Boolean),
)
function isContra(item) {
  return contraList.value.some((c) => c.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(c.toLowerCase()))
}

async function liveStart(item) {
  if (liveBusyId.value) return
  liveBusyId.value = item.id
  try {
    const res = await startModality({
      ...liveIds,
      modality_id: item.id,
      patient_id: livePatientId.value,
      modality_label: item.name,
      started_at: apiNowHM(),
      start_at_iso: nowISO(),
    })
    if (res?.status === 'success') {
      const d = res.data || {}
      if (!inLiveLog(item.id)) {
        liveLog.push({
          modality_id: item.id,
          name: item.name,
          start_at_iso: d.start_at_iso || nowISO(),
          end_at_iso: null,
          duration_ms: null,
          isAssess: /assessment/i.test(item.name || ''),
          assessDone: false,
        })
      }
      planned.value = planned.value.filter((x) => x.id !== item.id)
      showPicker.value = false
      // Assessment/reassessment only: opens in THIS tab (no new tab) — the
      // treatment room recovers the running session on return.
      if (isAssessName(item)) await gotoAssessment(res.redirect_url)
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not start modality' })
    }
  } catch (e) {
    console.log('startModality failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not start — try again' })
  } finally {
    liveBusyId.value = null
  }
}

function hm(iso) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Resume an assessment — re-calls startModality and reopens the assessment app */
async function liveResume(m) {
  if (liveBusyId.value) return
  liveBusyId.value = m.modality_id
  try {
    const d = await startModality({
      ...liveIds,
      doctor_id: liveDoctorId,
      patient_id: livePatientId.value,
      modality_id: Number(m.modality_id),
      modality_label: m.name,
      started_at: apiNowHM(),
      start_at_iso: nowISO(),
    })
    if (isAssessName(m)) await gotoAssessment(d?.redirect_url)
    else if (d?.status !== 'success') Notify.create({ type: 'negative', message: d?.message || 'Could not resume' })
  } catch (e) {
    console.log('liveResume failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not resume — try again' })
  } finally {
    liveBusyId.value = null
  }
}

async function liveEnd(m) {
  if (liveBusyId.value) return
  liveBusyId.value = m.modality_id
  try {
    const res = await endModality({
      ...liveIds,
      modality_id: m.modality_id,
      patient_id: livePatientId.value,
      ended_at: apiNowHM(),
      end_at_iso: nowISO(),
    })
    if (res?.status === 'success') {
      const d = res.data || {}
      m.end_at_iso = d.end_at_iso || nowISO()
      m.duration_ms = d.duration_ms ?? null
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not end modality' })
    }
  } catch (e) {
    console.log('endModality failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not end — try again' })
  } finally {
    liveBusyId.value = null
  }
}

const elapsedLive = (m) => fmtElapsed(tick.value - new Date(m.start_at_iso).getTime())
const liveDurLabel = (m) =>
  m.duration_ms != null ? fmtDur(m.duration_ms / 1000) : fmtDur((new Date(m.end_at_iso) - new Date(m.start_at_iso)) / 1000)

async function finishLive() {
  if (finishBusy.value) return
  if (needsReason.value) {
    showReason.value = true
    return
  }
  finishBusy.value = true
  try {
    // end anything still running first
    for (const m of liveLog.filter((x) => !x.end_at_iso)) await liveEnd(m)
    const res = await endSession({ ...liveIds, doctor_id: liveDoctorId })
    if (res?.status === 'success') {
      Notify.create({
        type: 'positive',
        message: `${res.message || 'Session ended'}${res.actual_session_end ? ' · ' + res.actual_session_end : ''}`,
      })
      delete liveSessions[route.params.id]
      // Billing context — endSession response carries it; invoice API is the fallback
      let bill = res.treatment_procedures ? res : null
      if (!bill) {
        try {
          const inv = await getAppointmentInvoiceDetails({
            ...liveIds,
            doctor_id: liveDoctorId,
            patient_id: livePatientId.value,
          })
          if (inv?.status === 'success') bill = inv
        } catch (e2) {
          console.log('getAppointmentInvoiceDetails failed:', e2)
        }
      }
      if (bill) {
        applyBillData(bill)
      } else {
        router.push('/physio')
      }
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not end session' })
    }
  } catch (e) {
    console.log('endSession failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not end session — try again' })
  } finally {
    finishBusy.value = false
  }
}

async function endWithReason() {
  if (!reasonText.value.trim()) {
    Notify.create({ type: 'negative', message: 'Please enter a reason' })
    return
  }
  if (finishBusy.value) return
  finishBusy.value = true
  try {
    const res = await saveNoModalityReasonAndEndSession({
      ...liveIds,
      doctor_id: liveDoctorId,
      reason: reasonText.value.trim(),
    })
    if (res?.status === 'success') {
      Notify.create({ type: 'positive', message: res.message || 'Session ended' })
      showReason.value = false
      delete liveSessions[route.params.id]
      // this API also returns the billing context — open the billing page like a normal end
      if (res.treatment_procedures) {
        applyBillData(res)
      } else {
        router.push('/physio')
      }
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not end session' })
    }
  } catch (e) {
    console.log('saveNoModalityReasonAndEndSession failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not end session — try again' })
  } finally {
    finishBusy.value = false
  }
}

// default: whole plan confirmed
if (a.exConfirmed === null) a.exConfirmed = p.exercises.map((e) => e.id)
const confirmedSet = computed(() => new Set(a.exConfirmed))

/* ---------------- live timer tick ---------------- */
const tick = ref(Date.now())
let handle = null
onMounted(() => {
  handle = setInterval(() => (tick.value = Date.now()), 1000)
})
onUnmounted(() => clearInterval(handle))

const entryOf = (id) => a.modLog.find((m) => m.id === id)
const elapsed = (e) => fmtElapsed(tick.value - e.start)

function demoStartModality(id) {
  startMod(a, id)
}
function demoEndModality(id) {
  endMod(a, id)
}

/* ---------------- exercises ---------------- */
function toggleConfirm(id) {
  if (a.exConfirmed.includes(id)) a.exConfirmed = a.exConfirmed.filter((x) => x !== id)
  else a.exConfirmed = [...a.exConfirmed, id]
}
const inPlan = (id) => p.exercises.some((x) => x.id === id)
function togglePlan(id) {
  const i = p.exercises.findIndex((x) => x.id === id)
  if (i >= 0) {
    p.exercises.splice(i, 1)
    a.exConfirmed = a.exConfirmed.filter((x) => x !== id)
  } else {
    p.exercises.push({ id })
    a.exConfirmed = [...a.exConfirmed, id]
  }
}

/* ---------------- add custom modality ---------------- */
const showAddMod = ref(false)
const showExPicker = ref(false)
const newModName = ref('')
const newModMin = ref(10)
function addModality() {
  const name = newModName.value.trim()
  if (!name) {
    Notify.create({ type: 'negative', message: 'Enter a name' })
    return
  }
  MODALITIES.push({ id: 'cust-' + Date.now(), name, std: Math.max(1, newModMin.value || 10) })
  newModName.value = ''
  newModMin.value = 10
  showAddMod.value = false
  Notify.create({ message: 'Treatment added' })
}

/* ---------------- finish ---------------- */
function finishTreatment() {
  endAllRunning(a)
  a.status = 'done'
  router.push(`/physio/invoice/${a.id}`)
}
</script>

<style scoped>
.ph-page {
  --bg: #f4f8f8;
  --card: #ffffff;
  --text: #10212a;
  --text-2: #5a6c76;
  --text-3: #8da0aa;
  --line: #dce7ea;
  --brand: #0a7e6e;
  --brand-2: #0f9886;
  --brand-3: #d8f1eb;
  --warning: #c78810;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
  --grad: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  --grad-soft: linear-gradient(135deg, #edf9f6 0%, #e5f3f5 100%);

  background: var(--bg);
  max-width: 460px;
  margin: 0 auto;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
.ph-screen {
  min-height: 100vh;
  animation: ph-fade 0.25s ease;
}
@keyframes ph-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  position: sticky;
  top: 0;
  background: rgba(244, 248, 248, 0.92);
  backdrop-filter: blur(10px);
  z-index: 20;
}
.topbar h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.back {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section { padding: 0 16px; }
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 4px 10px;
}
.section-title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.section-title .link {
  color: var(--brand);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.row { display: flex; align-items: center; gap: 12px; }
.between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.grow { flex: 1; }
.muted { color: var(--text-2); font-size: 13px; }
.tiny { color: var(--text-3); font-size: 12px; }

.card {
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}
.card + .card { margin-top: 12px; }

.chip-active {
  background: var(--brand) !important;
  color: #fff !important;
  border-color: var(--brand) !important;
}
.chip.dur {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #f0f6f6;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.chip {
  cursor: pointer;
}

.bill-list {
  max-height: 44vh;
  overflow: auto;
  margin-top: 4px;
}

.oop-scrim {
  position: fixed;
  inset: 0;
  background: rgba(16, 33, 42, 0.45);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}
.oop-dialog {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 22px;
  padding: 18px;
  animation: ph-fade 0.2s ease;
}

/* billing full-screen */
.bill-screen {
  position: fixed;
  inset: 0;
  z-index: 45;
  background: var(--bg);
  overflow: auto;
  animation: ph-fade 0.22s ease;
}
.bill-inner {
  max-width: 460px;
  margin: 0 auto;
  min-height: 100%;
  padding-bottom: 20px;
}
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}
.badge.brand { background: var(--brand-3); color: var(--brand); }
.badge.muted { background: #eef3f4; color: var(--text-2); }
.pkg-bar {
  height: 8px;
  border-radius: 99px;
  background: #e6eeef;
  margin-top: 10px;
  overflow: hidden;
}
.pkg-bar i {
  display: block;
  height: 100%;
  background: var(--grad);
  border-radius: 99px;
}
.inv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px dashed var(--line);
}
.inv-row:last-of-type { border-bottom: none; }
.inv-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 6px;
  border-top: 2px solid var(--line);
  font-weight: 800;
  font-size: 18px;
}

/* selectable rows */
.pick {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  cursor: pointer;
  background: #fff;
  transition: 0.15s;
}
.pick.on {
  border-color: var(--brand-2);
  background: var(--grad-soft);
}
.check {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  flex: none;
  background: #fff;
}
.check.on {
  background: var(--brand);
  border-color: var(--brand);
}
.ph-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex: none;
}

.chip {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #f0f6f6;
  color: var(--text-2);
  border: 1px solid var(--line);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 14px;
  min-height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: 0.18s ease;
}
.btn:active { transform: scale(0.985); }
.btn.primary { background: var(--grad); color: #fff; box-shadow: var(--shadow-sm); }
.btn.secondary { background: var(--brand-3); color: var(--brand); }
.btn.ghost { background: transparent; color: var(--text-2); border: 1px solid var(--line); }
.btn.small { min-height: 36px; border-radius: 12px; padding: 0 12px; font-size: 13px; }
.btn.full { width: 100%; }

.field-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-2);
  margin: 0 0 6px 2px;
  letter-spacing: 0.01em;
}
.input, .textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 11px 12px;
  background: #fff;
  color: var(--text);
  outline: none;
  font-size: 15px;
  font-family: inherit;
}
.input:focus, .textarea:focus {
  border-color: var(--brand-2);
  box-shadow: 0 0 0 3px rgba(15, 152, 134, 0.12);
}
.textarea { min-height: 84px; resize: vertical; }

.sticky-foot {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 460px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--line);
  z-index: 25;
}

.scrim {
  position: fixed;
  inset: 0;
  background: rgba(16, 33, 42, 0.45);
  z-index: 40;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ph-fade 0.2s ease;
}
.sheet {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
  padding: 18px 18px calc(18px + env(safe-area-inset-bottom));
  max-height: 86vh;
  overflow: auto;
  animation: ph-slideup 0.26s ease;
}
@keyframes ph-slideup {
  from { transform: translateY(40px); opacity: 0.6; }
  to { transform: translateY(0); opacity: 1; }
}
.grabber {
  width: 40px;
  height: 5px;
  border-radius: 99px;
  background: var(--line);
  margin: 0 auto 14px;
}
</style>