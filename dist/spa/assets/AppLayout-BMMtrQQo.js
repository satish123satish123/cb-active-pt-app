<<<<<<< Updated upstream:dist/spa/assets/AppLayout-BMMtrQQo.js
import{F as e,I as t,K as n,L as r,M as i,Q as a,R as o,T as s,d as c,f as l,g as u,h as d,u as f,v as p,x as m,y as h}from"./vue.runtime.esm-bundler-D1AeD4rU.js";import{a as g,b as _,c as v,s as y,x as b}from"./dom-Dsz2_U-O.js";import{d as x}from"./scroll-gsgLuOd5.js";import{d as S,l as C,m as w,t as T}from"./QBtn-D_z9TlFx.js";import{a as E,f as D,u as O}from"./index-CCjELFIy.js";import{t as k}from"./QBadge-yUv1kfoa.js";import{n as A,t as j}from"./QList-B0CCER62.js";import{n as M,t as N}from"./QItem-DH1W08XH.js";import{_ as P,d as F,f as I,t as L}from"./QMenu-BHZIg7Aq.js";import{n as R}from"./QScrollObserver-CEmRprAi.js";import{n as z,t as B}from"./QLayout-ZyRJWs_H.js";import{t as V}from"./_plugin-vue_export-helper-gFNv2Gru.js";var H=_({name:`QSpace`,setup(){let e=h(`div`,{class:`q-space`});return()=>e}}),U=_({name:`QToolbar`,props:{inset:Boolean},setup(e,{slots:t}){let n=f(()=>`q-toolbar row no-wrap items-center`+(e.inset===!0?` q-toolbar--inset`:``));return()=>h(`div`,{class:n.value,role:`toolbar`},y(t.default))}}),W=_({name:`QHeader`,props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:[`reveal`,`focusin`],setup(e,{slots:r,emit:i}){let{proxy:{$q:a}}=p(),o=m(D,O);if(o===O)return console.error(`QHeader needs to be child of QLayout`),O;let c=n(parseInt(e.heightHint,10)),l=n(!0),u=f(()=>e.reveal===!0||o.view.value.indexOf(`H`)!==-1||a.platform.is.ios&&o.isContainer.value===!0),d=f(()=>{if(e.modelValue!==!0)return 0;if(u.value===!0)return l.value===!0?c.value:0;let t=c.value-o.scroll.value.position;return t>0?t:0}),g=f(()=>e.modelValue!==!0||u.value===!0&&l.value!==!0),_=f(()=>e.modelValue===!0&&g.value===!0&&e.reveal===!0),y=f(()=>`q-header q-layout__section--marginal `+(u.value===!0?`fixed`:`absolute`)+`-top`+(e.bordered===!0?` q-header--bordered`:``)+(g.value===!0?` q-header--hidden`:``)+(e.modelValue===!0?``:` q-layout--prevent-focus`)),b=f(()=>{let e=o.rows.value.top,t={};return e[0]===`l`&&o.left.space===!0&&(t[a.lang.rtl===!0?`right`:`left`]=`${o.left.size}px`),e[2]===`r`&&o.right.space===!0&&(t[a.lang.rtl===!0?`left`:`right`]=`${o.right.size}px`),t});function x(e,t){o.update(`header`,e,t)}function S(e,t){e.value!==t&&(e.value=t)}function C({height:e}){S(c,e),x(`size`,e)}function w(e){_.value===!0&&S(l,!0),i(`focusin`,e)}t(()=>e.modelValue,e=>{x(`space`,e),S(l,!0),o.animate()}),t(d,e=>{x(`offset`,e)}),t(()=>e.reveal,t=>{t===!1&&S(l,e.modelValue)}),t(l,e=>{o.animate(),i(`reveal`,e)}),t(o.scroll,t=>{e.reveal===!0&&S(l,t.direction===`up`||t.position<=e.revealOffset||t.position-t.inflectionPoint<100)});let T={};return o.instances.header=T,e.modelValue===!0&&x(`size`,c.value),x(`space`,e.modelValue),x(`offset`,d.value),s(()=>{o.instances.header===T&&(o.instances.header=void 0,x(`size`,0),x(`offset`,0),x(`space`,!1))}),()=>{let t=v(r.default,[]);return e.elevated===!0&&t.push(h(`div`,{class:`q-layout__shadow absolute-full overflow-hidden no-pointer-events`})),t.push(h(R,{debounce:0,onResize:C})),h(`header`,{class:y.value,style:b.value,onFocusin:w},t)}}}),G=_({name:`QFooter`,props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:[`reveal`,`focusin`],setup(e,{slots:r,emit:i}){let{proxy:{$q:a}}=p(),o=m(D,O);if(o===O)return console.error(`QFooter needs to be child of QLayout`),O;let c=n(parseInt(e.heightHint,10)),l=n(!0),u=n(x.value===!0||o.isContainer.value===!0?0:window.innerHeight),d=f(()=>e.reveal===!0||o.view.value.indexOf(`F`)!==-1||a.platform.is.ios&&o.isContainer.value===!0),_=f(()=>o.isContainer.value===!0?o.containerHeight.value:u.value),v=f(()=>{if(e.modelValue!==!0)return 0;if(d.value===!0)return l.value===!0?c.value:0;let t=o.scroll.value.position+_.value+c.value-o.height.value;return t>0?t:0}),y=f(()=>e.modelValue!==!0||d.value===!0&&l.value!==!0),b=f(()=>e.modelValue===!0&&y.value===!0&&e.reveal===!0),S=f(()=>`q-footer q-layout__section--marginal `+(d.value===!0?`fixed`:`absolute`)+`-bottom`+(e.bordered===!0?` q-footer--bordered`:``)+(y.value===!0?` q-footer--hidden`:``)+(e.modelValue===!0?``:` q-layout--prevent-focus`+(d.value===!0?``:` hidden`))),C=f(()=>{let e=o.rows.value.bottom,t={};return e[0]===`l`&&o.left.space===!0&&(t[a.lang.rtl===!0?`right`:`left`]=`${o.left.size}px`),e[2]===`r`&&o.right.space===!0&&(t[a.lang.rtl===!0?`left`:`right`]=`${o.right.size}px`),t});function w(e,t){o.update(`footer`,e,t)}function T(e,t){e.value!==t&&(e.value=t)}function E({height:e}){T(c,e),w(`size`,e)}function k(){if(e.reveal!==!0)return;let{direction:t,position:n,inflectionPoint:r}=o.scroll.value;T(l,t===`up`||n-r<100||o.height.value-_.value-n-c.value<300)}function A(e){b.value===!0&&T(l,!0),i(`focusin`,e)}t(()=>e.modelValue,e=>{w(`space`,e),T(l,!0),o.animate()}),t(v,e=>{w(`offset`,e)}),t(()=>e.reveal,t=>{t===!1&&T(l,e.modelValue)}),t(l,e=>{o.animate(),i(`reveal`,e)}),t([c,o.scroll,o.height],k),t(()=>a.screen.height,e=>{o.isContainer.value!==!0&&T(u,e)});let j={};return o.instances.footer=j,e.modelValue===!0&&w(`size`,c.value),w(`space`,e.modelValue),w(`offset`,v.value),s(()=>{o.instances.footer===j&&(o.instances.footer=void 0,w(`size`,0),w(`offset`,0),w(`space`,!1))}),()=>{let t=g(r.default,[h(R,{debounce:0,onResize:E})]);return e.elevated===!0&&t.push(h(`div`,{class:`q-layout__shadow absolute-full overflow-hidden no-pointer-events`})),h(`footer`,{class:S.value,style:C.value,onFocusin:A},t)}}});function K(e){if(e===!1)return 0;if(e===!0||e===void 0)return 1;let t=parseInt(e,10);return isNaN(t)?0:t}var q=b({name:`close-popup`,beforeMount(e,{value:t}){let n={depth:K(t),handler(t){n.depth!==0&&setTimeout(()=>{let r=I(e);r!==void 0&&F(r,t,n.depth)})},handlerKey(e){w(e,13)===!0&&n.handler(e)}};e.__qclosepopup=n,e.addEventListener(`click`,n.handler),e.addEventListener(`keyup`,n.handlerKey)},updated(e,{value:t,oldValue:n}){t!==n&&(e.__qclosepopup.depth=K(t))},beforeUnmount(e){let t=e.__qclosepopup;e.removeEventListener(`click`,t.handler),e.removeEventListener(`keyup`,t.handlerKey),delete e.__qclosepopup}}),J={},Y={class:`row items-center cursor-pointer`},X={class:`logo-box q-mr-md`},Z={class:`q-pa-md row items-center justify-between bg-white text-dark`,style:{"border-radius":`20px 20px 0 0`}},Q={class:`q-pa-sm text-center bg-grey-1`},$={class:`glass-nav row items-center justify-around`},ee={class:`center-play-wrapper`};function te(t,n){let s=e(`router-view`);return i(),l(B,{view:`lHh lpr lFf`,class:`premium-layout desktop-constrained`,container:``},{default:r(()=>[u(W,{class:`glass-header text-dark q-py-sm q-px-sm`},{default:r(()=>[u(U,null,{default:r(()=>[c(`div`,Y,[c(`div`,X,[u(S,{name:`fitness_center`,color:`white`,size:`22px`})]),n[0]||=c(`div`,{class:`text-h6 text-weight-bolder tracking-tight logo-text`},`Active PT`,-1)]),u(H),u(T,{round:``,dense:``,unelevated:``,color:`blue-8`,class:`action-btn text-dark q-mr-sm`},{default:r(()=>[u(S,{name:`notifications`,size:`20px`}),u(k,{color:`negative`,floating:``,rounded:``,class:`shadow-1 text-weight-bold`},{default:r(()=>[...n[1]||=[d(`2`,-1)]]),_:1}),u(L,{"transition-show":`jump-down`,"transition-hide":`jump-up`,offset:[0,10],class:`notification-menu glass-panel no-shadow`,style:{"border-radius":`20px`,width:`340px`,"max-width":`90vw`,border:`1px solid rgba(0, 0, 0, 0.05)`}},{default:r(()=>[c(`div`,Z,[n[2]||=c(`div`,{class:`text-h6 text-weight-bolder tracking-tight`,style:{"font-size":`1.1rem`}},` Notifications `,-1),o(u(T,{flat:``,round:``,dense:``,icon:`close`,size:`sm`,color:`grey-7`},null,512),[[q]])]),u(A),u(j,{class:`bg-white`,style:{"border-radius":`0 0 20px 20px`,overflow:`hidden`}},{default:r(()=>[o((i(),l(N,{clickable:``,class:`q-pa-md bg-blue-1`},{default:r(()=>[u(M,{avatar:``,top:``},{default:r(()=>[u(E,{color:`white`,"text-color":`primary`,icon:`assignment`,class:`shadow-1`})]),_:1}),u(M,null,{default:r(()=>[u(P,{class:`text-weight-bold text-dark text-body2`},{default:r(()=>[...n[3]||=[d(`Time for your session! ⏱`,-1)]]),_:1}),u(P,{caption:``,lines:`2`,class:`text-grey-8 q-mt-xs`,style:{"line-height":`1.3`}},{default:r(()=>[...n[4]||=[d(` Your afternoon shoulder rehab session is scheduled for 3:00 PM. Tap to start. `,-1)]]),_:1}),u(P,{caption:``,class:`text-primary text-weight-bold q-mt-sm`},{default:r(()=>[...n[5]||=[d(`Just now`,-1)]]),_:1})]),_:1}),u(M,{side:``,top:``},{default:r(()=>[u(k,{color:`primary`,rounded:``,class:`q-mt-sm`,style:{width:`8px`,height:`8px`}})]),_:1})]),_:1})),[[C]]),u(A,{inset:``}),o((i(),l(N,{clickable:``,class:`q-pa-md bg-blue-1`},{default:r(()=>[u(M,{avatar:``,top:``},{default:r(()=>[u(E,{color:`white`,"text-color":`orange`,icon:`medical_services`,class:`shadow-1`})]),_:1}),u(M,null,{default:r(()=>[u(P,{class:`text-weight-bold text-dark text-body2`},{default:r(()=>[...n[6]||=[d(`Dr. Saulihal reviewed`,-1)]]),_:1}),u(P,{caption:``,lines:`2`,class:`text-grey-8 q-mt-xs`,style:{"line-height":`1.3`}},{default:r(()=>[...n[7]||=[d(` Your physical therapist reviewed your recent session and added some notes. `,-1)]]),_:1}),u(P,{caption:``,class:`text-primary text-weight-bold q-mt-sm`},{default:r(()=>[...n[8]||=[d(`2 hours ago`,-1)]]),_:1})]),_:1}),u(M,{side:``,top:``},{default:r(()=>[u(k,{color:`primary`,rounded:``,class:`q-mt-sm`,style:{width:`8px`,height:`8px`}})]),_:1})]),_:1})),[[C]]),u(A,{inset:``}),o((i(),l(N,{clickable:``,class:`q-pa-md`},{default:r(()=>[u(M,{avatar:``,top:``},{default:r(()=>[u(E,{color:`green-1`,"text-color":`positive`,icon:`emoji_events`,class:`shadow-1`})]),_:1}),u(M,null,{default:r(()=>[u(P,{class:`text-weight-bold text-dark text-body2`},{default:r(()=>[...n[9]||=[d(`4-Day Streak! 🔥`,-1)]]),_:1}),u(P,{caption:``,lines:`2`,class:`text-grey-7 q-mt-xs`,style:{"line-height":`1.3`}},{default:r(()=>[...n[10]||=[d(` Awesome work! You've successfully completed 4 days of rehab in a row. Keep it up! `,-1)]]),_:1}),u(P,{caption:``,class:`text-grey-5 text-weight-medium q-mt-sm`},{default:r(()=>[...n[11]||=[d(`Yesterday`,-1)]]),_:1})]),_:1})]),_:1})),[[C]]),u(A),c(`div`,Q,[u(T,{flat:``,color:`grey-7`,label:`Mark all as read`,class:`text-weight-bold text-caption full-width`,"no-caps":``})])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),u(z,null,{default:r(()=>[u(s)]),_:1}),u(G,{class:`transparent q-px-md safe-bottom`},{default:r(()=>[c(`div`,$,[u(T,{flat:``,round:``,dense:``,icon:`home`,color:t.$route.path===`/`?`primary`:`grey-5`,class:a([`nav-btn`,{"active-nav":t.$route.path===`/`}]),size:`md`,to:`/`},null,8,[`color`,`class`]),u(T,{flat:``,round:``,dense:``,icon:`description`,color:t.$route.path===`/report`?`primary`:`grey-5`,class:a([`nav-btn`,{"active-nav":t.$route.path===`/report`}]),size:`md`,to:`/report`},null,8,[`color`,`class`]),c(`div`,ee,[u(T,{round:``,color:`primary`,class:`center-play-btn shadow-vibrant`,to:`/session`},{default:r(()=>[u(S,{name:`play_arrow`,size:`32px`})]),_:1})]),u(T,{flat:``,round:``,dense:``,icon:`calendar_month`,color:t.$route.path===`/appointments`?`primary`:`grey-5`,class:a([`nav-btn`,{"active-nav":t.$route.path===`/appointments`}]),size:`md`,to:`/appointments`},null,8,[`color`,`class`]),u(T,{flat:``,round:``,dense:``,icon:`person_outline`,color:t.$route.path===`/profile`?`primary`:`grey-5`,class:a([`nav-btn`,{"active-nav":t.$route.path===`/profile`}]),size:`md`,to:`/profile`},null,8,[`color`,`class`])])]),_:1})]),_:1})}var ne=V(J,[[`render`,te],[`__scopeId`,`data-v-1c14b277`]]);export{ne as default};
=======
import {
  F as e,
  I as t,
  K as n,
  L as r,
  M as i,
  Q as a,
  R as o,
  T as s,
  d as c,
  f as l,
  g as u,
  h as d,
  u as f,
  v as p,
  x as m,
  y as h,
} from './vue.runtime.esm-bundler-D1AeD4rU.js'
import { a as g, b as _, c as v, s as y, x as b } from './dom-Dsz2_U-O.js'
import { d as x } from './scroll-gsgLuOd5.js'
import { d as S, l as C, m as w, t as T } from './QBtn-D_z9TlFx.js'
import { a as E, f as D, u as O } from './index-BijDhEEH.js'
import { t as k } from './QBadge-yUv1kfoa.js'
import { n as A, t as j } from './QList-B0CCER62.js'
import { n as M, t as N } from './QItem-DH1W08XH.js'
import { _ as P, d as F, f as I, t as L } from './QMenu-C8epFsPs.js'
import { n as R } from './QScrollObserver-CEmRprAi.js'
import { n as z, t as B } from './QLayout-DiovXwB5.js'
import { t as V } from './_plugin-vue_export-helper-gFNv2Gru.js'
var H = _({
    name: `QSpace`,
    setup() {
      let e = h(`div`, { class: `q-space` })
      return () => e
    },
  }),
  U = _({
    name: `QToolbar`,
    props: { inset: Boolean },
    setup(e, { slots: t }) {
      let n = f(
        () => `q-toolbar row no-wrap items-center` + (e.inset === !0 ? ` q-toolbar--inset` : ``),
      )
      return () => h(`div`, { class: n.value, role: `toolbar` }, y(t.default))
    },
  }),
  W = _({
    name: `QHeader`,
    props: {
      modelValue: { type: Boolean, default: !0 },
      reveal: Boolean,
      revealOffset: { type: Number, default: 250 },
      bordered: Boolean,
      elevated: Boolean,
      heightHint: { type: [String, Number], default: 50 },
    },
    emits: [`reveal`, `focusin`],
    setup(e, { slots: r, emit: i }) {
      let {
          proxy: { $q: a },
        } = p(),
        o = m(D, O)
      if (o === O) return (console.error(`QHeader needs to be child of QLayout`), O)
      let c = n(parseInt(e.heightHint, 10)),
        l = n(!0),
        u = f(
          () =>
            e.reveal === !0 ||
            o.view.value.indexOf(`H`) !== -1 ||
            (a.platform.is.ios && o.isContainer.value === !0),
        ),
        d = f(() => {
          if (e.modelValue !== !0) return 0
          if (u.value === !0) return l.value === !0 ? c.value : 0
          let t = c.value - o.scroll.value.position
          return t > 0 ? t : 0
        }),
        g = f(() => e.modelValue !== !0 || (u.value === !0 && l.value !== !0)),
        _ = f(() => e.modelValue === !0 && g.value === !0 && e.reveal === !0),
        y = f(
          () =>
            `q-header q-layout__section--marginal ` +
            (u.value === !0 ? `fixed` : `absolute`) +
            `-top` +
            (e.bordered === !0 ? ` q-header--bordered` : ``) +
            (g.value === !0 ? ` q-header--hidden` : ``) +
            (e.modelValue === !0 ? `` : ` q-layout--prevent-focus`),
        ),
        b = f(() => {
          let e = o.rows.value.top,
            t = {}
          return (
            e[0] === `l` &&
              o.left.space === !0 &&
              (t[a.lang.rtl === !0 ? `right` : `left`] = `${o.left.size}px`),
            e[2] === `r` &&
              o.right.space === !0 &&
              (t[a.lang.rtl === !0 ? `left` : `right`] = `${o.right.size}px`),
            t
          )
        })
      function x(e, t) {
        o.update(`header`, e, t)
      }
      function S(e, t) {
        e.value !== t && (e.value = t)
      }
      function C({ height: e }) {
        ;(S(c, e), x(`size`, e))
      }
      function w(e) {
        ;(_.value === !0 && S(l, !0), i(`focusin`, e))
      }
      ;(t(
        () => e.modelValue,
        (e) => {
          ;(x(`space`, e), S(l, !0), o.animate())
        },
      ),
        t(d, (e) => {
          x(`offset`, e)
        }),
        t(
          () => e.reveal,
          (t) => {
            t === !1 && S(l, e.modelValue)
          },
        ),
        t(l, (e) => {
          ;(o.animate(), i(`reveal`, e))
        }),
        t(o.scroll, (t) => {
          e.reveal === !0 &&
            S(
              l,
              t.direction === `up` ||
                t.position <= e.revealOffset ||
                t.position - t.inflectionPoint < 100,
            )
        }))
      let T = {}
      return (
        (o.instances.header = T),
        e.modelValue === !0 && x(`size`, c.value),
        x(`space`, e.modelValue),
        x(`offset`, d.value),
        s(() => {
          o.instances.header === T &&
            ((o.instances.header = void 0), x(`size`, 0), x(`offset`, 0), x(`space`, !1))
        }),
        () => {
          let t = v(r.default, [])
          return (
            e.elevated === !0 &&
              t.push(
                h(`div`, {
                  class: `q-layout__shadow absolute-full overflow-hidden no-pointer-events`,
                }),
              ),
            t.push(h(R, { debounce: 0, onResize: C })),
            h(`header`, { class: y.value, style: b.value, onFocusin: w }, t)
          )
        }
      )
    },
  }),
  G = _({
    name: `QFooter`,
    props: {
      modelValue: { type: Boolean, default: !0 },
      reveal: Boolean,
      bordered: Boolean,
      elevated: Boolean,
      heightHint: { type: [String, Number], default: 50 },
    },
    emits: [`reveal`, `focusin`],
    setup(e, { slots: r, emit: i }) {
      let {
          proxy: { $q: a },
        } = p(),
        o = m(D, O)
      if (o === O) return (console.error(`QFooter needs to be child of QLayout`), O)
      let c = n(parseInt(e.heightHint, 10)),
        l = n(!0),
        u = n(x.value === !0 || o.isContainer.value === !0 ? 0 : window.innerHeight),
        d = f(
          () =>
            e.reveal === !0 ||
            o.view.value.indexOf(`F`) !== -1 ||
            (a.platform.is.ios && o.isContainer.value === !0),
        ),
        _ = f(() => (o.isContainer.value === !0 ? o.containerHeight.value : u.value)),
        v = f(() => {
          if (e.modelValue !== !0) return 0
          if (d.value === !0) return l.value === !0 ? c.value : 0
          let t = o.scroll.value.position + _.value + c.value - o.height.value
          return t > 0 ? t : 0
        }),
        y = f(() => e.modelValue !== !0 || (d.value === !0 && l.value !== !0)),
        b = f(() => e.modelValue === !0 && y.value === !0 && e.reveal === !0),
        S = f(
          () =>
            `q-footer q-layout__section--marginal ` +
            (d.value === !0 ? `fixed` : `absolute`) +
            `-bottom` +
            (e.bordered === !0 ? ` q-footer--bordered` : ``) +
            (y.value === !0 ? ` q-footer--hidden` : ``) +
            (e.modelValue === !0
              ? ``
              : ` q-layout--prevent-focus` + (d.value === !0 ? `` : ` hidden`)),
        ),
        C = f(() => {
          let e = o.rows.value.bottom,
            t = {}
          return (
            e[0] === `l` &&
              o.left.space === !0 &&
              (t[a.lang.rtl === !0 ? `right` : `left`] = `${o.left.size}px`),
            e[2] === `r` &&
              o.right.space === !0 &&
              (t[a.lang.rtl === !0 ? `left` : `right`] = `${o.right.size}px`),
            t
          )
        })
      function w(e, t) {
        o.update(`footer`, e, t)
      }
      function T(e, t) {
        e.value !== t && (e.value = t)
      }
      function E({ height: e }) {
        ;(T(c, e), w(`size`, e))
      }
      function k() {
        if (e.reveal !== !0) return
        let { direction: t, position: n, inflectionPoint: r } = o.scroll.value
        T(l, t === `up` || n - r < 100 || o.height.value - _.value - n - c.value < 300)
      }
      function A(e) {
        ;(b.value === !0 && T(l, !0), i(`focusin`, e))
      }
      ;(t(
        () => e.modelValue,
        (e) => {
          ;(w(`space`, e), T(l, !0), o.animate())
        },
      ),
        t(v, (e) => {
          w(`offset`, e)
        }),
        t(
          () => e.reveal,
          (t) => {
            t === !1 && T(l, e.modelValue)
          },
        ),
        t(l, (e) => {
          ;(o.animate(), i(`reveal`, e))
        }),
        t([c, o.scroll, o.height], k),
        t(
          () => a.screen.height,
          (e) => {
            o.isContainer.value !== !0 && T(u, e)
          },
        ))
      let j = {}
      return (
        (o.instances.footer = j),
        e.modelValue === !0 && w(`size`, c.value),
        w(`space`, e.modelValue),
        w(`offset`, v.value),
        s(() => {
          o.instances.footer === j &&
            ((o.instances.footer = void 0), w(`size`, 0), w(`offset`, 0), w(`space`, !1))
        }),
        () => {
          let t = g(r.default, [h(R, { debounce: 0, onResize: E })])
          return (
            e.elevated === !0 &&
              t.push(
                h(`div`, {
                  class: `q-layout__shadow absolute-full overflow-hidden no-pointer-events`,
                }),
              ),
            h(`footer`, { class: S.value, style: C.value, onFocusin: A }, t)
          )
        }
      )
    },
  })
function K(e) {
  if (e === !1) return 0
  if (e === !0 || e === void 0) return 1
  let t = parseInt(e, 10)
  return isNaN(t) ? 0 : t
}
var q = b({
    name: `close-popup`,
    beforeMount(e, { value: t }) {
      let n = {
        depth: K(t),
        handler(t) {
          n.depth !== 0 &&
            setTimeout(() => {
              let r = I(e)
              r !== void 0 && F(r, t, n.depth)
            })
        },
        handlerKey(e) {
          w(e, 13) === !0 && n.handler(e)
        },
      }
      ;((e.__qclosepopup = n),
        e.addEventListener(`click`, n.handler),
        e.addEventListener(`keyup`, n.handlerKey))
    },
    updated(e, { value: t, oldValue: n }) {
      t !== n && (e.__qclosepopup.depth = K(t))
    },
    beforeUnmount(e) {
      let t = e.__qclosepopup
      ;(e.removeEventListener(`click`, t.handler),
        e.removeEventListener(`keyup`, t.handlerKey),
        delete e.__qclosepopup)
    },
  }),
  J = {},
  Y = { class: `row items-center cursor-pointer` },
  X = { class: `logo-box q-mr-md` },
  Z = {
    class: `q-pa-md row items-center justify-between bg-white text-dark`,
    style: { 'border-radius': `20px 20px 0 0` },
  },
  Q = { class: `q-pa-sm text-center bg-grey-1` },
  $ = { class: `glass-nav row items-center justify-around` },
  ee = { class: `center-play-wrapper` }
function te(t, n) {
  let s = e(`router-view`)
  return (
    i(),
    l(
      B,
      { view: `lHh lpr lFf`, class: `premium-layout desktop-constrained`, container: `` },
      {
        default: r(() => [
          u(
            W,
            { class: `glass-header text-dark q-py-sm q-px-sm` },
            {
              default: r(() => [
                u(U, null, {
                  default: r(() => [
                    c(`div`, Y, [
                      c(`div`, X, [u(S, { name: `fitness_center`, color: `white`, size: `22px` })]),
                      (n[0] ||= c(
                        `div`,
                        { class: `text-h6 text-weight-bolder tracking-tight logo-text` },
                        `Activ PT`,
                        -1,
                      )),
                    ]),
                    u(H),
                    u(
                      T,
                      {
                        round: ``,
                        dense: ``,
                        unelevated: ``,
                        color: `blue-8`,
                        class: `action-btn text-dark q-mr-sm`,
                      },
                      {
                        default: r(() => [
                          u(S, { name: `notifications`, size: `20px` }),
                          u(
                            k,
                            {
                              color: `negative`,
                              floating: ``,
                              rounded: ``,
                              class: `shadow-1 text-weight-bold`,
                            },
                            { default: r(() => [...(n[1] ||= [d(`2`, -1)])]), _: 1 },
                          ),
                          u(
                            L,
                            {
                              'transition-show': `jump-down`,
                              'transition-hide': `jump-up`,
                              offset: [0, 10],
                              class: `notification-menu glass-panel no-shadow`,
                              style: {
                                'border-radius': `20px`,
                                width: `340px`,
                                'max-width': `90vw`,
                                border: `1px solid rgba(0, 0, 0, 0.05)`,
                              },
                            },
                            {
                              default: r(() => [
                                c(`div`, Z, [
                                  (n[2] ||= c(
                                    `div`,
                                    {
                                      class: `text-h6 text-weight-bolder tracking-tight`,
                                      style: { 'font-size': `1.1rem` },
                                    },
                                    ` Notifications `,
                                    -1,
                                  )),
                                  o(
                                    u(
                                      T,
                                      {
                                        flat: ``,
                                        round: ``,
                                        dense: ``,
                                        icon: `close`,
                                        size: `sm`,
                                        color: `grey-7`,
                                      },
                                      null,
                                      512,
                                    ),
                                    [[q]],
                                  ),
                                ]),
                                u(A),
                                u(
                                  j,
                                  {
                                    class: `bg-white`,
                                    style: { 'border-radius': `0 0 20px 20px`, overflow: `hidden` },
                                  },
                                  {
                                    default: r(() => [
                                      o(
                                        (i(),
                                        l(
                                          N,
                                          { clickable: ``, class: `q-pa-md bg-blue-1` },
                                          {
                                            default: r(() => [
                                              u(
                                                M,
                                                { avatar: ``, top: `` },
                                                {
                                                  default: r(() => [
                                                    u(E, {
                                                      color: `white`,
                                                      'text-color': `primary`,
                                                      icon: `assignment`,
                                                      class: `shadow-1`,
                                                    }),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                              u(M, null, {
                                                default: r(() => [
                                                  u(
                                                    P,
                                                    {
                                                      class: `text-weight-bold text-dark text-body2`,
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[3] ||= [
                                                          d(`Time for your session! ⏱`, -1),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  u(
                                                    P,
                                                    {
                                                      caption: ``,
                                                      lines: `2`,
                                                      class: `text-grey-8 q-mt-xs`,
                                                      style: { 'line-height': `1.3` },
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[4] ||= [
                                                          d(
                                                            ` Your afternoon shoulder rehab session is scheduled for 3:00 PM. Tap to start. `,
                                                            -1,
                                                          ),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  u(
                                                    P,
                                                    {
                                                      caption: ``,
                                                      class: `text-primary text-weight-bold q-mt-sm`,
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[5] ||= [d(`Just now`, -1)]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                ]),
                                                _: 1,
                                              }),
                                              u(
                                                M,
                                                { side: ``, top: `` },
                                                {
                                                  default: r(() => [
                                                    u(k, {
                                                      color: `primary`,
                                                      rounded: ``,
                                                      class: `q-mt-sm`,
                                                      style: { width: `8px`, height: `8px` },
                                                    }),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                        )),
                                        [[C]],
                                      ),
                                      u(A, { inset: `` }),
                                      o(
                                        (i(),
                                        l(
                                          N,
                                          { clickable: ``, class: `q-pa-md bg-blue-1` },
                                          {
                                            default: r(() => [
                                              u(
                                                M,
                                                { avatar: ``, top: `` },
                                                {
                                                  default: r(() => [
                                                    u(E, {
                                                      color: `white`,
                                                      'text-color': `orange`,
                                                      icon: `medical_services`,
                                                      class: `shadow-1`,
                                                    }),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                              u(M, null, {
                                                default: r(() => [
                                                  u(
                                                    P,
                                                    {
                                                      class: `text-weight-bold text-dark text-body2`,
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[6] ||= [
                                                          d(`Dr. Saulihal reviewed`, -1),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  u(
                                                    P,
                                                    {
                                                      caption: ``,
                                                      lines: `2`,
                                                      class: `text-grey-8 q-mt-xs`,
                                                      style: { 'line-height': `1.3` },
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[7] ||= [
                                                          d(
                                                            ` Your physical therapist reviewed your recent session and added some notes. `,
                                                            -1,
                                                          ),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  u(
                                                    P,
                                                    {
                                                      caption: ``,
                                                      class: `text-primary text-weight-bold q-mt-sm`,
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[8] ||= [d(`2 hours ago`, -1)]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                ]),
                                                _: 1,
                                              }),
                                              u(
                                                M,
                                                { side: ``, top: `` },
                                                {
                                                  default: r(() => [
                                                    u(k, {
                                                      color: `primary`,
                                                      rounded: ``,
                                                      class: `q-mt-sm`,
                                                      style: { width: `8px`, height: `8px` },
                                                    }),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                        )),
                                        [[C]],
                                      ),
                                      u(A, { inset: `` }),
                                      o(
                                        (i(),
                                        l(
                                          N,
                                          { clickable: ``, class: `q-pa-md` },
                                          {
                                            default: r(() => [
                                              u(
                                                M,
                                                { avatar: ``, top: `` },
                                                {
                                                  default: r(() => [
                                                    u(E, {
                                                      color: `green-1`,
                                                      'text-color': `positive`,
                                                      icon: `emoji_events`,
                                                      class: `shadow-1`,
                                                    }),
                                                  ]),
                                                  _: 1,
                                                },
                                              ),
                                              u(M, null, {
                                                default: r(() => [
                                                  u(
                                                    P,
                                                    {
                                                      class: `text-weight-bold text-dark text-body2`,
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[9] ||= [d(`4-Day Streak! 🔥`, -1)]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  u(
                                                    P,
                                                    {
                                                      caption: ``,
                                                      lines: `2`,
                                                      class: `text-grey-7 q-mt-xs`,
                                                      style: { 'line-height': `1.3` },
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[10] ||= [
                                                          d(
                                                            ` Awesome work! You've successfully completed 4 days of rehab in a row. Keep it up! `,
                                                            -1,
                                                          ),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  u(
                                                    P,
                                                    {
                                                      caption: ``,
                                                      class: `text-grey-5 text-weight-medium q-mt-sm`,
                                                    },
                                                    {
                                                      default: r(() => [
                                                        ...(n[11] ||= [d(`Yesterday`, -1)]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                ]),
                                                _: 1,
                                              }),
                                            ]),
                                            _: 1,
                                          },
                                        )),
                                        [[C]],
                                      ),
                                      u(A),
                                      c(`div`, Q, [
                                        u(T, {
                                          flat: ``,
                                          color: `grey-7`,
                                          label: `Mark all as read`,
                                          class: `text-weight-bold text-caption full-width`,
                                          'no-caps': ``,
                                        }),
                                      ]),
                                    ]),
                                    _: 1,
                                  },
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ),
          u(z, null, { default: r(() => [u(s)]), _: 1 }),
          u(
            G,
            { class: `transparent q-px-md safe-bottom` },
            {
              default: r(() => [
                c(`div`, $, [
                  u(
                    T,
                    {
                      flat: ``,
                      round: ``,
                      dense: ``,
                      icon: `home`,
                      color: t.$route.path === `/` ? `primary` : `grey-5`,
                      class: a([`nav-btn`, { 'active-nav': t.$route.path === `/` }]),
                      size: `md`,
                      to: `/`,
                    },
                    null,
                    8,
                    [`color`, `class`],
                  ),
                  u(
                    T,
                    {
                      flat: ``,
                      round: ``,
                      dense: ``,
                      icon: `description`,
                      color: t.$route.path === `/report` ? `primary` : `grey-5`,
                      class: a([`nav-btn`, { 'active-nav': t.$route.path === `/report` }]),
                      size: `md`,
                      to: `/report`,
                    },
                    null,
                    8,
                    [`color`, `class`],
                  ),
                  c(`div`, ee, [
                    u(
                      T,
                      {
                        round: ``,
                        color: `primary`,
                        class: `center-play-btn shadow-vibrant`,
                        to: `/session`,
                      },
                      { default: r(() => [u(S, { name: `play_arrow`, size: `32px` })]), _: 1 },
                    ),
                  ]),
                  u(
                    T,
                    {
                      flat: ``,
                      round: ``,
                      dense: ``,
                      icon: `calendar_month`,
                      color: t.$route.path === `/appointments` ? `primary` : `grey-5`,
                      class: a([`nav-btn`, { 'active-nav': t.$route.path === `/appointments` }]),
                      size: `md`,
                      to: `/appointments`,
                    },
                    null,
                    8,
                    [`color`, `class`],
                  ),
                  u(
                    T,
                    {
                      flat: ``,
                      round: ``,
                      dense: ``,
                      icon: `person_outline`,
                      color: t.$route.path === `/profile` ? `primary` : `grey-5`,
                      class: a([`nav-btn`, { 'active-nav': t.$route.path === `/profile` }]),
                      size: `md`,
                      to: `/profile`,
                    },
                    null,
                    8,
                    [`color`, `class`],
                  ),
                ]),
              ]),
              _: 1,
            },
          ),
        ]),
        _: 1,
      },
    )
  )
}
var ne = V(J, [
  [`render`, te],
  [`__scopeId`, `data-v-1c14b277`],
])
export { ne as default }
>>>>>>> Stashed changes:dist/spa/assets/AppLayout-DUaJKBFO.js
