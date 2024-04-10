import { ref as m, watch as E, watchEffect as b, computed as v, onMounted as O, onBeforeUpdate as j, onUpdated as w, onBeforeUnmount as L, onUnmounted as U, onErrorCaptured as C, onRenderTracked as g, onRenderTriggered as T, onActivated as H, onDeactivated as x, onServerPrefetch as B } from "vue";
import D from "lodash.clonedeep";
const N = {
  mounted: O,
  beforeUpdate: j,
  updated: w,
  beforeUnmount: L,
  unmounted: U,
  errorCaptured: C,
  renderTracked: g,
  renderTriggered: T,
  activated: H,
  deactivated: x,
  serverPrefetch: B
};
function S(c, d) {
  const s = d ?? c.returns ?? c, t = d ? c : c.default ?? c, h = Object.keys(s), n = {}, r = {}, a = {};
  return function(...l) {
    l.forEach((e, o) => {
      t.props && (n[t.props[o]] = e);
    }), Object.entries(s).forEach(([e, o]) => {
      e != "default" && (typeof o == "function" ? r[e] = o.bind(n) : n[e] = m(D(o)));
    }), Object.entries(N).forEach(([e, o]) => {
      var p;
      const u = e;
      if (t[u]) {
        const i = (p = t[u]) == null ? void 0 : p.name;
        if (!i)
          return;
        o && r[i] && o(r[i]);
      }
    }), t.watch && Object.entries(t.watch).forEach(([e, o]) => {
      n[e] && E(n[e], r[o.name]);
    }), t.watchEffect && Object.values(t.watchEffect).forEach((e) => {
      b(r[e.name]);
    }), t.computed && Object.keys(t.computed).forEach((e) => {
      a[e] = v(r[e]);
    });
    const f = {};
    return h.forEach((e) => {
      e != "default" && (e in n && (f[e] = n[e]), e in r && (f[e] = r[e]), e in a && (f[e] = a[e]));
    }), f;
  };
}
export {
  S as default
};
