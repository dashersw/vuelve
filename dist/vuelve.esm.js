import { ref as h, watch as s, watchEffect as p, computed as v, onMounted as E, onBeforeUpdate as m, onUpdated as j, onBeforeUnmount as O, onUnmounted as g, onErrorCaptured as w, onRenderTracked as U, onRenderTriggered as y, onActivated as T, onDeactivated as k, onServerPrefetch as C } from "vue";
import b from "lodash.clonedeep";
const x = {
  mounted: E,
  beforeUpdate: m,
  updated: j,
  beforeUnmount: O,
  unmounted: g,
  errorCaptured: w,
  renderTracked: U,
  renderTriggered: y,
  activated: T,
  deactivated: k,
  serverPrefetch: C
};
function H(t) {
  return function(...i) {
    const c = {}, f = {}, a = {}, o = {};
    return i.forEach((e, n) => {
      var d;
      const r = (d = t.props) == null ? void 0 : d[n];
      r && (c[r] = e);
    }), t.data && Object.entries(t.data).forEach(([e, n]) => {
      c[e] = h(b(n));
    }), Object.assign(o, c), t.methods && Object.entries(t.methods).forEach(([e, n]) => {
      f[e] = (...r) => n.apply(o, r);
    }), Object.assign(o, f), Object.entries(x).forEach(([e, n]) => {
      const r = e;
      if (t[r]) {
        const d = t[r];
        n((...u) => d.apply(o, u));
      }
    }), t.watch && Object.entries(t.watch).forEach(([e, n]) => {
      c[e] && s(c[e], n);
    }), t.watchEffect && Object.values(t.watchEffect).forEach((e) => {
      p(e.bind(o));
    }), t.computed && Object.keys(t.computed).forEach((e) => {
      var r;
      const n = (r = t.computed) == null ? void 0 : r[e];
      n && (a[e] = v(n.bind(o)));
    }), {
      ...c,
      ...f,
      ...a
    };
  };
}
export {
  H as default
};
