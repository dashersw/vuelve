<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9c7e218 (Add external dependencies to rollupOptions for smaller package size)
import { ref as h, onMounted as p, watch as m, watchEffect as E, computed as l } from "vue";
import w from "lodash.clonedeep";
function v(o, u) {
  const a = u || o.returns || o, f = u ? o : o.default || o, s = Object.keys(a), e = {}, c = {}, i = {};
  return function(...d) {
    d.forEach((t, n) => {
      f.props && (e[f.props[n]] = t);
    }), Object.entries(a).forEach(([t, n]) => {
      t != "default" && (typeof n == "function" ? c[t] = n.bind(e) : e[t] = h(w(n)));
    }), f.mounted && p(c[f.mounted.name]), f.watch && Object.entries(f.watch).forEach(([t, n]) => {
      m(e[t], c[n.name]);
    }), f.watchEffect && Object.values(f.watchEffect).forEach((t) => {
      E(c[t.name]);
    }), f.computed && Object.keys(f.computed).forEach((t) => {
      i[t] = l(c[t]);
<<<<<<< HEAD
    });
    const r = {};
    return s.forEach((t) => {
      t != "default" && (t in e && (r[t] = e[t]), t in c && (r[t] = c[t]), t in i && (r[t] = i[t]));
    }), r;
  };
}
export {
  v as default
=======
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Jo(e, t) {
  const n = new Set(e.split(","));
  return t ? (o) => n.has(o.toLowerCase()) : (o) => n.has(o);
}
const K = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {};
process.env.NODE_ENV !== "production" && Object.freeze([]);
const X = () => {
}, qo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), L = Object.assign, Yo = Object.prototype.hasOwnProperty, N = (e, t) => Yo.call(e, t), v = Array.isArray, Oe = (e) => ot(e) === "[object Map]", Xo = (e) => ot(e) === "[object Set]", S = (e) => typeof e == "function", F = (e) => typeof e == "string", rt = (e) => typeof e == "symbol", V = (e) => e !== null && typeof e == "object", Zo = (e) => (V(e) || S(e)) && S(e.then) && S(e.catch), Qo = Object.prototype.toString, ot = (e) => Qo.call(e), Ln = (e) => ot(e).slice(8, -1), ko = (e) => ot(e) === "[object Object]", It = (e) => F(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Hn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Kn = Hn((e) => e.charAt(0).toUpperCase() + e.slice(1)), es = Hn((e) => e ? `on${Kn(e)}` : ""), k = (e, t) => !Object.is(e, t), ts = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
};
let Nn;
const Un = () => Nn || (Nn = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Vt(e) {
  if (v(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], s = F(o) ? ss(o) : Vt(o);
      if (s)
        for (const i in s)
          t[i] = s[i];
    }
    return t;
  } else if (F(e) || V(e))
    return e;
}
const ns = /;(?![^(]*\))/g, rs = /:([^]+)/, os = /\/\*[^]*?\*\//g;
function ss(e) {
  const t = {};
  return e.replace(os, "").split(ns).forEach((n) => {
    if (n) {
      const o = n.split(rs);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function Pt(e) {
  let t = "";
  if (F(e))
    t = e;
  else if (v(e))
    for (let n = 0; n < e.length; n++) {
      const o = Pt(e[n]);
      o && (t += o + " ");
    }
  else if (V(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
/**
* @vue/reactivity v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function fe(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let is;
function cs(e, t = is) {
  t && t.active && t.effects.push(e);
}
let se;
class zn {
  constructor(t, n, o, s) {
    this.fn = t, this.trigger = n, this.scheduler = o, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, cs(this, s);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1, st();
      for (let t = 0; t < this._depsLength; t++) {
        const n = this.deps[t];
        if (n.computed && (as(n.computed), this._dirtyLevel >= 4))
          break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), it();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(t) {
    this._dirtyLevel = t ? 4 : 0;
  }
  run() {
    if (this._dirtyLevel = 0, !this.active)
      return this.fn();
    let t = Z, n = se;
    try {
      return Z = !0, se = this, this._runnings++, Sn(this), this.fn();
    } finally {
      xn(this), this._runnings--, se = n, Z = t;
    }
  }
  stop() {
    var t;
    this.active && (Sn(this), xn(this), (t = this.onStop) == null || t.call(this), this.active = !1);
  }
}
function as(e) {
  return e.value;
}
function Sn(e) {
  e._trackId++, e._depsLength = 0;
}
function xn(e) {
  if (e.deps.length > e._depsLength) {
    for (let t = e._depsLength; t < e.deps.length; t++)
      Wn(e.deps[t], e);
    e.deps.length = e._depsLength;
  }
}
function Wn(e, t) {
  const n = e.get(t);
  n !== void 0 && t._trackId !== n && (e.delete(t), e.size === 0 && e.cleanup());
}
let Z = !0, yt = 0;
const Gn = [];
function st() {
  Gn.push(Z), Z = !1;
}
function it() {
  const e = Gn.pop();
  Z = e === void 0 ? !0 : e;
}
function Dt() {
  yt++;
}
function At() {
  for (yt--; !yt && Ot.length; )
    Ot.shift()();
}
function Bn(e, t, n) {
  var o;
  if (t.get(e) !== e._trackId) {
    t.set(e, e._trackId);
    const s = e.deps[e._depsLength];
    s !== t ? (s && Wn(s, e), e.deps[e._depsLength++] = t) : e._depsLength++, process.env.NODE_ENV !== "production" && ((o = e.onTrack) == null || o.call(e, L({ effect: e }, n)));
  }
}
const Ot = [];
function Jn(e, t, n) {
  var o;
  Dt();
  for (const s of e.keys()) {
    let i;
    s._dirtyLevel < t && (i ?? (i = e.get(s) === s._trackId)) && (s._shouldSchedule || (s._shouldSchedule = s._dirtyLevel === 0), s._dirtyLevel = t), s._shouldSchedule && (i ?? (i = e.get(s) === s._trackId)) && (process.env.NODE_ENV !== "production" && ((o = s.onTrigger) == null || o.call(s, L({ effect: s }, n))), s.trigger(), (!s._runnings || s.allowRecurse) && s._dirtyLevel !== 2 && (s._shouldSchedule = !1, s.scheduler && Ot.push(s.scheduler)));
  }
  At();
}
const qn = (e, t) => {
  const n = /* @__PURE__ */ new Map();
  return n.cleanup = e, n.computed = t, n;
}, Nt = /* @__PURE__ */ new WeakMap(), ie = Symbol(process.env.NODE_ENV !== "production" ? "iterate" : ""), St = Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
function P(e, t, n) {
  if (Z && se) {
    let o = Nt.get(e);
    o || Nt.set(e, o = /* @__PURE__ */ new Map());
    let s = o.get(n);
    s || o.set(n, s = qn(() => o.delete(n))), Bn(
      se,
      s,
      process.env.NODE_ENV !== "production" ? {
        target: e,
        type: t,
        key: n
      } : void 0
    );
  }
}
function Q(e, t, n, o, s, i) {
  const a = Nt.get(e);
  if (!a)
    return;
  let f = [];
  if (t === "clear")
    f = [...a.values()];
  else if (n === "length" && v(e)) {
    const p = Number(o);
    a.forEach((g, E) => {
      (E === "length" || !rt(E) && E >= p) && f.push(g);
=======
>>>>>>> 9c7e218 (Add external dependencies to rollupOptions for smaller package size)
    });
    const r = {};
    return s.forEach((t) => {
      t != "default" && (t in e && (r[t] = e[t]), t in c && (r[t] = c[t]), t in i && (r[t] = i[t]));
    }), r;
  };
}
export {
<<<<<<< HEAD
  Li as default
>>>>>>> e3b5aad (Migrate development environment from Rollup to Vite)
=======
  v as default
>>>>>>> 9c7e218 (Add external dependencies to rollupOptions for smaller package size)
};
