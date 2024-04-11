import { ref as h, watch as s, watchEffect as p, computed as v, onMounted as E, onBeforeUpdate as m, onUpdated as j, onBeforeUnmount as O, onUnmounted as g, onErrorCaptured as w, onRenderTracked as U, onRenderTriggered as y, onActivated as T, onDeactivated as b, onServerPrefetch as k } from "vue";
import C from "lodash.clonedeep";
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
  deactivated: b,
  serverPrefetch: k
};
function H(t) {
  return function(...a) {
    const o = {}, f = {}, i = {}, c = {};
    return a.forEach((e, n) => {
      var d;
      const r = (d = t.props) == null ? void 0 : d[n];
      r && (o[r] = e);
    }), t.data && Object.entries(t.data).forEach(([e, n]) => {
      o[e] = h(C(n));
    }), Object.assign(c, o), t.methods && Object.entries(t.methods).forEach(([e, n]) => {
      f[e] = (...r) => n.apply(c, r);
    }), Object.assign(c, f), Object.entries(x).forEach(([e, n]) => {
      const r = e;
      if (t[r]) {
        const d = t[r];
        n((...u) => d.apply(c, u));
      }
    }), t.watch && Object.entries(t.watch).forEach(([e, n]) => {
      o[e] && s(o[e], n.bind(c));
    }), t.watchEffect && Object.values(t.watchEffect).forEach((e) => {
      p(e.bind(c));
    }), t.computed && Object.keys(t.computed).forEach((e) => {
      var r;
      const n = (r = t.computed) == null ? void 0 : r[e];
      n && (i[e] = v(n.bind(c)));
    }), {
      ...o,
      ...f,
      ...i
    };
  };
}
export {
  H as default
};
